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
