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
function emptyGroup(width, height) {
    return new window.fabric.Group(undefined, {
        selectable: false,
        originX: "left",
        originY: "top"
    });
}
var FabricRenderer = /** @class */ (function (_super) {
    __extends(FabricRenderer, _super);
    function FabricRenderer(ele, renderWidth, renderHeight) {
        var _this = _super.call(this, ele, renderWidth, renderHeight) || this;
        _this.ele = ele;
        _this.renderWidth = renderWidth;
        _this.renderHeight = renderHeight;
        _this.canvasLayers = {
            "low": emptyGroup(_this.renderWidth, _this.renderHeight),
            "normal": emptyGroup(_this.renderWidth, _this.renderHeight),
            "high": emptyGroup(_this.renderWidth, _this.renderHeight),
        };
        _this.fabricCanvas = new window.fabric.Canvas(ele, {
            hoverCursor: "inherit",
            selection: false,
            renderOnAddRemove: true
        });
        _this.fabricCanvas.setWidth(renderWidth);
        _this.fabricCanvas.setHeight(renderHeight);
        _this.bindEvents();
        var keys = Object.keys(_this.canvasLayers);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _this.fabricCanvas.add(_this.canvasLayers[key]);
        }
        return _this;
    }
    FabricRenderer.prototype.setCanvasSize = function (width, height) {
        this.fabricCanvas.setDimensions({ width: width, height: height });
        this.fabricCanvas.renderAll();
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
    FabricRenderer.prototype.getBackground = function () {
        return this.canvasBackground ? this.canvasBackground.getElement() : undefined;
    };
    FabricRenderer.prototype.setBackground = function (img) {
        if (img) {
            if (this.canvasBackground) {
                this.fabricCanvas.remove(this.canvasBackground);
            }
            this.canvasBackground = new window.fabric.Image(img, { left: 0, top: 0, selectable: false });
            this.fabricCanvas.insertAt(this.canvasBackground, 0, false);
        }
        else {
            if (this.canvasBackground) {
                this.fabricCanvas.remove(this.canvasBackground);
                this.canvasBackground = undefined;
            }
        }
    };
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
    FabricRenderer.prototype.panX = function (pixel) {
        if (pixel !== undefined) {
            this.fabricCanvas.absolutePan(new window.fabric.Point(Math.min(Math.max(pixel, this.minX), this.maxX), this.panY()));
        }
        return -this.fabricCanvas.viewportTransform[4];
    };
    FabricRenderer.prototype.panY = function (pixel) {
        if (pixel !== undefined) {
            this.fabricCanvas.absolutePan(new window.fabric.Point(this.panX(), Math.min(Math.max(pixel, this.minY), this.maxY)));
        }
        return -this.fabricCanvas.viewportTransform[5];
    };
    return FabricRenderer;
}(core.BaseRenderer));
exports.FabricRenderer = FabricRenderer;
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-render-fabric/src/FabricRenderer.js.map