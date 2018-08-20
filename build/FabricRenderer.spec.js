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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var FabricRenderer_1 = require("./FabricRenderer");
var psdetch_utils_1 = require("psdetch-utils");
var testUtils_1 = require("psdetch-utils/build/testUtils");
var canvas_1 = require("psdetch-utils/build/canvas");
function dummyPage() {
    var img = new Image(275, 183);
    img.src = "base/testAssets/nature.jpeg";
    var p = {
        name: "dummy page",
        width: 275,
        height: 183,
        getPreview: function (zoom) {
            return canvas_1.zoomImg(img, zoom);
        },
        getLayers: function () {
            return Promise.resolve([]);
        }
    };
    return p;
}
describe("FabricRenderer", function () {
    function getRenderer() {
        return new FabricRenderer_1.FabricRenderer(c, 300, 300);
    }
    var c;
    beforeAll(function () {
        c = document.createElement("canvas");
        c.width = 300;
        c.height = 300;
        document.querySelector("body").appendChild(c);
    });
    afterAll(function () {
        document.querySelector("body").removeChild(c);
    });
    it("should attach to a canvas element", function () {
        var f = getRenderer();
        expect(f.renderWidth).toEqual(300);
        expect(f.renderHeight).toEqual(300);
        f.destroy();
    });
    it("should render a page", function () { return __awaiter(_this, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = getRenderer();
                    return [4 /*yield*/, f.renderPage(dummyPage())];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                case 2:
                    _a.sent();
                    expect(testUtils_1.testConfirm("Do you see renderened image?")).toBeTruthy();
                    f.setBackground();
                    return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                case 3:
                    _a.sent();
                    expect(testUtils_1.testConfirm("Was the rendered image disappeared?")).toBeTruthy();
                    f.destroy();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should pan canvas", function () { return __awaiter(_this, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = getRenderer();
                    return [4 /*yield*/, f.renderPage(dummyPage())];
                case 1:
                    _a.sent();
                    f.panX(100);
                    return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                case 2:
                    _a.sent();
                    expect(f.panX()).toEqual(100);
                    expect(testUtils_1.testConfirm("Do you see image panned to left about 100px?")).toBeTruthy();
                    f.panY(20);
                    return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                case 3:
                    _a.sent();
                    expect(f.panY()).toEqual(20);
                    expect(testUtils_1.testConfirm("Do you see image panned to top about 20px?")).toBeTruthy();
                    f.destroy();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should zoom canvas", function () { return __awaiter(_this, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = getRenderer();
                    return [4 /*yield*/, f.renderPage(dummyPage())];
                case 1:
                    _a.sent();
                    f.zoom(2);
                    return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                case 2:
                    _a.sent();
                    expect(f.zoom()).toEqual(2);
                    debugger;
                    expect(testUtils_1.testConfirm("Do you see image be zoomed to 2x?")).toBeTruthy();
                    f.zoom(0.5);
                    return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                case 3:
                    _a.sent();
                    expect(f.zoom()).toEqual(0.5);
                    expect(testUtils_1.testConfirm("Do you see image be zoomed to  0.5x?")).toBeTruthy();
                    f.destroy();
                    return [2 /*return*/];
            }
        });
    }); });
    if (process.env.INTERACTIVE) {
        describe("Canvas Interactive event", function () {
            it("should handle mouse event ", function () { return __awaiter(_this, void 0, void 0, function () {
                var f;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            f = getRenderer();
                            return [4 /*yield*/, f.renderPage(dummyPage())];
                        case 1:
                            _a.sent();
                            f.zoom(3);
                            return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var evts = {
                                        click: false,
                                        mousedown: false,
                                        mouseleave: false,
                                        mousemove: false,
                                        mouseup: false
                                    };
                                    function h(k) {
                                        var _this = this;
                                        return function () { return __awaiter(_this, void 0, void 0, function () {
                                            var keys, _i, keys_1, key;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        evts[k] = true;
                                                        keys = Object.keys(evts);
                                                        for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                                                            key = keys_1[_i];
                                                            if (!evts[key]) {
                                                                return [2 /*return*/];
                                                            }
                                                        }
                                                        return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                                                    case 1:
                                                        _a.sent();
                                                        f.destroy();
                                                        resolve();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); };
                                    }
                                    var keys1 = Object.keys(evts);
                                    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
                                        var key = keys1_1[_i];
                                        f.on(key, h(key));
                                    }
                                    testUtils_1.testAlert("Move mouse onto the page and click it and move out the page");
                                })];
                    }
                });
            }); });
            it("should handle wheel/touch pad ", function () { return __awaiter(_this, void 0, void 0, function () {
                var f;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            f = getRenderer();
                            return [4 /*yield*/, f.renderPage(dummyPage())];
                        case 1:
                            _a.sent();
                            f.zoom(2);
                            return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var timer = setInterval(function () {
                                        if (f.panY() === f.maxY) {
                                            clearInterval(timer);
                                            f.destroy();
                                            resolve();
                                        }
                                    }, 100);
                                    testUtils_1.testAlert("Use mouse scroll to scroll page to bottom of the canvas.");
                                })];
                    }
                });
            }); });
        });
    }
    describe("Drawing", function () {
        it("should draw on canvas", function () { return __awaiter(_this, void 0, void 0, function () {
            var f;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        f = getRenderer();
                        return [4 /*yield*/, f.renderPage(dummyPage())];
                    case 1:
                        _a.sent();
                        f.zoom(2);
                        f.draw(new window.fabric.Rect({
                            left: 100,
                            top: 100,
                            width: 100,
                            height: 100,
                            fill: "red",
                        }));
                        return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                    case 2:
                        _a.sent();
                        expect(testUtils_1.testConfirm("Do you see a red rectangle drawn on canvas?")).toBeTruthy();
                        f.draw(new window.fabric.Rect({
                            left: 150,
                            top: 150,
                            width: 100,
                            height: 100,
                            fill: "blue"
                        }), "high");
                        return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                    case 3:
                        _a.sent();
                        expect(testUtils_1.testConfirm("Do you see a blue rectangle drawn above red rect?")).toBeTruthy();
                        f.draw(new window.fabric.Rect({
                            left: 50,
                            top: 50,
                            width: 100,
                            height: 100,
                            fill: "green"
                        }), "low");
                        return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                    case 4:
                        _a.sent();
                        expect(testUtils_1.testConfirm("Do you see a green rectangle drawn under red rect?")).toBeTruthy();
                        f.clearDrawing(undefined, "normal");
                        return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                    case 5:
                        _a.sent();
                        expect(testUtils_1.testConfirm("Do you see a red rectangle disappeared?")).toBeTruthy();
                        f.clearDrawing(undefined, "low");
                        f.clearDrawing(undefined, "high");
                        return [4 /*yield*/, psdetch_utils_1.sleep(100)];
                    case 6:
                        _a.sent();
                        expect(testUtils_1.testConfirm("Do you see all rectangles disappeared?")).toBeTruthy();
                        f.destroy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/psdetch-render-fabric/src/FabricRenderer.spec.js.map