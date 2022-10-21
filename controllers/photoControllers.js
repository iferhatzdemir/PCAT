const fs = require('fs');
const photo = require('../models/Photos'); // oluşturduğum schemayı aldım
const randomId = require('random-id');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1
  const photosPerPage = 2;
  const totalphotos = await photo.find().countDocuments();
  const photos = await photo.find({}).sort({ dateCreated: 'desc' }).skip((page - 1) * photosPerPage).limit(photosPerPage);
  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalphotos / photosPerPage)
  });
  // console.log(req.query);
  // const photos = await photo.find({}).sort({ dateCreated: 'desc' }); //desc: en son eklenenler en üstte olacak şekiilde sıralar
  // res.render('index', { photos });
};

exports.updatePhoto = async (req, res) => {
  const f_Photo = await photo.findById(req.params.id);
  f_Photo.title = req.body.title;
  f_Photo.description = req.body.description;
  // if (req.files) {
  //   if (f_Photo.image != null) {
  //     fs.unlinkSync(path.join(__dirname, '/public/uploads/' + f_Photo.image));
  //   }
  // }
  f_Photo.save();

  res.redirect(`/photos/${f_Photo.id}`);
};
exports.getPhoto = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);

  res.render('photo', { photo: foundedPhoto });
};

exports.createPhoto = async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  var len = 5;
  var pattern = 'aA0';
  let imageid = randomId(len, pattern);
  let uploadPath =
    __dirname +
    '/../public/uploads/' +
    imageid +
    '.' +
    uploadeImage.name.substr('.');

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err); // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await photo.create({
      ...req.body,
      image: '/uploads/' + imageid + '.' + uploadeImage.name.substr('.'), //burada image'ın adını ve uzantısını veriyoruz çünkü silme işleminde aynı fototyu kullanan başka bir foto varsa onu da silmemizi engelledik
    });
  });
  res.redirect('/');
};

exports.deletePhoto = async (req, res) => {
  // photo.remove({ _id: req.params.id }); //dbden ve dosyadan siler  problemli eski yöntem
  const photosD = await photo.findOne({ _id: req.params.id });
  let deletetedPhoto = __dirname + '/../public' + photosD.image;
  if (fs.existsSync(deletetedPhoto)) {
    fs.unlinkSync(deletetedPhoto);
  }
  await photo.findByIdAndDelete(req.params.id); //sadece dbden siler

  res.redirect('/');
};
