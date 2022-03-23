const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

let ImageSchema = new Schema ({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_250');
})

const opts = { toJSON: { virtuals: true } };

let CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ ImageSchema ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [ Number ],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
            <p>${this.description.slice(0, 20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = new mongoose.model('Campground', CampgroundSchema);