"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(require('dotenv')).config();
var _a = process.env, PGUSER = _a.PGUSER, PGPASSWORD = _a.PGPASSWORD, PGDATABASE = _a.PGDATABASE, PGHOST = _a.PGHOST, PGPORT = _a.PGPORT;
var PrismaScheme = {
    datasources: {
        db: {
            url: "postgresql://".concat(PGUSER, ":").concat(PGPASSWORD, "@").concat(PGHOST, ":").concat(PGPORT, "/").concat(PGDATABASE, "?schema=public")
        }
    }
};
exports.default = PrismaScheme;
