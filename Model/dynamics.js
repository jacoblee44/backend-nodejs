const mongoose = require('mongoose');


const countrySchema = new mongoose.Schema({
    country: {type:String,unique:true},
    active: {type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const countryModel = mongoose.model('country', countrySchema)

const languageSchema = new mongoose.Schema({
    language: {type:String,unique:true},
    active: {type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const languageModel = mongoose.model('language', languageSchema)

const jobtypeSchema = new mongoose.Schema({
    jobtype: {type:String,unique:true},
    active: {type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const jobtypeModel = mongoose.model('jobtype', jobtypeSchema)

const jobschedSchema = new mongoose.Schema({
    jobsched: {type:String,unique:true},
    active: {type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const jobschedModel = mongoose.model('jobsched', jobschedSchema)

const supplementalpaySchema = new mongoose.Schema({
    supplementalpay: {type:String,unique:true},
    active: {type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const supplementalpayModel = mongoose.model('supplementalpay', supplementalpaySchema)

const benefitsofferSchema = new mongoose.Schema({
    benefitsoffers: {type:String,unique:true},
    active: {type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const benefitsoffersModel = mongoose.model('benefitsoffers', benefitsofferSchema)

module.exports = {
    countrySeed: async (req, res) => {
        const CountryData = req.body.data;
        countryModel.insertMany(CountryData, {ordered : false }).catch(err=>{ /*console.error(err);*/ }) 
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },
    getallcountry: async (req, res) => {
        const result = await countryModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Country is not Available...!"}) }
        res.status(201).json({status:true, countries:result})
    },
    languageSeed: async (req, res) => {
        const languageData = req.body.data;
        languageModel.insertMany(languageData, {ordered : false }).catch(err=>{ /*console.error(err);*/ }) 
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },
    getalllanguage: async (req, res) => {
        const result = await languageModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Language is not Available...!"}) }
        res.status(201).json({status:true, languages:result})
    },
    jobtypeSeed: async (req, res) => {
        const jobtypeData = req.body.data;
        jobtypeModel.insertMany(jobtypeData, {ordered : false }).catch(err=>{ /*console.error(err);*/ }) 
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },
    getalljobtype: async (req, res) => {
        const result = await jobtypeModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Jobtype is not Available...!"}) }
        res.status(201).json({status:true, jobtypes:result})
    },
    jobscheduleSeed: async (req, res) => {
        const jobschedData = req.body.data;
        jobschedModel.insertMany(jobschedData, {ordered : false }).catch(err=>{ /*console.error(err);*/ }) 
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },
    getalljobschedule: async (req, res) => {
        const result = await jobschedModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Jobschedule is not Available...!"}) }
        res.status(201).json({status:true, jobschedules:result})
    },
    supplementalpaySeed: async (req, res) => {
        const supplementalpayData = req.body.data;
        supplementalpayModel.insertMany(supplementalpayData, {ordered : false }).catch(err=>{ /*console.error(err);*/ }) 
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },
    getallsupplementalpay: async (req, res) => {
        const result = await supplementalpayModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Supplemental Pay is not Available...!"}) }
        res.status(201).json({status:true, supplementalpay:result})
    },
    benefitsofferedSeed: async (req, res) => {
        const benefitsoffersData = req.body.data;
        benefitsoffersModel.insertMany(benefitsoffersData, {ordered : false }).catch(err=>{ /*console.error(err);*/ }) 
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },
    getallbenefitsoffered: async (req, res) => {
        const result = await benefitsoffersModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Benefits Offered is not Available...!"}) }
        res.status(201).json({status:true, benefitsoffered:result})
    }
}