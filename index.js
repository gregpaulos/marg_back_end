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

app.get(`/v1/establishments/`, (req, res) => {
  queries.getEstablishmentsQuickly()
    .then(records => { res.json(records) })
    .catch(err => { res.json({error: err}) });
});

app.get(`/v1/establishments/random`, (req, res) => {
  queries.getEstablishments()
    .then(records => { res.json(records) })
    .catch(err => { res.json({error: err}) });
});

app.get(`/v1/establishments/:id`, (req, res) => {
  queries.getEstablishmentsByID(req.params.id)
    .then(records => { res.json(records) })
    .catch(err => { res.json({error: err}) });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
