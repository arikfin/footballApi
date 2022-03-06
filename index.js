const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const actionsRoute = require('./controllers/actions');
app.use('/api', actionsRoute);


const url ="mongodb+srv://arik_user:EykWrLrBjs102lIt@cluster0.wpvsg.mongodb.net/Store_DB?retryWrites=true&w=majority"


const port = 5090;

mongoose.connect(url)
.then(results =>{
    console.log(results);
    app.listen(port, function() {
        console.log(`Running via port ${port}`);
    })
})
.catch(err =>{
    console.log(err);
})