import { render } from "uxele-utils";
/**
 * create fabric groups with pages and its layout definition.
 */
export declare function pagesToGroup(pages: render.IPageOnCanvas[], scale: number): Promise<fabric.Group>;
/**
 * group[0] -- pages with offsetX and offsetY
 * group[1] -- pages without offsetX and offsetY
 */
export declare function zoomPagesGroup(level: number, group: fabric.Group): void;
