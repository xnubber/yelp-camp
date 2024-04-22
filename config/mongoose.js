const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

module.exports = db