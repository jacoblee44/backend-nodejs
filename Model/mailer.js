var nodemailer = require("nodemailer");
//module.exports = (req, res)=>{
  

  module.exports = {
    sendConfirmationEmail:(name, email, message, subject, transporter, res) => {
      var mailOptions = {
        from: name,
        to: email,
        subject: subject,
        html: message,
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(200).json(error);  
        } else {
            console.log("Sent: " + info.response);
            res.status(200).json("Sent: " + info.response);
        }
      });
    }
 }