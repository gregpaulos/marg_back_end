const express = require(`express`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);
const app = express();
const port = process.env.PORT || 3000;
const queries = require(`./queries.js`);
const fetch = require("node-fetch");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

const google_key = process.env.GOOGLE;

async function calcDistance(long, lat, establishmentArray) {
  // function calcDistance(long, lat, establishmentObj) {
  console.log("LONG", long);
  console.log("LAT", lat);
  console.log("GOOGLE MOFO", google_key);
  // console.log("ESTABLISHMENT OBJECT", establishmentObj);

  // console.log("ESTABLISHMENT ARRAY", establishmentArray);
  // let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${
  //   establishmentArray[0][1]
  // },${establishmentArray[0][0]}&key=${google_key}`;
  // console.log("THIS IS OUR URL", url);
  // fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(
  //       "THIS IS OUR RESPONSE FROM GOOGLE",
  //       data.rows[0].elements[0].distance.text
  //     );
  //   });

  console.log("ESTABLISHMENT ARRAY", establishmentArray);

  
  async function hitGoogle () {
    let responseArray = []
    for (let i = 0; i < establishmentArray.length; i++) {
      let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${
        establishmentArray[i][1]
      },${establishmentArray[i][0]}&key=${google_key}`;
      console.log("THIS IS OUR URL", url);
      await fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(
            "THIS IS OUR RESPONSE FROM GOOGLE",
            data.rows[0].elements[0].distance.text
          );
          responseArray.push(data.rows[0].elements[0].distance.text)
        })
    }
    console.log('THIS IS OUR INITIAL RESPONSE', responseArray);
    
    return responseArray
  
  }

  const newResponseArray = await hitGoogle();
  console.log('THIS IS OUR ARRAY OF GOOGLE INFO', newResponseArray);
  
  // let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${
  //   establishmentArray[0][1]
  // },${establishmentArray[0][0]}&key=${google_key}`;
  // console.log("THIS IS OUR URL", url);
  // fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(
  //       "THIS IS OUR RESPONSE FROM GOOGLE",
  //       data.rows[0].elements[0].distance.text
  //     );
  //   });

  // let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=lat,long|lat,long|lat,long|lat,long|lat,long&key=${google_key}`
  // fetch()
}

app.get(`/v1/hello`, (req, res) => {
  res.json({ message: `Hello World!` });
});

app.get(`/v1/establishments/`, (req, res) => {
  queries
    .getEstablishmentsQuickly()
    .then(records => {
      res.json(records);
    })
    .catch(err => {
      res.json({ error: err });
    });
});

app.get(`/v1/establishments/random/:long/:lat`, (req, res) => {
  console.log(req.params.long);
  console.log(req.params.lat);
  queries
    .getEstablishments()
    .then(records => {
      console.log("WHAT WE GET FROM OUR DB", records);
      // let distanceObj = {};
      // records.forEach(establishment => {
      //   distanceObj[establishment.id] = [establishment.long, establishment.lat];
      // });
      // console.log("THIS IS THE OBJECT I CREATED", distanceObj);
      // calcDistance(req.params.long, req.params.lat, distanceObj);

      let distanceArray = [];
      records.forEach(establishment => {
        distanceArray.push([establishment.long, establishment.lat]);
      });
      console.log("THIS IS THE OBJECT I CREATED", distanceArray);
      calcDistance(req.params.long, req.params.lat, distanceArray);

      return records;
    })
    .then(records => {
      res.json(records);
    })
    .catch(err => {
      res.json({ error: err });
    });
});

app.get(`/v1/establishments/:id`, (req, res) => {
  queries
    .getEstablishmentsByID(req.params.id)
    .then(records => {
      res.json(records);
    })
    .catch(err => {
      res.json({ error: err });
    });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
