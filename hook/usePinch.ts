import { RefObject, useCallback, useEffect, useRef } from "react";
import { useBool } from "./useData";
import { useAutoActionHandler } from "./useAuto";
import { pinchHelper } from "utils/data";
import { actionHandler } from "utils/action";
import PointerTracker, { Pointer } from "utils/pointer";
import { UseInitRefTypes, UseMatrixType, UsePinchProps, UsePinchType, UseTouchTypes, UseWheelType } from "types/hook";

interface ApplyChangeOpts {
  panX?: number;
  panY?: number;
  scaleDiff?: number;
  originX?: number;
  originY?: number;
}

interface SetTransformOpts {
  scale?: number;
  x?: number;
  y?: number;
}

const useInitRef: UseInitRefTypes = <T extends HTMLElement, K extends HTMLElement>({
  pinchRef,
  coverRef,
}: {
  pinchRef: RefObject<T>;
  coverRef: RefObject<K>;
}) => {
  useEffect(() => {
    const { current: cover } = coverRef;
    if (cover) {
      cover.style.zIndex = "999999999";
      cover.style.touchAction = "none";
    }
  }, []);
  useEffect(() => {
    const { current: pinch } = pinchRef;
    if (pinch) {
      pinch.setAttribute("draggable", "false");
      pinch.querySelectorAll("img").forEach((img) => img.setAttribute("draggable", "false"));
    }
  }, []);
};

const useMatrix: UseMatrixType = () => {
  const matrix = useRef<DOMMatrix>();

  useEffect(() => {
    matrix.current = pinchHelper.createMatrix();
  }, []);

  return matrix;
};

const useWheel: UseWheelType = ({ action, ref }) => {
  const addListener = useCallback<(action: (e?: WheelEvent) => void) => void>((action) => {
    actionHandler<HTMLElement, void, void>(ref.current, (ele) => ele.addEventListener("wheel", action));
  }, []);

  const removeListener = useCallback<(action: (e?: WheelEvent) => void) => void>((action) => {
    actionHandler<HTMLElement, void, void>(ref.current, (ele) => ele.removeEventListener("wheel", action));
  }, []);

  useAutoActionHandler<WheelEvent, HTMLElement>({
    action,
    addListener,
    removeListener,
  });
};

const useTouch: UseTouchTypes = ({ ref, action, scaleRef }) => {
  const twoFinger = useRef<boolean>(false);
  const pointerTracker = useRef<PointerTracker>();

  useEffect(() => {
    const { current: cover } = ref;
    if (cover) {
      const tracker = new PointerTracker(cover, {
        start: () => {
          // We only want to track 2 pointers at most
          if (tracker.currentPointers.length === 2) return false;
          return true;
        },
        move: (previousPointers) => {
          if (twoFinger.current || scaleRef.current) {
            action(previousPointers, tracker.currentPointers);
          }
        },
      });
      pointerTracker.current = tracker;
    }
  }, []);

  const touchStart = useCallback<(event?: TouchEvent) => void>((event) => {
    if (event && event.touches.length >= 2) {
      twoFinger.current = true;
    } else {
      twoFinger.current = false;
    }
  }, []);

  const touchEnd = useCallback(() => {
    if (pointerTracker.current) {
      pointerTracker.current.currentPointers = [];
    }
    twoFinger.current = false;
  }, []);

  const addTouchStartListener = useCallback<(action: (e?: TouchEvent) => void) => void>((action) => {
    actionHandler<HTMLElement, void, void>(ref.current, (ele) => ele.addEventListener("touchstart", action));
  }, []);

  const addTouchEndListener = useCallback<(action: (e?: TouchEvent) => void) => void>((action) => {
    actionHandler<HTMLElement, void, void>(ref.current, (ele) => ele.addEventListener("touchend", action));
  }, []);

  const removeTouchStartListener = useCallback<(action: (e?: TouchEvent) => void) => void>((action) => {
    actionHandler<HTMLElement, void, void>(ref.current, (ele) => ele.removeEventListener("touchstart", action));
  }, []);

  const removeTouchEndListener = useCallback<(action: (e?: TouchEvent) => void) => void>((action) => {
    actionHandler<HTMLElement, void, void>(ref.current, (ele) => ele.removeEventListener("touchend", action));
  }, []);

  useAutoActionHandler({
    action: touchStart,
    addListener: addTouchStartListener,
    removeListener: removeTouchStartListener,
  });

  useAutoActionHandler({
    action: touchEnd,
    addListener: addTouchEndListener,
    removeListener: removeTouchEndListener,
  });
};

