const express = require('express'); //import express
const app = express();
const PORT = 8080;

const ROUTE = '/test';

app.use(express.json())

app.get(ROUTE, (req, res) =>{
    res.status(200).send({test: `test`});
})

app.post(ROUTE + `/:id`, (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    if (!name) {
        res.status(418).send({messasge: 'we need a name'})
    }
    else
        res.status(200).send({
    id: `${id}`,
    name: `${name}`})
}), 

app.listen(
    PORT,
    () => console.log(`http://localhost:${PORT}`) 
)