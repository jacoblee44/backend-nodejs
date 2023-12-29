const mongoose = require('mongoose');
const jobapply = require('./job');
const userlst =  require('./users');
const mailTemplate = require('../utils/mailTemplate')
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const resumecreateSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    firstname:String,
    lastname:String,
    phonenumber:String,
    showphonenumber:{type:Boolean,default:true},
    country:String,
    streetaddress:String,
    citystate:String,
    postalcode:String,
    uploadedresume:String, 
    resumeheadline:String,   
    createddate:Date,  
    updateddate:Date,
    ispublic:{type:Boolean},
    isdeleted:{type:Boolean,default:false}
});
const createresumeModel = mongoose.model('resume', resumecreateSchema)

const educationSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    resumeid:Number,
    level:String,
    fieldofstudy:String,
    schoolnumber:String,
    country:String,
    citystate:String,
    currentlyenrolled:{type:Boolean,default:true},
    frommonth:Number,
    fromyear:Number,
    tomonth:Number,
    toyear:Number,    
    isdeleted:{type:Boolean,default:false}
});
const educationModel = mongoose.model('education', educationSchema)

const workexperienceSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    resumeid:Number,
    jobtitle:String,
    company:String,
    country:String,
    citystate:String,
    currentlywork:{type:Boolean,default:true},
    frommonth:Number,
    fromyear:Number,
    tomonth:Number,
    toyear:Number,
    totalmonthexp:Number,
    notes:String,      
    isdeleted:{type:Boolean,default:false}
});
const workexperienceModel = mongoose.model('workexperience', workexperienceSchema)

const curricularactivitiesSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    resumeid:Number,
    activities:String,
    type:String,  
    isdeleted:{type:Boolean,default:false}
});
const curricularactivitiesModel = mongoose.model('curricularactivities', curricularactivitiesSchema)

const desiredjobSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    resumeid:Number,
    jobtitle:String,
    relocation:{type:Boolean,default:false}, 
    desiredpayfrom:Number,
    desiredpayperiod:String,    
    jobtype:Array,
    others:String,
    jobschedule:Array,
    isdeleted:{type:Boolean,default:false}
});
const desiredjobModel = mongoose.model('desiredjob', desiredjobSchema)

const citystateSchema = new mongoose.Schema({
    _id:Number,
    city:String,
    State:String,  
    isdeleted:{type:Boolean,default:false}
});
const citystateModel = mongoose.model('citystate', citystateSchema)

const fieldofstudySchema = new mongoose.Schema({
    _id:Number,
    fieldofstudy:String,
    isdeleted:{type:Boolean,default:false}
});
const fieldofstudyModel = mongoose.model('fieldofstudy', fieldofstudySchema)

const addsectionSchema = new mongoose.Schema({
    _id:Number,
    addsection:String,
    isdeleted:{type:Boolean,default:false}
});
const addsectionModel = mongoose.model('addsection', addsectionSchema)

const jobsavebyuserSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    jobid:Number,
    saveddate:Date,
    isdeleted:{type:Boolean,default:false}
});
const jobsavebyuserModel = mongoose.model('jobsavebyuser', jobsavebyuserSchema)

const jobsavebyinviteSchema = new mongoose.Schema({
    _id:Number,
    userid:Number,
    jobid:Number,
    inviteddate:Date,
    isdeleted:{type:Boolean,default:false}
});
const jobsavebyinviteModel = mongoose.model('jobsavebyinvite', jobsavebyinviteSchema)



