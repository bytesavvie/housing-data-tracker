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
// axios
var axios_1 = require("axios");
// @aws-sdk-v3
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var client = new client_dynamodb_1.DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
var createStateDataPoint = function (csvRow) {
    var dataPoint = {
        date: csvRow[0] || "",
        state: csvRow[1] || "",
        stateId: csvRow[2] || "",
        medianListingPrice: csvRow[3] || "",
        medianListingPriceMM: csvRow[4] || "",
        medianListingPriceYY: csvRow[5] || "",
        activeListingCount: csvRow[6] || "",
        activeListingCountMM: csvRow[7] || "",
        activeListingCountYY: csvRow[8] || "",
        medianDaysOnMarket: csvRow[9] || "",
        medianDaysOnMarketMM: csvRow[10] || "",
        medianDaysOnMarketYY: csvRow[11] || "",
        newListingCount: csvRow[12] || "",
        newListingCountMM: csvRow[13] || "",
        newListingCountYY: csvRow[14] || "",
        priceIncreasedCount: csvRow[15] || "",
        priceIncreasedCountMM: csvRow[16] || "",
        priceIncreasedCountYY: csvRow[17] || "",
        priceReducedCount: csvRow[18] || "",
        priceReducedCountMM: csvRow[19] || "",
        priceReducedCountYY: csvRow[20] || "",
        pendingListingCount: csvRow[21] || "",
        pendingListingCountMM: csvRow[22] || "",
        pendingListingCountYY: csvRow[23] || "",
        medianListingPricePerSquareFoot: csvRow[24] || "",
        medianListingPricePErSquareFootMM: csvRow[25] || "",
        medianListingPricePErSquareFootYY: csvRow[26] || "",
        medianSquareFeet: csvRow[27] || "",
        medianSquareFeetMM: csvRow[28] || "",
        medianSquareFeetYY: csvRow[29] || "",
        averageListingPrice: csvRow[30] || "",
        averageListingPriceMM: csvRow[31] || "",
        averageListingPriceYY: csvRow[32] || "",
        totalListingCount: csvRow[33] || "",
        totalListingCountMM: csvRow[34] || "",
        totalListingCountYY: csvRow[35] || "",
        pendingRatio: csvRow[36] || "",
        pendingRatioMM: csvRow[37] || "",
        pendingRatioYY: csvRow[38] || "",
    };
    return dataPoint;
};
var getStateData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, lines, stateHash, i, columns, stateId, stateDataPoint, tableName, item, putItemCommand, result, states, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get("https://econdata.s3-us-west-2.amazonaws.com/Reports/Core/RDC_Inventory_Core_Metrics_State_History.csv")];
            case 1:
                data = (_c.sent()).data;
                lines = data.split(/\r|\r?\n/g);
                stateHash = {};
                // First line is the header columns;
                // Last four lines are either empty strings or contain the quality flag description (last line of actual data is lines.length - 5)
                for (i = 1; i < lines.length - 4; i++) {
                    columns = ((_a = lines[i]) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
                    stateId = columns[2];
                    stateDataPoint = createStateDataPoint(columns);
                    if (stateId && stateHash[stateId] !== undefined) {
                        (_b = stateHash[stateId]) === null || _b === void 0 ? void 0 : _b.push(stateDataPoint);
                    }
                    else if (stateId) {
                        stateHash[stateId] = [stateDataPoint];
                    }
                }
                tableName = "UsHousingDataByState";
                item = {
                    stateId: { S: "TX" },
                    data: {
                        L: [
                            {
                                M: {
                                    date: { S: "10/2020" },
                                    price: { S: "100000" },
                                },
                            },
                            {
                                M: {
                                    date: { S: "11/2020" },
                                    price: { S: "105000" },
                                },
                            },
                        ],
                    },
                };
                putItemCommand = new client_dynamodb_1.PutItemCommand({
                    TableName: tableName,
                    Item: item,
                });
                return [4 /*yield*/, client.send(putItemCommand)];
            case 2:
                result = _c.sent();
                console.log("result", result);
                states = Object.keys(stateHash);
                console.log(states.length);
                console.log(states);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _c.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
getStateData().catch(function (err) {
    console.error(err);
});
