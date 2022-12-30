const nodemailer = require("nodemailer");
const express =require("express");
const mongoose= require("mongoose");




const clintSchema = {
    pDate:String,
    mobile:String,
    location:String
}
const Clint = mongoose.model("Clint",clintSchema)
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
});
const port = 8080

const app = new express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.get("/",(req,res)=>{
    res.sendFile("index.html",{root: __dirname })
})

app.post("/api/mail",(req,res)=>{
    let clint =new Clint(req.body)
    clint.save();
    let mes =`You have a new clint Details are :-
    Pick up date : ${req.body.pDate}
    Mobile No    : ${req.body.mobile}
    location     : ${req.body.location}
    `;
    mailSend(mes).catch(console.error)  
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
// async..await is not allowed in global scope, must use a wrapper
const mailSend =async(message)=> {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: testAccount.user, // sender address
    to: "ankitkumar6star@gmail.com", // list of receivers
    subject: "New Clint", // Subject line
    text: message, // plain text body
  });
}

