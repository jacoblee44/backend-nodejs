const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
//var mailer = require('./mailer');
//var nodemailer = require("nodemailer");
var common = require('./common');
const Cryptr = require('cryptr');
const dotenv = require('dotenv');
dotenv.config();
const monthlybilling =  require('./job');
const jobapply =  require('./job');
const userlst =  require('./users.js');

module.exports = {
    getcurmnthbillingAmount: async (req, res) => { 
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
    },
    getalluserBilling: async (req, res) => { 
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
    }
}