"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateSongsCreation(req, h) {
    var song = req.payload;
    var requiredParameter = {
        title: "string",
        year: "number",
        genre: "string",
        performer: "string",
    };
    if (Object.entries(requiredParameter).every(function (_a) {
        var param = _a[0], type = _a[1];
        return (param in song && typeof song[param] === type);
    }))
        return h.continue;
    else {
        var s = JSON.stringify;
        var response = {
            status: "fail",
            code: 400,
            message: "Invalid request body.",
        };
        var res = h.response(response).code(response.code);
        res.header("Content-Type", "application/json");
        res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
        req.app = { invalidResponse: res };
        return res;
    }
}
exports.default = validateSongsCreation;
