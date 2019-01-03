import * as core from "uxele-core";
import "script-loader!./vendor/fabric.min.js";
export declare class FabricRenderer extends core.BaseRenderer {
    protected parent: HTMLElement;
    pageByRealCoords(coords: core.IPoint): core.IPage | null;
    resizeRender(): void;
    readonly imgWidth: number;
    readonly imgHeight: number;
    renderPages(pages: core.IPage[]): Promise<any>;
    protected setCanvasSize(width: number, height: number): void;
    private renderPageWithLayout;
    private fabricCanvas;
    /**
     * Background contains all rendered pages
     */
    private canvasBackground?;
    private canvasLayers;
    private canvas;
    private pages?;
    constructor(parent: HTMLElement);
    private bindEvents;
    on(evt: core.RendererEvent, handler: core.RendererEventHandler): void;
    off(evt?: core.RendererEvent | undefined, handler?: core.RendererEventHandler): void;
    zoom(level?: number): number;
    clearDrawing(params?: fabric.Object, zindex?: core.RendererDrawZIndex): void;
    draw(param: fabric.Object, zindex?: core.RendererDrawZIndex): void;
    destroy(): void;
    protected _panX(pixel?: number | undefined): number;
    protected _panY(pixel?: number | undefined): number;
}