module.exports = {

    citystateSeed: async (req, res) => {

        const citystateData = req.body.data;
        var idcount=1;
        const hasrecord = await citystateModel.findOne().sort({_id:-1});
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        for(var i=0;i<citystateData.length;i++){  
            citystateModel.create( {_id:idcount, city:citystateData[i].city, state:citystateData[i].state});
            idcount++;
        }
        //citystateModel.execute();
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },

    getallcityState: async (req, res) => {
        const result = await citystateModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "CityState is not Available...!"}) }
        res.status(201).json({status:true, citystate:result})
    },

    fieldofstudySeed: async (req, res) => {
        const fieldofstudyData = req.body.data;
        var idcount=1;
        const hasrecord = await fieldofstudyModel.findOne().sort({_id:-1});
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        for(var i=0;i<fieldofstudyData.length;i++){  
            fieldofstudyModel.create( {_id:idcount, fieldofstudy:fieldofstudyData[i].fieldofstudy,});
            idcount++;
        }
        //fieldofstudyModel.execute();
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },

    getallfieldofStudy: async (req, res) => {
        const result = await fieldofstudyModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Field of Study is not Available...!"}) }
        res.status(201).json({status:true, fieldofstudy:result})
    },

    addnewsectionSeed: async (req, res) => {
        const addsectionData = req.body.data;
        var idcount=1;
        const hasrecord = await addsectionModel.findOne().sort({_id:-1});
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        for(var i=0;i<addsectionData.length;i++){  
            addsectionModel.create( {_id:idcount, addsection:addsectionData[i].fieldofstudy});
            idcount++;
        }
        //addsectionModel.execute();
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },

    getalladdnewSection: async (req, res) => {
        const result = await addsectionModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Section is not Available...!"}) }
        res.status(201).json({status:true, addsection:result})
    },

    listpredefinedSkills: async (req, res) => {
        curricularactivitiesModel.find().distinct('activities', { type: "skill" }, function(err, result) {
            if(err) return res.status(400).json({err}); 
            res.status(201).json({status:true, predefinedskills:result}) 
        });       
    },

    createResume: async (req, res) => {
              
        var currdate = new Date();   
        const hasrecord = await createresumeModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        if(req.body.firstname) {
            createresumeModel.create({_id:idcount, userid:req.body.userid, firstname:req.body.firstname, lastname:req.body.lastname, createddate:currdate, updateddate:currdate}, function(err,data){   
                if(err) return res.status(400).json({err});        
                res.status(201).json({status:true, resid:data._id})
            }) 
        }
    },
    updateResume: async (req, res) => {
              
        var currdate = new Date(); 
        if((typeof req.body.firstname != "undefined") && (typeof req.body.lastname != "undefined")) {
       // if(req.body.firstname) {
            try {
                const data = await createresumeModel.updateOne(
                { $and : [{'_id':req.body.resid}, { $or: [ { firstname: { $ne: req.body.firstname } }, { lastname: { $ne: req.body.lastname } } ] } ] },
                {$set:{'firstname':req.body.firstname,'lastname':req.body.lastname,'updateddate':currdate}},{multi:true}
                )                
                res.status(201).json({status:true, resid:req.body.resid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        }

        //if(req.body.phonenumber) {  
        if((typeof req.body.phonenumber != "undefined") && (typeof req.body.showphonenumber != "undefined")) {
            try {         
                const data = await createresumeModel.updateOne(
                    {$and : [ {'_id':req.body.resid}, { phonenumber: { $ne: req.body.phonenumber } }]},
                    {$set:{'phonenumber':req.body.phonenumber,'showphonenumber':req.body.showphonenumber,'updateddate':currdate}},{multi:true}
                )
                res.status(201).json({status:true, resid:req.body.resid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        }
        if((typeof req.body.citystate != "undefined") && (typeof req.body.country != "undefined") && (typeof req.body.streetaddress != "undefined") && (typeof req.body.postalcode != "undefined")) {
        ///if(req.body.citystate) {  
            try {         
                const data = await createresumeModel.updateOne(
                    {'_id':req.body.resid},
                    {$set:{'country':req.body.country,'streetaddress':req.body.streetaddress,'citystate':req.body.citystate,'postalcode':req.body.postalcode,'updateddate':currdate}},{multi:true}
                )
                res.status(201).json({status:true, resid:req.body.resid})
            } catch(e) {
                return res.status(400).json({e}); 
            }
        }
    },

    isresumePrivate: async (req, res) => {        
        try {
            const data = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'ispublic':req.body.ispublic, 'updateddate':currdate}},{multi:true}
            )
            res.status(201).json({status:true, resid:req.body.resid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    resumeHeadline: async (req, res) => {        
        try {
            const data = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'resumeheadline':req.body.resumeheadline, 'updateddate':currdate}},{multi:true}
            )
            res.status(201).json({status:true, resid:req.body.resid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    deleteResume: async (req, res) => {
        const result = await createresumeModel.findOne({_id:req.body.resid});
        if(!result) { return res.status(422).json({message : "Invalid Resume...!"}) }
        const data = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Resume Deleted Successfully...!"})
    },

    getResume: async (req, res) => {
        const result = await createresumeModel.findOne({_id:req.body.resid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Resume is not Available...!"}) }
        res.status(201).json({status:true, resume:result})
    },

    getResumesbyuser: async (req, res) => {
        const result = await createresumeModel.findOne({userid:req.body.userid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Resumes are not Available...!"}) }
        res.status(201).json({status:true, resume:result})
    },

    getallResumes: async (req, res) => {
        /*const result = await createresumeModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Resumes are not Available...!"}) }
        res.status(201).json({status:true, resume:result})*/

        const result = await createresumeModel.aggregate(
            [ 
                { "$match": {"isdeleted":false} },
    
                { "$lookup": {
                    "from": "educations",
                    localField: "_id",
                    foreignField: "resumeid",              
                    "as": "educations"
                }},

                { "$lookup": {
                    "from": "workexperiences",
                    localField: "_id",
                    foreignField: "resumeid",              
                    "as": "workexperiences"
                }},
                { "$lookup": {
                    "from": "curricularactivities",
                    localField: "_id",
                    foreignField: "resumeid",              
                    "as": "curricularactivities"
                }},
                { "$lookup": {
                    "from": "desiredjobs",
                    localField: "_id",
                    foreignField: "resumeid",              
                    "as": "desiredjobs"
                }}
            ]
            ).sort({createddate:-1})
            if(!result) { return res.status(422).json({message : "Resumes are not Available...!"}) }
            res.status(201).json({status:true, resume:result})

    },

    createEducation: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        const hasrecord = await educationModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }        
        educationModel.create({_id:idcount, userid:req.body.userid, resumeid:req.body.resid, level:req.body.level, fieldofstudy:req.body.fieldofstudy, schoolnumber:req.body.schoolnumber, country:req.body.country, citystate:req.body.citystate, currentlyenrolled:req.body.currentlyenrolled, frommonth:req.body.frommonth, fromyear:req.body.fromyear, tomonth:req.body.tomonth, toyear:req.body.toyear}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, edudata:data})
        })
    },

    updateEducation: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        try {           
            const data = await educationModel.updateOne(
            {'_id':req.body.eduid},
            {$set:{'level':req.body.level,'fieldofstudy':req.body.fieldofstudy,'country':req.body.country,'citystate':req.body.citystate,'fieldofstudy':req.body.fieldofstudy,'schoolnumber':req.body.schoolnumber,'currentlyenrolled':req.body.currentlyenrolled,'frommonth':req.body.frommonth,'fromyear':req.body.fromyear,'tomonth':req.body.tomonth,'toyear':req.body.toyear}},{multi:true}
            )
            res.status(201).json({status:true, eduid:req.body.eduid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    getEducation: async (req, res) => {
        const result = await educationModel.findOne({_id:req.body.eduid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Education is not Available...!"}) }
        res.status(201).json({status:true, edudata:result})
    },

    getallEducation: async (req, res) => {
        const result = await educationModel.find({resumeid:req.body.resid,isdeleted:false}).sort({ fromyear: -1 });;
        if(!result) { return res.status(422).json({message : "Education is not Available...!"}) }
        res.status(201).json({status:true, edudata:result})
    },

    deleteEducation: async (req, res) => {
        const result = await educationModel.findOne({_id:req.body.eduid});
        if(!result) { return res.status(422).json({message : "Invalid Education...!"}) }
        const data = await educationModel.updateOne(
            {'_id':req.body.eduid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Education Deleted Successfully...!"})
    },

    createworkExperience: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        const hasrecord = await workexperienceModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        
        const d = new Date(); 
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        if(!req.body.currentlywork) {
             month = req.body.tomonth;
             year = req.body.toyear;
        }

        var mnthexp = parseInt(month) - parseInt(req.body.frommonth);
        var yrexp = (parseInt(year) - parseInt(req.body.fromyear));
        var tmnth = yrexp * 12;
        var totmnth = tmnth + mnthexp;

        workexperienceModel.create({_id:idcount, userid:req.body.userid, resumeid:req.body.resid, jobtitle:req.body.jobtitle, company:req.body.company, country:req.body.country, citystate:req.body.citystate, currentlywork:req.body.currentlywork, frommonth:req.body.frommonth, fromyear:req.body.fromyear, tomonth:req.body.tomonth, toyear:req.body.toyear, notes:req.body.notes, totalmonthexp:totmnth}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, workexpdata:data})
        })
    },

    updateworkExperience: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        const d = new Date(); 
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        if(!req.body.currentlywork) {
             month = req.body.tomonth;
             year = req.body.toyear;
        }

        var mnthexp = parseInt(month) - parseInt(req.body.frommonth);
        var yrexp = (parseInt(year) - parseInt(req.body.fromyear));
        var tmnth = yrexp * 12;
        var totmnth = tmnth + mnthexp;

        try {
            const data = await workexperienceModel.updateOne(
            {'_id':req.body.workexpid},
            {$set:{'jobtitle':req.body.jobtitle,'company':req.body.company,'country':req.body.country,'citystate':req.body.citystate,'currentlywork':req.body.currentlywork,'frommonth':req.body.frommonth,'fromyear':req.body.fromyear,'tomonth':req.body.tomonth,'toyear':req.body.toyear, 'notes':req.body.notes, 'totalmonthexp':totmnth}},{multi:true}
            )
            res.status(201).json({status:true, workexpid:req.body.workexpid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    }, 

    getworkExperience: async (req, res) => {
        const result = await workexperienceModel.findOne({_id:req.body.workexpid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Work Experience is not Available...!"}) }
        res.status(201).json({status:true, workexpdata:result})
    },
    
    getallworkExperience: async (req, res) => {
        const result = await workexperienceModel.find({resumeid:req.body.resid,isdeleted:false}).sort({ fromyear: -1 });
        if(!result) { return res.status(422).json({message : "Work Experience is not Available...!"}) }
        res.status(201).json({status:true, workexpdata:result})
    },
    
    deleteworkExperience: async (req, res) => {
        const result = await workexperienceModel.findOne({_id:req.body.workexpid});
        if(!result) { return res.status(422).json({message : "Invalid Work Experience...!"}) }
        const data = await workexperienceModel.updateOne(
            {'_id':req.body.workexpid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Work Experience Deleted Successfully...!"})
    },

    createcurricularActivities: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        const hasrecord = await curricularactivitiesModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }  

        const result = await curricularactivitiesModel.find({resumeid:req.body.resid,type:req.body.type,isdeleted:false},{activities:1, _id: 0});
        var actiarr  = result.map(item=>item.activities);
        if (actiarr.indexOf(req.body.activities) >= 0) {
            res.status(201).json({status:true, message : "Duplicate Entry...!"})
        } else {
            curricularactivitiesModel.create({_id:idcount, userid:req.body.userid, resumeid:req.body.resid, activities:req.body.activities, type:req.body.type}, function(err,data){   
                if(err) return res.status(400).json({err});        
                res.status(201).json({status:true, cactivi:data})
            })
        }
    },

    updatecurricularActivities: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        try {
            const data = await curricularactivitiesModel.updateOne(
            {'_id':req.body.curractid},
            {$set:{'activities':req.body.activities,'type':req.body.type}},{multi:true}
            )
            res.status(201).json({status:true, curractid:req.body.curractid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    getcurricularActivities: async (req, res) => {
        const result = await curricularactivitiesModel.findOne({_id:req.body.cactiviid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Curricular Activities is not Available...!"}) }
        res.status(201).json({status:true, cactividata:result})
    },

    getallcurricularActivities: async (req, res) => {
        const result = await curricularactivitiesModel.find({resumeid:req.body.resid,type:req.body.type,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Curricular Activities is not Available...!"}) }
        res.status(201).json({status:true, cactividata:result})
    },

    deletecurricularActivities: async (req, res) => {
        const result = await curricularactivitiesModel.findOne({_id:req.body.curractid});
        if(!result) { return res.status(422).json({message : "Invalid Curricular Activities...!"}) }
        const data = await curricularactivitiesModel.updateOne(
            {'_id':req.body.curractid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Curricular Activities Deleted Successfully...!"})
    },

    createdesiredJob: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        const hasrecord = await desiredjobModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        desiredjobModel.create({_id:idcount, userid:req.body.userid, resumeid:req.body.resid, jobtitle:req.body.jobtitle, relocation:req.body.relocation, desiredpayfrom:req.body.desiredpayfrom, desiredpayperiod:req.body.desiredpayperiod, jobtype:req.body.jobtype, jobschedule:req.body.jobschedule}, function(err,data){  //, others:req.body.others 
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, djobdata:data})
        })
    },

    updatedesiredJob: async (req, res) => {
        var currdate = new Date();   
        const data1 = await createresumeModel.updateOne(
            {'_id':req.body.resid},
            {$set:{'updateddate':currdate}},{multi:true}
        )
        try {
            const data = await desiredjobModel.updateOne(
            {'_id':req.body.djobid},
            {$set:{'jobtitle':req.body.jobtitle,'relocation':req.body.relocation,'desiredpayfrom':req.body.desiredpayfrom,'desiredpayperiod':req.body.desiredpayperiod,'jobtype':req.body.jobtype,'others':req.body.others,'jobschedule':req.body.jobschedule}},{multi:true}
            )
            res.status(201).json({status:true, djobid:req.body.djobid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    getdesiredJob: async (req, res) => {
        const result = await desiredjobModel.findOne({resumeid:req.body.resid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Desired Job is not Available...!"}) }
        res.status(201).json({status:true, djobdata:result})
    },

    getdesiredJobbyuid: async (req, res) => {
        const result = await desiredjobModel.findOne({userid:req.body.userid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Desired Job is not Available...!"}) }
        res.status(201).json({status:true, djobdata:result})
    },

    deletedesiredJob: async (req, res) => {
        const result = await desiredjobModel.findOne({_id:req.body.djobid});
        if(!result) { return res.status(422).json({message : "Invalid Desired Job...!"}) }
        const data = await desiredjobModel.updateOne(
            {'_id':req.body.djobid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Desired Job Deleted Successfully...!"})
    },
    getalldesiredJobtitle: async (req, res) => {
        const listjobtitle = await desiredjobModel.aggregate([           
            {
                $group: { 
                    "_id":"$_id",
                    "count":{ 
                        "$sum":1
                    },
                    "jobtitle":{"$first":"$jobtitle"},
                }
            }           
        ]);
        if(!listjobtitle) { return res.status(422).json({message : "JobList is not Available...!"}) }
        res.status(201).json({status:true, jobtitle:listjobtitle})
    },
    getallCompany: async (req, res) => {
        const listcompany = await workexperienceModel.aggregate([           
            {
                $group: { 
                    "_id":"$_id",
                    "count":{ 
                        "$sum":1
                    },
                    "company":{"$first":"$company"},
                }
            }           
        ]);
        if(!listcompany) { return res.status(422).json({message : "Company list is not Available...!"}) }
        res.status(201).json({status:true, company:listcompany})
    },
    getcountEducation: async (req, res) => {
        const listedulevel = await educationModel.aggregate([         
            {
                $group: { 
                    "_id":"$level",
                    "count":{ 
                        "$sum":1
                    },
                    "educount":{"$first":"$level"},
                }
            }           
        ]);
        if(!listedulevel) { return res.status(422).json({message : "level of study is not Available...!"}) }
        res.status(201).json({status:true, educount:listedulevel})
    },
    getallAssessment: async (req, res) => {
        const listassessment = await curricularactivitiesModel.aggregate([ 
            { "$match": { "type": "Skills" } },            
            {
                $group: {
                    "_id":"$activities",
                    "count":{ 
                        "$sum":1
                    },
                    "assessment":{"$first":"$activities"},
                }
            }           
        ]);
        if(!listassessment) { return res.status(422).json({message : "level of study is not Available...!"}) }
        res.status(201).json({status:true, assessment:listassessment})
    },

    getallworkExperiencecount: async (req, res) => {
        var expbet = req.body.wexp.split(',');
        //var expbet1 = 
        console.log(expbet[0]+'/'+expbet[1]+' workexp');
        const listworkexperience = await workexperienceModel.aggregate([  
                { "$match": { "totalmonthexp": {"$gte": parseInt(expbet[0]), "$lt": parseInt(expbet[1])} } },
                {$group: {
                    "_id":"$_id",
                    "count":{ 
                        "$sum":1
                    },
                    "workexperience":{"$first":"$totalmonthexp"}
                }}      
        ]);
        console.log(listworkexperience)
        if(!listworkexperience) { return res.status(422).json({message : "Work Experience is not Available...!"}) }
        res.status(201).json({status:true, workexperience:listworkexperience, workexperiencetitle:req.body.wexptitle})
    },

    getallMilitary: async (req, res) => {
        const listmilitary = await curricularactivitiesModel.aggregate([  
            { "$match": { "type": "military" } },                     
            {
                $group: {
                    "_id":"$_id",
                    "count":{ 
                        "$sum":1
                    },
                    "military":{"$first":"$activities"},
                }
            }
        ]);
        if(!listmilitary) { return res.status(422).json({message : "Military is not Available...!"}) }
        res.status(201).json({status:true, military:listmilitary})
    },

    /*getalldesiredjobtitle: async (req, res) => {
        const result = await desiredjobModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Job list is not Available...!"}) }
        res.status(201).json({status:true, djob:result})
    },
    getallcompany: async (req, res) => {
        const result = await workexperienceModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Company list is not Available...!"}) }
        res.status(201).json({status:true, company:result})
    },
    getalleducation: async (req, res) => {
        const result = await educationModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Education list is not Available...!"}) }
        res.status(201).json({status:true, education:result})
    },
    getallassessment: async (req, res) => {
        const result = await curricularactivitiesModel.find({type:'skills',isdeleted:false});
        if(!result) { return res.status(422).json({message : "Assessment list is not Available...!"}) }
        res.status(201).json({status:true, company:result})
    },*/

    getalljobappliedbyUser: async (req, res) => {
        /*const result = await jobapply.jobapplySchema.find({userid:req.body.userid, status:""});        
        if(!result) { return res.status(422).json({message : "Job applied list is not Available...!"}) }
        res.status(201).json({status:true, djob:result})*/

        const jobapplied = await jobapply.jobapplySchema.aggregate(
            [ 
                { "$match": {"userid":req.body.userid, "status":""} },
    
                { "$lookup": {
                    "from": "jobs",
                    localField: "jobid",
                    foreignField: "_id",              
                    "as": "jobdetails"
                }}
            ]
            ) 
            if(!jobapplied) { return res.status(422).json({message : "Job applied list is not Available...!"}) }
            res.status(201).json({status:true, djob:jobapplied})
    },

    getjobappliedbyUser: async (req, res) => {
        const result = await jobapply.jobapplySchema.findOne({userid:req.body.userid, jobid:req.body.jobid}); 
        if(!result){
            res.status(201).json({status:true, djob:0})
        } else {
            res.status(201).json({status:true, djob:result})
        }  
    },

    updatejobappliedStatus: async (req, res) => {
        try {
            const data = await jobapply.jobapplySchema.updateOne(
            {'jobid':req.body.jobid,'userid':req.body.userid},
            {$set:{'status':req.body.status}},{multi:true}
            )
            res.status(201).json({status:true, message:"Status updated successfully"})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    getalljobappliedtoInterview: async (req, res) => {
        /*const result = await jobapply.jobapplySchema.find({userid:req.body.userid, status:"interview"});        
        if(!result) { return res.status(422).json({message : "Job interview list is not Available...!"}) }
        res.status(201).json({status:true, djob:result})*/

        const jobinterviewed = await jobapply.jobapplySchema.aggregate(
            [ 
                { "$match": {"userid":req.body.userid, "status":"interview"} },
    
                { "$lookup": {
                    "from": "jobs",
                    localField: "jobid",
                    foreignField: "_id",              
                    "as": "jobdetails"
                }}
            ]
            ) 
            if(!jobinterviewed) { return res.status(422).json({message : "Job interview list is not Available...!"}) }
            res.status(201).json({status:true, djob:jobinterviewed})
    },

    getalljobappliedtoArchived: async (req, res) => {
        /*const result = await jobapply.jobapplySchema.find({userid:req.body.userid, status:"archived"});        
        if(!result) { return res.status(422).json({message : "Job archived list is not Available...!"}) }
        res.status(201).json({status:true, djob:result})*/
        const jobarchived = await jobapply.jobapplySchema.aggregate(
            [ 
                { "$match": {"userid":req.body.userid, "status":"archived"} },
    
                { "$lookup": {
                    "from": "jobs",
                    localField: "jobid",
                    foreignField: "_id",              
                    "as": "jobdetails"
                }}
            ]
            ) 
            if(!jobarchived) { return res.status(422).json({message : "Job interview list is not Available...!"}) }
            res.status(201).json({status:true, djob:jobarchived})
    },

    jobsavebyUser: async (req, res) => {
        const hasrecord = await jobsavebyuserModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }  
        jobsavebyuserModel.create({_id:idcount, userid:req.body.userid, jobid:req.body.jobid, saveddate:new Date()}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, jobsave:data})
        })
    },

    getalljobSaved: async (req, res) => {
        /*const result = await jobsavebyuserModel.find({userid:req.body.userid, isdeleted:false});        
        if(!result) { return res.status(422).json({message : "Job saved list is not Available...!"}) }
        res.status(201).json({status:true, savedlist:result})*/

        const jobsaved = await jobsavebyuserModel.aggregate(
            [ 
                { "$match": {"userid":req.body.userid} },
    
                { "$lookup": {
                    "from": "jobs",
                    localField: "jobid",
                    foreignField: "_id",              
                    "as": "jobdetails"
                }}
            ]
            ) 
            if(!jobsaved) { return res.status(422).json({message : "Saved Job list is not Available...!"}) }
            res.status(201).json({status:true, djob:jobsaved})
    },

    getjobSaved: async (req, res) => {
        const result = await jobsavebyuserModel.findOne({userid:req.body.userid, jobid:req.body.jobid, isdeleted:false});        
        //if(!result) { return res.status(422).json({message : "Job saved list is not Available...!"}) }
        if(!result){
            res.status(201).json({status:true, savedid:0})
        } else {
            res.status(201).json({status:true, savedid:result._id})
        }
    },

    deletejobSaved: async (req, res) => {        
        const result = await jobsavebyuserModel.deleteOne({jobid:req.body.jobid, userid:req.body.userid});
        if(result){
            res.status(201).json({status:true, message : "Saved Job Deleted Successfully...!"})
        }
    },

    getalljobInvited: async (req, res) => {
        const jobsaved = await jobsavebyinviteModel.aggregate(
            [ 
                { "$match": {"userid":req.body.userid} },
    
                { "$lookup": {
                    "from": "jobs",
                    localField: "jobid",
                    foreignField: "_id",              
                    "as": "jobdetails"
                }}
            ]
            ) 
            if(!jobsaved) { return res.status(422).json({message : "Saved Job list is not Available...!"}) }
            res.status(201).json({status:true, djob:jobsaved})
    },

    deletejobInvited: async (req, res) => {
        const result = await jobsavebyinviteModel.deleteOne({jobid:req.body.jobid, userid:req.body.userid});
        if(result){
            res.status(201).json({status:true, message : "Invited Job Deleted Successfully...!"})
        }
    },

    getalljobrejected: async (req, res) => {
        const jobsaved = await jobapply.jobapplySchema.aggregate(
            [ 
                { "$match": {"userid":req.body.userid, "status": req.body.status} },
    
                { "$lookup": {
                    "from": "jobs",
                    localField: "jobid",
                    foreignField: "_id",              
                    "as": "jobdetails"
                }}
            ]
            ) 
            if(!jobsaved) { return res.status(422).json({message : "Saved Job list is not Available...!"}) }
            res.status(201).json({status:true, djob:jobsaved})
    },

    getalljobscountbyUser: async (req, res) => {  

        const monthlycredits = await jobapply.jobapplySchema.aggregate([ 
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
                "$match": {$and:[{"jobs.employerid":req.body.userid}]}
            }, {
                $group: { 
                    "_id":{jobid:"$jobid", status:"$status"},
                    "jobid":{"$first":"$jobid"},
                    "status":{"$last":"$status"},
                    "count":{ 
                        "$sum":1
                    },
                    "employerid":{"$first":"$jobs.employerid"},
                }
               
            }        
        ]);
        if(!monthlycredits) { return res.status(422).json({message : "Monthly bill is not Available...!"}) }            
        res.status(201).json({status:true, jobcount:monthlycredits})        
    },
    
    getallInvitedjobscount: async (req, res) => {  

        const monthlycredits = await jobsavebyinviteModel.aggregate([ 
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
                "$match": {$and:[{"jobs.employerid":req.body.userid}]}
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
        res.status(201).json({status:true, jobcount:monthlycredits})        
    },    

    

    invitejobtoApply: async (req, res) => {

        const result = await createresumeModel.find({resid:req.body.resid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Resume is not Available...!"}) }

        const useremail = await userlst.userSchema.find({_id:result.userid, isdeleted:false});
        if(!useremail) { return res.status(422).json({message : "user is not Available...!"}) }

        const jobresult = await jobapply.jobSchema.find({_id:req.body.jobid,isdeleted:false});
        if(!jobresult) { return res.status(422).json({message : "job is not Available...!"}) }

        const hasrecord = await jobsavebyinviteModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        
        const hasrecord1 = await jobapply.jobconversationSchema.findOne().sort({_id:-1});
        var idcount1=1;
        if(hasrecord1) {
            idcount1 = parseInt(hasrecord1._id) + 1;
        } 

        const invitecnt = await jobsavebyinviteModel.find({jobid:req.body.jobid,userid:result[0].userid});
        //if(!invitecnt) { return res.status(422).json({message : "job is not Available...!"}) }
        if(invitecnt <= 0) {
        jobsavebyinviteModel.create({_id:idcount, userid:result[0].userid, jobid:req.body.jobid, inviteddate:new Date()}, function(err,data){   
            if(err) return res.status(400).json({err}); 
            try {
                const body = mailTemplate({
                    title: 'Job Invitation link from Dayratework',
                    content: "Hi User, <br /><br />This is the invitation to apply for job matched your resume.Please click this button to apply.",
                    button: {
                        text:"Apply",
                        link: req.body.url
                    }
                })
                const obj = {
                to:  useremail[0].email,
                from: 'noreply@dayratework.com',
                fromname: 'Dayratework',
                subject: 'Job Invitation link from Dayratework',
                text: body,
                html: `<strong>${body}</strong>`,
                };
                //sendGridMail.send(obj);
                //res.status(201).json({status:true, message : "Job Invitation email sent successfully"});
            } catch (error) {
                /*if (error.response) {
                return res.status(422).json({message : "Unable to send email."})
                }*/
            }
            const empid = jobapply.jobSchema.findOne({_id:req.body.jobid,isdeleted:false});
            jobapply.jobconversationSchema.create({_id:idcount1,userid:result[0].userid,employerid:empid.employerid,jobid:req.body.jobid,createddate:new Date(),subject:"Message Initialized",message:"",messageby:empid.employerid}, function(err,data1){
                convid = idcount1;                 
                //res.status(201).json({status:true, applyid:applyid})              
            })    
            res.status(201).json({status:true, jobinvite:data})
        })
        } else {
            res.status(201).json({status:true, message:"Already Invited"}) 
        }
        //res.status(201).json({status:true, job:result})
        
    },

    searchResumes: async (req, res) => { 

        //var filterobjs = '';
        var filterobj1 = '';
        var filterobj2 = '';
        var filterobj3 = '';
        var filterobj4 = '';
        var filterobj5 = '';
        var filterobj6 = '';
        var filterobj7 = '';
        var filterobj8 = '';
        var filterobj9 = '';
        var filterobj10 = '';        
        var filterobj11 = '';
        var filterobj12 = '';        
        var filterobj13 = '';

        var residobj = [];
        var sidfilterarr = [];
        var finaluniqueid = [];
        var finaluniqueid1 = [];
        var mergeuniqueid = [];
        
        var limitdata = req.body.data
       
        if(limitdata == "" || (limitdata.length > 3)) {
            if(req.body.keyword != "" && req.body.location == "") {
                filterobj1={"$regexMatch": { "input": "$jobtitle", "regex": req.body.keyword, "options": "i" }};
                filterobj2={"$regexMatch": { "input": "$activities", "regex": req.body.keyword, "options": "i" }};
                filterobj3={"$regexMatch": { "input": "$companyname", "regex": req.body.keyword, "options": "i" }};
                filterobj4={"$regexMatch": { "input": "$fieldofstudy", "regex": req.body.keyword, "options": "i" }};
            } else if(req.body.keyword == "" && req.body.location != "") {
                filterobj5={"$regexMatch": { "input": "$citystate", "regex": req.body.location, "options": "i" }};
            } else if(req.body.keyword != "" && req.body.location != "") {
                filterobj1={"$regexMatch": { "input": "$jobtitle", "regex": req.body.keyword, "options": "i" }};
                filterobj2={"$regexMatch": { "input": "$activities", "regex": req.body.keyword, "options": "i" }};
                filterobj3={"$regexMatch": { "input": "$companyname", "regex": req.body.keyword, "options": "i" }};
                filterobj4={"$regexMatch": { "input": "$fieldofstudy", "regex": req.body.keyword, "options": "i" }};
                filterobj5={"$regexMatch": { "input": "$citystate", "regex": req.body.location, "options": "i" }};
                //var filterobj = {$and:[{$or: filterobj1}, {"$regexMatch": { "input": "$citystate", "regex": req.body.location, "options": "i" }}]}
            }
            
        } else if(req.body.data != "") {
            for(var i=0;i<limitdata.length;i++){
                var ltdata = JSON.stringify(limitdata[i]);
                var ltdata1 = JSON.parse(ltdata);                
                if(ltdata1['searchtype'] == "Job Title") { filterobj1={"$regexMatch": { "input": "$jobtitle", "regex": req.body.keyword, "options": "i" }}; }
                if(ltdata1['searchtype'] == "Skills") { filterobj2={"$regexMatch": { "input": "$activities", "regex": req.body.keyword, "options": "i" }}; }
                if(ltdata1['searchtype'] == "Companies") { filterobj3={"$regexMatch": { "input": "$companyname", "regex": req.body.keyword, "options": "i" }}; }
                if(ltdata1['searchtype'] == "Field of study") { filterobj4={"$regexMatch": { "input": "$fieldofstudy", "regex": req.body.keyword, "options": "i" }}; }
            }  
            if(req.body.location != ""){
                filterobj5 = {"$regexMatch": { "input": "$citystate", "regex": req.body.location, "options": "i" }};
            }
        } 
        
        if(filterobj1 != ""){
            const djobresult = await desiredjobModel.aggregate([ 
                { "$match": { "$expr": filterobj1  } },{ "$project": { "resumeid": 1, "_id":0}}
            ]);
            console.log(djobresult.length+' desired jobs');
            if(djobresult.length > 0) {
                for(var i=0; i<djobresult.length; i++){
                    residobj.push(djobresult[i].resumeid);               
                }
            }
            console.log(JSON.stringify(residobj)+' next desired jobs');

            const workexpresult = await workexperienceModel.aggregate([ 
                { "$match": { "$expr": filterobj1  } },{ "$project": { "resumeid": 1, "_id":0}}
            ]);
            console.log(workexpresult.length+' Work experience');
            if(workexpresult.length > 0) {
                for(var i=0; i<workexpresult.length; i++){
                    residobj.push(workexpresult[i].resumeid);               
                }
            }
            console.log(JSON.stringify(residobj)+' next desired jobs');
        }      
        
        if(filterobj2 != ""){
            const eduresult = await educationModel.aggregate([ 
                { "$match": { "$expr": filterobj2  } },{ "$project": { "resumeid": 1, "_id":0}}
            ]);
            if(eduresult.length > 0) {
                for(var i=0; i<eduresult.length; i++){
                    residobj.push(eduresult[i].resumeid);
                }
            }
        }

        if(filterobj3 != ""){
            const wexpresult = await workexperienceModel.aggregate([ 
                { "$match": { "$expr": filterobj3  } },{ "$project": { "resumeid": 1, "_id":0}}
            ]);
            if(wexpresult.length > 0) {
                for(var i=0; i<wexpresult.length; i++){
                    residobj.push(wexpresult[i].resumeid);
                }
            }
        }

        if(filterobj4 != ""){
            const cactresult = await curricularactivitiesModel.aggregate([ 
                { "$match": { "$expr": filterobj4  } },{ "$project": { "resumeid": 1, "_id":0}}
            ]);
            if(cactresult.length > 0) {
                for(var i=0; i<cactresult.length; i++){
                    residobj.push(cactresult[i].resumeid);
                }
            }
        }  


        const unique1 = [ ...new Set(residobj)] 
        console.log(unique1+'/ firstarray');
        
        var filtitdata = req.body.filtertitledata;
        console.log(JSON.stringify(filtitdata)+' reqilterbody lentht '+filtitdata.length);
        if(filtitdata.length > 0){
            for(let fd = 0; fd < filtitdata.length; fd++){
                console.log(filtitdata[fd].filtertitle)+' inside filter';
                if(filtitdata[fd].filtertitle == 'Jobtitles' ) {
                    filterobj6 = await desiredjobModel.find({jobtitle: {$in: [filtitdata[fd].filterdata]}}); 
                    console.log(filterobj6+' filtertitle');        
                    if(filterobj6.length > 0) {
                        for(var i=0; i<filterobj6.length; i++){
                            sidfilterarr.push(filterobj6[i].resumeid);               
                        }
                    }
                }

                if(filtitdata[fd].filtertitle == 'Lastupdatedresume' ) {
                    
                    var date = new Date();
                    var firstmonth = date.getMonth() - filtitdata[fd].filterdata;
                    var firstDay = new Date(date.getFullYear(), firstmonth, 1);
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                    filterobj11 = await createresumeModel.find({createddate:{$gte:firstDay,$lt:lastDay}},{isdeleted:false});            
                    //filterobj7 = await createresumeModel.find({company: {$in: [req.body.filterdata]}});          
                    if(filterobj11.length > 0) {
                        for(var i=0; i<filterobj7.length; i++){
                            sidfilterarr.push(filterobj11[i].resumeid);               
                        }
                    }
                }

                if(filtitdata[fd].filtertitle == 'ExcludedCandidates' ) {
                    var today = new Date();
                    var priorDate = new Date(new Date().setDate(today.getDate() - filtitdata[fd].filterdata));
                    filterobj12 = await  jobapply.jobapplySchema.find({applieddate:{$gte:priorDate,$lt:today}},{isdeleted:false});            
                    //filterobj7 = await createresumeModel.find({company: {$in: [req.body.filterdata]}});          
                    if(filterobj12.length > 0) {
                        for(var i=0; i<filterobj12.length; i++){
                            sidfilterarr.push(filterobj12[i].resumeid);               
                        }
                    }
                }
                
                if(filtitdata[fd].filtertitle == 'Company' ) {
                    filterobj7 = await workexperienceModel.find({company: {$in: [filtitdata[fd].filterdata]}});          
                    if(filterobj7.length > 0) {
                        for(var i=0; i<filterobj7.length; i++){
                            sidfilterarr.push(filterobj7[i].resumeid);               
                        }
                    }
                }

                if(filtitdata[fd].filtertitle == 'Years of Experience' ) {
                    let durarange = filtitdata[fd].filterdata.split(',');
                    filterobj8 = await workexperienceModel.find({totalmonthexp: {$gte:durarange[0],$lt:durarange[1]}});          
                    if(filterobj8.length > 0) {
                        for(var i=0; i<filterobj8.length; i++){
                            sidfilterarr.push(filterobj8[i].resumeid);               
                        }
                    }
                }

                if(filtitdata[fd].filtertitle == 'Education' ) {
                    filterobj9 = await educationModel.find({level: {$in: filtitdata[fd].filterdata}});          
                    if(filterobj9.length > 0) {
                        for(var i=0; i<filterobj9.length; i++){
                            sidfilterarr.push(filterobj9[i].resumeid);               
                        }
                    }
                }

                if(filtitdata[fd].filtertitle == 'Assessment' ) {
                    filterobj10 = await curricularactivitiesModel.find({activities: {$in: filtitdata[fd].filterdata}});          
                    if(filterobj10.length > 0) {
                        for(var i=0; i<filterobj10.length; i++){
                            sidfilterarr.push(filterobj10[i].resumeid);               
                        }
                    }
                }

                if(filtitdata[fd].filtertitle == 'Military' ) {
                    filterobj13 = await curricularactivitiesModel.find({activities: {$in: filtitdata[fd].filterdata}});          
                    if(filterobj13.length > 0) {
                        for(var i=0; i<filterobj13.length; i++){
                            sidfilterarr.push(filterobj13[i].resumeid);               
                        }
                    }
                }
            }

            const unique2 = [ ...new Set(sidfilterarr)] 
            console.log(unique2+"/ sidearray");
            const combined = [...unique1, ...unique2]
            console.log(combined+' combined');
            //for(var i=0; i<combined; i++){
                //if (unique2.indexOf(updresume[i]._id) >= 0) {
                   // mergeuniqueid.push(combined[i]);
            /// }
            //}

            //const combined = [...unique1, ...unique2]

            const unique = combined 
            console.log(unique+' unique')
        
            if(filtitdata.filtertitle == 'Lastupdate' ) {
                const updresume = await createresumeModel.find({resumeid: {$in: unique}}, {isdeleted:false});
                if(updresume.length > 0) {
                    var months;
                    for(var i=0; i<updresume.length; i++){
                        var d1 = new Date();
                        var d2 = updresume[i].createddate;   
                        months = (d2.getFullYear() - d1.getFullYear()) * 12;
                        months -= d1.getMonth();
                        months += d2.getMonth(); 
                        
                        if(months < req.body.filterdata) {
                            if (unique.indexOf(updresume[i]._id) >= 0) {
                                finaluniqueid.push(updresume[i].resumeid);
                            }
                        }
                    }
                } 
            } else {
                finaluniqueid = [...unique]
            } 
            
            if(filtitdata.filtertitle == 'Excludecontacted' ) {
                const updjobapply = await jobapply.applySchema.find({resumeid: {$in: finaluniqueid}});
                if(updjobapply.length > 0) {
                    var months;
                    for(var i=0; i<updjobapply.length; i++){
                        var d1 = new Date();
                        var d2 = updjobapply[i].applieddate;   
                        months = (d2.getFullYear() - d1.getFullYear()) * 12;
                        months -= d1.getMonth();
                        months += d2.getMonth(); 
                        
                        if(months < req.body.filterdata) {
                            if (unique.indexOf(updjobapply[i]._id) >= 0) {
                                finaluniqueid1.push(updjobapply[i].resumeid);
                            }
                        }
                    }
                } 
            } else {
                finaluniqueid1 = [...finaluniqueid]
            }
        } else {
            finaluniqueid1 = [...unique1]
        }
        let filterobj = "";
        console.log(finaluniqueid1+' final id')
        if(finaluniqueid1.length > 1) {
            filterobj = { _id: { $in: finaluniqueid1 } }; //{ '$in': ["$_id", finaluniqueid1] }
            console.log(filterobj+' inside');
        } else {
            filterobj = { _id: finaluniqueid1[0] };
            console.log(JSON.stringify(filterobj)+' outside');
        }
        
        if(filterobj5 != ""){
            filterobj = {$and:[filterobj, {"$regexMatch": { "input": "$citystate", "regex": req.body.location, "options": "i" }}]}
        }

        const ressearch = await createresumeModel.aggregate(
        [ 
            { $match: filterobj },

            { "$lookup": {
                "from": "desiredjobs",
                localField: "_id",
                foreignField: "resumeid",              
                "as": "desiredjobData"
            }},   

            { "$lookup": {
              "from": "workexperiences",
              localField: "_id",
              foreignField: "resumeid",              
              "as": "workexperienceData"
            }},

            { "$lookup": {
                "from": "curricularactivities",
                localField: "_id",
                foreignField: "resumeid",
                "as": "curricularactivitiesData"
            }},

            { "$lookup": {
            "from": "educations",
            localField: "_id",
            foreignField: "resumeid",               
            "as": "educationData"
            }}
        ]
        ) 
        console.log(ressearch);
        if(!ressearch) { return res.status(422).json({message : "Resumes are not Available...!"}) }
        res.status(201).json({status:true, resumes:ressearch})
        
    }


}