const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const multer  = require('multer');
const csv = require("csvtojson");

// middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() })

const logLevel = ['warn', 'error'];

app.get("/", async (req, res) => {
  res.send("beansTalkEdu is running");
});

async function run() {
  try {
    //process log
    app.post("/processlog", upload.single('file'),  (req, res) => {
      const logArray =  (req.file.buffer.toString()).split(/\r?\n/);

      // console.log('Before filtered array: ', logArray);
    
        if (logArray.length === 0) {
          return res.send({ errorData: 'invalid file' });
        }
        
        let filteredLogArray = logArray.filter(element => { 
            return logLevel.includes(element.split(' - ')[1].toLowerCase())
        });
        
        let expectedArray = filteredLogArray.map(element => {
          let [timePortion, logStatusPortion, otherDetails] = element.split(' - ')
          let stringTimeValue = timePortion.substring(1);
          let formattedTimeStamp = Math.floor(new Date(stringTimeValue).valueOf());
          let formattedOtherDetails = otherDetails.replaceAll('""', '"').slice(0, -1);
          let detailsJson = JSON.parse(formattedOtherDetails);
          console.log('json details ', detailsJson.transactionId);

          let expectedValue = {
            "timestamp": formattedTimeStamp,
            "loglevel": logStatusPortion,
            "transactionId": detailsJson.transactionId,
            "err": detailsJson.err
          }
          console.log(expectedValue);
          return expectedValue;
        });
      
        console.log('Final value', expectedArray);

        res.send({data: expectedArray});
      });

  } 
  
  finally {

  }
}
run().catch(error => console.error({errorData: error}));

app.listen(port, () => console.log(`beansTalkEdu server is running on ${port}`));
