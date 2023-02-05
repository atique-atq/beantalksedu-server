import express, {Express, Request, Response} from 'express'
const app: Express = express();
import cors from 'cors'
import multer from 'multer'
const port = process.env.PORT || 5000;
import {successCode, invalidContentErrorCode, errorFileMessage, jsonFormatData } from './utilities'

//middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() })

//log level filter
const logLevel = ['warn', 'error'];


async function run() {
  try {
    //process log api
    app.post("/processlog", upload.single('file'),  (req: Request, res:Response) => {
      const file = req.file as Express.Multer.File;
      const arrayFromFile =  file.buffer.toString().split(/\r?\n/);

      if (arrayFromFile[0].length === 0) {
        return res.status(invalidContentErrorCode).send(errorFileMessage);
      }
      //filter log warn and error
      let filteredLogArray = arrayFromFile.filter(element => { 
        return logLevel.includes(element.split(' - ')[1]?.toLowerCase())
      });

      //formatting log as per expecting format
      let expectedArray = filteredLogArray.map(element => {
        let [timePortion, logStatusPortion, otherDetails] = element.split(' - ')
        let stringTimeValue = timePortion.substring(1);
        let formattedTimeStamp = Math.floor(new Date(stringTimeValue).valueOf());
        let formattedOtherDetails = otherDetails.replaceAll('""', '"').slice(0, -1);
        let detailsInfoJson = JSON.parse(formattedOtherDetails);

        return jsonFormatData(formattedTimeStamp, logStatusPortion, detailsInfoJson);
      });
      res.status(200).send({data: expectedArray});
    })
  }
  finally {
  }
}
run().catch(error => console.error({errorData: error}));

app.get("/", (req: Request, res: Response): void => {
  res.send( "beansTalkEdu server (typescript) is running");
});

app.listen(port, ():void => console.log(`beansTalkEdu server (typescript) is running on ${port}`));