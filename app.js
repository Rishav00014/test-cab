const nodemailer = require("nodemailer");
const express =require("express");
const mongoose= require("mongoose");



const taxiClintSchema = {
  name:String,
  number:String,
  email:String,
  message:String,
  location:String,
  pDate:String
}
const TaxiClint = mongoose.model("TaxiClint",taxiClintSchema)

const loanClintSchema = {
  firstName: String,
  lastName: String,
  age: String,
  mobile: String,
  address: String,
  businessName: String,
  gstNo: String,
  bAddress: String,
  bTurnOver: String,
  loanAmount: String,
  interestRate: String,
  loanTenure: String,
  creditScore: String
}
const LoanClint = mongoose.model("LoanClint",loanClintSchema)

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
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://rishav.host"); // Update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get("/",(req,res)=>{
    res.sendFile("index.html",{root: __dirname })
})

app.post("/api/loan/users",(req,res)=>{
  try {
    console.log(req.body)
    const info ={
      firstName: req.body.pd.firstName,
      lastName: req.body.pd.lastName,
      age: req.body.pd.age,
      mobile: req.body.pd.mobile,
      address: req.body.pd.address,
      businessName: req.body.bd.businessName,
      gstNo: req.body.bd.gstNo,
      bAddress: req.body.bd.bAddress,
      bTurnOver: req.body.bd.bTurnOver,
      loanAmount: req.body.ld.loanAmount,
      interestRate: req.body.ld.interestRate,
      loanTenure: req.body.ld.loanTenure,
      creditScore: req.body.ld.creditScore
    }
    let loanClint =new LoanClint(info);
    loanClint.save();

  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

app.post("/api/taxi/mail",(req,res)=>{
    let data ={
      name:req.body.name,
      number:req.body.number,
      email:req.body.email,
      message:req.body.message,
      pDate:"",
      location:""
    }
    let taxiClint =new TaxiClint(data);
    taxiClint.save();

    let mes =`You have a new clint Details are :-
    Name         : ${data.name}
    Mobile No    : ${data.number}
    Email        : ${data.email}
    Message      : ${data.message}
    `;
    mailSend(mes).catch(console.error)  
    res.redirect("/")
})
app.post("/api/taxi/mail2",(req,res)=>{
  let data ={
    name:"",
    number:req.body.number,
    email:"",
    message:"Need ride on the date",
    pDate:req.body.pDate,
    location:req.body.location
  }
  
  let taxiClint =new TaxiClint(data);
  taxiClint.save();

  let mes =`You have a new clint Details are :-
  Pick up date : ${data.pDate}
  Mobile No    : ${data.number}
  Location     : ${data.location}
  Message      : ${data.message}
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
    to: "admin@sdcabwale.com", // list of receivers
    subject: "New Clint", // Subject line
    text: message, // plain text body
  });
}

