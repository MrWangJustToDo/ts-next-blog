import React, { Component, ReactChild, createRef, ReactElement, RefObject } from "react";
import PointerTracker from "./pointerTracker";
import Pointer from "./pointer";
import { pinchHelper } from "utils/data";

// a pinch zoom component

type PinchProps = {
  children: ReactChild;
  startScale?: () => void;
  endScale?: () => void;
  className?: string;
  minScale: number;
  maxScale: number;
  imgRef?: RefObject<HTMLImageElement>;
};

type PinchState = {
  mounted: boolean;
  isPicture: boolean;
  scaleState: boolean;
};

interface ChangeOptions {
  /**
   * Fire a 'change' event if values are different to current values
   */
  allowChangeEvent?: boolean;
}

interface ApplyChangeOpts extends ChangeOptions {
  panX?: number;
  panY?: number;
  scaleDiff?: number;
  originX?: number;
  originY?: number;
}

interface SetTransformOpts extends ChangeOptions {
  scale?: number;
  x?: number;
  y?: number;
}

class Pinch extends Component<PinchProps, PinchState> {
  private imgElement: ReactElement;
  private coverElement: ReactElement;
  private twoFinger: boolean;
  private timmer: NodeJS.Timeout | undefined;
  private _transform: DOMMatrix;
  private pointerTracker: PointerTracker | null;

  static getDerivedStateFromProps(props: PinchProps) {
    const { children } = props;
    if (React.Children.count(children) === 1 && typeof children === "object" && children.type === "img") {
      return {
        isPicture: true,
      };
    }
    return {
      isPicture: false,
    };
  }

  static defaultProps = {
    minScale: 1,
    maxScale: 8,
  };

  constructor(props: PinchProps) {
    super(props);

    this.state = {
      mounted: false,
      isPicture: false,
      scaleState: false,
    };

    this.twoFinger = false;

    this._transform = pinchHelper.createMatrix();

    this.imgElement = this._initImg();

    this.coverElement = this._initCover();

    this.pointerTracker = null;
  }

  imgRef = createRef<HTMLImageElement>();

  coverRef = createRef<HTMLDivElement>();

  componentDidMount() {
    const { isPicture } = this.state;
    if (isPicture) {
      this.setState({ mounted: true });
    }
  }

  componentDidUpdate(_: PinchProps, preState: PinchState) {
    const { current: cover } = this.coverRef;
    const { current: img } = this.imgRef;
    const { isPicture, mounted } = this.state;
    if (preState.isPicture && !isPicture) {
      this.pointerTracker = null;
      cover?.removeEventListener("wheel", this._onWheel);
      this.setState({ mounted: false });
    } else if (mounted && isPicture && cover && img) {
      this.pointerTracker = new PointerTracker(cover, {
        start: (pointer, event) => {
          // We only want to track 2 pointers at most
          if (this.pointerTracker!.currentPointers.length === 2 || !cover) return false;
          // event.preventDefault();
          return true;
        },
        move: (previousPointers) => {
          if (this.state.scaleState || this.twoFinger) {
            this._onPointerMove(previousPointers, this.pointerTracker!.currentPointers);
          }
        },
      });
      cover.addEventListener("wheel", this._onWheel);
    } else if (!preState.isPicture && isPicture) {
      this.setState({ mounted: true });
    }
  }

  componentWillUnmount() {
    const { current: cover } = this.coverRef;
    cover?.removeEventListener("wheel", this._onWheel);
  }

  _initCover = () => {
    const { className } = this.props;
    const targetRef = this.coverRef;
    return React.createElement("div", { ref: targetRef, className });
  };

  _initImg = () => {
    const { isPicture } = this.state;
    const { children, imgRef } = this.props;
    if (isPicture && typeof children === "object" && children.type === "img") {
      if (imgRef) {
        this.imgRef = imgRef;
        return children;
      } else {
        return React.cloneElement(children, { ref: this.imgRef });
      }
    } else {
      return <>{children}</>;
    }
  };

  get x() {
    return this._transform.e;
  }

  get y() {
    return this._transform.f;
  }

  get scale() {
    return this._transform.a;
  }

  set x(val) {
    this._transform.e = val;
  }

  set y(val) {
    this._transform.f = val;
  }

  set scale(val) {
    this._transform.a = val;
    this._transform.b = val;
  }

