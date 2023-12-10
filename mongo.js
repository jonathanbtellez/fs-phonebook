const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://jonathanb:${password}@cluster55453.xxtwjis.mongodb.net/phonebook-app?retryWrites=true&w=majority`


mongoose.connect(url)


const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)


if (process.argv.length > 4) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    contact.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`, process.argv.length)
        mongoose.connection.close()
    })
    return
}

if (process.argv.length < 4) {

    Contact.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
    return
}

console.log('Please provide the number  as an argument: node mongo.js <password> <name> <number>')
process.exit(1)