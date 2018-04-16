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
  async function hitGoogle () {
    let fetchArray = []
    for (let i = 0; i < establishmentArray.length; i++) {
      let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${long}&destinations=${
        establishmentArray[i][1]
      },${establishmentArray[i][0]}&key=${google_key}`;
      await fetch(url)
        .then(response => response.json())
        .then(data => {
          fetchArray.push(data.rows[0].elements[0].distance.text)
        })
    }
    return fetchArray  
  }
  const responseArray = await hitGoogle();
  return responseArray
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
      let distanceArray = [];
      records.forEach(establishment => {
        distanceArray.push([establishment.long, establishment.lat]);
      });
      calcDistance(req.params.long, req.params.lat, distanceArray)
      .then(googleInfo => {
        googleInfo.forEach((distance, i) => {          
          records[i]["distance"] = googleInfo[i]
        })
        res.json(records);
      })
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
