const mongoose = require('mongoose')
// const rl = require('readline-sync');
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
/*const password = rl.question('Please enter the password to access the database.');
const url = `mongodb+srv://fullstack:${password}@cluster0.i2rin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`*/

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)