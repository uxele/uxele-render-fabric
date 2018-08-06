import * as core from "psdetch-core";
import "./vendor/fabric.min.js";
export declare class FabricRenderer extends core.BaseRenderer {
    protected ele: HTMLCanvasElement;
    renderWidth: number;
    renderHeight: number;
    private fabricCanvas;
    private canvasBackground?;
    private canvasLayers;
    constructor(ele: HTMLCanvasElement, renderWidth: number, renderHeight: number);
    private bindEvents;
    on(evt: core.RendererEvent, handler: core.RendererEventHandler): void;
    off(evt?: core.RendererEvent | undefined, handler?: core.RendererEventHandler): void;
    clearDrawing(params?: fabric.Object, zindex?: core.RendererDrawZIndex): void;
    setBackground(img?: HTMLImageElement | undefined): void;
    draw(param: fabric.Object, zindex?: core.RendererDrawZIndex): void;
    destroy(): void;
    zoom(level?: number | undefined): number;
    panX(pixel?: number | undefined): number;
    panY(pixel?: number | undefined): number;
}