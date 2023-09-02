// const mongoose = require('mongoose');

// const CountSchemas = mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId, // Assuming you're using MongoDB ObjectId
//       ref: 'User', // Reference to the User model
//       required: true,
//     },
//     items: [
//       {
//         itemId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Restaurant', // Reference to the Restaurant model
//         },
//         count: {
//           type: Number,
//           required: true,
//           default: 1,
//         },
//       },
//     ],


//   },
//   {
//     collection: 'cart_details',
//     versionKey: false,
//   }
// );

// const countModel = mongoose.model('cart_details', CountSchemas);
// module.exports = { countModel };

const mongoose = require('mongoose');





const CountSchemas = mongoose.Schema(
  {
    userId: 
    { 
        type: String,
       required: true 
    },
    itemId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    }, 
    name: { 
      type: String, 
      required: true 
    },
    count: { 
      type: Number, 
      required: true 
    },
  },
  {
    collection: 'cartdetails',
    versionKey: false,
  }
);

const countModel = mongoose.model('cartdetails', CountSchemas);
module.exports = { countModel };
