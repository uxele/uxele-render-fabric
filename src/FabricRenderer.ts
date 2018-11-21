import * as core from "uxele-core";
import "script-loader!./vendor/fabric.min.js";

function emptyGroup(width: number, height: number) {
  return new window.fabric.Group(undefined, {
    selectable: false,
    originX: "left",
    originY: "top"
  })
}
export class FabricRenderer extends core.BaseRenderer {
  protected setCanvasSize(width: number, height: number): void {
    this.fabricCanvas.setDimensions({ width, height });
    this.fabricCanvas.renderAll();
  }

  private fabricCanvas: fabric.Canvas;
  private canvasBackground?: fabric.Image;
  private canvasLayers: {
    [key in core.RendererDrawZIndex]: fabric.Group
  } = {
      "low": emptyGroup(this.renderWidth, this.renderHeight),
      "normal": emptyGroup(this.renderWidth, this.renderHeight),
      "high": emptyGroup(this.renderWidth, this.renderHeight),
    };
  constructor(
    protected ele: HTMLCanvasElement,
    public renderWidth: number,
    public renderHeight: number,
  ) {
    super(ele, renderWidth, renderHeight);
    this.fabricCanvas = new window.fabric.Canvas(ele, {
      hoverCursor: "inherit",
      selection: false,
      renderOnAddRemove: true
    });

    this.fabricCanvas.setWidth(renderWidth);
    this.fabricCanvas.setHeight(renderHeight);

    this.bindEvents();
    const keys: core.RendererDrawZIndex[] = Object.keys(this.canvasLayers) as core.RendererDrawZIndex[];
    for (const key of keys) {
      this.fabricCanvas.add(this.canvasLayers[key]);
    }
  }
  private bindEvents() {
    (this.fabricCanvas as any)["__onMouseWheel"] = (evt: MouseWheelEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      const factor = evt.deltaFactor ? isNaN(evt.deltaFactor) ? 1 : evt.deltaFactor : 1;
      if (evt.deltaX) {
        this.panX(this.panX() + evt.deltaX * factor)
      }
      if (evt.deltaY) {
        this.panY(this.panY() + evt.deltaY * factor)
      }
      // this.onInvalidate.emit();
    }
    // click
    let downEvt: fabric.IEvent;
    this.fabricCanvas.on("mouse:down", (evt) => {
      downEvt = evt;
    })
    this.fabricCanvas.on("mouse:up", (evt) => {
      if (downEvt) {
        if (evt.e.timeStamp - downEvt.e.timeStamp < 200) {
          if (
            Math.sqrt(
              Math.pow((evt.e as MouseEvent).offsetX - (downEvt.e as MouseEvent).offsetX, 2) +
              Math.pow((evt.e as MouseEvent).offsetY - (downEvt.e as MouseEvent).offsetY, 2)
            ) < 50
          ) {
            this.emit("click", evt);
          }

        }
      }
    })
  }
  on(evt: core.RendererEvent, handler: core.RendererEventHandler): void {
    switch (evt) {
      case "mousedown":
        this.fabricCanvas.on("mouse:down", handler);
        break;
      case "mouseup":
        this.fabricCanvas.on("mouse:up", handler);
        break;
      case "mousemove":
        this.fabricCanvas.on("mouse:move", handler);
        break;
      case "mouseleave":
        this.fabricCanvas.on("mouse:out", handler);
        break;
      default:
        super.on(evt, handler);
    }
  }
  off(evt?: core.RendererEvent | undefined, handler?: core.RendererEventHandler): void {
    super.off(evt, handler);
    if (evt) {
      switch (evt) {
        case "mousedown":
          this.fabricCanvas.off("mouse:down", handler);
          break;
        case "mouseup":
          this.fabricCanvas.off("mouse:up", handler);
          break;
        case "mousemove":
          this.fabricCanvas.off("mouse:move", handler);
          break;
        case "mouseleave":
          this.fabricCanvas.off("mouse:out", handler);
          break;
        default:
          super.off(evt, handler);
      }
    } else {
      this.fabricCanvas.off();
    }
  }
  clearDrawing(params?: fabric.Object, zindex?: core.RendererDrawZIndex): void {
    // if (params){
    //   if (zindex){
    //     const layer = this.canvasLayers[zindex];
    //     layer.removeWithUpdate(params);
    //   }else{
    //     (Object.keys(this.canvasLayers) as core.RendererDrawZIndex[]).forEach((key:core.RendererDrawZIndex)=>{
    //       this.canvasLayers[key].removeWithUpdate(params);
    //     })
    //   }
    // }else{
    //   if (zindex) {
    //     const layer = this.canvasLayers[zindex];
    //     layer.remove(...layer.getObjects());
    //   } else {
    //     const keys: core.RendererDrawZIndex[] = Object.keys(this.canvasLayers) as core.RendererDrawZIndex[];
    //     for (const key of keys) {
    //       const layer = this.canvasLayers[key];
    //       layer.remove(...layer.getObjects());
    //     }
    //   }
    // }
    if (params) {
      this.fabricCanvas.remove(params);
    } else {
      this.fabricCanvas.clear();
      if (this.canvasBackground) {
        this.fabricCanvas.add(this.canvasBackground);
      }
    }
    this.fabricCanvas.requestRenderAll();
  }
  getBackground(): HTMLImageElement | undefined {
    return this.canvasBackground ? this.canvasBackground.getElement() : undefined;
  }
  setBackground(img?: HTMLImageElement | undefined): void {
    if (img) {
      if (this.canvasBackground) {
        this.fabricCanvas.remove(this.canvasBackground);
      }
      this.canvasBackground = new window.fabric.Image(img, { left: 0, top: 0, selectable: false });
      this.fabricCanvas.insertAt(this.canvasBackground, 0, false);
    } else {
      if (this.canvasBackground) {
        this.fabricCanvas.remove(this.canvasBackground);
        this.canvasBackground = undefined;
      }
    }
  }
  draw(param: fabric.Object, zindex: core.RendererDrawZIndex = "normal"): void {
    // if (!this.canvasLayers[zindex].contains(param)){
    //   // this.canvasLayers[zindex].removeWithUpdate(param);
    //   this.canvasLayers[zindex].addWithUpdate(param);
    // }
    // (this.canvasLayers[zindex] as any ).setCoords();
    if (!this.fabricCanvas.contains(param)) {
      this.fabricCanvas.add(param);
    }
    this.fabricCanvas.requestRenderAll();
    // console.log(this.canvasLayers[zindex].left);
    // console.log(this.canvasLayers[zindex].top);
  }
  destroy(): void {
    this.fabricCanvas.dispose();
  }
  panX(pixel?: number | undefined): number {
    if (pixel !== undefined) {
      this.fabricCanvas.absolutePan(
        new window.fabric.Point(
          Math.min(Math.max(pixel, this.minX), this.maxX),
          this.panY()
        )
      )
    }
    return -this.fabricCanvas.viewportTransform![4];
  }
  panY(pixel?: number | undefined): number {
    if (pixel !== undefined) {
      this.fabricCanvas.absolutePan(
        new window.fabric.Point(
          this.panX(),
          Math.min(Math.max(pixel, this.minY), this.maxY)
        )
      )
    }
    return -this.fabricCanvas.viewportTransform![5];
  }


}