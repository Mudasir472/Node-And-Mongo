const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    comment: String,
    rating : {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default:Date.now(),
    }
})


const Review = mongoose.model("Review", reviewSchema);
// const del = async () =>{
//     await Review.deleteMany({});
// }

// del();
module.exports = Review;

