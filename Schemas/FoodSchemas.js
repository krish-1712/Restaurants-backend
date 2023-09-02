const mongoose = require('mongoose')


const FoodSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    foodDescription: {
      type: String,
      required: true,
    },
    foodType: {
      type: String,
      required: false,
    },
    foodCategory: {
      type: String,
      required: false,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
    offerDetails: {
      offerPrice: {
        type: Number,
        required: false,
        default: null,
      },
      offerValue: {
        type: Number,
        required: false,
        default: null,
      },
      offerUnit: {
        type: String,
        required: false,
        default: null,
      },
      offerDescription: {
        type: String,
        required: false,
        default: null,
      },
    }
  },

  {
    collection: "food",
    versionKey: false
  }

);



let foodModel = mongoose.model('food', FoodSchema)
module.exports = { foodModel }