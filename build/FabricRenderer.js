"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("uxele-core"));
require("script-loader!./vendor/fabric.min.js");
var pagesToGroup_1 = require("./pagesToGroup");
/**
 * Turning off caching fixes some blury issue on images and texts.
 * see: http://fabricjs.com/fabric-object-caching
 */
window.fabric.Object.prototype.objectCaching = false;
function emptyGroup(width, height) {
    return new window.fabric.Group(undefined, {
        selectable: false,
        originX: "left",
        originY: "top"
    });
}
// async function pageToGroup(page: core.IPage): Promise<fabric.Group> {
//   const label = new window.fabric.Text(page.name, { left: 0, top: 0 });
//   const img = await page.getPreview();
//   const fImg = new window.fabric.Image(img, {
//     left: page.;
//     top: label.height
//   })
// }
var FabricRenderer = /** @class */ (function (_super) {
    __extends(FabricRenderer, _super);
    function FabricRenderer(parent) {
        var _this = _super.call(this, parent) || this;
        _this.parent = parent;
        _this.canvasLayers = {
            "low": emptyGroup(_this.renderWidth, _this.renderHeight),
            "normal": emptyGroup(_this.renderWidth, _this.renderHeight),
            "high": emptyGroup(_this.renderWidth, _this.renderHeight),
        };
        _this.canvas = document.createElement("canvas");
        _this.canvas.width = _this.renderWidth;
        _this.canvas.height = _this.renderHeight;
        parent.innerHTML = "";
        parent.appendChild(_this.canvas);
        _this.fabricCanvas = new window.fabric.Canvas(_this.canvas, {
            hoverCursor: "inherit",
            selection: false,
            renderOnAddRemove: true
        });
        _this.resizeRender();
        _this.bindEvents();
        var keys = Object.keys(_this.canvasLayers);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _this.fabricCanvas.add(_this.canvasLayers[key]);
        }
        return _this;
    }
    FabricRenderer.prototype.pageByRealCoords = function (coords) {
        if (this.pages) {
            for (var _i = 0, _a = this.pages; _i < _a.length; _i++) {
                var page = _a[_i];
                if (page.rect.containsCoords(coords.x, coords.y)) {
                    return page.page;
                }
            }
        }
        return null;
    };
    FabricRenderer.prototype.resizeRender = function () {
        this.fabricCanvas.setWidth(this.renderWidth);
        this.fabricCanvas.setHeight(this.renderHeight);
    };
    Object.defineProperty(FabricRenderer.prototype, "imgWidth", {
        get: function () {
            return (this.canvasBackground ? this.canvasBackground.getScaledWidth() : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricRenderer.prototype, "imgHeight", {
        get: function () {
            return (this.canvasBackground ? this.canvasBackground.getScaledHeight() : 0);
        },
        enumerable: true,
        configurable: true
    });
    FabricRenderer.prototype.renderPages = function (pages) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.pages = pagesToGroup_1.pagesToLayout(pages);
                        return [4 /*yield*/, this.renderPageWithLayout()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FabricRenderer.prototype.setCanvasSize = function (width, height) {
        this.fabricCanvas.setDimensions({ width: width, height: height });
        this.fabricCanvas.renderAll();
    };
    FabricRenderer.prototype.renderPageWithLayout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.pages) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, pagesToGroup_1.pagesToGroup(this.pages, this.zoomLevel)];
                    case 1:
                        _a.canvasBackground = _b.sent();
                        this.fabricCanvas.clear();
                        if (this.canvasBackground) {
                            this.fabricCanvas.add(this.canvasBackground);
                        }
                        this.fabricCanvas.requestRenderAll();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    FabricRenderer.prototype.bindEvents = function () {
        var _this = this;
        this.fabricCanvas["__onMouseWheel"] = function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var factor = evt.deltaFactor ? isNaN(evt.deltaFactor) ? 1 : evt.deltaFactor : 1;
            if (evt.deltaX) {
                _this.panX(_this.panX() + evt.deltaX * factor);
            }
            if (evt.deltaY) {
                _this.panY(_this.panY() + evt.deltaY * factor);
            }
            // this.onInvalidate.emit();
        };
        // click
        var downEvt;
        this.fabricCanvas.on("mouse:down", function (evt) {
            downEvt = evt;
        });
        this.fabricCanvas.on("mouse:up", function (evt) {
            if (downEvt) {
                if (evt.e.timeStamp - downEvt.e.timeStamp < 200) {
                    if (Math.sqrt(Math.pow(evt.e.offsetX - downEvt.e.offsetX, 2) +
                        Math.pow(evt.e.offsetY - downEvt.e.offsetY, 2)) < 50) {
                        _this.emit("click", evt);
                    }
                }
            }
        });
    };
    FabricRenderer.prototype.on = function (evt, handler) {
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
                _super.prototype.on.call(this, evt, handler);
        }
    };
    FabricRenderer.prototype.off = function (evt, handler) {
        _super.prototype.off.call(this, evt, handler);
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
                    _super.prototype.off.call(this, evt, handler);
            }
        }
        else {
            this.fabricCanvas.off();
        }
    };
    FabricRenderer.prototype.zoom = function (level) {
        if (level !== undefined) {
            this.zoomLevel = level;
            this.renderPageWithLayout();
            // zoomPagesGroup(level, this.canvasBackground!);
            // this.fabricCanvas.requestRenderAll();
            // (this.canvasBackground! as any).addWithUpdate();
            return level;
        }
        return this.zoomLevel;
    };
    FabricRenderer.prototype.clearDrawing = function (params, zindex) {
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
        }
        else {
            this.fabricCanvas.clear();
            if (this.canvasBackground) {
                this.fabricCanvas.add(this.canvasBackground);
            }
        }
        this.fabricCanvas.requestRenderAll();
    };
    // getBackground(): HTMLImageElement | undefined {
    //   return this.canvasBackground ? this.canvasBackground.getElement() : undefined;
    // }
    // setBackground(img?: HTMLImageElement | undefined): void {
    //   if (img) {
    //     if (this.canvasBackground) {
    //       this.fabricCanvas.remove(this.canvasBackground);
    //     }
    //     this.canvasBackground = new window.fabric.Image(img, { left: 0, top: 0, selectable: false });
    //     this.fabricCanvas.insertAt(this.canvasBackground, 0, false);
    //   } else {
    //     if (this.canvasBackground) {
    //       this.fabricCanvas.remove(this.canvasBackground);
    //       this.canvasBackground = undefined;
    //     }
    //   }
    // }
    FabricRenderer.prototype.draw = function (param, zindex) {
        if (zindex === void 0) { zindex = "normal"; }
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
    };
    FabricRenderer.prototype.destroy = function () {
        this.fabricCanvas.dispose();
    };
    FabricRenderer.prototype._panX = function (pixel) {
        if (pixel !== undefined) {
            this.fabricCanvas.absolutePan(new window.fabric.Point(Math.min(Math.max(pixel, this.minX), this.maxX), this.panY()));
        }
        return -this.fabricCanvas.viewportTransform[4];
    };
    FabricRenderer.prototype._panY = function (pixel) {
        if (pixel !== undefined) {
            this.fabricCanvas.absolutePan(new window.fabric.Point(this.panX(), Math.min(Math.max(pixel, this.minY), this.maxY)));
        }
        return -this.fabricCanvas.viewportTransform[5];
    };
    return FabricRenderer;
}(core.BaseRenderer));
exports.FabricRenderer = FabricRenderer;
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-render-fabric/src/FabricRenderer.js.map