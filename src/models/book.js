const mongoose = require('mongoose')
const validator = require('validator')
    const Book = mongoose.model('book', {
        topic: {
            type: String, 
            required: true, 
            trim: true
        }, 
        cost:{
            type: Number,
            required: true 
        }, 
        numberOfItems:{
            type: Number, 
            required: true,
            validate(value){
                if(value<0){
                    throw new Error('negative values aren\'t allowed')
                }
            }
        }, 
        itemNumber:{
            type: Number, 
            required: true, 
        }, 
        name:{
            type:String, 
            required: true
        }


    })
    module.exports = Book