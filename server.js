require('dotenv').config();
const express = require('express');
const ejsLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const multer = require('multer');
const upload = multer({dest : './uploads'});
const cloudinary = require('cloudinary');
const db = require('./models');

const app = express();

app.set('view engine', 'ejs');
app.use(ejsLayout);
//* look for static file for css and js
//* middleware
app.use(express.static(__dirname + '/static')) //* where to find static files
app.use(express.urlencoded({extended: false})) //* allow use data from form on html
//! enable req.body
app.use(methodOverride('_method'));


app.get('/', function(req, res) {
    res.render('index');
});

//* GET /dinosaurs >> get all dinos
app.get('/dinosaurs', function(req, res) {
    db.dino.findAll().then(function(dinoData) {
        console.log(dinoData);
        res.render('dinos/index.ejs', {dinosaurs:dinoData});    
    })
})

//* GET /dinosaurs/new - serve up our new dino form
app.get('/dinosaurs/new', function(req, res) {
    res.render('dinos/new');
}) 

//* PUT /dinosaurs/edit/:id - update dino info
app.get('/dinosaurs/edit/:id', function(req, res) {
    db.dino.findOne({
        where: {
            id: parseInt(req.params.id),
        },
        include: [db.img]
    }).then(function(dino) {
        res.render('dinos/edit', {dinosaur:dino});
    })

}) 

//* GET /dinosaurs/:id get a dino
app.get('/dinosaurs/:id', function(req,res) {
    let id = parseInt(req.params.id); //! id is string, convert to id
    db.dino.findOne({
        where: {
            id: id,
        },
        include: [db.img]
    }).then(function(dino) {
        res.render('dinos/show', {dinosaur: dino, id});

    });
});

// GET /dinosuars/:id/editphotos page for uploading new photos
app.get('/dinosaurs/:id/editphotos', function(req, res) {
    db.dino.findOne({
        where: {
            id: parseInt(req.params.id)
        },
        include: [db.img]
    }).then(function(dino) {
        res.render('dinos/editphotos', {dinosaur: dino});
    });
});


//* POST /dinosaurs
app.post('/dinosaurs', upload.single('Myfile'), function(req, res) {
    console.log(req.body); //! get input info
    db.dino.create({
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    }).then(function() {
        res.redirect('/dinosaurs');        
    });
});

//* DELETE /dinosaurs/:id
app.delete('/dinosaurs/:id', function(req, res) {
    let id = parseInt(req.params.id);
    db.dino.destroy({
        where: {
            id: id
        }
    }).then(function() {
        res.redirect('/dinosaurs');

    });
});

// DELETE /dinosaurs/:id/photos/:imgid
app.delete('/dinosaurs/:id/photos/:imgid', function(req, res) {
    db.img.destroy({
        where: {
            id: parseInt(req.params.imgid)
        }
    }).then(function() {
        res.redirect('/dinosaurs/' + req.params.id + '/editphotos');
    });
});

//* PUT /dinosaurs/:id
app.put('/dinosaurs/:id', function(req, res) {
    let id = parseInt(req.params.id);
    db.dino.update({
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
        },
        {where: {id : id}}    
    ).then(function() {
        res.redirect('/dinosaurs/' + id);
    });
});

//POST /dinosaurs/:id/photos  add new dino photos
app.post('/dinosaurs/:id/photos', upload.single('myFile'), function(req,res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        let url = cloudinary.url(result.public_id);
        db.img.create({
            url: url,
            dinoId: parseInt(req.params.id)
        }).then(function() {
            res.redirect('/dinosaurs/' + req.params.id +'/editphotos');
        })
    })
})

//file uploader
app.post('/', upload.single('Myfile'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        let imgurl = cloudinary.url(result.public_id);
        db.img.create({
            url: imgurl,
            dinoId: req.body.dinoId
        }).then(function(data) {
            res.send('done')
        })
    })
})


app.listen(3000, function() {
    console.log('🏃‍♂️ connected to port 3000');
})