"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv
var dotenv = require("dotenv"); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// fs
var fs_1 = require("fs");
// axios
var axios_1 = require("axios");
/*  Header Fields from csv
month_date_yyyymm: 202302 -- 0
cbsa_code: 26820 --  1
cbsa_title: Idaho Falls, ID --- 2
HouseholdRank: 302 --  3
median_listing_price: 457500 -- 4
median_listing_price_mm: 0.0184 -- 5
median_listing_price_yy: -0.01339 -- 6
active_listing_count: 374 -- 7
active_listing_count_mm: -0.0778 -- 8
active_listing_count_yy,  9
median_days_on_market,  10
median_days_on_market_mm,  11
median_days_on_market_yy,  12
new_listing_count,  13
new_listing_count_mm,  14
new_listing_count_yy,  15
price_increased_count,  16
price_increased_count_mm,  17
price_increased_count_yy,  18
price_reduced_count,  19
price_reduced_count_mm,  20
price_reduced_count_yy,  21
pending_listing_count,  22
pending_listing_count_mm,  23
pending_listing_count_yy,  24
median_listing_price_per_square_foot,  25
median_listing_price_per_square_foot_mm  26
,median_listing_price_per_square_foot_yy,  27
median_square_feet,  28
median_square_feet_mm,  29
median_square_feet_yy,  30
average_listing_price,  31
average_listing_price_mm,  32
average_listing_price_yy,  33
total_listing_count,  34
total_listing_count_mm,  35
total_listing_count_yy,  36
pending_ratio,  37
pending_ratio_mm,  38
pending_ratio_yy,  39
quality_flag  40
*/
function csvToArray(text) {
    var p = "", row = [""], i = 0, r = 0, s = !0, l;
    var ret = [row];
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        l = text_1[_i];
        if ('"' === l) {
            if (s && l === p)
                row[i] += l;
            s = !s;
        }
        else if ("," === l && s)
            l = row[++i] = "";
        else if ("\n" === l && s) {
            var tempRow = row[i];
            if ("\r" === p && tempRow)
                row[i] = tempRow.slice(0, -1);
            row = ret[++r] = [(l = "")];
            i = 0;
        }
        else
            row[i] += l;
        p = l;
    }
    return ret;
}
var extractStateFromCBSATitle = function (title) {
    if (!title)
        return;
    var state = title.split(",")[1];
    if (state) {
        state = state.trim().slice(0, 2).toLowerCase();
        return state;
    }
};
var getStateData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, csvArray, stateHash, headerRow, i, row, stateId, _i, _a, _b, key, value, err_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_Metro_History.csv")];
            case 1:
                data = (_d.sent()).data;
                csvArray = csvToArray(data);
                stateHash = {};
                headerRow = csvArray[0] || [];
                for (i = 1; i < csvArray.length - 2; i++) {
                    row = csvArray[i];
                    if (row) {
                        stateId = extractStateFromCBSATitle(row[2]);
                        if (stateId && stateHash[stateId]) {
                            (_c = stateHash[stateId]) === null || _c === void 0 ? void 0 : _c.push(row.join(","));
                        }
                        else if (stateId) {
                            stateHash[stateId] = [row.join(",")];
                        }
                    }
                }
                for (_i = 0, _a = Object.entries(stateHash); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], value = _b[1];
                    (0, fs_1.writeFileSync)("metroData/".concat(key, ".csv"), "".concat(headerRow.join(","), "\r\n").concat(value.join("\r\n")));
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _d.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
getStateData().catch(function (err) {
    console.error(err);
});
