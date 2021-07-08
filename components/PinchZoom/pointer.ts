const isPointerEvent = (event: any): event is PointerEvent => self.PointerEvent && event instanceof PointerEvent;

class Pointer {
  /** x offset from the top of the document */
  pageX: number;
  /** y offset from the top of the document */
  pageY: number;
  /** x offset from the top of the viewport */
  clientX: number;
  /** y offset from the top of the viewport */
  clientY: number;
  /** Unique ID for this pointer */
  id: number = -1;
  /** The platform object used to create this Pointer */
  nativePointer: Touch | PointerEvent | MouseEvent;

  constructor(nativePointer: Touch | PointerEvent | MouseEvent) {
    this.nativePointer = nativePointer;
    this.pageX = nativePointer.pageX;
    this.pageY = nativePointer.pageY;
    this.clientX = nativePointer.clientX;
    this.clientY = nativePointer.clientY;

    // 触摸事件，单独拿出来?   todo
    if (self.Touch && nativePointer instanceof Touch) {
      this.id = nativePointer.identifier;
    } else if (isPointerEvent(nativePointer)) {
      // 统一的指针事件
      // is PointerEvent
      this.id = nativePointer.pointerId;
    }
  }

  /**
   * Returns an expanded set of Pointers for high-resolution inputs.
   * 浏览器合成事件的默认处理   反复合成事件的帧中对应的所有事件
   * 将段时间的操作中所有的pointerEvent全部拿出来
   *
   */
  getCoalesced(): Pointer[] {
    if ("getCoalescedEvents" in this.nativePointer) {
      return this.nativePointer.getCoalescedEvents().map((p) => new Pointer(p));
    }
    return [this];
  }
}

export { isPointerEvent };

export default Pointer;
