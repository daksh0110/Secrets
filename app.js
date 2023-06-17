//jshint esversion:6
require('dotenv').config()
const ejs=require("ejs");
const express=require("express");
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');
const app=express();
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] });
console.log(process.env.SECRET);
const User=mongoose.model("User",userSchema);

app.route("/")
.get((req,res)=>{
    res.render("home");
});


app.route("/register")
.get((req,res)=>{
    res.render("register");
})
.post((req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const Newuser=new User({
        email:username,
        password:password
    })
    Newuser.save().then(()=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    })
});




app.route("/login")
.get((req,res)=>{
    res.render("login");
})
.post((req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username})
    .then((Result)=>{
        if(Result.password==password){
            res.render("secrets");
        }else{
            console.log("password is wrong"); 
        }
    })
    .catch((err)=>{
        console.log(err);
    });
})




app.route("/submit")
.get((req,res)=>{
    res.render("submit");
});



app.listen(3000,()=>{
    console.log("successfully connected to server");
});