const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.i2rin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url)

/*mongoose.connect('mongodb://localhost:27017/groundWorkDB', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("CONNECTION OPEN FOR MONGOOSE")
    })
  .catch(err => {
    console.log(err)
  })*/

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Javascript is tricky',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

/*Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})*/