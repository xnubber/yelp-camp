const mongoose = require('mongoose')
const faker = require('faker')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once('open', () => {
  console.log('Database connected')
})

const sample = array => array[~~(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = ~~(Math.random() * 1000)
    const price = ~~(Math.random() * 20) + 10
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      image: [
        {
          url: `https://loremflickr.com/320/240/camp,landscape/?random=${Math.random() * 100}`,
          filename: 'yelp-camp-img-1'
        },
        {
          url: `https://loremflickr.com/320/240/camp,landscape/?random=${Math.random() * 100}`,
          filename: 'yelp-camp-img-2'
        },
      ],
      description: faker.lorem.text(),
      price,
      author: "6235b2b80b59d13789039231"
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})