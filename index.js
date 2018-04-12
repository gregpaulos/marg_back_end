const express = require(`express`);
const app = express();
const port = process.env.PORT || 3000;

app.get(`/v1/hello`, (req, res) => {
    res.json({message: `Hello World!`})
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})