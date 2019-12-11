

const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileupload = require("express-fileupload");
const session = require("express-session");
const methodOverride = require("method-override");

//Creation of app object



//This loads all our environment variables from the keys.env
require("dotenv").config({path:'./config/keys.env'});


//Import your router objects
const generalRoutes = require("./routes/General");
const userRoutes = require("./routes/User");
const roomRoutes = require("./routes/Room");
const app= express();
app.use(bodyParser.urlencoded({ extended: false }));

//This is how you map your file upload to express
app.use(fileupload())

//override with poat having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(session({secret:"This is my secret key. This should not be shown to everyone"}))

app.use((req,res,next)=>{

    //This is a global variable that can be accessed by templates
    res.locals.user= req.session.userInfo;
    res.locals.admin= req.session.admin;
    next();
})


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/room",roomRoutes);

app.use("/",(req,res)=>{
    res.render("General/404");
});





//This code is used to connect mongoose to our MONGODB in the Cloud
const MONGO_DB_URL =`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0-gvp1k.mongodb.net/${process.env.MONGO_DB_DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_DB_URL, {useUnifiedTopology: true,useNewUrlParser: true})
//The then block will only be executed if the above-mentioned line is successful
.then(()=>{
    console.log(`Database is connected`)
})
//The catch block will only be executed if the connection failed
.catch(err=>{
    console.log(`Sorry,Something went wrong : ${err}`);
})





   

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`The Web Server is connected at port ${PORT}`);
});