
const express = require('express')
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser')
const devicesRoutes = require("./routes/devicesRoutes.js")
//const pool = require("./database/psql")


const port = process.env.PORT || 4000
const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    //Enable CORS for all requests
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next() //It passes control to the next matching route. 
})
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use("/devices", devicesRoutes)


app.get('/', (req, res) => {
    res.json({
        message: 'Wings-Ict-Projcet Server is up and running.'
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`))
