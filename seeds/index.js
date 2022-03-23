const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cites = require('./city');
const {descriptors, places} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind('connection error!'));
db.once('open', () => {
    console.log('Database Connected!');
})

let sample = arr => arr[Math.floor(Math.random() * arr.length )];

let seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let rand1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 20) + 10;
        let camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}` ,
            author: '6231f20e1fd85c302f91cd96',
            location: `${cites[rand1000].city} ${cites[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cites[rand1000].longitude,
                    cites[rand1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dajnu3p8z/image/upload/v1647769039/YelpCamp/tkywhhuhy4pigbcusf69.jpg',
                    filename: 'YelpCamp/tkywhhuhy4pigbcusf69'
                },
                {
                    url:'https://res.cloudinary.com/dajnu3p8z/image/upload/v1647708333/YelpCamp/w9rjimxrer3yueka6aph.jpg',
                    filename: 'YelpCamp/w9rjimxrer3yueka6aph'
                }
            ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit nostrum veritatis deleniti, eaque error rerum molestias qui in labore, aspernatur voluptatibus? Ad nemo dolores, debitis impedit iure quo repudiandae modi.',
            price
        });
        await camp.save();        
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});