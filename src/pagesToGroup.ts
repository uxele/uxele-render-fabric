import { IPage, IPoint, Rect } from "uxele-core/build";
import {render} from "uxele-utils";
const gridMargin = 20;
const itemPerRow = 4;
const labelPreviewSpan = 10;

/**
 * create fabric groups with pages and its layout definition.
 */
export async function pagesToGroup(pages: render.IPageOnCanvas[], scale: number): Promise<fabric.Group> {
  const groups: fabric.Group[] = [];
  for (const page of pages) {
    const group = await pageToGroup(page.page, scale, { x: page.rect.left, y: page.rect.top });
    groups.push(group);
  }

  const rtn = new window.fabric.Group(groups, {
    selectable: false,
    originX: "left",
    originY: "top",
    left: 0,
    top: 0
  });
  
  //mutate page's rect so that the rect is related to 0,0 of left top
  // const offsetX=rtn.width!/2;
  // const offsetY=rtn.height!/2;
  // for (let i = 0; i < pages.length; i++) {
  //   const page=pages[i];
  //   const group=groups[i];
  //   const img=group.item(1);
  //   page.rect=page.rect.pan(img.left!+group.width!/2+group.left!+offsetX- page.rect.left, img.top!+group.height!/2+group.top!+offsetY-page.rect.top);
  // }
  return rtn;
}
/**
 * Conver a page to a label + preview group
 */
async function pageToGroup(page: IPage, scale: number, coords?: IPoint): Promise<fabric.Group> {
  const label = new window.fabric.Text(page.name, {
    left: 0, top: 0,
    fontFamily: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    fill: "white"
  });

  label.top = (label.height ? -label.height : 0) - labelPreviewSpan;
  const preview = await page.getPreview();
  const img = new window.fabric.Image(preview, {
    left: 0,
    top: 0,
    scaleX: scale,
    scaleY: scale
  });
  return new window.fabric.Group([label, img], {
    selectable: false,
    originX: "left",
    originY: "top",
    left: (coords ? coords.x : page.offsetX)! * scale,
    top: (coords ? coords.y : page.offsetY)! * scale
  })

}


/**
 * group[0] -- pages with offsetX and offsetY
 * group[1] -- pages without offsetX and offsetY
 */
export function zoomPagesGroup(level: number, group: fabric.Group) {
  // group.scale(level);
  group.forEachObject((group) => {
    (group as fabric.Group).forEachObject((group) => {
      const txt = (group as fabric.Group).item(0);
      const img = (group as fabric.Group).item(1);
      img.scale(level);
      img.setCoords();
      (group as any).set("dirty", true);

      // img.top=0;
      // img.left=0;
      // txt.left=0;
      // txt.top=-txt.height!-labelPreviewSpan;
      // (group as any).addWithUpdate();
    });
    (group as any).set("dirty", true);
  });
  (group as any).set("dirty", true);
}