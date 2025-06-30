const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  salonId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'adminProfile'
  },
  stars:{
    type:Number,
    enum:[1,2,3,4,5]
  },
  message:{
    type:String
  }
},{timestamps:true})

const ratingModel= mongoose.model("rating",ratingSchema)
module.exports = ratingModel
