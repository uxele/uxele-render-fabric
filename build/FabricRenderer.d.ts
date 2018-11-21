import * as core from "uxele-core";
import "script-loader!./vendor/fabric.min.js";
export declare class FabricRenderer extends core.BaseRenderer {
    protected ele: HTMLCanvasElement;
    renderWidth: number;
    renderHeight: number;
    protected setCanvasSize(width: number, height: number): void;
    private fabricCanvas;
    private canvasBackground?;
    private canvasLayers;
    constructor(ele: HTMLCanvasElement, renderWidth: number, renderHeight: number);
    private bindEvents;
    on(evt: core.RendererEvent, handler: core.RendererEventHandler): void;
    off(evt?: core.RendererEvent | undefined, handler?: core.RendererEventHandler): void;
    clearDrawing(params?: fabric.Object, zindex?: core.RendererDrawZIndex): void;
    getBackground(): HTMLImageElement | undefined;
    setBackground(img?: HTMLImageElement | undefined): void;
    draw(param: fabric.Object, zindex?: core.RendererDrawZIndex): void;
    destroy(): void;
    panX(pixel?: number | undefined): number;
    panY(pixel?: number | undefined): number;
}
