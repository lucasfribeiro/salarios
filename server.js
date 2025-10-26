const express = require ("express");
const app = express();
const port = 3333;

app.use( express.urlencoded({ extended: true }) );

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost${port}`);
})
