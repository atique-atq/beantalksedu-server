const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const multer  = require('multer');
const csv = require("csvtojson");
const utilities = require("./utilities");

// middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() })

//log level filter
const logLevel = ['warn', 'error'];


async function run() {
  try {
    //process log api
    app.post("/processlog", upload.single('file'),  (req, res) => {
      const logArray =  req.file.buffer.toString().split(/\r?\n/);
      if (logArray[0].length === 0) {
        return res.status(utilities.invalidContentErrorCode).send(utilities.errorFileMessage);
      }
      let filteredLogArray = logArray.filter(element => { 
        return logLevel.includes(element.split(' - ')[1]?.toLowerCase())
      });
     
      let expectedArray = filteredLogArray.map(element => {
          let [timePortion, logStatusPortion, otherDetails] = element.split(' - ')
          let stringTimeValue = timePortion.substring(1);
          let formattedTimeStamp = Math.floor(new Date(stringTimeValue).valueOf());
          let formattedOtherDetails = otherDetails.replaceAll('""', '"').slice(0, -1);
          let detailsJson = JSON.parse(formattedOtherDetails);

          return {
            "timestamp": formattedTimeStamp,
            "loglevel": logStatusPortion,
            "transactionId": detailsJson.transactionId,
            "err": detailsJson.err
          }
        });
        res.status(utilities.successCode).send({data: expectedArray});
      });
  } 
  finally {
  }
}
run().catch(error => console.error({errorData: error}));

app.get("/", async (req, res) => {
  res.send("beansTalkEdu task server is running");
});

app.listen(port, () => console.log(`beansTalkEdu server is running on ${port}`));
