const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log(url)
        console.log('error connecting to MongoDB:', error.message)
    })

// Create a schema to save an specify data
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Set a custom schema rsponse
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Bind data with modal and export
module.exports = mongoose.model('Contact', contactSchema)