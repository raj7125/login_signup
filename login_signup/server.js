const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")

const user = require("./model/user")
const product = require("./model/product")

const app = express()
const PORT = 3001
app.use(session({
    secret: 'hvyujdyju',
    resave: false,
    saveUninitialized: true,
  }))

app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

mongoose.connect("mongodb+srv://arupmaiti22:b1234@cluster0.vwl57kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("MongoDb Connected")
})

app.get("/",(req,res)=>{
    res.render("login")
})

app.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    const data = await user.findOne({email,password})
    if(!data){
        res.render("login",{message:"credentials not matched"})
    }
    req.session.userId = data

    res.render("home",{item})
})
function authentication(req,res,next){
    if(req.session.userId)
     next();
    else
     res.redirect("/")
}

app.get("/home",authentication,async (req,res)=>{
    
    res.render("home")
    
})

app.get("/signuppage",(req,res)=>{
    res.render("signup")
})

app.post("/signup",async (req,res)=>{
  const {name,email,password} = req.body
  await user.create({name,email,password})
  res.render("login")
})

app.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})

app.listen(PORT,(err)=>{
    if(err)
     console.log(err)
    else
     console.log("Server Started at PORT:",PORT)
})