const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageControllers');

const path = require('path');

const photo = require('./models/Photos'); // oluşturduğum schemayı aldım
const methodOverride = require('method-override');
const app = express();

//Database connect
mongoose.connect('mongodb://localhost/pcat-test-db');

//VİEW ENGİNE
app.set('view engine', 'ejs');

//MİDDLEWARE
app.use(express.static('public')); // Static dosyaları koyacağımız klasörü seçtik
app.use(express.urlencoded({ extended: true })); // Body parser
app.use(express.json()); // Body parser
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] })); //delete için gerekli olan method override  //https://www.npmjs.com/package/method-override
//ROUTES
app.get('/', photoController.getAllPhotos);

app.put('/photo/:id', photoController.updatePhoto);
app.get('/about', pageController.getAboutPage);

app.get('/add', pageController.getAddPage);

app.get('/photos/:photo_id', photoController.getPhoto);

app.post('/photos', photoController.createPhoto);

app.get('/photos/edit/:id', pageController.getEditPage);
app.delete('/photos/:id', photoController.deletePhoto);

const port = 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda dinleniyor`);
});
