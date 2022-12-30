const nodemailer = require("nodemailer");
const express =require("express");
const mongoose= require("mongoose");



const clintSchema = {
    name:String,
    number:String,
    email:String,
    message:String,
    location:String,
    pDate:String
}
const Clint = mongoose.model("Clint",clintSchema)
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    }
});
const port = 8080

const app = new express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.get("/",(req,res)=>{
    res.sendFile("index.html",{root: __dirname })
})

app.post("/api/mail",(req,res)=>{
    let data ={
      name:req.body.name,
      number:req.body.number,
      email:req.body.email,
      message:req.body.message,
      pDate:"",
      location:""
    }
    let clint =new Clint(data);
    clint.save();
    let mes =`You have a new clint Details are :-
    Name         : ${data.name}
    Mobile No    : ${data.number}
    Email        : ${data.email}
    Message      : ${data.message}
    `;
    console.log(mes);
    mailSend(mes).catch(console.error)  
    res.redirect("/")
})
app.post("/api/mail2",(req,res)=>{
  let data ={
    name:"",
    number:req.body.number,
    email:"",
    message:"Need ride on the date",
    pDate:req.body.pDate,
    location:req.body.location
  }
  let clint =new Clint(data);
  //clint.save();
  let mes =`You have a new clint Details are :-
  Pick up date : ${data.pDate}
  Mobile No    : ${data.number}
  Location     : ${data.location}
  Message      : ${data.message}
  `;
  console.log(mes);
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
    to: "admin@sdcabwale.com", // list of receivers
    subject: "New Clint", // Subject line
    text: message, // plain text body
  });
}

