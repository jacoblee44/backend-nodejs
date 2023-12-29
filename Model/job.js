const mongoose = require('mongoose');
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');
const userlst =  require('./users.js');
const globalsettings =  require('./users');
const axios = require('axios');
const mailTemplate = require('../utils/mailTemplate.js');

const jobcategorySchema = new mongoose.Schema({
    _id:Number,
    jobcategoryname:{type:String,unique:true},
    active:{type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const jobcategoryModel = mongoose.model('jobcategory', jobcategorySchema)

const postjobSchema = new mongoose.Schema({
    _id:Number,
    country: String,
    language: String,
    companyname: String,
    employerid:Number,
    jobtitle: String,
    locallangreq:{type:Boolean,default:false},
    langtraining:{type:Boolean,default:false},
    jobcategory:String,
    alterjobcategory:String,
    address:Array,
    adlocation:String,
    jobtype:Array,
    jobschedule:Array,
    contractlength:Number,
    contractperiod:String,
    startdate:Date,
    hirenumofpeople:String,
    hiringspeed:String,
    payrate: Array,
    supplementalpay:Array,
    benefitsoffered:Array,
    jobdescription:String,    
    jobdescdocs:Object,
    covidprecautions:String,
    jobreferenceid:String,
    jobstatus:{ type: String, enum: ['active', 'closed', 'pending'] },
    issubmitcv:Number,
    isapplndeadline:{type:Boolean,default:false},
    deadlinedate:Date,
    jobconversation:{type:Boolean,default:false},
    isdeleted:{type:Boolean,default:false},
    createddate:Date,
    updateddate:Date,
    externallink:String,
    isAPI:{type:Boolean,default:false},
    feedrating:String,
    feednoofreview:Number,
    feedjoburl:String,
    feedurl:String,
    feedpay:String,
    feedposteddate:String,
    feeddomain:String,
    feedsessionid:Number
});
const jobsModel = mongoose.model('jobs', postjobSchema);

const jobsearchglobalSchema = new mongoose.Schema({
    _id:Number,
    jobsearchkeyword:String,
    viewcount:Number,
    searchdate:Date,
    isdeleted:{type:Boolean,default:false}
});
const jobsearchglobalModel = mongoose.model('globaljobsearch', jobsearchglobalSchema);

const jobsearchuserSchema = new mongoose.Schema({
    _id:Number,
    jobsearchkeyword:String,
    userid:Number,
    viewcount:Number,
    searchdate:Date,
    isdeleted:{type:Boolean,default:false}
});
const jobsearchuserModel = mongoose.model('userjobsearch', jobsearchuserSchema)

const jobapplycreditSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    credits:Number,
    purchasedtransid:String,
    purchaseddate:Date
});
const jobapplycreditModel = mongoose.model('jobapplycredit', jobapplycreditSchema)

const jobapplySchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    jobid:Number,
    resumeid:Number,    
    firstname:String,
    lastname:String,
    email:String,
    phonecode:Number,
    phonenumber:Number,
    resumedocs:Object,
    creditflag:Number,
    supportdocs:Array,
    applieddate:Date,
    status:{type:String,default:""}
});
const jobapplyModel = mongoose.model('jobapply', jobapplySchema)

const jobconversationSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    employerid:Number,
    jobid:Number,
    createddate:Date,    
    subject:String,
    message:String,
    messageby:Number
});
const jobconversationModel = mongoose.model('jobconversation', jobconversationSchema)

const monthlybillingSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    month:Number,
    year:Number,
    credits:Number,
    amount:Number,
    currencycode:String,
    billingdate:Date,
    paymenttransid:String,
    paymentdate:Date,
    status:{type:String,default:"pending"}
});
const monthlybillingModel = mongoose.model('monthlybilling', monthlybillingSchema)


