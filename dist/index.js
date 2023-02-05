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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const port = process.env.PORT || 5000;
const utilities_1 = require("./utilities");
//middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
//log level filter
const logLevel = ['warn', 'error'];
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //process log api
            app.post("/processlog", upload.single('file'), (req, res) => {
                const file = req.file;
                const arrayFromFile = file.buffer.toString().split(/\r?\n/);
                if (arrayFromFile[0].length === 0) {
                    return res.status(utilities_1.invalidContentErrorCode).send(utilities_1.errorFileMessage);
                }
                //filter log warn and error
                let filteredLogArray = arrayFromFile.filter(element => {
                    var _a;
                    return logLevel.includes((_a = element.split(' - ')[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase());
                });
                //formatting log as per expecting format
                let expectedArray = filteredLogArray.map(element => {
                    let [timePortion, logStatusPortion, otherDetails] = element.split(' - ');
                    let stringTimeValue = timePortion.substring(1);
                    let formattedTimeStamp = Math.floor(new Date(stringTimeValue).valueOf());
                    let formattedOtherDetails = otherDetails.replaceAll('""', '"').slice(0, -1);
                    let detailsInfoJson = JSON.parse(formattedOtherDetails);
                    return (0, utilities_1.jsonFormatData)(formattedTimeStamp, logStatusPortion, detailsInfoJson);
                });
                res.status(200).send({ data: expectedArray });
            });
        }
        finally {
        }
    });
}
run().catch(error => console.error({ errorData: error }));
app.get("/", (req, res) => {
    res.send("beansTalkEdu server (typescript) is running");
});
app.listen(port, () => console.log(`beansTalkEdu server (typescript) is running on ${port}`));
