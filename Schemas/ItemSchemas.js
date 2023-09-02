const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({


  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, default: 1 }


},
  {
    collection: 'itemdetails',
    versionKey: false,
  }

);
const itemModel = mongoose.model('itemdetails', ItemSchema);
module.exports = { itemModel };