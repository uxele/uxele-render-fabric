import { FabricRenderer } from "./FabricRenderer";
import { IPage, RendererEvent } from "psdetch-core";
import { sleep } from "psdetch-utils";
import { testConfirm, testAlert } from "psdetch-utils/build/testUtils";
import {} from "psdetch-utils";
import { zoomImg } from "psdetch-utils/build/canvas";


function dummyPage() {
  const img = new Image(275,183);
  img.src = "base/testAssets/nature.jpeg";
  const p: IPage = {
    name: "dummy page",
    width: 275,
    height: 183,
    getPreview: (zoom:number) => {
      return zoomImg(img,zoom);
    },
    getLayers: () => {
      return Promise.resolve([]);
    }
  };
  return p;

}
describe("FabricRenderer", () => {
  function getRenderer() {
    return new FabricRenderer(c, 300, 300);
  }
  let c: any;
  beforeAll(() => {
    c = document.createElement("canvas");
    c.width = 300;
    c.height = 300;
    document.querySelector("body")!.appendChild(c);
  })
  afterAll(() => {
    document.querySelector("body")!.removeChild(c);
  })
  it("should attach to a canvas element", () => {
    const f = getRenderer();
    expect(f.renderWidth).toEqual(300);
    expect(f.renderHeight).toEqual(300);
    f.destroy();
  });
  it("should render a page", async () => {
    const f = getRenderer();
    await f.renderPage(dummyPage());
    await sleep(100);
    expect(testConfirm("Do you see renderened image?")).toBeTruthy();
    f.setBackground();
    await sleep(100);
    expect(testConfirm("Was the rendered image disappeared?")).toBeTruthy();
    f.destroy();
  });
  it("should pan canvas", async () => {
    const f = getRenderer();
    await f.renderPage(dummyPage());
    f.panX(100);
    await sleep(100);
    expect(f.panX()).toEqual(100);
    expect(testConfirm("Do you see image panned to left about 100px?")).toBeTruthy();
    f.panY(20);
    await sleep(100);
    expect(f.panY()).toEqual(20);
    expect(testConfirm("Do you see image panned to top about 20px?")).toBeTruthy();
    f.destroy();
  })
  it("should zoom canvas", async () => {
    const f = getRenderer();
    await f.renderPage(dummyPage());
    f.zoom(2);
    await sleep(100);
    expect(f.zoom()).toEqual(2);
    debugger;
    expect(testConfirm("Do you see image be zoomed to 2x?")).toBeTruthy();
    f.zoom(0.5);
    await sleep(100);
    expect(f.zoom()).toEqual(0.5);
    expect(testConfirm("Do you see image be zoomed to  0.5x?")).toBeTruthy();
    f.destroy();
  })
  if (process.env.INTERACTIVE) {
    describe("Canvas Interactive event", () => {
      it("should handle mouse event ", async () => {
        const f = getRenderer();
        await f.renderPage(dummyPage());
        f.zoom(3);
        await sleep(100);

        return new Promise((resolve, reject) => {
          const evts: {
            [key in RendererEvent]: boolean
          } = {
            click: false,
            mousedown: false,
            mouseleave: false,
            mousemove: false,
            mouseup: false
          }
          function h(k: RendererEvent) {
            return async () => {
              evts[k] = true;
              const keys = Object.keys(evts) as RendererEvent[];
              for (const key of keys) {
                if (!evts[key]) {
                  return;
                }
              }
              await sleep(100);
              f.destroy();
              resolve();
            }
          }
          const keys1 = Object.keys(evts) as RendererEvent[];
          for (const key of keys1) {
            f.on(key, h(key));
          }
          testAlert("Move mouse onto the page and click it and move out the page");

        })

      })
      it("should handle wheel/touch pad ", async () => {
        const f = getRenderer();
        await f.renderPage(dummyPage());
        f.zoom(2);
        await sleep(100);
        return new Promise((resolve, reject) => {
          const timer = setInterval(() => {
            if (f.panY() === f.maxY) {
              clearInterval(timer);
              f.destroy();
              resolve();
            }
          }, 100);
          testAlert("Use mouse scroll to scroll page to bottom of the canvas.");

        })

      })
    })

  }

  describe("Drawing", () => {
    it("should draw on canvas", async() => {
      const f = getRenderer();
      await f.renderPage(dummyPage());
      f.zoom(2);
      f.draw(new window.fabric.Rect({
        left:100,
        top:100,
        width:100,
        height:100,
        fill:"red",
      }));
      await sleep(100);
      expect(testConfirm("Do you see a red rectangle drawn on canvas?")).toBeTruthy();
      f.draw(new window.fabric.Rect({
        left:150,
        top:150,
        width:100,
        height:100,
        fill:"blue"
      }),"high");
      await sleep(100);
      expect(testConfirm("Do you see a blue rectangle drawn above red rect?")).toBeTruthy();
      f.draw(new window.fabric.Rect({
        left:50,
        top:50,
        width:100,
        height:100,
        fill:"green"
      }),"low");
      await sleep(100);
      expect(testConfirm("Do you see a green rectangle drawn under red rect?")).toBeTruthy();
      f.clearDrawing(undefined,"normal");
      await sleep(100);
      expect(testConfirm("Do you see a red rectangle disappeared?")).toBeTruthy();
      f.clearDrawing(undefined,"low");
      f.clearDrawing(undefined,"high");
      await sleep(100);
      expect(testConfirm("Do you see all rectangles disappeared?")).toBeTruthy();
      f.destroy();
    })
  })
})