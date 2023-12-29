const mongoose = require('mongoose');
const { promises } = require('nodemailer/lib/xoauth2');

const predealcategorySchema = new mongoose.Schema({
    _id:Number,
    predealcategoryname:{type:String,unique:true},
    active:{type:Number,default:1},
    isdeleted:{type:Boolean,default:false}
});
const predealcategoryModel = mongoose.model('predealcategory', predealcategorySchema);

const predealquestionSchema = new mongoose.Schema({
    _id:Number,
    predealquestioncategory:Number,
    //predealquestiontype:String,
    predealquestiontitle:String,
    predealinputfields:Array,   
    isdefault:{type:Boolean,default:false},
    isdeleted:{type:Boolean,default:false}
});
const predealquestionModel = mongoose.model('predealquestion', predealquestionSchema);

const jobdealquestionSchema = new mongoose.Schema({
    _id:Number,
    jobid:Number,
    predealquestioncategory:Number,
    predealquestionid:Number,
    //predealquestiontype:String,
    predealquestiontitle:String,
    predealanswer:String,
    isdealbreaker:{type:Boolean,default:false},
    isdeleted:{type:Boolean,default:false}
});
const jobdealquestionModel = mongoose.model('jobdealquestion', jobdealquestionSchema)

module.exports = {

    predealcategorySeed: async (req, res) => {
        const predealcategoryData = req.body.data;
        var idcount=1;
        const hasrecord = await predealcategoryModel.findOne().sort({_id:-1});
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        for(var i=0;i<predealcategoryData.length;i++){  
            predealcategoryModel.create( {_id:idcount, predealcategoryname:predealcategoryData[i].predealcategoryname});
            idcount++;
        }
        //predealcategoryModel.execute();
        res.status(201).json({status:true, Message:'Updated Successfully'})
    },

    addpredealCategory: async (req, res) => {
        const hasrecord = await predealcategoryModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        predealcategoryModel.create({_id:idcount,predealcategoryname:req.body.predealcategoryname}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, dcat:data})
        }) 
    },

    updatepredealCategory: async (req, res) => {
        const result = await predealcategoryModel.findOne({_id:req.body.predealcatid});
        if(!result) { return res.status(422).json({message : "Invalid Predefined deal breaker Category...!"}) }
        const data = await predealcategoryModel.updateOne(
            {'_id':req.body.predealcatid},
            {$set:{'predealcategoryname':req.body.predealcategoryname}},{multi:true}
        )
        res.status(201).json({status:true, dcat:data})
    },

    deletepredealCategory: async (req, res) => {
        const result = await predealcategoryModel.findOne({_id:req.body.predealcatid});
        if(!result) { return res.status(422).json({message : "Invalid Predefined deal breaker Category...!"}) }
        const data = await predealcategoryModel.updateOne(
            {'_id':req.body.predealcatid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Predefined deal breaker Category Deleted Successfully...!"})
    },

    getallpredealCategory: async (req, res) => {
        const result = await predealcategoryModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Predefined deal breaker Category is not Available...!"}) }
        res.status(201).json({status:true, dcat:result})
    },

    getpredealCategory: async (req, res) => {
        const result = await predealcategoryModel.findOne({_id:req.body.predealcatid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Predefined deal breaker Category is not Available...!"}) }
        res.status(201).json({status:true, dcat:result})
    },
    

    addpredealQuestions: async (req, res) => {
        const hasrecord = await predealquestionModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        predealquestionModel.create({_id:idcount,predealquestioncategory:req.body.predealquestioncategory,predealquestiontitle:req.body.predealquestiontitle,predealinputfields:req.body.predealinputfields,isdefault:req.body.isdefault}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, ques:data})
        }) 
    },

    updatepredealQuestions: async (req, res) => {
        const result = await predealquestionModel.findOne({_id:req.body.predealquesid});
        if(!result) { return res.status(422).json({message : "Invalid Predefined deal breaker Question...!"}) }
        const data = await predealquestionModel.updateOne(
            {'_id':req.body.predealquesid},
            {$set:{'predealquestioncategory':req.body.predealquestioncategory,'predealquestiontitle':req.body.predealquestiontitle,'predealinputfields':req.body.predealinputfields,'isdefault':req.body.isdefault}},{multi:true}
        )
        res.status(201).json({status:true,message : "Predefined deal breaker Question Updated Successfully...!"})
    },

    deletepredealQuestions: async (req, res) => {
        const result = await predealquestionModel.findOne({_id:req.body.predealquesid});
        if(!result) { return res.status(422).json({message : "Invalid Predefined deal breaker Question...!"}) }
        const data = await predealquestionModel.updateOne(
            {'_id':req.body.predealquesid},
            {$set:{'isdeleted':true}},{multi:true}
        )
        res.status(201).json({status:true, message : "Predefined deal breaker Question Deleted Successfully...!"})
    },

    getallpredealQuestions: async (req, res) => {
        const result = await predealquestionModel.find({isdeleted:false});
        if(!result) { return res.status(422).json({message : "Predefined deal breaker Questions is not Available...!"}) }
        res.status(201).json({status:true, dques:result})
    },

    getpredealQuestions: async (req, res) => {
        const result = await predealquestionModel.findOne({predealquestioncategory:req.body.predealcatid,isdeleted:false});
        console.log(result);
        if(!result) { return res.status(422).json({message : "Predefined deal breaker Category is not Available...!"}) }
        res.status(201).json({status:true, ques:result})
    },

    savepredealQuestions: async (req, res) => {
       
        var idcount=1;

        const predealquesansdata = req.body.quesansdata;
       
        for(var i=0;i<predealquesansdata.length;i++){
            var allquesansdata = predealquesansdata[i].split('::')
            const hasrecord = await jobdealquestionModel.findOne().sort({_id:-1});
            var idcount=1;
            if(hasrecord) {
                idcount = parseInt(hasrecord._id) + 1;
            } 
            const createrec = jobdealquestionModel.create({_id:idcount,jobid:req.body.jobid,predealquestioncategory:allquesansdata[0],predealquestionid:allquesansdata[3],predealquestiontitle:allquesansdata[1],predealanswer:allquesansdata[2],isdealbreaker:allquesansdata[4]}, function(err,data,i){   
                if(err) return res.status(400).json({err}); 
                if((predealquesansdata.length - 1) == i) {
                    res.status(201).json({status:true, ques:data})
                }        
            })
            const allresult =  await Promise.all([createrec, hasrecord]);
        }
        
        const timer = ms => new Promise(res => setTimeout(res, ms))
        /*for (let i=0;i<predealquesdata.length;i++) {
        //for (var i=0;i<predealflagdata.length;i++){
            const hasrecord = await jobdealquestionModel.findOne().sort({_id:-1});
            if(hasrecord) {
                idcount = parseInt(hasrecord._id) + 1;
            } 
            var predealjobid =  req.body.jobid;
            var predealquesid = predealquesids[i];
            var predealques =  predealquesdata[i];            
            var predealans =  predealansdata[i];
            var predealansdbr =  predealbreaker[i];
           
            predealquestionModel.find({_id:idcount}).exec(function (err, doc) {
                doc.forEach(node => insertBatch(node,predealquesids[i],predealjobid,predealquesid,predealques,predealans,predealansdbr));
            });
            function insertBatch(doc,docid,jobid,quesid,ques,ansid,dealbreaker) { 
                doc._id =  docid;
                const cpyques =jobdealquestionModel.findOneAndUpdate({_id: docid, jobid: jobid, predealquestioncategory :0, predealquestionid: quesid, predealquestiontitle: ques, predealanswer: ansid, isdealbreaker: predealansdbr}, doc, {upsert: true,new: true}, function(err, doc1) {
                    //console.log(doc1);
                    if(err) return res.status(400).json({err});
                    if(previd == dealid) {
                        jobdealquestionModel.updateOne(
                            {'_id':docid},
                            {$set:{'isdealbreaker':dealbreaker}},{multi:true}
                        )
                    }
                });
            } 
            if(i==(predealquesids[i] - 1)) {            
                res.status(201).json({status:true, Message:'Updated Successfully'})   
            }   
            await timer(500);*/
        //} 
       
    },

    addcustomjobdealQuestions: async (req, res) => {
        const hasrecord = await jobdealquestionModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        } 
        jobdealquestionModel.create({_id:idcount,predealquestioncategory:req.body.predealquestioncategory,predealquestiontitle:req.body.predealquestiontitle,predealinputfields:req.body.predealinputfields,jobid:req.body.jobid}, function(err,data){   
            if(err) return res.status(400).json({err});        
            res.status(201).json({status:true, ques:data})
        })
    }
}