# Yelp-camp
This project is a camp forum website. Use EJS as web page renderer, and back-end used the RESTful concept as the core. Use Express.js to build web structures and use MongoDB as the database.

## Built With
- Node.js (v14.17.0)
- Express
- nodemon
- Mongo
- Robo 3T
- Mongoose 

## Features
- use MongoDB as databas
- use Mongoose to manipulate database
- use EJS as webpage renderer
- use Mapbox to show the campgrounds location
- use express-mongo-sanitize to handle database injection
- use Joi to validate HTTP request body & deal with XSS
- use Cloudinary to store upload images
- use passport to achieve user sign up/ sign on /logout

## Install
use terminal and follow below steps

1. Clone this project to local

```sh
git clone https://github.com/xnubber/yelp-camp.git
```

2. Into the target directory
```sh
cd yelp-camp
```

3. Install npm package
```sh
npn install
```

4. Refer to .env.example to create .env
```
touch .env
```
```
CLOUDINARY_NAME=your cloudinary name
CLOUDINARY_KEY=your cloudinary key
CLOUDINARY_SECRET=your cloudinary secret
MAPBOX_TOKEN=your mapbox token
```

5. Create seeds data
```
node seeds/index.js
```

6. Run Express server

  ```
  npm run start
  ```
  nodemon
  ```
  npm run dev
  ```
