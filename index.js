const express = require(`express`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);
const app = express();
const port = process.env.PORT || 3000;
const queries = require(`./queries.js`)

app.use(cors());
app.use(bodyParser.json());

app.get(`/v1/hello`, (req, res) => {
  res.json({ message: `Hello World!` });
});

app.get(`/v1/establishments/:lat/:long`, (req, res) => {
  queries.getEstablishments(req.params.lat, req.params.long)
    .then()
    .catch();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
