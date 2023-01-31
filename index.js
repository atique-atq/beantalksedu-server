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

      console.log('Before filtered array: ', logArray);
      // console.log(logArray)
    
      if (logArray.length != 0) {
          let filteredLogArray = logArray.filter(element => { 
              return logLevel.includes(element.split(' - ')[1].toLowerCase())
          });
        
        filteredLogArray.map(element => {
          // Math.floor(new Date('2021-08-09T02:12:51.259Z').valueOf())
          let [timePortion, logStatusPortion] = element.split(' - ')
          let stringTimeValue = timePortion.substring(1);
          let formattedTimeStamp = Math.floor(new Date(stringTimeValue).valueOf());
          console.log('--log status: ', logStatusPortion);
          return {
            "timestamp": formattedTimeStamp,
            "loglevel": logStatusPortion,
          }
        });
     }


        res.send({file: 'demo file'});
      });



  } 
  
  finally {

  }
}
run().catch(error => console.error(error));

app.listen(port, () => console.log(`beansTalkEdu server is running on ${port}`));
