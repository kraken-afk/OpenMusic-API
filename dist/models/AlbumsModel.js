"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = __importDefault(require("shortid"));
var init_1 = require("../config/init");
var AlbumsModel = /** @class */ (function () {
    function AlbumsModel() {
    }
    AlbumsModel.create = function (data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, response, error_1, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = 'album-' + shortid_1.default.generate();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, init_1.prisma.albums.create({ data: __assign(__assign({}, data), { id: id }) })];
                    case 2:
                        _b.sent();
                        response = {
                            status: true,
                            data: {
                                albumId: id,
                            },
                        };
                        return [2 /*return*/, response];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        response = {
                            status: false,
                            message: (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _a !== void 0 ? _a : "Unable to create album, something went Error!",
                        };
                        return [2 /*return*/, response];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AlbumsModel.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var album;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, init_1.prisma.albums.findUnique({
                            where: { id: id },
                        })];
                    case 1:
                        album = _a.sent();
                        return [4 /*yield*/, init_1.prisma.$disconnect()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, album];
                }
            });
        });
    };
    AlbumsModel.update = function (id, _a) {
        var _b;
        var name = _a.name, year = _a.year;
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2, response;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, init_1.prisma.albums.update({
                                where: { id: id },
                                data: { name: name, year: year },
                            })];
                    case 1:
                        _c.sent();
                        response = {
                            status: true,
                            data: { message: "Album of id: '".concat(id, " has been updated.'") },
                        };
                        return [2 /*return*/, response];
                    case 2:
                        error_2 = _c.sent();
                        response = {
                            status: false,
                            message: (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.message) !== null && _b !== void 0 ? _b : "Album not found",
                        };
                        return [2 /*return*/, response];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AlbumsModel.remove = function (id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, init_1.prisma.albums.delete({ where: { id: id } })];
                    case 1:
                        _b.sent();
                        response = {
                            status: true,
                            data: { message: "Album of id: '".concat(id, " has been removed.'") },
                        };
                        return [2 /*return*/, response];
                    case 2:
                        error_3 = _b.sent();
                        response = {
                            status: false,
                            message: (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.message) !== null && _a !== void 0 ? _a : "Album not found",
                        };
                        return [2 /*return*/, response];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AlbumsModel;
}());
exports.default = AlbumsModel;
