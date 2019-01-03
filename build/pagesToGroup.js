"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var gridMargin = 20;
var itemPerRow = 4;
var labelPreviewSpan = 10;
/**
 * create fabric groups with pages and its layout definition.
 */
function pagesToGroup(pages, scale) {
    return __awaiter(this, void 0, void 0, function () {
        var groups, _i, pages_1, page, group, rtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    groups = [];
                    _i = 0, pages_1 = pages;
                    _a.label = 1;
                case 1:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 4];
                    page = pages_1[_i];
                    return [4 /*yield*/, pageToGroup(page.page, scale, { x: page.rect.left, y: page.rect.top })];
                case 2:
                    group = _a.sent();
                    groups.push(group);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    rtn = new window.fabric.Group(groups, {
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
                    return [2 /*return*/, rtn];
            }
        });
    });
}
exports.pagesToGroup = pagesToGroup;
/**
 * Conver a page to a label + preview group
 */
function pageToGroup(page, scale, coords) {
    return __awaiter(this, void 0, void 0, function () {
        var label, preview, img;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    label = new window.fabric.Text(page.name, {
                        left: 0, top: 0,
                        fontFamily: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
                        fontSize: 16,
                        fill: "white"
                    });
                    label.top = (label.height ? -label.height : 0) - labelPreviewSpan;
                    return [4 /*yield*/, page.getPreview()];
                case 1:
                    preview = _a.sent();
                    img = new window.fabric.Image(preview, {
                        left: 0,
                        top: 0,
                        scaleX: scale,
                        scaleY: scale
                    });
                    return [2 /*return*/, new window.fabric.Group([label, img], {
                            selectable: false,
                            originX: "left",
                            originY: "top",
                            left: (coords ? coords.x : page.offsetX) * scale,
                            top: (coords ? coords.y : page.offsetY) * scale
                        })];
            }
        });
    });
}
/**
 * group[0] -- pages with offsetX and offsetY
 * group[1] -- pages without offsetX and offsetY
 */
function zoomPagesGroup(level, group) {
    // group.scale(level);
    group.forEachObject(function (group) {
        group.forEachObject(function (group) {
            var txt = group.item(0);
            var img = group.item(1);
            img.scale(level);
            img.setCoords();
            group.set("dirty", true);
            // img.top=0;
            // img.left=0;
            // txt.left=0;
            // txt.top=-txt.height!-labelPreviewSpan;
            // (group as any).addWithUpdate();
        });
        group.set("dirty", true);
    });
    group.set("dirty", true);
}
exports.zoomPagesGroup = zoomPagesGroup;
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-render-fabric/src/pagesToGroup.js.map