const { render } = require('ejs');
const express = require('express');
const methodOverride = require('method-override')
const app = express();
const bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.set('view engine',"ejs");

const mongoose= require("mongoose");
const uri = "mongodb://localhost/basic_app"
mongoose
    .connect(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true})
    .then(() => {
        console.log(`Connected to DB ${uri}`)
	})
    .catch((err) => {
        console.log(`Error: ${err.message}`)
    })
const User = require('./models/user');
const Key = require('./models/key');
const Admin = require('./models/admin');
app.get('/',function(req,res){
    res.redirect("/doggy");
});
app.get('/doggy',function(req,res){
    res.render("landing");
});
app.post('/doggy',function(req,res){
    const idadmin = req.body.idadmin;
    const pasw1=req.body.pasw1;
    if(req.body.pasw1 == req.body.pasw2){
        Admin.find((id),function(err,result){
            console.log(result);
        })
    }else{
        console.log("no password match");
        res.redirect("/doggy")
    }
});
app.get('/doggy/adregister',function(req,res){
    res.render("adregister");
});
app.post('/doggy/adregister',function(req,res){
    if(req.body.pasw1 == req.body.pasw2){
        Admin.create({name:req.body.username,idadmin:req.body.idadmin,password:req.body.pasw1},function(req,admin){
            console.log(admin);
            res.redirect('/doggy/db');
        })
    }
});
app.get('/doggy/db',function(req,res){
    User.find({},function(req,data){
        Key.find({},function(err,keys){
            res.render('home',{data:data,keys:keys});
        })
    })
});
app.post('/doggy/db',function(req,res){
    const querysearch = req.body.querysearch;
    Key.find({word:querysearch},function(err,data){
        if(data.length == 1){
            Key.deleteOne({word:querysearch},function(err,data){
                 Key.create({word:querysearch},function(err,data){
                   res.redirect('/doggy/db');
                 })
            }) 
        }else{
            Key.create({word:querysearch},function(err,data){
                res.redirect('/doggy/db');
            })
        }
    })
});
app.get('/doggy/usregister',function(req,res){
    res.render('usregister');
});
app.post('/doggy/usregister',function(req,res){
    const regDate = new Date();
    const newuser = new User({
        name:req.body.name,
        date:regDate
    });
    newuser.dogs.push({
        name: req.body.dogname
    });
    newuser.save(function(err,user){
        res.redirect('/');
    });
});
app.get('/doggy/user/:id',function(req,res){
    const userId = req.params.id;
    User.findById(req.params.id,function(req,data){
        res.render('user',{data});
    })
});
app.put('/doggy/user/:id',function(req,res){
    const userId = req.params.id;
    User.findByIdAndUpdate(req.params.id,{name:req.body.username,dogs:{name:req.body.dogname}},function(req,data){
        res.redirect('/user/'+userId);
    })
});
app.delete('/doggy/user/:id',function(req,res){
    User.findByIdAndRemove(req.params.id,function(req,data){
        res.redirect('/');
    })
});
//app.get('/*',function(req,res){
   // res.end('404 page');
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() { 
  console.log('Server listening on port 3000'); 
});