"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonFormatData = exports.errorFileMessage = exports.invalidContentErrorCode = exports.successCode = void 0;
exports.successCode = 200;
exports.invalidContentErrorCode = 422;
exports.errorFileMessage = { data: 'invalid file format' };
const jsonFormatData = (formattedTimeStamp, logStatusPortion, detailsInfoJson) => {
    return {
        timestamp: formattedTimeStamp,
        loglevel: logStatusPortion,
        transactionId: detailsInfoJson.transactionId,
        err: detailsInfoJson.err
    };
};
exports.jsonFormatData = jsonFormatData;