  /**
   * Update transform values without checking bounds. This is only called in setTransform.
   */
  private _updateTransform(scale: number, x: number, y: number) {
    const { minScale, endScale, startScale } = this.props;
    const { scaleState } = this.state;
    const { current: img } = this.imgRef;

    if (!img) return;

    // Return if there's no change
    if (scale === this.scale && x === this.x && y === this.y) return;

    // Avoid scaling to zero
    if (scale <= minScale) {
      if (scaleState) {
        this.setState({ scaleState: false });
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        img.style.transition = "transform , 0.2s";
        img.style.transform = "translate(0px, 0px) scale(1)";
        if (endScale) endScale();
      }
    } else {
      if (!scaleState) {
        this.setState({ scaleState: true });
        img.style.transition = "none";
        if (startScale) startScale();
      }
      this.x = x;
      this.y = y;
      this.scale = scale;
      img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  }

  private _onWheel = (event: WheelEvent) => {
    const { current: img } = this.imgRef;
    if (!img) return;
    event.preventDefault();

    const currentRect = img.getBoundingClientRect();
    let { deltaY } = event;
    const { ctrlKey, deltaMode } = event;

    if (deltaMode === 1) {
      // 1 is "lines", 0 is "pixels"
      // Firefox uses "lines" for some types of mouse
      deltaY *= 15;
    }

    // ctrlKey is true when pinch-zooming on a trackpad.
    const divisor = ctrlKey ? 100 : 300;
    const scaleDiff = 1 - deltaY / divisor;

    this._applyChange({
      scaleDiff,
      originX: event.clientX - currentRect.left,
      originY: event.clientY - currentRect.top,
      allowChangeEvent: true,
    });
  };

  private _onPointerMove(previousPointers: Pointer[], currentPointers: Pointer[]) {
    const { current: img } = this.imgRef;
    if (!img) return;

    // Combine next points with previous points
    const currentRect = img.getBoundingClientRect();

    // For calculating panning movement
    const prevMidpoint = pinchHelper.getMidpoint(previousPointers[0], previousPointers[1]);
    const newMidpoint = pinchHelper.getMidpoint(currentPointers[0], currentPointers[1]);

    // Midpoint within the element
    const originX = prevMidpoint.clientX - currentRect.left;
    const originY = prevMidpoint.clientY - currentRect.top;

    // Calculate the desired change in scale
    const prevDistance = pinchHelper.getDistance(previousPointers[0], previousPointers[1]);
    const newDistance = pinchHelper.getDistance(currentPointers[0], currentPointers[1]);
    const scaleDiff = prevDistance ? newDistance / prevDistance : 1;

    this._applyChange({
      originX,
      originY,
      scaleDiff,
      panX: newMidpoint.clientX - prevMidpoint.clientX,
      panY: newMidpoint.clientY - prevMidpoint.clientY,
      allowChangeEvent: true,
    });
  }

  /** Transform the view & fire a change event */
  private _applyChange(opts: ApplyChangeOpts = {}) {
    const { panX = 0, panY = 0, originX = 0, originY = 0, scaleDiff = 1, allowChangeEvent = false } = opts;

    const matrix = pinchHelper
      .createMatrix()
      // Translate according to panning.
      .translate(panX, panY)
      // Scale about the origin.
      .translate(originX, originY)
      // Apply current translate
      .translate(this.x, this.y)
      .scale(scaleDiff)
      .translate(-originX, -originY)
      // Apply current scale.
      .scale(this.scale);

    // Convert the transform into basic translate & scale.
    this.setTransform({
      allowChangeEvent,
      scale: matrix.a,
      x: matrix.e,
      y: matrix.f,
    });
  }

  /**
   * Update the stage with a given scale/x/y.
   */
  setTransform(opts: SetTransformOpts = {}) {
    const { scale = this.scale } = opts;
    const { current: img } = this.imgRef;
    const { current: cover } = this.coverRef;

    let { x = this.x, y = this.y } = opts;

    // If we don't have an element to position, just set the value as given.
    // We'll check bounds later.
    if (!img || !cover) {
      this._updateTransform(scale, x, y);
      return;
    }

    // Get current layout
    const thisBounds = cover.getBoundingClientRect();
    const positioningElBounds = img.getBoundingClientRect();

    // Not displayed. May be disconnected or display:none.
    // Just take the values, and we'll check bounds later.
    if (!thisBounds.width || !thisBounds.height) {
      this._updateTransform(scale, x, y);
      return;
    }

    // Create points for _positioningEl.
    let topLeft = pinchHelper.createPoint();
    topLeft.x = positioningElBounds.left - thisBounds.left;
    topLeft.y = positioningElBounds.top - thisBounds.top;
    let bottomRight = pinchHelper.createPoint();
    bottomRight.x = positioningElBounds.width + topLeft.x;
    bottomRight.y = positioningElBounds.height + topLeft.y;

    // Calculate the intended position of _positioningEl.
    const matrix = pinchHelper
      .createMatrix()
      .translate(x, y)
      .scale(scale)
      // Undo current transform
      .multiply(this._transform.inverse());

    topLeft = topLeft.matrixTransform(matrix);
    bottomRight = bottomRight.matrixTransform(matrix);

    // Ensure _positioningEl can't move beyond out-of-bounds.
    // Correct for x
    if (topLeft.x > thisBounds.width) {
      x += thisBounds.width - topLeft.x;
    } else if (bottomRight.x < 0) {
      x += -bottomRight.x;
    }

    // Correct for y
    if (topLeft.y > thisBounds.height) {
      y += thisBounds.height - topLeft.y;
    } else if (bottomRight.y < 0) {
      y += -bottomRight.y;
    }

    this._updateTransform(scale, x, y);
  }

  _touchStart = (evt: TouchEvent) => {
    this.timmer && clearTimeout(this.timmer);
    if (evt.touches && evt.touches.length === 2) {
      this.twoFinger = true;
    } else {
    }
  };

  _touchEnd = () => {
    this.timmer && clearTimeout(this.timmer);
    this.twoFinger = false;
    if (this.pointerTracker) {
      this.pointerTracker.currentPointers = [];
    }
  };

  render() {
    const { children } = this.props;
    const { isPicture, mounted } = this.state;
    if (isPicture) {
      if (!mounted) {
        this.imgElement = this._initImg();
        return this.imgElement;
      } else {
        return React.cloneElement(
          this.coverElement,
          {
            onTouchStart: this._touchStart,
            onTouchEnd: this._touchEnd,
          },
          React.cloneElement(this.imgElement, { style: { willChange: "transform", transformOrigin: "0 0" } })
        );
      }
    }
    return children;
  }
}

export default Pinch;
