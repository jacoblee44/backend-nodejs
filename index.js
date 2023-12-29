const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
//require('./dbconfig');
const util = require('util');
var routes = require('./routes/routes');
const path = require('path');
const app = express();


const cron = require('node-cron');

const jobfeed = require('./Model/job');

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '100mb',
        parameterLimit: 50000,
    }),
);
app.use(
    bodyParser.json({
        limit: '100mb',
    })
)
app.use(express.json());
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "*Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// app.use(express.json({ type: '*/*', limit: "50mb" }));

//cron.schedule('0 1 * * *', jobfeed.getjobfeedData);


/*() => {
    console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
    jobfeed.getjobfeedData.dataSources.get();
}, {
    scheduled: true
    /*,
    timezone: "America/Sao_Paulo"* /
});*/

//app.listen(5000);

const initPublicStructure = (publicStructures = [], index = 0) => {
    if (index >= publicStructures.length) return;
    if (!fs.existsSync(publicStructures[index]))
        fs.mkdirSync(publicStructures[index]);
    return initPublicStructure(publicStructures, index + 1)
}

initPublicStructure([
    './public',
    './public/uploads',
    './public/uploads/resume'
])

const port = process.env.PORT || 3000
app.use('/', routes);
app.listen(port, () => console.log("Server Connected http://localhost:" + port + "/"));
