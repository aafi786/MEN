const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

//Connection To MongoDB
mongoose.connect('mongodb://localhost:27017/MEN');
let db = mongoose.connection;

//check connection

db.once('open', function () {
    console.log('Connected To Mongoose');
})

//check for connection

db.on('error', function (err) {
    console.log(err);
});



//MiddleWare For Template Engine
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Static Path For Directory
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser - For Getting Form Data

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Express Session Middelware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Message Middelware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


//Calling DB Model

var Article = require('./models/article');

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/get-article', function (req, res) {
    Article.find({}, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(data);
            res.render('article', {
                article: data
            })
        }
    })

});



app.post('/send-data', function (req, res) {
    var Art = new Article({
        title: req.body.title,
        body: req.body.content
    })
    Art.save(function (err) {
        if (err) {
            console.log(err)
        }
        else {
            req.flash('success', 'Article Added Succesfully');
            res.redirect('/get-article');
        }
    });
});

app.get('/single/:id', function (req, res) {
    Article.findOne({ _id: req.params.id }, function (err, data) {
        if (err) {
            console.log(err)
        }
        else {
            // console.log(data);
            res.render('single', {
                article: data
            })
        }
    })
})
app.get('/edit/:id', function (req, res) {
    Article.findOne({ _id: req.params.id }, function (err, data) {
        if (err) {
            console.log(err)
        }
        else {
            // console.log(data);
            res.render('edit', {
                edit: data
            })
        }
    })
})
app.post('/edit/:id', function (req, res) {
    Article.update({ _id: req.params.id }, { title: req.body.title, body: req.body.content }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Article Updated Succesfully !')
        }
    })
})
app.listen(3000, function () {
    console.log('Server Running On Port 3000');
});