// 让任何元素可以pinch
const usePinch: UsePinchType = <T extends HTMLElement, K extends HTMLElement>(props: UsePinchProps<T, K> = {}) => {
  const { maxScale = 8, minScale = 1, startScale, endScale, forWardCoverRef, forWardPinchRef } = props;
  const { bool: scale, show, hide } = useBool({ init: false });
  const pinchRef = useRef<T>(null);
  const coverRef = useRef<K>(null);
  const scaleRef = useRef<boolean>(false);

  const targetPinchRef = forWardPinchRef || pinchRef;
  const targetCoverRef = forWardCoverRef || coverRef;

  const matrix = useMatrix();

  useInitRef<T, K>({ coverRef: targetCoverRef, pinchRef: targetPinchRef });

  const updateTransform = useCallback(
    (scale: number, x: number, y: number) => {
      const { current: item } = targetPinchRef;
      if (!item) return;

      if (scale > maxScale) return;

      if (matrix.current) {
        const target = matrix.current;
        if (scale === target.a && x === target.e && y === target.f) return;
        if (scale <= minScale) {
          if (scaleRef.current) {
            target.e = 0;
            target.f = 0;
            target.a = 1;
            target.d = 1;
            hide();
            scaleRef.current = false;
            if (endScale) endScale();
          }
          item.style.cssText = `
        will-change: transform;
        transform-origin: 0 0;
        transition: transform, 0.2s;
        transform: translate(0px, 0px) scale(1);
        `;
        } else {
          if (!scaleRef.current) {
            scaleRef.current = true;
            show();
            if (startScale) startScale();
          }
          target.e = x;
          target.f = y;
          target.a = scale;
          target.d = scale;
          item.style.cssText = `
        will-change: transform;
        transform-origin: 0 0;
        transition: none;
        transform: translate(${x}px, ${y}px) scale(${scale})
        `;
        }
      }
    },
    [minScale, maxScale, startScale, endScale]
  );

  const setTransform = useCallback(
    (opts: SetTransformOpts = {}) => {
      if (matrix.current) {
        const target = matrix.current;
        const { scale = target.a } = opts;
        let { x = target.e, y = target.f } = opts;
        const { current: item } = targetPinchRef;
        const { current: cover } = targetCoverRef;

        // If we don't have an element to position, just set the value as given.
        // We'll check bounds later.
        if (!item || !cover) {
          updateTransform(scale, x, y);
          return;
        } else if (cover && item) {
          // Get current layout
          const thisBounds = cover.getBoundingClientRect();
          const positioningElBounds = item.getBoundingClientRect();

          // Not displayed. May be disconnected or display:none.
          // Just take the values, and we'll check bounds later.
          if (!thisBounds.width || !thisBounds.height) {
            updateTransform(scale, x, y);
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
          const newMatrix = pinchHelper
            .createMatrix()
            .translate(x, y)
            .scale(scale)
            // Undo current transform
            .multiply(target.inverse());

          topLeft = topLeft.matrixTransform(newMatrix);
          bottomRight = bottomRight.matrixTransform(newMatrix);

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
          updateTransform(scale, x, y);
        }
      }
    },
    [updateTransform]
  );

  const applyChange = useCallback(
    (opts: ApplyChangeOpts = {}) => {
      const { panX = 0, panY = 0, originX = 0, originY = 0, scaleDiff = 1 } = opts;
      if (matrix.current) {
        const newMatrix = pinchHelper
          .createMatrix()
          // Translate according to panning.
          .translate(panX, panY)
          // Scale about the origin.
          .translate(originX, originY)
          // Apply current translate
          .translate(matrix.current.e, matrix.current.f)
          .scale(scaleDiff)
          .translate(-originX, -originY)
          // Apply current scale.
          .scale(matrix.current.a);

        // Convert the transform into basic translate & scale.
        setTransform({
          scale: newMatrix.a,
          x: newMatrix.e,
          y: newMatrix.f,
        });
      }
    },
    [matrix, setTransform]
  );

  const onWheel = useCallback<(event?: WheelEvent) => void>(
    (event?: WheelEvent) => {
      const { current: item } = targetPinchRef;

      if (!item || !event) return;

      event.preventDefault();

      const currentRect = item.getBoundingClientRect();
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

      applyChange({
        scaleDiff,
        originX: event.clientX - currentRect.left,
        originY: event.clientY - currentRect.top,
      });
    },
    [applyChange]
  );

  const onPointerMove = useCallback(
    (previousPointers: Pointer[], currentPointers: Pointer[]) => {
      const { current: item } = targetPinchRef;
      if (!item) return;

      // Combine next points with previous points
      const currentRect = item.getBoundingClientRect();

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

      applyChange({
        originX,
        originY,
        scaleDiff,
        panX: newMidpoint.clientX - prevMidpoint.clientX,
        panY: newMidpoint.clientY - prevMidpoint.clientY,
      });
    },
    [applyChange]
  );

  useWheel({ ref: targetCoverRef, action: onWheel });

  useTouch({ ref: targetCoverRef, action: onPointerMove, scaleRef });

  return [targetPinchRef, targetCoverRef, scale];
};

export { usePinch };
