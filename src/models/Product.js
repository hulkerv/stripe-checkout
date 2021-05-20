const{Schema, model} = require('mongoose');

const ProductSchema = new Schema({
    name:{type:String, required:true},
    price:{type:String , required:true},
    description:{type:String, required:true},
    img_filename: {type: String},
    img_path: {type: String},
    img_originalname: {type: String},
    img_mimetype: {type: String},
    img_size: {type: Number},
    created_at: {type: Date, default: Date.now}
});

module.exports = model('Product', ProductSchema)