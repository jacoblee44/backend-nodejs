const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
//var mailer = require('./mailer');
//var nodemailer = require("nodemailer");
var common = require('./common');
const Cryptr = require('cryptr');
const dotenv = require('dotenv');
dotenv.config();
const sendGridMail = require('@sendgrid/mail');
const mailTemplate = require('../utils/mailTemplate');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//const monthlybilling =  require('./job');
//const jobapply =  require('./job');
const userSchema = new mongoose.Schema({
    _id: Number,
    firstname: String,
    lastname: String,
    displayname: String,
    email: String,
    password: String,
    accounttype:{ type: String, enum: ['employer', 'contractor'] },
    phone: String,
    companyname: String,
    numofemployees: String,
    heardaboutus: String,
    active: {type:Boolean,default:false},
    adminactive: {type:Boolean,default:true},
    isdeleted: {type:Boolean,default:false},
    twofactorauth: {type:Boolean,default:true},
    logintype: String,
    loginuniqid: String,
    priceperappln: Number,
    stripe_customer_id:String,
    stripe_card_id:String,
    stripe_card_type:String,
    otpcode: String,
    createddate: Date,
    activationexpiry: Date,
    isforgot: {type:Boolean,default:false}
});

const userModel = mongoose.model('user', userSchema)

const adminuserSchema = new mongoose.Schema({
    _id: Number,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    userrole:{ type: String, enum: ['admin', 'team members'] },
    createddate: Date,
    active: {type:Boolean,default:false},
    isdeleted: {type:Boolean,default:false},
    isforgot: {type:Boolean,default:false}
});

const adminuserModel = mongoose.model('adminuser', adminuserSchema)

const globalsettingsSchema = new mongoose.Schema({
    _id: Number,
    globalpricesetting: Number,
    createddate: Date
});

const globalsettingsModel = mongoose.model('globalsettings', globalsettingsSchema)

