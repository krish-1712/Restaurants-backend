const mongoose = require('mongoose')



const RestaurantSchema  = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
          },
          cuisine: {
            type: Array,
            required: false,
          },
          foodTypes: {  
            type: Array,
            required: false,
          },
          branch: {
            type: Number,
            required: false,
          },
          address: {
            addressLine1: {
              type: String,
              required: true,
            },
            addressLine2: {
              type: String,
              required: true,
            },
            area: {
              type: String,
              required: true,
            },
            city: {
              type: String,
              required: true,
            },
            state: {
              type: String,
              required: true,
            },
            pincode: {
              type: Number,
              required: true,
            },
            country: {
              type: String,
              required: true,
            },
          },
          contactNumber: {
            type: String,
            required: false,
          },
          createdOn: {
            type: Date,
            default: Date.now(),
          },
          updateOn: {
            type: Date,
            default: Date.now(),
          },
          defaultRating: {
            type: Number,
            required: false,
          },
        
    },
  
    {
        collection: "Restaurant",
        versionKey: false
    }

);

    

let restaurantModel = mongoose.model('Restaurant', RestaurantSchema )
module.exports = { restaurantModel }