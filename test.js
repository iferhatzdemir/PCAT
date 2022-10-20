const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Connect to db
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Create Schema
const photoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', photoSchema);

//Photo.create({ title: 'test2', description: 'Lorem impsum' });

//Read Photo
// Photo.find({}, (err, photo) => {
//   console.log(photo);
// });

//Update Photo
// const id = '63447f073e71eefc378859c7';
// Photo.findByIdAndUpdate(
//   id,
//   { title: 'test4', description: 'new Description2' },
//   { new: true }, //new:true ile güncellenen veriyi gösterir,
//   (err, photo) => {
//     console.log(photo);
//   }
// );

//Delete Photo
const id = '63447f073e71eefc378859c7';
Photo.findByIdAndDelete(id, (err, photo) => {
  console.log('Silindi');
});