module.exports = {

    jobSchema:jobsModel,
    jobapplySchema:jobapplyModel,
    jobconversationSchema:jobconversationModel,
    monthlybillingSchema:monthlybillingModel,

    jobcategorySeed: async (req, res) => {

        const jobcategoryData = req.body.data;
        var idcount=1;
        const hasrecord = await jobcategoryModel.findOne().sort({_id:-1});
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        for(var i=0;i<jobcategoryData.length;i++){  
            jobcategoryModel.create( {_id:idcount, jobcategoryname:jobcategoryData[i].jobcategoryname});
            idcount++;
        }
        //jobcategoryModel.execute();
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },

    addjobCategory: async (req, res) => {
        const hasrecord = await jobcategoryModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        jobcategoryModel.create({_id:idcount, jobcategoryname:req.body.jobcategoryname}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, user:data})
        }) 
    },

    updatejobCategory: async (req, res) => {
        const result = await jobcategoryModel.findOne({_id:req.body.jobcatid});
        if(!result) { return res.status(422).json({message : "Invalid Job Category...!"}) }
        const data = await jobcategoryModel.updateOne(
            {'_id':req.body.jobcatid},
            {$set:{'jobcategoryname':req.body.jobcategoryname}},{multi:true}
        )
        res.status(201).json({status:true, user:data})
    },

    deletejobCategory: async (req, res) => {
        const result = await jobcategoryModel.findOne({_id:req.body.jobcatid});
        if(!result) { return res.status(422).json({message : "Invalid Job Category...!"}) }
        const data = await jobcategoryModel.updateOne(
            {'_id':req.body.jobcatid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Job Category Deleted Successfully...!"})
    },

    getalljobCategory: async (req, res) => {
        const result = await jobcategoryModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Job Category is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    getjobCategory: async (req, res) => {
        const result = await jobcategoryModel.findOne({_id:req.body.jobcatid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Job Category is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    addJob: async (req, res) => {
        var currdate = new Date();
        const hasrecord = await jobsModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        if((typeof req.body.jobtitle != "undefined")) {
            jobsModel.create({_id:idcount,country:req.body.country,language:req.body.language,companyname:req.body.companyname,employerid:req.body.employerid,jobtitle:req.body.jobtitle,locallangreq:req.body.locallangreq,langtraining:req.body.langtraining,jobcategory:req.body.jobcategory,alterjobcategory:req.body.alterjobcategory,address:req.body.address,adlocation:req.body.adlocation,jobstatus:"pending",createddate:currdate}, function(err,data){   
                if(err) return res.status(400).json({err});        
                res.status(201).json({status:true, jobid:idcount})
            }) 
        }        
    },

    copyJob: async (req, res) => {

        const hasrecord = await jobsModel.findOne().sort({_id:-1});
        var idcount=0;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }    
         
        jobsModel.find({_id:req.body.jobid}).exec(function (err, doc) {
            doc.forEach(node => insertBatch(node,idcount));
        });
        
        function insertBatch(doc,docid) { 
            doc._id =  docid;        
            jobsModel.findOneAndUpdate({_id: docid}, doc, {upsert: true,new: true}, function(err, doc1) {
                if(err) return res.status(400).json({err});
                console.log(doc1); 
                res.status(201).json({status:true, job:doc1, message:"copied successfully"})
            });
        }
    },

    updateJob: async (req, res) => {       
        if((typeof req.body.jobtitle != "undefined") && (typeof req.body.language != "undefined") && (typeof req.body.companyname != "undefined") && (typeof req.body.employerid != "undefined") && (typeof req.body.locallangreq != "undefined") && (typeof req.body.langtraining != "undefined") && (typeof req.body.jobcategory != "undefined") && (typeof req.body.alterjobcategory != "undefined") && (typeof req.body.address != "undefined") && (typeof req.body.adlocation != "undefined")) {
            try {
                const data = await jobsModel.updateOne(
                {'_id':req.body.jobid},
                {$set:{'country':req.body.country,'language':req.body.language,'companyname':req.body.companyname,'employerid':req.body.employerid,'jobtitle':req.body.jobtitle,'locallangreq':req.body.locallangreq,'langtraining':req.body.langtraining,'jobcategory':req.body.jobcategory,'alterjobcategory':req.body.alterjobcategory,'address':req.body.address,'adlocation':req.body.adlocation}},{multi:true}
                )                
                res.status(201).json({status:true, jobid:req.body.jobid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        } else if((typeof req.body.jobtype != "undefined") || (typeof req.body.jobschedule != "undefined") || (typeof req.body.contractlength != "undefined") || (typeof req.body.contractperiod != "undefined") || (typeof req.body.startdate != "undefined") || (typeof req.body.hirenumofpeople != "undefined") || (typeof req.body.hiringspeed != "undefined")) {  
            try {         
                const data = await jobsModel.updateOne(
                    {'_id':req.body.jobid},
                    {$set:{'jobtype':req.body.jobtype,'jobschedule':req.body.jobschedule,'contractlength':req.body.contractlength,'contractperiod':req.body.contractperiod,'startdate':req.body.startdate,'hirenumofpeople':req.body.hirenumofpeople,'hiringspeed':req.body.hiringspeed}},{multi:true}
                )
                res.status(201).json({status:true, jobid:req.body.jobid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        } else if((typeof req.body.payrate != "undefined") || (typeof req.body.supplementalpay != "undefined") || (typeof req.body.benefitsoffered != "undefined")) {  
            try {         
                const data = await jobsModel.updateOne(
                    {'_id':req.body.jobid},
                    {$set:{'payrate':req.body.payrate,'supplementalpay':req.body.supplementalpay,'benefitsoffered':req.body.benefitsoffered}},{multi:true}
                )
                res.status(201).json({status:true, jobid:req.body.jobid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        } else if((typeof req.body.jobdescription != "undefined") || (typeof req.body.covidprecautions != "undefined") || (typeof req.body.jobreferenceid != "undefined")) {  
            try {         
                const data = await jobsModel.updateOne(
                    {'_id':req.body.jobid},
                    {$set:{'jobdescription':req.body.jobdescription,'jobdescdocs':{},'covidprecautions':req.body.covidprecautions,'jobreferenceid':req.body.jobreferenceid}},{multi:true}
                )
                res.status(201).json({status:true, jobid:req.body.jobid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        } else if((typeof req.body.issubmitcv != "undefined") || (typeof req.body.isapplndeadline != "undefined") || (typeof req.body.jobconversation != "undefined")) {  
            try {         
                const data = await jobsModel.updateOne(
                    {'_id':req.body.jobid},
                    {$set:{'issubmitcv':req.body.issubmitcv,'isapplndeadline':req.body.isapplndeadline,'deadlinedate':req.body.deadlinedate,'jobconversation':req.body.jobconversation}},{multi:true}
                )
                res.status(201).json({status:true, jobid:req.body.jobid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        } else {
            return res.status(422).json({message : "Invalid input values...!"})
        }        
    },

    deleteJob: async (req, res) => {
        const result = await jobsModel.findOne({_id:req.body.jobid});
        if(!result) { return res.status(422).json({message : "Invalid Job...!"}) }
        const data = await jobsModel.updateOne(
            {'_id':req.body.jobid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Job Deleted Successfully...!"})
    },

    updateJobstatus: async (req, res) => {
        const result = await jobsModel.findOne({_id:req.body.jobid});
        if(!result) { return res.status(422).json({message : "Invalid Job...!"}) }
        const data = await jobsModel.updateOne(
            {'_id':req.body.jobid},
            {$set:{'jobstatus':req.body.jobstatus}},{multi:true}
        )
        res.status(201).json({status:true, message : "Job Status Updated Successfully...!"})
    },

    getalljobLocation: async (req, res) => {
        jobsModel.find().distinct('adlocation', function(err, result) {
            if(err) return res.status(400).json({err}); 
            res.status(201).json({status:true, joblocations:result}) 
        });       
    },

    getallJobs: async (req, res) => {
        const result = await jobsModel.find({isdeleted:false,jobstatus:'active',feeddomain:{$exists:false} }); //employerid:req.body.userid,
        if(!result) { return res.status(422).json({message : "Joblist is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    getallProposals: async (req, res) => {
        const result = await jobapplyModel.find({jobid: req.body.jobid});
        if (!result) return res.status(400).json({err});
        res.status(201).json({status: true, job:result})
    },

    getallfeedJobs: async (req, res) => {
        const result = await jobsModel.find({isdeleted:false,jobstatus:'active',feeddomain:{$exists:true}}); //employerid:req.body.userid,
        if(!result) { return res.status(422).json({message : "Joblist is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    getallJobtitle: async (req, res) => {
        const listjobtitle = await jobsModel.aggregate([           
            {
                $group: { 
                    "_id":"$jobtitle",
                    "count":{ 
                        "$sum":1
                    },
                    "jobtitle":{"$first":"$jobtitle"},
                    "id":{"$last":"$_id"},
                }
            }           
        ]);
        if(!listjobtitle) { return res.status(422).json({message : "JobList is not Available...!"}) }
        res.status(201).json({status:true, jobtitle:listjobtitle})
    },
    getallJobcompany: async (req, res) => {
        const listcompany = await jobsModel.aggregate([      
            {
                $group: { 
                    "_id":"$companyname",
                    "count":{ 
                        "$sum":1
                    },
                    "companyname":{"$first":"$companyname"},
                    "id":{"$last":"$_id"},
                }
            }           
        ]);
        if(!listcompany) { return res.status(422).json({message : "Company list is not Available...!"}) }
        res.status(201).json({status:true, company:listcompany})
    },

    getJob: async (req, res) => {
        const result = await jobsModel.findOne({_id:req.body.jobid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Job is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    getpublicJobs: async (req, res) => {
        console.log();
        const result = await jobsModel.findOne({_id:req.body.jobid,jobstatus:'active',isdeleted:false});
        console.log(JSON.stringify(result)+" get public jobs")
        if(!result) { return res.status(422).json({message : "Job is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },
    
    recentsearchJobs: async (req, res) => {
        const result = await jobsearchuserModel.find({userid:req.body.userid,jobsearchkeyword:{$exists:true},isdeleted:false}).sort({searchdate:-1}).limit( req.body.rlimit );
        if(!result) { return res.status(422).json({message : "Recent search data is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    recentsearches: async (req, res) => {
        const result = await jobsearchuserModel.find({userid:req.body.userid,jobsearchkeyword:{$exists:true},isdeleted:false}).sort({searchdate:-1}).limit( req.body.rlimit );
        if(!result) { return res.status(422).json({message : "Recent search data is not Available...!"}) }
        res.status(201).json({status:true, resudata:result})
    },

    recentsearchespublic: async (req, res) => {
        const result = await jobsearchuserModel.find({jobsearchkeyword:{$exists:true},isdeleted:false}).sort({searchdate:-1}).limit( req.body.rlimit );
        if(!result) { return res.status(422).json({message : "Recent search data is not Available...!"}) }
        res.status(201).json({status:true, resupubdata:result})
    },

    deleterecentsearchJobs: async (req, res) => {
        const result = await jobsearchuserModel.findOne({_id:req.body.recid});
        if(!result) { return res.status(422).json({message : "Invalid search delete...!"}) }
        const data = await jobsearchuserModel.updateOne(
            {'_id':req.body.recid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Recent Search Deleted Successfully...!"})
    },

    gblsearchJobs: async (req, res) => {
        const result = await jobsearchglobalModel.find().sort({viewcount:-1}).limit( req.body.glimit );
        if(!result) { return res.status(422).json({message : "global search data is not Available...!"}) }
        res.status(201).json({status:true, job:result})
    },

    searchjobsTemplate: async (req, res) => { 

        var filterobj = {}        
        var keyword =  { $regex : new RegExp(req.body.keyword, "i") } 
        var jobstatus = [];
        if(typeof req.body.jobstatus !== 'undefined') { jobstatus = req.body.jobstatus.split(','); }
        var sortfld = "";  var orderfld = "";
        var currdate = new Date();  

        if(jobstatus.length > 0) {
            filterobj = {$and:[{$or:[ {'jobtitle':keyword}, {'companyname':keyword}, {'adlocation':keyword} ]}, {'employerid':req.body.userid}, {'isdeleted':false},{'jobstatus':{$in:jobstatus}}]} 
        } else {
            filterobj = {$and:[{$or:[ {'jobtitle':keyword}, {'companyname':keyword}, {'adlocation':keyword} ]}, {'employerid':req.body.userid}, {'isdeleted':false}]}
        }        
        var sortarr = [];
        if(typeof req.body.sort !== 'undefined' && req.body.sort != '') { 
           sortfld = req.body.sort;  
           orderfld = (req.body.order == 'desc') ? -1:1; 
           sortarr[sortfld] = orderfld;
        } else { 
            sortarr['createddate'] =  -1 ;
        }
        var sortobj = { ...sortarr }

        jobsModel.find( filterobj, function(err,data){
            if(err) return res.status(400).json({err});
            if(data.length > 0){
                res.status(201).json({status:true, search:data})
            } else {
                res.status(422).json({status:false, search:"No jobs Available"})
            }                     
        }).sort( sortobj );
    },

    /*searchallJobs: async (req, res) => {       
           
        var currdate = new Date();   
        var vcount = 0;

        if(typeof req.body.userid !== "undefined" && req.body.userid != "") {
            const hasrecordrecent = await jobsearchuserModel.findOne().sort({_id:-1});
            var idcountrecent=1;
            if(hasrecordrecent) {
                idcountrecent = parseInt(hasrecordrecent._id) + 1;
            } 
            const vcount1 = await jobsearchuserModel.findOne({jobsearchkeyword:req.body.keyword});
            if(!vcount1) {                       
                vcount = 1 
                jobsearchuserModel.create({_id:idcountrecent,jobsearchkeyword:req.body.keyword,userid:req.body.userid,viewcount:vcount,searchdate:currdate}, function(err,data){   
                    if(err) return res.status(400).json({err});        
                    //res.status(201).json({status:true, job:data})
                }) 
            } else {           
                vcount = vcount1.viewcount + 1
                const data = await jobsearchuserModel.updateOne({'jobsearchkeyword':req.body.keyword},{$set:{'viewcount':vcount,'searchdate':currdate}},{multi:true})
            } 
        }
        
        const hasrecordglobal = await jobsearchglobalModel.findOne().sort({_id:-1});
        var idcountglobal=1;
        if(hasrecordglobal) {
            idcountglobal = parseInt(hasrecordglobal._id) + 1;
        } 

        var vcountgbl = 0;
        const vcountgbl1 = await jobsearchglobalModel.findOne({jobsearchkeyword:req.body.keyword});
        if(!vcountgbl1) {                       
            vcountgbl = 1 
            jobsearchglobalModel.create({_id:idcountglobal,jobsearchkeyword:req.body.keyword,viewcount:vcountgbl,searchdate:currdate}, function(err,data){   
                if(err) return res.status(400).json({err});        
                //res.status(201).json({status:true, job:data})
            }) 
        } else {           
            vcountgbl = vcountgbl1.viewcount + 1
            const data = await jobsearchglobalModel.updateOne({'jobsearchkeyword':req.body.keyword},{$set:{'viewcount':vcountgbl,'searchdate':currdate}},{multi:true})
        } 

        var filterobj = {}
        
        var keyword =  { $regex : new RegExp(req.body.keyword, "i") }
        var location =  { $regex : new RegExp(req.body.location, "i") }
        //var keyword =  { $regex: '/.*' + req.body.keyword + '.* /', $options: 'i' }
        //var location =  { $regex: '/.*' + req.body.location + '.* /', $options: 'i'}
        console.log(keyword+'/'+location);
        
        if(req.body.keyword != "" && req.body.location == "") {
            filterobj = {$and:[{'jobstatus':'active'},{$or:[{'jobtitle': keyword},{'companyname': keyword}]}]}
        } else if(req.body.keyword == "" && req.body.location != "") {
            filterobj = {$and:[{'jobstatus':'active'},{'adlocation':location}]}
        } else {
            filterobj = {$and:[{'jobstatus':'active'},{$or:[ {'jobtitle':keyword}, {'companyname':keyword} ]}, {'adlocation':location}]}
        } 
         
        console.log(filterobj);    
        jobsModel.find( filterobj, function(err,data){
            if(err) return res.status(400).json({err});
            if(data.length > 0){
                res.status(201).json({status:true, search:data})
            } else {
                res.status(422).json({status:false, search:"No jobs Available"})
            }            
        }).sort({_id:-1});
    }, */

    searchallJobs: async (req, res) => {       
           
        var currdate = new Date();   
        var vcount = 0;
        console.log(req.body.userid+' userid '+req.body.filtertitledata)
        if(typeof req.body.userid !== "undefined" && req.body.userid != "") {
            const hasrecordrecent = await jobsearchuserModel.findOne().sort({_id:-1});
            var idcountrecent=1;
            if(hasrecordrecent) {
                idcountrecent = parseInt(hasrecordrecent._id) + 1;
            } 
            const vcount1 = await jobsearchuserModel.findOne({jobsearchkeyword:req.body.keyword});
            if(!vcount1) {                       
                vcount = 1 
                jobsearchuserModel.create({_id:idcountrecent,jobsearchkeyword:req.body.keyword,userid:req.body.userid,viewcount:vcount,searchdate:currdate}, function(err,data){   
                    if(err) return res.status(400).json({err});        
                    //res.status(201).json({status:true, job:data})
                }) 
            } else {           
                vcount = vcount1.viewcount + 1
                const data = await jobsearchuserModel.updateOne({'jobsearchkeyword':req.body.keyword},{$set:{'viewcount':vcount,'searchdate':currdate}},{multi:true})
            } 
        }
        
        const hasrecordglobal = await jobsearchglobalModel.findOne().sort({_id:-1});
        var idcountglobal=1;
        if(hasrecordglobal) {
            idcountglobal = parseInt(hasrecordglobal._id) + 1;
        }        
        console.log(idcountglobal);

        var vcountgbl = 0;
        const vcountgbl1 = await jobsearchglobalModel.findOne({jobsearchkeyword:req.body.keyword});
        if(!vcountgbl1) {                       
            vcountgbl = 1 
            jobsearchglobalModel.create({_id:idcountglobal,jobsearchkeyword:req.body.keyword,viewcount:vcountgbl,searchdate:currdate}, function(err,data){   
                if(err) return res.status(400).json({err});        
                //res.status(201).json({status:true, job:data})
            }) 
        } else {           
            vcountgbl = vcountgbl1.viewcount + 1
            const data = await jobsearchglobalModel.updateOne({'jobsearchkeyword':req.body.keyword},{$set:{'viewcount':vcountgbl,'searchdate':currdate}},{multi:true})
        } 

        var filterobj = {}        
        var filterobj1 = '';
        var filterobj2 = '';
        var filterobj3 = '';
        var mainfilterarr = [];
        var sidfilterarr = [];
        var sidfilterarr1 = [];
        var finaluniqueid1 = [];
        var unique1 = '';
        var unique3 = "";

        
        console.log(req.body.keyword+'/'+req.body.location);
        
        var keyword =  { $regex : new RegExp(req.body.keyword, "i") }
        var location =  { $regex : new RegExp(req.body.location, "i") }
        //var keyword =  { $regex: '/.*' + req.body.keyword + '.*/', $options: 'i' }
        //var location =  { $regex: '/.*' + req.body.location + '.*/', $options: 'i'}
        
        if(req.body.keyword != "" && req.body.location == "") {
            filterobj = {$and:[{'jobstatus':'active'},{$or:[{'jobtitle': keyword},{'companyname': keyword}]}]}
        } else if(req.body.keyword == "" && req.body.location != "") {
            filterobj = {$and:[{'jobstatus':'active'},{'adlocation':location}]}
        } else if(req.body.keyword == "" && req.body.location == "") {
            filterobj = {$and:[{'jobstatus':'active'}]}
        } else {
            filterobj = {$and:[{'jobstatus':'active'},{$or:[ {'jobtitle':keyword}, {'companyname':keyword} ]}, {'adlocation':location}]}
        } 

        if(filterobj != '' ) {
            filterobj3 = await jobsModel.find(filterobj); 
            if(filterobj3.length > 0) {
                for(var i=0; i<filterobj3.length; i++){
                    mainfilterarr.push(filterobj3[i]._id);               
                }
            }
        }

        const unique2 = [ ...new Set(mainfilterarr)] 
        console.log(JSON.stringify(unique2)+' / '+' unique 2 '+req.body.filtertitledata+' test filterdatatitle');

        if((typeof req.body.filtertitledata != "undefined") && req.body.filtertitledata.length > 0 ) {
            var filtitdata = req.body.filtertitledata;
            console.log(JSON.stringify(filtitdata)+' reqilterbody lentht '+filtitdata.length);
        if(filtitdata.length > 0){
            //for(let fd = 0; fd < filtitdata.length; fd++){
                for(var i=0; i<filtitdata.length; i++){  
                    console.log(filtitdata[i]['filtertitle'])
                    if(filtitdata[i]['filtertitle'] == 'Jobtitles' ) {
                        //var fiterarr = filtitdata[i]['filterdata']; 
                        //sidfilterarr.push(fiterarr);  
                        filterobj1 = await jobsModel.find({jobtitle: {$in: [filtitdata[i].filterdata]}}); 
                        console.log(filterobj1+' filtertitle');        
                        if(filterobj1.length > 0) {
                            for(var i=0; i<filterobj1.length; i++){
                                sidfilterarr.push(filterobj1[i]._id);               
                            }
                        }
                    }
                                            
                } 
                for(var i=0; i<filtitdata.length; i++){  
                   
                    console.log(filtitdata[i]['filtertitle']+' second now')
                    if(filtitdata[i]['filtertitle'] == 'Company' ) {
                        //var fiterarr = filtitdata[i]['filterdata']; 
                        //sidfilterarr.push(fiterarr);  
                        filterobj2 = await jobsModel.find({companyname: {$in: [filtitdata[i].filterdata]}}); 
                        console.log(filterobj2+' filtertitle');        
                        if(filterobj2.length > 0) {
                            for(var i=0; i<filterobj2.length; i++){
                                sidfilterarr.push(filterobj2[i]._id);               
                            }
                        } 
                    }                            
                } 
            //}
            

            for(var i=0; i<filtitdata.length; i++){
                if(filtitdata[i]['filtertitle'] == 'Salary' ) {
                    var fiterarr = filtitdata[i]['filterdata'].split(' - ');
                    if(unique3.length > 0) {
                        var allsal = await jobsModel.find({isdeleted:false,_id:{$in : unique3},jobstatus:'active', 
                        payrate:{
                            $elemMatch:{
                                $or:[{
                                    minimum : {$lte:fiterarr[1], $gte:fiterarr[0]} 
                               },{
                                    amount : {$lte:fiterarr[1], $gte:fiterarr[0]}
                                }]
                            }
                        }});
                       
                    } else {
                        var allsal = await jobsModel.find({isdeleted:false,jobstatus:'active', 
                        payrate:{
                            $elemMatch:{
                                $or:[{
                                    minimum : {$lte:fiterarr[1], $gte:fiterarr[0]} 
                               },{
                                    amount : {$lte:fiterarr[1], $gte:fiterarr[0]}
                                }]
                            }
                        }});
                    }                   
                    
                    for(var al=0; al<allsal.length; al++) {                   
                        sidfilterarr.push(allsal[al]._id);
                    }  
                }

            }
            //console.log(sidfilterarr1.length);
            /*if(sidfilterarr1.length > 0) {
                unique1 = [ ...new Set(sidfilterarr1)] 
            } else {*/
                unique1 = [ ...new Set(sidfilterarr)] 
            //}
            //const unique3 = [ ...new Set(sidfilterarr)] 
           // console.log(JSON.stringify(unique3)+' / '+' unique 3');
        }  
    }   
        console.log(JSON.stringify(unique1)+' / '+' unique 1'+req.body.keyword);

        if(unique1.length > 0 && unique2.length > 0) {
            const combined = [...unique1, ...unique2]
            //const combined = unique1.filter(value => unique2.includes(value))
            finaluniqueid1 = [ ...new Set(combined)]
            console.log(JSON.stringify(finaluniqueid1)+' / '+' finaluniqueid1 1');
        } else if(unique1.length > 0 && unique2.length <= 0) {
            finaluniqueid1 = unique1
        } else if(unique1.length <= 0 && unique2.length > 0 && (req.body.keyword != "" || req.body.location != "" )) {
            finaluniqueid1 = unique2
        } 
        
        console.log(JSON.stringify(finaluniqueid1)+' / '+' final');

        var filterobj4 = { _id: { $in: finaluniqueid1 } }; //{ '$in': ["$_id", finaluniqueid1] }
        console.log(JSON.stringify(filterobj4)+' filterobj4');
    

        if(finaluniqueid1.length > 0)  {
            const alljobs = jobsModel.find( filterobj4, function(err,data){
                if(err) return res.status(400).json({err});
                console.log(data+' - '+data.length);
                if(data.length > 0 ){
                    res.status(201).json({status:true, search:data})
                } else {
                    res.status(200).json({status:false, search:"No jobs Available"})
                }            
            }).sort({_id:-1});
        } else if(req.body.keyword == "" && req.body.location == "") {
            const alljobs = jobsModel.find( filterobj, function(err,data){
                if(err) return res.status(400).json({err});
                console.log(data+' - '+data.length);
                if(data.length > 0 ){
                    res.status(201).json({status:true, search:data})
                } else {
                    res.status(200).json({status:false, search:"No jobs Available"})
                }            
            }).sort({_id:-1});
        } else {
            console.log("No jobs Available");
            res.status(200).json({status:false, search:"No jobs Available"})
        }
    }, 

    searchallfeedJobs: async (req, res) => {       
           
        var currdate = new Date();   
        var vcount = 0;

        if(typeof req.body.userid !== "undefined" && req.body.userid != "") {
            const hasrecordrecent = await jobsearchuserModel.findOne().sort({_id:-1});
            var idcountrecent=1;
            if(hasrecordrecent) {
                idcountrecent = parseInt(hasrecordrecent._id) + 1;
            } 
            const vcount1 = await jobsearchuserModel.findOne({jobsearchkeyword:req.body.keyword});
            if(!vcount1) {                       
                vcount = 1 
                jobsearchuserModel.create({_id:idcountrecent,jobsearchkeyword:req.body.keyword,userid:req.body.userid,viewcount:vcount,searchdate:currdate}, function(err,data){   
                    if(err) return res.status(400).json({err});        
                    //res.status(201).json({status:true, job:data})
                }) 
            } else {           
                vcount = vcount1.viewcount + 1
                const data = await jobsearchuserModel.updateOne({'jobsearchkeyword':req.body.keyword},{$set:{'viewcount':vcount,'searchdate':currdate}},{multi:true})
            } 
        }
        
        const hasrecordglobal = await jobsearchglobalModel.findOne().sort({_id:-1});
        var idcountglobal=1;
        if(hasrecordglobal) {
            idcountglobal = parseInt(hasrecordglobal._id) + 1;
        } 
        var vcountgbl = 0;
        const vcountgbl1 = await jobsearchglobalModel.findOne({jobsearchkeyword:req.body.keyword});
        if(!vcountgbl1) {                       
            vcountgbl = 1 
            jobsearchglobalModel.create({_id:idcountglobal,jobsearchkeyword:req.body.keyword,viewcount:vcountgbl,searchdate:currdate}, function(err,data){   
                if(err) return res.status(400).json({err});        
                //res.status(201).json({status:true, job:data})
            }) 
        } else {           
            vcountgbl = vcountgbl1.viewcount + 1
            const data = await jobsearchglobalModel.updateOne({'jobsearchkeyword':req.body.keyword},{$set:{'viewcount':vcountgbl,'searchdate':currdate}},{multi:true})
        } 

        var filterobj = {}
        
        var keyword =  { $regex : new RegExp(req.body.keyword, "i") }
        var location =  { $regex : new RegExp(req.body.location, "i") }
        //var keyword =  { $regex: '/.*' + req.body.keyword + '.*/', $options: 'i' }
        //var location =  { $regex: '/.*' + req.body.location + '.*/', $options: 'i'}
        console.log(keyword+'/'+location);
        
        if(req.body.keyword != "" && req.body.location == "") {
            filterobj = {$and:[{'jobstatus':'active'},{$or:[{'jobtitle': keyword},{'companyname': keyword}]},{'feeddomain':{$exists:true}}]}
        } else if(req.body.keyword == "" && req.body.location != "") {
            filterobj = {$and:[{'jobstatus':'active'},{'adlocation':location},{'feeddomain':{$exists:true}}]}
        } else {
            filterobj = {$and:[{'jobstatus':'active'},{$or:[ {'jobtitle':keyword}, {'companyname':keyword} ]}, {'adlocation':location}, {'feeddomain':{$exists:true}}]}
        } 
         
        //console.log(filterobj);    
        jobsModel.find( filterobj, function(err,data){
            if(err) return res.status(400).json({err});
            if(data.length > 0){
                res.status(201).json({status:true, search:data})
            } else {
                res.status(422).json({status:false, search:"No jobs Available"})
            }            
        }).sort({_id:-1});
    },

    jobpurchaseLimit: async (req, res) => {
        const hasrecord = await jobapplycreditModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        jobapplycreditModel.create({_id:idcount,userid:req.body.userid,credits:req.body.credits,purchasedtransid:req.body.purchasedtransid,purchaseddate:new Date()}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, purchaseid:idcount})
        }) 
    },

    getallPurchaseLimit: async (req, res) => {
        const result = await jobapplycreditModel.find({userid:req.body.userid}); //employerid:req.body.userid,
        if(!result) { return res.status(422).json({message : "Purchase Order is not Available...!"}) }
        res.status(201).json({status:true, purchaselimit:result})
    },

   /* uploadResume: async (req, res) => {          
        try {
            const hasrecord = await createresumeModel.findOne().sort({_id:-1});
            var idcount=1;
            if(hasrecord) {
                idcount = parseInt(hasrecord._id) + 1;
            } 
            createresumeModel.create({_id:idcount, uploadedresume:req.file.originalname}, function(err,data){   
                if(err) return res.status(400).json({err});        
                res.status(201).json({status:true, user:data, message: 'File uploded successfully'})
            })
           // return res.status(201).json({ message: 'File uploded successfully'});
        } catch (error) {
            console.error(error);
        }                 
    },

    getfiles: async (req, res) => {
    },*/


    jobApply: async (req, res) => {
        const hasrecord = await jobapplyModel.findOne().sort({_id:-1});
        var idcount=1;
        var idcount1=1;
        var resume = "";
        var creditflag = 0;
        var resumedocs = "";
        var resumeid = 0;         
        var supportdtlst = [];

        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }  
        const hasrecord1 = await jobconversationModel.findOne().sort({_id:-1});
        if(hasrecord1) {
            idcount1 = parseInt(hasrecord1._id) + 1;
        } 
        if((typeof req.body.resumedocs != "undefined") && req.body.resumedocs != "") {
            var uplddata = req.body.resumedocs;  
            var tempfilename = uplddata.file_name;
            var tempfiledata = uplddata.file_data;
            if (!fs.existsSync('./public/uploads/resume/user_' + req.body.userid)) {
                fs.mkdirSync('./public/uploads/resume/user_' + req.body.userid);
            }
            const timestamp = Date.now();
            // tempfilename = timestamp+'_'+uplddata.file_name;
            tempfilename = timestamp + '.' + uplddata.file_name.split('.').pop();
            let imageBuffer = Buffer.from(uplddata.file_data.split('base64,')[1], 'base64');

            fs.writeFileSync('./public/uploads/resume/user_' + req.body.userid + '/' + tempfilename, imageBuffer);

            // resumedocs = {name:tempfilename, data:tempfiledata};
            resumedocs = { name: tempfilename };
        }

        if((typeof req.body.supportdatalist != "undefined") && req.body.supportdatalist != "") { 
            var upldsuppdata= req.body.supportdatalist; 
            var vcnt=1;
            for (let data of upldsuppdata) {

                var tempfilename1 = data.file_name;                
                var tempfiledata1 = data.file_data;
                if (!fs.existsSync('./public/uploads/resume/user_'+req.body.userid)) {
                    fs.mkdirSync('./public/uploads/resume/user_' + req.body.userid);
                }
                const timestamp = Date.now();
                // tempfilename1 = timestamp+'_'+data.file_name;
                tempfilename1 = timestamp + '.' + data.file_name.split('.').pop();
                let imageBuffer = Buffer.from(data.file_data.split('base64,')[1], 'base64');

                fs.writeFileSync('./public/uploads/resume/user_' + req.body.userid + '/' + tempfilename1, imageBuffer);

                // supportdtlst.push({name:tempfilename1, data:tempfiledata1});
                supportdtlst.push({ name: tempfilename1, originName: data.file_name });
                //if(supportdtlst != "") var vinc = ","; else  var vinc = "";
               //supportdtlst += vinc+tempfilename1;

            }
        }

        const empid = await jobsModel.findOne({_id:req.body.jobid,isdeleted:false});
        
        const creditzeroflag = await jobapplyModel.find({creditflag:0,userid:empid.employerid,jobid:req.body.jobid}).count();
        const creditoneflag = await jobapplyModel.find({creditflag:1,userid:empid.employerid,jobid:req.body.jobid}).count();
        const creditlimits = await jobapplycreditModel.aggregate([ { $match: { userid:empid.employerid } }, { $group: { _id: { ID: "$_id" }, TotalSum: { $sum: "$credits" } } } ]);

        if(creditzeroflag > 0) {
            creditflag = 0;
        } else if(creditzeroflag <= 0 && creditoneflag < creditlimits.TotalSum) {            
            creditflag = 1;
        }
        const empemail = await userlst.userSchema.findOne({_id:empid.employerid});
        if(!empemail) { return res.status(422).json({message : "user is not Available...!"}) }   

        const convmsg = await jobconversationModel.find({employerid:empid.employerid, userid:req.body.userid});
        if(convmsg.length <= 0) { var msgcnt = "no"; } else {  var msgcnt = "yes";  }
        var applyid = 0; var convid = 0

        jobapplyModel.create({_id:idcount,userid:req.body.userid,jobid:req.body.jobid,firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,phonenumber:req.body.phonenumber,supportdocs:supportdtlst,resumedocs:resumedocs,resumeid:req.body.resumeid,creditflag:creditflag,applieddate:new Date()}, function(err,data){  
            // console.log(JSON.stringify(data)); 
             if(err) return res.status(400).json({err}); 
             applyid = idcount;
             console.log(JSON.stringify(applyid)); 
             try {
                 const body = mailTemplate({
                    title: 'Job Applied by '+req.body.firstname+' '+req.body.lastname+'('+req.body.email+') from Dayratework',
                    // content: "Hi "+empemail.firstname+" "+empemail.lastname+", <br /><br />The Contractor applied Following Job in your company from https://www.dayratework.com . <br><br> <b>JOBTITLE:</b>"+ empid.jobtitle+"."
                    content: `
                        Dear Employer.<br /><br />
                        A contractor applied for <b>${empid.jobtitle}</b> role you posted on Dayratework.<br><br>
                        Link to contractor profile : <a href="${req.body.profileUrl}/${req.body.resumeid}">Profile Link</a> <br />
                        ${(resumedocs != "" && resumedocs) ? `Link to CV: <a href='${process.env.BASE_URL}/uploads/resume/user_${req.body.userid}/${resumedocs.name}' target='_blank'>Click here</a><br />` : ''}
                        ${(supportdtlst.length) 
                            ? `
                                Supported Files: 
                                ${supportdtlst.map((doc, index) => {return `${index?' ':''}<a href='${process.env.BASE_URL}/uploads/resume/user_${req.body.userid}/${doc.name}' target='_blank'>${doc.originName}</a>`})}<br />` : ''}
                        Kind regards<br />
                        Dayratework Team.`
                 })
                 const obj = {
                 to: empemail.email,  /* devcastouri@gmail.com*/
                 from: 'noreply@dayratework.com',
                 fromname: 'Dayratework',
                 subject: 'Job Applied by '+req.body.firstname+' '+req.body.lastname+'('+req.body.email+') from Dayratework',
                 text: body,
                 html: `<strong>${body}</strong>`,
                 };
                 sendGridMail.send(obj);
                 //res.status(201).json({status:true, message : "Job Applied Notification email sent successfully"});
             } catch (error) {
                 /*if (error.response) {
                     return res.status(422).json({message : "Unable to send email."})
                 }*/
             }
             
             if(msgcnt == 'no') {
                 jobconversationModel.create({_id:idcount1,userid:req.body.userid,employerid:empid.employerid,jobid:req.body.jobid,createddate:new Date(),subject:"Message Initialized",message:"",messageby:req.body.userid}, function(err,data1){
                     convid = idcount1;                 
                     res.status(201).json({status:true, applyid:applyid})              
                 })
             } else {
                 res.status(201).json({status:true, applyid:applyid})
             }
             
         })
        
    },

    createConversation: async (req, res) => {
        const hasrecord = await jobconversationModel.findOne().sort({_id:-1});
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        jobconversationModel.create({_id:idcount,userid:req.body.userid,employerid:req.body.empid,jobid:req.body.jobid,createddate:new Date(),subject:req.body.subject,message:req.body.message,messageby:req.body.messageby}, function(err,data){
            convid = idcount;                 
            res.status(201).json({status:true, convid:idcount})              
        })
    },
    
    getallConversation: async (req, res) => {
        const result = await jobconversationModel.find({employerid:req.body.empid,userid:req.body.userid,isdeleted:false}).sort({createddate:-1, jobid:-1});
        if(!result) { return res.status(422).json({message : "Conversation Message is not available"}) }
        res.status(201).json({status:true, convmsg:result})
    },

    getconusersbyEmp: async (req, res) => {  

        var result1 = await userlst.userSchema.find({$and:[{accounttype:'contractor'},{displayname:{$regex:new RegExp(req.body.keyword,'i')}}]}).distinct('_id'); 
        if(!result1) { return res.status(422).json({message : "Userlist is not available"}) }
        const result = await jobconversationModel.aggregate([                
                { "$match": {$and:[{employerid:req.body.emp },{userid:{$in:result1}}]}},
                { $sort: { _id: 1, userid: 1, createddate: -1 }} ,
                { $group : {"_id":{userid:"$userid"}, userid:{"$first":"$userid"}, createddate:{"$last":"$createddate"}}},
                { "$lookup": {
                    "from": "users",
                    localField: "userid",
                    foreignField: "_id",              
                    "as": "uniqueusers"
                }}               
            ]
        )
        res.status(201).json({status:true, usrlst:result})
        
    },

    getempusersbyCon: async (req, res) => { 
        var result1 = await userlst.userSchema.find({$and:[{accounttype:'employer'},{displayname:{$regex:new RegExp(req.body.keyword,'i')}}]}).distinct('_id'); 
        console.log(result1);
        if(!result1) { return res.status(422).json({message : "Userlist is not available"}) }
        const result = await jobconversationModel.aggregate(
            [                
                { "$match": {$and:[{userid:req.body.userid },{employerid:{$in:result1}}]}},
                { $sort: { _id: 1, employerid: 1, createddate: -1 }} ,
                { $group : {"_id":{employerid:"$employerid"}, employerid:{"$first":"$employerid"}, createddate:{"$last":"$createddate"}}},
                { "$lookup": {
                    "from": "users",
                    localField: "employerid",
                    foreignField: "_id",              
                    "as": "uniqueusers"
                }}               
            ]
        )
        if(result.length <= 0) { return res.status(422).json({message : "Employers list is not Available...!"}) }
        res.status(201).json({status:true, usrlst:result});
    },

    getalljobszeroCreditflag: async (req, res) => {
        const creditzeroflag = await jobapplyModel.aggregate([  
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobid',
                    foreignField: '_id',
                    as: 'Jobs'
                }
            },
            {
                $addFields: {
                "Job Title": "$Jobs.jobtitle",
                }
            },
            {
                $group: { 
                    "_id":"$jobid",
                    "count":{ 
                        "$sum":1
                    },
                    "jobtitle":{"$first":"$Jobs.jobtitle"},
                }
            }           
        ]);
        if(!creditzeroflag) { return res.status(422).json({message : "Job Application is not Available...!"}) }
        res.status(201).json({status:true, jobapply:creditzeroflag})
    },

    updatecreditFlag: async (req, res) => {       
        try { 
            const jobapplyflagdata = req.body.data;
            for(var i=0;i<jobapplyflagdata.length;i++){
                const data = await jobapplyModel.updateOne(
                    {'_id':jobapplyflagdata[i].id},
                    {$set:{'creditflag':1}},{multi:true}
                )
            }
            res.status(201).json({status:true, Message:'Updated Successfully'})  
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    generateMonthlybilling: async (req, res) => {  
        var today = new Date();
        var fdate = new Date(req.body.year+'-'+req.body.month+'-01T00:00:00.000Z');
        var lastDate = new Date(fdate.getFullYear(), fdate.getMonth()+1, 0);
        var tdate = new Date(req.body.year+'-'+req.body.month+'-'+lastDate.getDate()+"T23:59:59.000Z");
        if(tdate < today){
            const monthlycredits = await jobapplyModel.aggregate([ 
                { "$match": {$and:[{"applieddate":{$gte:fdate}}, {"applieddate":{$lt:tdate}}]}},
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'jobid',
                        foreignField: '_id',
                        as: 'jobs'
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        localField: 'jobs.employerid',
                        foreignField: '_id',
                        as: 'users'
                    }
                }, {
                    $unwind: {
                    path: "$jobs",
                    preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: { 
                        "_id":"$jobs.employerid",
                        "count":{ 
                            "$sum":1
                        },
                        /*"employerid":{"$first":"$jobs.employerid"},*/
                    }
                }        
            ]);

            if(!monthlycredits) { return res.status(422).json({message : "Job Application is not Available...!"}) }
            const result = await globalsettings.globalsettingsSchema.find({_id:1});
            if(!result) { return res.status(422).json({message : "Invalid Global Price...!"}) }
            if(monthlycredits[i].priceperappln != "") {
                var amountcal = monthlycredits[i].priceperappln;
            } else {
                var amountcal =  result[0].globalpricesetting;
            }
            var idcount=1;
            for(var i=0;i<monthlycredits.length;i++){
                const result = await monthlybillingModel.findOne({userid:monthlycredits[i]._id, month:req.body.month, year:req.body.year});
                if(!result){
                    var amount = (monthlycredits[i].count * amountcal);
                    const hasrecord = await monthlybillingModel.findOne().sort({_id:-1});
                    if(hasrecord) {
                        idcount = parseInt(hasrecord._id) + 1;
                    }
                    monthlybillingModel.create({_id:idcount, userid:monthlycredits[i]._id, month:req.body.month, year:req.body.year, credits:monthlycredits[i].count, amount:amount, currencycode:'usd', billingdate:new Date(), subject:req.body.subject, message:req.body.message, messageby:req.body.messageby}, function(err,data){
                        convid = idcount; 
                    })
                }
            }
            res.status(201).json({status:true, billingdata:monthlycredits})
        } else {
            return res.status(422).json({message : "Monthly bill only create after last date of month...!"})
        }
        
    },

    getBillingHistory: async (req, res) => { 
        if(typeof req.body.userid !== "undefined"){
            var result = await monthlybillingModel.find({userid:req.body.userid}); 
            console.log(result);
            if(!result) { return res.status(422).json({message : "Billing History is not available"}) }        
            res.status(201).json({status:true, billhistory:result});
        } else {
            return res.status(422).json({message : "Invalid input values...!"})
        }
    },

    getCurMonbilling: async (req, res) => {  
        var today = new Date();
        var fdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01T00:00:00.000Z');
        var lastDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var tdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+lastDate.getDate()+"T23:59:59.000Z");
        //console.log(fdate);
        //console.log(tdate);

        const monthlycredits = await jobapplyModel.aggregate([ 
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobid',
                    foreignField: '_id',
                    as: 'jobs'
                }
            }, {
                $unwind: {
                path: "$jobs",
                preserveNullAndEmptyArrays: true
                }
            }, { 
                "$match": {$and:[{"applieddate":{$gte:fdate}}, {"applieddate":{$lt:tdate}}, {"jobs.employerid":req.body.userid}]}
            }, {
                $group: { 
                    "_id":"$jobid",
                    "status":"accept",
                    "count":{ 
                        "$sum":1
                    },
                    "employerid":{"$first":"$jobs.employerid"},
                }
            }        
        ]);
        if(!monthlycredits) { return res.status(422).json({message : "Monthly bill is not Available...!"}) }            
        res.status(201).json({status:true, jobcredits:monthlycredits})        
    },

    getTodaybilling: async (req, res) => {  
        var today = new Date();
        var fdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T00:00:00.000Z');
        var tdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"T23:59:59.000Z");

        const monthlycredits = await jobapplyModel.aggregate([ 
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobid',
                    foreignField: '_id',
                    as: 'jobs'
                }
            }, {
                $unwind: {
                path: "$jobs",
                preserveNullAndEmptyArrays: true
                }
            }, { 
                "$match": {$and:[{"applieddate":{$gte:fdate}}, {"applieddate":{$lt:tdate}}, {"jobs.employerid":req.body.userid}]}
            }, {
                $group: { 
                    "_id":"$jobid",
                    "count":{ 
                        "$sum":1
                    },
                    "employerid":{"$first":"$jobs.employerid"},
                }
            }        
        ]);
        if(!monthlycredits) { return res.status(422).json({message : "Monthly bill is not Available...!"}) }            
        res.status(201).json({status:true, jobcredits:monthlycredits})        
    },    

    getjobfeedData: async (req, res) => {     

        
        var feedsession = [];
        var payr = [];
        
        var currdate = new Date();
        
        var username = "toby@gocontract.com";
        var password = "8jqBM03$@6l0";
       // var url = "https://webautomation.io/api/sessions/data/245273/";
       
        var auth = "Basic " + new Buffer.from(username + ":" + password).toString("base64"); 

        var url = "https://webautomation.io/api/sessions/";
        const response = await axios.get(url, {
            auth: {
                username: username,
                password: password
            }
        }).then(function(response) {
            //res.status(201).json({status:true, jobdata:response.data})           
           feedsession = response.data;
        }).catch(function(error) {
            return res.status(422).json({message : "Error on Authentication!"})
        });
        console.log(feedsession);
     
        if(feedsession.length > 0) {
            //res.status(201).json({status:true, jobdata:feeddata})
            for(var fs = 0; fs < feedsession.length; fs++) {
                var feeddata = [];
                console.log(feedsession[fs].id);

                var url = "https://webautomation.io/api/sessions/data/"+feedsession[fs].id+"/";

                const response = await axios.get(url, {
                    auth: {
                        username: username,
                        password: password
                    }
                }).then(function(response) {
                    //res.status(201).json({status:true, jobdata:response.data})           
                    feeddata = response.data.results;
                }).catch(function(error) {
                   // return res.status(422).json({message : "Error on Authentication!"})
                });
                //var feeddata = response.data.results;
                console.log(feeddata.length);
                if(feeddata.length > 0) {
                    //res.status(201).json({status:true, jobdata:feeddata})
                    for(var fu = 0; fu < feeddata.length; fu++) {
                        console.log(feeddata[fu].url);
                        const hasrecord = await jobsModel.findOne().sort({_id:-1});
                        var idcount=1;
                        if(hasrecord) {
                            idcount = parseInt(hasrecord._id) + 1;
                        }
                        
                        var comname = feeddata[fu].company_name.split('/')[3];
                        var domain = feeddata[fu].url.split('/')[2];
                        
                        var pay1 = feeddata[fu].pay.replace(/[^a-zA-Z0-9 ]/g,'', "");
                        //pay1 = pay1.replace(/-/g, "");
                        var pay = pay1.replace("  ", " ");
                        if(pay != 'NaN') {
                            var sal = pay.split(" ");
                            if(!isNaN(sal[0])){
                                if(sal.length > 3) {
                                    payr = [{ "showpayby": "range" }, { "minimum": sal[0] }, { "maximum": sal[1] }, { "period": sal[3] }]
                                } else {
                                    payr = [{ "showpayby": "exact amount" }, { "amount": sal[0] }, { "period": sal[2] }]
                                }
                            }
                        }
                        
                        const checkurl = await jobsModel.find({feedurl:feeddata[fu].url});
                        if(checkurl.length <= 0) {
                            jobsModel.create({_id:idcount,jobdescription:feeddata[fu].job_description_html,jobtitle:feeddata[fu].job_title,companyname:comname,employerid:0,adlocation:feeddata[fu].location,feedrating:feeddata[fu].rating,feednoofreview:feeddata[fu].number_of_review,feedjoburl:feeddata[fu].job_url,feedurl:feeddata[fu].url,feedpay:feeddata[fu].pay,feedposteddate:feeddata[fu].Posted_date,feeddomain:domain,payrate:payr,jobstatus:'active',createddate:currdate,isAPI:true,feedsessionid:feedsession[fs].id}, function(err,data){   
                                //if(err) return res.status(400).json({err});        
                                //res.status(201).json({status:true, message:"Inserted successfully"})
                            })
                        } else {
                            try {   
                                ///console.log(feeddata[fu].url+' array'+JSON.stringify(payr));  
                                const data = await jobsModel.updateOne(
                                    {'feedurl':feeddata[fu].url},
                                    {$set:{'jobdescription':feeddata[fu].job_description_html,'jobtitle':feeddata[fu].job_title,'companyname':comname,'employerid':0,'adlocation':feeddata[fu].location,'feedrating':feeddata[fu].rating,'feednoofreview':feeddata[fu].number_of_review,'feedjoburl':feeddata[fu].job_url,'feedurl':feeddata[fu].url,'feedpay':feeddata[fu].pay,'feedposteddate':feeddata[fu].Posted_date,'feeddomain':domain,'payrate':payr,'jobstatus':'active',updateddate:currdate,feedsessionid:feedsession[fs].id}},{multi:true}
                                )
                                //res.status(201).json({status:true, message:"Updated successfully"})
                            } catch(e) {
                                //return res.status(422).json({message : "Unable to update"})
                            }

                        }                        
                    }
                }
                if(fs == (feedsession.length - 1)) {
                    res.status(201).json({status:true, message:"Updated successfully"})
                }
            }
        }
    },

    deletejobfeedData: async (req, res) => { 
        const result = await jobsModel.deleteMany({feeddomain:{$exists:true}});
        if(result){
            res.status(201).json({status:true, message : "Feed Job Deleted Successfully...!"})
        }
    }
    
}