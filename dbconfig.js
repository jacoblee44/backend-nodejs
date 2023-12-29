const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
//if(process.env.MONGODB){
    mongoose.connect("mongodb+srv://"+process.env.MONGOUSER+":"+process.env.MONGOPASS+"@"+process.env.MONGOSERVER+"/"+process.env.MONGODB+"?authMechanism=DEFAULT&authSource=admin");
//} else{
    //mongoose.connect("mongodb+srv://doadmin:4MS8K05uc69Vb2v7@db-mongodb-lon1-56586-ca6881b7.mongo.ondigitalocean.com/admin?authMechanism=DEFAULT&authSource=admin"); 
//}