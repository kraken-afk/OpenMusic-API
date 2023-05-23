"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateAlbumCreation(req, h) {
    var payload = req.payload;
    if ("name" in payload &&
        "year" in payload &&
        typeof payload.name === "string" &&
        typeof payload.year === "number")
        return h.continue;
    else {
        var s = JSON.stringify;
        var response = {
            status: "fail",
            code: 400,
            message: "Invalid request body. Name<string> and Year<number> are required.",
        };
        var res = h.response(response).code(response.code);
        res.header("Content-Type", "application/json");
        res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
        req.app = { invalidResponse: res };
        return res;
    }
}
exports.default = validateAlbumCreation;