function getRandomInt() {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {

    userSchema:userModel,
    globalsettingsSchema:globalsettingsModel,
    
    globalsettingsCreate: async (req, res) => {
        const hasrecord = await globalsettingsModel.findOne().sort({_id:-1});
        var idcount=1;
        if(hasrecord) {
            idcount = parseInt(hasrecord._id) + 1;
        }
        if(req.body.priceid.length <= 0){
            globalsettingsModel.create({_id:idcount, globalpricesetting:req.body.amount, createddate:new Date()}, async function(err,data){
                if(err) return res.status(400).json({err});
                res.status(201).json({status:true, global:data._id})
            })
        } else {
            const data = await globalsettingsModel.updateOne(
                {'_id':req.body.priceid},
                {$set:{'globalpricesetting':req.body.amount}},{multi:true}
            );                         
            res.status(201).json({status:true, message:"Global setting data updated successfully"})
        }
    },

    getglobalprice:  async (req, res) => { 
        const result = await globalsettingsModel.find({_id:1});
        if(!result) { return res.status(422).json({message : "Invalid Global Price...!"}) }
        if(result) {           
            res.status(201).json({status:true, priceid:result[0].globalpricesetting})
        }      
    },

    create: async (req, res) => {
        //console.log(req.body.pass+' password');   
        if((typeof req.body.email === "undefined") || (typeof req.body.pass === "undefined") || (req.body.email.length == 0) ||  (req.body.pass.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const checkexisting = await userModel.findOne({email:req.body.email});
        if(checkexisting) {
            return res.status(422).json({message : "User already exists...!"})
        } else {
            var currdate = new Date();
            var expDate = new Date(Date.now() + 24*60*60*1000);
            console.log(currdate +'/'+ expDate);
            const salt = await bcrypt.genSalt(10);
            const hasrecord = await userModel.findOne().sort({_id:-1});
            var idcount=1;
            if(hasrecord) {
                idcount = parseInt(hasrecord._id) + 1;
            }

            const cryptr = new Cryptr('myTotalySecretKey');
            let email = req.body.email;
            let encryptdEmail = cryptr.encrypt(email);

            if((typeof req.body.accounttype === "undefined") || (req.body.accounttype == "")) {
                var accounttype = "contractor";
            } else {
                var accounttype = req.body.accounttype;
            }
            
            userModel.create({_id:idcount, email:req.body.email, password:await bcrypt.hash(req.body.pass, salt), accounttype:accounttype, createddate:currdate, activationexpiry:expDate, displayname:req.body.email}, async function(err,data){
                if(err) return res.status(400).json({err});
                /*var transporter = nodemailer.createTransport({                   
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                    user: "a9c83ee405012d",
                    pass: "e0d3ad0ec4d32d"
                    }
                });

                var subject = "Email confirmation link from Dayratework";
                var bodymessage = "Hi User, <br /><br />Please click this link for confirm your Email Address: <a href='"+req.body.url+encryptdEmail+"' target=_blank style='text-decoration:underline;'>Click Here</a><br /><br />This link is valid only for 24hours";

                mailer.sendConfirmationEmail(
                    'devcastouri@gmail.com',
                    req.body.email,
                    bodymessage,
                    subject,
                    transporter,
                    res
                );*/
                try {
                    const body = mailTemplate({
                        title: "Verify your email address",
                        content: "Hello, <br /><br />To finish setting up your DayRateWork account, we just need to make sure that this email address is yours.<br>To verify your email address, please click on the button.<br />If you didn't create an account, you can safely ignore this email.<br><br>Thanks,<br>DayRateWork Team.",
                        button: {
                            text: "Verify email",
                            link: req.body.url+encryptdEmail
                        }
                    })
                    const obj = {
                      to:  req.body.email,
                      from: 'noreply@dayratework.com',
                      fromname: 'Dayratework',
                      subject: 'Verify your email address',
                      text: body,
                      html: `<strong>${body}</strong>`,
                    };
                    await sendGridMail.send(obj);
                    res.status(201).json({status:true, user:{_id:data._id,email:data.email}})  //,activationurl:req.body.url+encryptdEmail
                  } catch (error) {
                    if (error.response) {
                      return res.status(422).json({message : "Unable to send email."})
                    }
                  }
    
                
            })
        }
    },

    admincreate: async (req, res) => {
        //console.log(req.body.pass+' password');   
        if((typeof req.body.email === "undefined") || (typeof req.body.pass === "undefined") || (req.body.email.length == 0) ||  (req.body.pass.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const checkexisting = await adminuserModel.findOne({email:req.body.email});
        if(checkexisting) {
            return res.status(422).json({message : "User already exists...!"})
        } else {
            var currdate = new Date();
            var expDate = new Date(Date.now() + 24*60*60*1000);

            const salt = await bcrypt.genSalt(10);
            const hasrecord = await adminuserModel.findOne().sort({_id:-1});
            var idcount=1;
            if(hasrecord) {
                idcount = parseInt(hasrecord._id) + 1;
            }

            /*const cryptr = new Cryptr('myTotalySecretKey');
            let email = req.body.email;
            let encryptdEmail = cryptr.encrypt(email);*/

            if((typeof req.body.userrole === "undefined") || (req.body.userrole == "")) {
                var userrole = "admin";
            } else {
                var userrole = req.body.userrole;
            }

            var lurl = req.body.url;
            
            adminuserModel.create({_id:idcount, email:req.body.email, password:await bcrypt.hash(req.body.pass, salt), userrole:userrole, firstname:req.body.firstname, lastname:req.body.lastname, createddate:currdate}, async function(err,data){ 
                if(err) return res.status(400).json({err});
                
                res.status(201).json({status:true, user:{_id:data._id,email:data.email}})
                /*try {
                    const body =  "Hi User, <br /><br />We're pleased to welcome you to DayRateWork.<br>Your user name is "+req.body.email+" and password is "+req.body.pass+".<br>You can access your personal information and job preferences by visiting your <a href='"+lurl+"' target=_blank style='text-decoration:underline;'>user profile link</a><br />All the best in your search.<br><br>Thanks,<br>DayRateWork Team.";
                    const obj = {
                      to:  email,
                      from: 'noreply@dayratework.com',
                      fromname: 'Dayratework',
                      subject: 'WELCOME to Dayratework',
                      text: body,
                      html: `<strong>${body}</strong>`,
                    };
                    await sendGridMail.send(obj);
                } catch (error) {
                    if (error.response) {
                        return res.status(422).json({message : "Unable to send email."})
                    }
                }*/
    
                
            })
        }
    },

    adminUpdate:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await adminuserModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            
            const data = await adminuserModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'firstname':req.body.firstname,'lastname':req.body.lastname,'email':req.body.email}},{multi:true}
            );                         
            res.status(201).json({status:true, message:"User updated successfully"})
           
        }      
    },

    getadminUser:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await adminuserModel.findOne({_id:req.body.userid},{ password: 0, active: 0, isdeleted: 0, isforgot:0 });
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {           
            res.status(201).json({status:true, adminuser:result})
        }      
    },

    getalladminUser: async (req, res) => {
        //console.log(req.params._limit)
        var limit = parseInt(req.params._limit);
        var page = parseInt(req.params._page);
        if(page == 1) {
            var skiping = 0;
        } else {
            var skiping = limit * (page - 1); 
        }
        //var skip = (req.params._limit * req.params._page) - 1;
        const resultcnt = await adminuserModel.find({isdeleted:false},{ password: 0, active: 0, isdeleted: 0, isforgot:0 });
        const result = await adminuserModel.find({isdeleted:false},{ password: 0, active: 0, isdeleted: 0, isforgot:0 }).limit(limit).skip(skiping);
        if(!result) { return res.status(422).json({message : "Users are not Available...!"}) }
        res.setHeader('x-total-count', resultcnt.length)
        res.status(201).json(result)
    },

    /*getalluserBilling: async (req, res) => { 
        var limit = parseInt(req.params._limit);
        var page = parseInt(req.params._page);
        var skiping = limit * (page - 1); 

        var today = new Date();
        var fdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01T00:00:00.000Z');
        var lastDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var tdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+lastDate.getDate()+"T23:59:59.000Z");
        
        const resultcnt = await userModel.find({isdeleted:false,accounttype:'employer',isdeleted:false},{ password: 0, active: 0, isdeleted: 0, isforgot:0 });
        const userbilling = await userModel.aggregate([ 
            {
                $lookup: {
                    from: 'monthlybillings',
                    localField: '_id',
                    foreignField: 'userid',
                    pipeline: [ 
                        { "$match": {"status":"paid"}},
                        { "$sort": {
                           paymentdate: -1
                        }}
                      ],
                    as: 'usrbilling'
                }
            },
            {
                $lookup: {
                    from: 'jobapplies',
                    localField: '_id',
                    foreignField: 'userid',
                    pipeline: [
                        { "$match": {$and:[{"applieddate":{$gte:fdate}}, {"applieddate":{$lte:tdate}}]}},
                        {$sort: {
                           applieddate: -1
                        }}
                     ],
                    as: 'currentmonthbilling'
                }
            },
            { "$match": {"accounttype":'employer','isdeleted':false}},{"$skip":skiping},{"$limit":limit},{ $unset: [ "password", "isdeleted", "isforgot","otpcode", "twofactorauth" ] }
            
        ]);
        if(!userbilling) { return res.status(422).json({message : "Monthly s is not Available...!"}) }
        console.log(resultcnt.length)
        res.setHeader('x-total-count', resultcnt.length)           
        res.status(201).json(userbilling)        
    },*/

    getallcontractorList: async (req, res) => { 
        var limit = parseInt(req.params._limit);
        var page = parseInt(req.params._page);
        var skiping = limit * (page - 1); 

        var today = new Date();
        var fdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01T00:00:00.000Z');
        var lastDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var tdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+lastDate.getDate()+"T23:59:59.000Z");
        
        const resultcnt = await userModel.find({isdeleted:false,accounttype:'contractor',isdeleted:false},{ password: 0, active: 0, isdeleted: 0, isforgot:0 });
        const conbilling = await userModel.aggregate([ 
           /* {
                $lookup: {
                    from: 'monthlybillings',
                    localField: '_id',
                    foreignField: 'userid',
                    pipeline: [ 
                        { "$match": {"status":"paid"}},
                        { "$sort": {
                           paymentdate: -1
                        }}
                      ],
                    as: 'usrbilling'
                }
            },
            {
                $lookup: {
                    from: 'jobapplies',
                    localField: '_id',
                    foreignField: 'userid',
                    pipeline: [
                        { "$match": {$and:[{"applieddate":{$gte:fdate}}, {"applieddate":{$lte:tdate}}]}},
                        {$sort: {
                           applieddate: -1
                        }}
                     ],
                    as: 'currentmonthbilling'
                }
            },*/
            { "$match": {"accounttype":'contractor','isdeleted':false}},{"$skip":skiping},{"$limit":limit},{ $unset: [ "password", "isdeleted", "isforgot","otpcode", "twofactorauth" ] }
            
        ]);
        if(!conbilling) { return res.status(422).json({message : "Monthly s is not Available...!"}) }
        console.log(resultcnt.length)
        res.setHeader('x-total-count', resultcnt.length)           
        res.status(201).json(conbilling)        
    },

    deleteadminUser:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await adminuserModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await adminuserModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'isdeleted':true}},{multi:true}
            ); 

            res.status(201).json({status:true, message:"User Deleted Succesfully"})
        }     
    },

    deleteempUser:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'isdeleted':true}},{multi:true}
            ); 

            res.status(201).json({status:true, message:"User Deleted Succesfully"})
        }     
    },

    adminupdatePassword:  async (req, res) => {  
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0) || (typeof req.body.opass === "undefined") || (req.body.opass.length == 0)|| (typeof req.body.npass === "undefined") || (req.body.npass.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await adminuserModel.findOne({_id:req.body.userid});
        const salt = await bcrypt.genSalt(10);
        const password= await bcrypt.hash(req.body.npass, salt);
        
        //const checkPass = bcrypt.compare(req.body.opass,result.password);
        bcrypt.compare(req.body.opass, result.password, async function(err, checkPass) {
            if (err) {
                console.log('Error while checking password');
            } else if (checkPass) {
                const data = await adminuserModel.updateOne(
                    {'_id':req.body.userid},
                    {$set:{'password':password}},{multi:true}
                );   
                res.status(201).json({status:true, message:"Password changed successfully"})
            } else {                
                return res.status(422).json({message : "Old Password is not matching!"});
            }
        });
         
    },

    adminforgotPassword:  async (req, res) => {  
        if((typeof req.body.email === "undefined") || (req.body.email.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await adminuserModel.findOne({email:req.body.email,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await adminuserModel.updateOne(
                {'email':req.body.email},
                {$set:{'isforgot':true}},{multi:true}
            ); 
            const cryptr = new Cryptr('myTotalySecretKey');
            let email = req.body.email;
            let encryptdEmail = cryptr.encrypt(email);
            
            try {
                const body = mailTemplate({
                    title: "Forgot Password - Email confirmation link from Dayratework",
                    content: "Hi User, <br /><br />Please click the button below to confirm your Email Address.<br /><br />",
                    button: {
                        text: "Confirm Email",
                        link: req.body.url+encryptdEmail
                    }
                })
                const obj = {
                  to:  req.body.email,
                  from: "noreply@dayratework.com",
                  fromname: 'Dayratework',
                  subject: "Forgot Password - Email confirmation link from Dayratework",
                  text: body,
                  html: `<strong>${body}</strong>`,
                };
                await sendGridMail.send(obj);
            } catch (error) {
                if (error.response) {
                    return res.status(422).json({message : "Unable to send email."})
                }
            }

            res.status(201).json({status:true, message:'Forgot Password Confirmation link send to your Email Address'})
        }
    },
    adminforgetPasswordconfirmation:  async (req, res) => {
        if((typeof req.body.encdata === "undefined") || (req.body.encdata.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const cryptr = new Cryptr('myTotalySecretKey');
        let decryptdEmail = cryptr.decrypt(req.body.encdata) 
        const result = await adminuserModel.findOne({email:decryptdEmail});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            if(result.isforgot) {
                const salt = await bcrypt.genSalt(10);
                const password= await bcrypt.hash(req.body.fpass, salt);
                const data = await adminuserModel.updateOne(
                    {'email':decryptdEmail},
                    {$set:{'password':password,isforgot:false}},{multi:true}
                );           
                res.status(201).json({status:true, message:"password updated successfully"})
            } else {
                res.status(422).json({status:false, message:"Link expired. please try again"})
            }
        }
    },

    getuserBilling: async (req, res) => {  
        var today = new Date();
        var fdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01T00:00:00.000Z');
        var lastDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var tdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+lastDate.getDate()+"T23:59:59.000Z");
        const userbilling = await userModel.aggregate([ 
            {
                $lookup: {
                    from: 'monthlybillings',
                    localField: '_id',
                    foreignField: 'userid',
                    as: 'usrbilling'
                }
            }, {
                $unwind: {
                path: "$usrbilling",
                preserveNullAndEmptyArrays: true
                }
            },
            { "$match": {$and:[{"usrbilling.paymentdate":{$gte:fdate}}, {"usrbilling.paymentdate":{$lte:tdate}}]}},
            
        ],{ password: 0, active: 0, isdeleted: 0, isforgot:0, otpcode:0, twofactorauth:0 });
        if(!userbilling) { return res.status(422).json({message : "Monthly bill is not Available...!"}) }            
        res.status(201).json({status:true, ubilling:userbilling})         
    },

    getallbillingAmount: async (req, res) => { 
        const totalpaidamount = await monthlybilling.monthlybillingSchema.aggregate([   
            { "$match": {"status":{$eq:'paid'}}},        
            {               
                $group: { 
                    "_id":"",
                    "amount":{$sum:"$amount"}
                }
            },
            {
                $project: {
                   _id: 0,
                   "TotalAmount": '$amount'
                } 
            }        
        ]);
        if(!totalpaidamount) { return res.status(422).json({message : "Total Amount is not Available...!"}) }
        res.status(201).json({status:true, totalamount:totalpaidamount})
    },

    /*getcurmnthbillingAmount: async (req, res) => { 
        var today = new Date();
        var fdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-01T00:00:00.000Z');
        var lastDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var tdate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+lastDate.getDate()+"T23:59:59.000Z");
        const curmnthtotalpaidamount = await jobapply.jobapplySchema.aggregate([  
            { "$match": {$and:[{"applieddate":{$gte:fdate}}, {"applieddate":{$lte:tdate}}]}},        
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } }          
        ]);
        if(!curmnthtotalpaidamount) { return res.status(422).json({message : "Total Amount is not Available...!"}) }
        res.status(201).json({status:true, totalamount:curmnthtotalpaidamount})
    },*/

    getallpendingAmountcnt: async (req, res) => {
        const cntpendingamount = await monthlybilling.monthlybillingSchema.aggregate([  
            { "$match": {"status":{$ne:'paid'}}},         
            {               
                $group: { 
                    "_id":"",
                    "amount": { $sum: "$amount" }
                }
            },
            {
                $project: {
                   _id: 0,
                   "TotalAmount": '$amount'
                } 
            }      
        ]);
        if(!cntpendingamount) { return res.status(422).json({message : "Pending List is not Available...!"}) }
        res.status(201).json({status:true, totalamount:cntpendingamount})
    },

    getallFacebookusercnt: async (req, res) => {
        const fbusercnt = await userModel.aggregate([  
            { "$match": {"logintype":'Facebook'}},
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } }                      
        ]);
        if(!fbusercnt) { return res.status(422).json({message : "Facebook users are not Available...!"}) }
        res.status(201).json({status:true, usercnt:fbusercnt})
    },

    getallGoogleusercnt: async (req, res) => {
        const googusercnt = await userModel.aggregate([  
            { "$match": {"logintype":'Google'}},
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } }                   
        ]);
        if(!googusercnt) { return res.status(422).json({message : "Goolge users are not Available...!"}) }
        res.status(201).json({status:true, usercnt:googusercnt})
    },

    getAllusercnt: async (req, res) => {
        const allusercnt = await userModel.aggregate([ 
            { "$match": {"accounttype":'employer',"active":true,"isdeleted":false}}, 
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } }         
        ]);
        if(!allusercnt) { return res.status(422).json({message : "Users are not Available...!"}) }
        res.status(201).json({status:true, usercnt:allusercnt})
    },
    
    isuserActive: async (req, res) => {        
        try {
            const data = await userModel.updateOne(
            {'_id':req.body.userid},
            {$set:{'adminactive':req.body.active}},{multi:true}
            )
            res.status(201).json({status:true, userid:req.body.userid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },
    
    employerpriceUpdate: async (req, res) => {        
        try {
            const data = await userModel.updateOne(
            {'_id':req.body.userid},
            {$set:{'priceperappln':req.body.amount}},{multi:true}
            )
            res.status(201).json({status:true, message:"Price Updated Successfully", userid:req.body.userid})
        } catch(e) {
            return res.status(400).json({e}); 
        }
    },

    createSSO: async (req, res) => { 
        if((typeof req.body.email === "undefined") || (req.body.email.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await userModel.findOne({email:req.body.email});//,logintype: req.body.logintype
        var accounttype = "";
        if(!result) {
            const hasrecord = await userModel.findOne().sort({_id:-1});
            var idcount=1;
            if(hasrecord) {
                idcount = parseInt(hasrecord._id) + 1;
            } 

            if((typeof req.body.accounttype === "undefined") || (req.body.accounttype == "")) {
                accounttype = "contractor";
            } else {
                accounttype = req.body.accounttype;
            }
            
            userModel.create({_id:idcount, email:req.body.email, accounttype:accounttype, logintype:req.body.logintype, loginuniqid:req.body.loginuniqid, active:true, displayname:req.body.email}, function(err,data){  
                if(err) return res.status(400).json({err});
                const _payload = {
                    userid: idcount,
                    email: req.body.email
                }; 
                var authtoken = common.generateJwt(_payload);        
                res.status(201).json({status:true, userid:idcount, token:authtoken})
            }) 
           
        } else {
            const _payload = {
                userid: result._id,
                email: req.body.email
            };
            var authtoken = common.generateJwt(_payload);
            res.status(201).json({status:true, userid:result._id, token:authtoken})
        }
    },
    
    loginUser: async (req, res) => { 
        if((typeof req.body.email === "undefined") || (typeof req.body.pass === "undefined") || (req.body.email.length == 0) ||  (req.body.pass.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await userModel.findOne({email:req.body.email, active:true, isdeleted:false, password:{$exists:true}});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        const checkPass = await bcrypt.compare(req.body.pass,result.password);
        if(!checkPass || result.email !== req.body.email ) {
            return res.status(422).json({message : "Invalid username or password...!"})  
        }

        if(result.twofactorauth == true) {

            var otpcode = getRandomInt();
            const data = await userModel.updateOne(
                {'email':req.body.email},
                {$set:{'otpcode':otpcode}},{multi:true}
            ); 
           /*var transporter = nodemailer.createTransport({                   
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                user: "a9c83ee405012d",
                pass: "e0d3ad0ec4d32d"
                }
            });

            var subject = "OTP Confirmation Code for Authentication from Dayratework"
            var bodymessage = "Please apply this OTP Code for Authentication: "+otpcode;

            mailer.sendConfirmationEmail(
                'devcastouri@gmail.com',
                req.body.email,
                bodymessage,
                subject,
                transporter,
                res
            );*/

            try {
                const body = mailTemplate({
                    title: "OTP Confirmation Code for Authentication from Dayratework",
                    content: "Please apply this OTP Code for Authentication: "+otpcode
                })
                const obj = {
                  to:  req.body.email,
                  from: 'noreply@dayratework.com',
                  fromname: 'Dayratework',
                  subject: 'OTP Confirmation Code for Authentication from Dayratework',
                  text: body,
                  html: `<strong>${body}</strong>`,
                };
                await sendGridMail.send(obj);
            } catch (error) {
                if (error.response) {
                    return res.status(422).json({message : "Unable to send email."})
                }
            }

            res.status(201).json({status:true, message : "OTP send to your email address", user:{_id:result._id,email:result.email}})  //,otpcode:otpcode
        } else {             
            const _payload = {
                userid: result._id,
                email: req.body.email
            };
            
            var authtoken = common.generateJwt(_payload);

            res.status(201).json({status:true, token:authtoken, user:{_id:result._id,email:result.email,accounttype:result.accounttype}})
        }     
    },

    adminloginUser: async (req, res) => { 
        if((typeof req.body.email === "undefined") || (typeof req.body.pass === "undefined") || (req.body.email.length == 0) ||  (req.body.pass.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await adminuserModel.findOne({email:req.body.email, active:true, isdeleted:false, password:{$exists:true}});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }

        const checkPass = await bcrypt.compare(req.body.pass,result.password);
        if(!checkPass || result.email !== req.body.email ) {
            return res.status(422).json({message : "Invalid username or password...!"})  
        }                     
        const _payload = {
            userid: result._id,
            email: req.body.email
        };
        
        var authtoken = common.generateJwt(_payload);
        res.status(201).json({status:true, token:authtoken, user:{_id:result._id,email:result.email,userrole:result.userrole}})
    },

    resendOTP: async (req, res) => {  
        if((typeof req.body.email === "undefined") || (req.body.email.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }         
        const result = await userModel.findOne({email:req.body.email});
        if(!result) { return res.status(422).json({message : "Invalid user...!"}) }

        var otpcode = getRandomInt();
        const data = await userModel.updateOne(
            {'email':req.body.email},
            {$set:{'otpcode':otpcode}},{multi:true}
        ); 
        /*var transporter = nodemailer.createTransport({                   
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "a9c83ee405012d",
            pass: "e0d3ad0ec4d32d"
            }
        });

        var subject = "OTP Confirmation Code for Authentication from Dayratework"
        var bodymessage = "Please apply this OTP Code for Authentication: "+otpcode;

        mailer.sendConfirmationEmail(
            'devcastouri@gmail.com',
            req.body.email,
            bodymessage,
            subject,
            transporter,
            res
        );*/

          try {
            const body = mailTemplate({
                title: 'OTP Confirmation Code for Authentication from Dayratework',
                content: "Please apply this OTP Code for Authentication: "+otpcode
            })
            const obj = {
              to:  req.body.email,
              from: 'noreply@dayratework.com',
              fromname: 'Dayratework',
              subject: 'OTP Confirmation Code for Authentication from Dayratework',
              text: body,
              html: `<strong>${body}</strong>`,
            };
            await sendGridMail.send(obj);
          } catch (error) {
            if (error.response) {
              return res.status(422).json({message : "Unable to send email."})
            }
          }

        res.status(201).json({status:true, message : "OTP send to your email address", user:{_id:result._id,email:result.email}})       
    },
    otpCheck:  async (req, res) => { 
        if((typeof req.body.email === "undefined") || (req.body.email.length == 0) || (typeof req.body.otpcode === "undefined") || (req.body.otpcode.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await userModel.findOne({otpcode:req.body.otpcode,email:req.body.email});
        if(!result) { return res.status(422).json({message : "Invalid OTPcode...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'email':req.body.email},
                {$set:{'otpcode':''}},{multi:true}
            );
            const _payload = {
                userid: result._id,
                email: req.body.email
            };            
            var authtoken = common.generateJwt(_payload);

            res.status(201).json({status:true, token:authtoken, user:{_id:result._id,email:result.email,accounttype:result.accounttype}})
        }      
    },
    activateUser:  async (req, res) => {
        
        if((typeof req.body.encdata === "undefined") || (req.body.encdata.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }

        const cryptr = new Cryptr('myTotalySecretKey');
        let decryptdEmail = cryptr.decrypt(req.body.encdata) 
        const gresult = await userModel.findOne({email:decryptdEmail});
        if(gresult.active == false) {   
            const result = await userModel.findOne({email:decryptdEmail,activationexpiry:{$gte:new Date()}});
            if(result) { 
                const data = await userModel.updateOne(
                    {'email':decryptdEmail},
                    {$set:{'active':true,'activationexpiry':''}},{multi:true}
                ); 
                res.status(201).json({status:true, message:'Your Account activated successfully'})
            } else {            
                const cryptr = new Cryptr('myTotalySecretKey');
                let email = decryptdEmail;
                let encryptdEmail = cryptr.encrypt(email);

                const data = await userModel.updateOne(
                    //{'email':req.body.email},
                    {'email':email},
                    {$set:{'activationexpiry':new Date(Date.now() + 24*60*60*1000)}},{multi:true}
                ); 

                /*var transporter = nodemailer.createTransport({                   
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                    user: "a9c83ee405012d",
                    pass: "e0d3ad0ec4d32d"
                    }
                });

                var subject = "Email confirmation link from Dayratework";
                var bodymessage = "Hi User, <br /><br />Please click this link for confirm your Email Address: <a href='"+req.body.url+encryptdEmail+"' target=_blank style='text-decoration:underline;'>Click Here</a><br /><br />This link is valid only for 24hours";

                mailer.sendConfirmationEmail(
                    'devcastouri@gmail.com',
                    email,
                    bodymessage,
                    subject,
                    transporter,
                    res
                );*/
                
                var lurl = "/employee/profile";
                if(gresult.accounttype == 'employer') {
                    lurl = "/employer-account";
                } 

                try {
                    const body = mailTemplate({
                        title: 'WELCOME to Dayratework',
                        content: "Hi User, <br /><br />We're pleased to welcome you to DayRateWork.<br>Your user name is "+email+" and gives you access to the latest contract jobs.<br>PYou can access your personal information and job preferences by visiting your user profile link</a><br />All the best in your search.<br><br>Thanks,<br>DayRateWork Team.",
                        button: {
                            text: "Profile",
                            link: req.body.url+lurl
                        }
                    })
                    const obj = {
                      to:  email,
                      from: 'noreply@dayratework.com',
                      fromname: 'Dayratework',
                      subject: 'WELCOME to Dayratework',
                      text: body,
                      html: `<strong>${body}</strong>`,
                    };
                    await sendGridMail.send(obj);
                } catch (error) {
                    if (error.response) {
                        return res.status(422).json({message : "Unable to send email."})
                    }
                }

                
                res.status(422).json({status:false, message:"Link expired. please check your email for new activation link"})
                
            }
        } else {
            res.status(422).json({status:false, message:"Invalid Activation Link"})
        }
            
    },
    deleteUser:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'isdeleted':true}},{multi:true}
            ); 

            res.status(201).json({status:true, message:"User Deleted Succesfully"})
        }      
    },
    createEmployer:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const customer = await stripe.customers.create({
                name: req.body.firstname+' '+req.body.lastname,
                email: result.email,
                phone: req.body.phone
            });  
            if(customer) {
                const data = await userModel.updateOne(
                    {'_id':req.body.userid},
                    {$set:{'firstname':req.body.firstname,'lastname':req.body.lastname,'numofemployees':req.body.numofemployees,'companyname':req.body.companyname,'phone':req.body.phone,'heardaboutus':req.body.heardaboutus,'stripe_customer_id':customer.id, 'displayname':req.body.firstname+' '+req.body.lastname}},{multi:true}
                );                         
                res.status(201).json({status:true, message:"Account Type updated successfully"})
            } else {
                return res.status(422).json({message : "Unable to create stripe account...!"}) 
            }
        }      
    }, 
    getUser:  async (req, res) => { 
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }          
        const result = await userModel.findOne({_id:req.body.userid},{ password: 0, active: 0, isdeleted: 0, isforgot:0, activationexpiry:0, otpcode:0 });
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {           
            res.status(201).json({status:true, user:result})
        }      
    },
    updateAccounttype:  async (req, res) => {   
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }        
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'accounttype':req.body.accounttype}},{multi:true}
            );           
            res.status(201).json({status:true, message:"Account Type updated successfully"})
        }      
    },
    updateAccountname:  async (req, res) => {  
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }         
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'firstname':req.body.firstname, 'lastname':req.body.lastname, 'displayname':req.body.firstname+' '+req.body.lastname}},{multi:true}
            );           
            res.status(201).json({status:true, message:"User Name Updated Successfully"})
        }      
    },
    updateEmail:  async (req, res) => {  
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        console.log(req.body.email);
        if(result) {             
            const result1 = await userModel.find({email:req.body.email});
            if(result1.length > 0) { return res.status(422).json({message : "Email ID already exists"}) }

            const cryptr = new Cryptr('myTotalySecretKey');
            let email = req.body.email+'::'+result.email;
            let encryptdEmail = cryptr.encrypt(email);

            try {
                const body = mailTemplate({
                    title: 'Email address change confirmation link from Dayratework',
                    content: "Hi User, <br /><br />Please click the button below for confirm your Email Address.<br />",
                    button: {
                        text: "Confirm Email",
                        link: req.body.url+encryptdEmail
                    }
                })
                const obj = {                  
                  //to:  "devcastouri@gmail.com",
                  to:  req.body.email,
                  from: 'noreply@dayratework.com',
                  fromname: 'Dayratework',
                  subject: 'Email address change confirmation link from Dayratework',
                  text: body,
                  html: `<strong>${body}</strong>`,
                };
                await sendGridMail.send(obj);
                res.status(201).json({status:true, message:"Verification Email sent successfully"})
            } catch (error) {
                if (error.response) {
                    return res.status(422).json({message : "Unable to send email."})
                }
            }

            /*const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'email':req.body.email}},{multi:true}
            );           
            res.status(201).json({status:true, message:"Email updated successfully"})*/
        }      
    },

    updateEmailconfirmation:  async (req, res) => {
        if((typeof req.body.encdata === "undefined") || (req.body.encdata.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const cryptr = new Cryptr('myTotalySecretKey');
        let decryptdEmail = cryptr.decrypt(req.body.encdata);
        var emails = decryptdEmail.split('::'); 
        
        console.log(JSON.stringify(emails));
        const result = await userModel.findOne({email:emails[1]});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            if(result.email) {
                const data = await userModel.updateOne(
                    {'email':emails[1]},
                    {$set:{'email':emails[0]}},{multi:true}
                );           
                res.status(201).json({status:true, message:"Email updated successfully"})
            } else {
                res.status(422).json({status:false, message:"Link expired. please try again"})
            }
        }
    },

    updatePassword:  async (req, res) => {  
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0) || (typeof req.body.opass === "undefined") || (req.body.opass.length == 0)|| (typeof req.body.npass === "undefined") || (req.body.npass.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await userModel.findOne({_id:req.body.userid});
        const salt = await bcrypt.genSalt(10);
        const password= await bcrypt.hash(req.body.npass, salt);
        bcrypt.compare(req.body.opass, result.password, async function(err, checkPass) {
            if (err) {
                console.log('Error while checking password');
            } else if (checkPass) {
                const data = await adminuserModel.updateOne(
                    {'_id':req.body.userid},
                    {$set:{'password':password}},{multi:true}
                );   
                res.status(201).json({status:true, message:req.body.userid})
            } else {                
                return res.status(422).json({message : "Old Password is not matching!"});
            }
        });

        /*const checkPass = bcrypt.compare(req.body.opass,result.password);

        if(!checkPass ) {  // || result.email !== req.body.email
            return res.status(422).json({message : "Old Password is not matching!"});
        } else {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'password':password}},{multi:true}
            );           
            res.status(201).json({status:true, message:"Password Updated Successfully"})
        } */
    },
    updatePhone:  async (req, res) => {  
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }         
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'phone':req.body.phone}},{multi:true}
            );           
            res.status(201).json({status:true, message:"Phone Number Updated Successfully"})
        }      
    },
    update2FA:  async (req, res) => {   
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }               
        const result = await userModel.findOne({_id:req.body.userid});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'_id':req.body.userid},
                {$set:{'twofactorauth':req.body.twofactorauth}},{multi:true}
            );           
            res.status(201).json({status:true, message:"2FA Authentication Updated Successfully"})
        }      
    }, 
    forgotPassword:  async (req, res) => {  
        if((typeof req.body.email === "undefined") || (req.body.email.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await userModel.findOne({email:req.body.email,isdeleted:false});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            const data = await userModel.updateOne(
                {'email':req.body.email},
                {$set:{'isforgot':true}},{multi:true}
            ); 
            const cryptr = new Cryptr('myTotalySecretKey');
            let email = req.body.email;
            let encryptdEmail = cryptr.encrypt(email);
            
            /*var transporter = nodemailer.createTransport({                   
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                user: "a9c83ee405012d",
                pass: "e0d3ad0ec4d32d"
                }
            });
    
            var subject = "Forgot Password - Email confirmation link from Dayratework";
            var bodymessage = "Hi User, <br /><br />Please click this link for confirm your Email Address: <a href='"+req.body.url+encryptdEmail+"' target=_blank style='text-decoration:underline;'>Click Here</a><br /><br />";
    
            mailer.sendConfirmationEmail(
                'devcastouri@gmail.com',
                email,
                bodymessage,
                subject,
                transporter
            );*/
            
            try {
                const body = mailTemplate({
                    title: "Forgot Password - Email confirmation link from Dayratework",
                    content: "Hi User, <br /><br />Please click the button below for confirm your Email Address.<br /><br />",
                    button: {
                        text: "Confirm Email",
                        link: req.body.url+encryptdEmail
                    }
                })
                const obj = {
                  to:  req.body.email,
                  from: "noreply@dayratework.com",
                  fromname: 'Dayratework',
                  subject: "Forgot Password - Email confirmation link from Dayratework",
                  text: body,
                  html: `<strong>${body}</strong>`,
                };
                await sendGridMail.send(obj);
            } catch (error) {
                if (error.response) {
                    return res.status(422).json({message : "Unable to send email."})
                }
            }

            res.status(201).json({status:true, message:'Forgot Password Confirmation link send to your Email Address'})
        }
    },
    forgetPasswordconfirmation:  async (req, res) => {
        if((typeof req.body.encdata === "undefined") || (req.body.encdata.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const cryptr = new Cryptr('myTotalySecretKey');
        let decryptdEmail = cryptr.decrypt(req.body.encdata) 
        const result = await userModel.findOne({email:decryptdEmail});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        if(result) {
            if(result.isforgot) {
                const salt = await bcrypt.genSalt(10);
                const password= await bcrypt.hash(req.body.fpass, salt);
                const data = await userModel.updateOne(
                    {'email':decryptdEmail},
                    {$set:{'password':password,isforgot:false}},{multi:true}
                );           
                res.status(201).json({status:true, message:"password updated successfully"})
            } else {
                res.status(422).json({status:false, message:"Link expired. please try again"})
            }
        }
    },
    updatestripeCard:  async (req, res) => {
        if((typeof req.body.userid === "undefined") || (req.body.userid.length == 0)) {
            return res.status(422).json({message : "Invalid input values...!"})
        }
        const result = await userModel.findOne({_id:req.body.userid,stripe_customer_id:{$ne:null},isdeleted:false});
        if(!result) { return res.status(422).json({message : "Invalid User...!"}) }
        var fresh = 1;
        
        if((result.stripe_card_id !== "" && (typeof result.stripe_card_id !== "undefined"))) {
            const retrievecard = await stripe.customers.retrieveSource(
                result.stripe_customer_id,
                result.stripe_card_id
            );
            
            if(retrievecard.last4 == req.body.ccnumber.substr(-4, 4)){
                const card = await stripe.customers.updateSource(
                    result.stripe_customer_id,
                    result.stripe_card_id,
                    {
                        exp_month: req.body.expmonth,
                        exp_year: req.body.expyear,
                        name:req.body.firstname+' '+req.body.lastname,
                        address_zip:req.body.address_zip,
                        address_country:req.body.address_country
                    }
                );
                fresh = 0;
                res.status(201).json({status:true, message:"Account Updated successfully"})
            }
        }

        if(fresh == 1) {
            const token = await stripe.tokens.create({
                card: {
                number: req.body.ccnumber,
                exp_month: req.body.expmonth,
                exp_year: req.body.expyear,
                cvc: req.body.cvc,
                name:req.body.firstname+' '+req.body.lastname,
                address_zip:req.body.address_zip,
                address_country:req.body.address_country
                },
            });
            
            const card = await stripe.customers.createSource(
                result.stripe_customer_id,
                { source: token.id }
            );
            if(card) {
                const data = await userModel.updateOne(
                    {'_id':req.body.userid},
                    {$set:{'stripe_card_id':card.id,'stripe_card_type':req.body.card_type}},{multi:true}
                );                         
                res.status(201).json({status:true, message:"Account Added successfully"})
            } else {
                return res.status(422).json({message : "Unable to create stripe account...!"}) 
            }
        }
    },

    creditpackagestripePayment: async (req, res) => {         
        const result = await userModel.findOne({_id:req.body.userid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "User is not Available...!"}) }
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: 'usd',
                payment_method_types: ['card'],
                customer: result.stripe_customer_id,
                payment_method: result.stripe_card_id,
                confirm:true
              });
              res.status(201).json({status:true, payment:paymentIntent})
        } catch (e) {
            switch (e.type) {
                case 'StripeCardError':
                //console.log(`A payment error occurred: ${e.message}`);
                return res.status(422).json({message : `A payment error occurred: ${e.message}`}) 
                break;
                case 'StripeInvalidRequestError':
                //console.log('An invalid request occurred.');
                return res.status(422).json({message : `An invalid request occurred.`}) 
                break;
                case 'StripeConnectionError':
                //console.log('An invalid request occurred.');
                return res.status(422).json({message : `There was a network problem between your server and Stripe.`}) 
                break;
                case 'StripeAPIError':
                //console.log('An invalid request occurred.');
                return res.status(422).json({message : `Something went wrong on Stripe’s end.`}) 
                break;
                case 'StripeAuthenticationError':
                //console.log('An invalid request occurred.');
                return res.status(422).json({message : `Stripe can’t authenticate you with the information provided.`}) 
                break;
                case 'StripePermissionError':
                //console.log('An invalid request occurred.');
                return res.status(422).json({message : `The API key used for this request does not have the necessary permissions.`}) 
                break;
                case 'StripeRateLimitError':
                //console.log('An invalid request occurred.');
                return res.status(422).json({message : `You made too many API calls in too short a time.`}) 
                break;
                default:
                //console.log('Another problem occurred, maybe unrelated to Stripe.');
                return res.status(422).json({message : `Another problem occurred, maybe unrelated to Stripe.`})
                break;
            }
        }
        
    },

    monthlybillingPayment: async (req, res) => {         
        const result = await userModel.findOne({_id:req.body.userid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "User is not Available...!"}) }

        const result1 = await  monthlybilling.monthlybillingSchema.findOne({_id:req.body.billingid,isdeleted:false});
        if(!result1) { return res.status(422).json({message : "Billing is not Available...!"}) }

        console.log(req.body.userid+'/'+req.body.billingid+'/'+result1.amount+'/'+result.stripe_customer_id+'/'+result.stripe_card_id);

        if((typeof result.stripe_card_id !== "undefined") && result.stripe_card_id != "") {
            //res.status(201).json({status:true, job:result})
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            var amount = parseInt(result1.amount * 100);
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'gbp',
                    payment_method_types: ['card'],
                    customer: result.stripe_customer_id,
                    payment_method: result.stripe_card_id,
                    confirm:true
                });
                
                const data = await monthlybilling.monthlybillingSchema.updateOne(
                    {'_id':req.body.billingid},
                    {$set:{'paymenttransid':paymentIntent.id, 'paymentdate':new Date(), 'status':"paid"}},{multi:true}
                )

                res.status(201).json({status:true, payment:paymentIntent})
            } catch (e) {
                switch (e.type) {
                    case 'StripeCardError':
                    //console.log(`A payment error occurred: ${e.message}`);
                    return res.status(201).json({message : `A payment error occurred: ${e.message}`}) 
                    break;
                    case 'StripeInvalidRequestError':
                    //console.log('An invalid request occurred.');
                    return res.status(201).json({message : `An invalid request occurred.`}) 
                    break;
                    case 'StripeConnectionError':
                    //console.log('An invalid request occurred.');
                    return res.status(201).json({message : `There was a network problem between your server and Stripe.`}) 
                    break;
                    case 'StripeAPIError':
                    //console.log('An invalid request occurred.');
                    return res.status(201).json({message : `Something went wrong on Stripe’s end.`}) 
                    break;
                    case 'StripeAuthenticationError':
                    //console.log('An invalid request occurred.');
                    return res.status(201).json({message : `Stripe can’t authenticate you with the information provided.`}) 
                    break;
                    case 'StripePermissionError':
                    //console.log('An invalid request occurred.');
                    return res.status(201).json({message : `The API key used for this request does not have the necessary permissions.`}) 
                    break;
                    case 'StripeRateLimitError':
                    //console.log('An invalid request occurred.');
                    return res.status(201).json({message : `You made too many API calls in too short a time.`}) 
                    break;
                    default:
                    //console.log('Another problem occurred, maybe unrelated to Stripe.');
                    return res.status(201).json({message : `Another problem occurred, maybe unrelated to Stripe.`})
                    break;
                }
            }
        } else {
            res.status(201).json({message : `Please update your payment method`})
        }
        
    },

    retrieveCarddetails: async (req, res) => {
        
        const result = await userModel.findOne({_id:req.body.userid,isdeleted:false});
        if(!result) { return res.status(422).json({message : "User is not Available...!"}) }

        if((typeof result.stripe_customer_id !== "undefined") && result.stripe_customer_id != "" && (typeof result.stripe_card_id !== "undefined") && result.stripe_card_id != "") {
          const card = await stripe.customers.retrieveSource(            
            result.stripe_customer_id,
            result.stripe_card_id
          );
          res.status(201).json({status:true, carddetails:card})
        } else {
          res.status(201).json({message : `Please update your payment method`}); 
        }
    }
    
}
