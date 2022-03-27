const express = require('express')
const Book = require('../models/book')
const router = express.Router()

//add a book
router.post('/books', (req, res)=>{
    const book = new Book (req.body)
    book.save().then(()=>{
        res.send(book)
    }).then((error)=>{
        res.status(400).send(error)
    })
})

//get a book by number 
router.get('/books/info/:id', async(req, res)=>{
    try{
        const book = await Book.findOne({itemNumber:req.params.id})
        if(!book){
            return res.status(404).send("Invalid item id")
        }
        res.status(200).send(book)
    } catch(err){
        console.log(err)
        res.status(500).send(err)
        }
})


//get a book by topic
router.get('/books/search/:topic', async(req, res)=>{
   try{
    const books = await Book.find({topic: req.params.topic})
    if(!books.length){
        return res.status(404).send("No items found with the specified topic.")
        }
        res.send(books)
   }
    catch(err){
        res.status(500).send(err)
    }
})

//update cost 
router.patch('/books/cost/:id', (req, res)=>{
    const cost = req.body.cost
    if(cost == null){
        return res.status(400).send("Please provide a cost!")
    }
    else if(cost<0){
        return res.status(400).send("Bad value for cost")
    }
    Book.findOneAndUpdate({itemNumber:req.params.id}, {cost}).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})
//update number of items
router.patch('/books/count/:id', (req, res)=>{
    const numberOfItems = req.body.numberOfItems
    if(numberOfItems == null){
        return res.status(400).send('Please provide number of items')
    }
    else if(numberOfItems<0){
        return res.status(400).send("Bad value for number of items")
    }
    Book.findOneAndUpdate({itemNumber:req.params.id}, {numberOfItems}).then((response)=>{
            res.send(response)

    }).catch((err)=>{
        res.status(500).send("err")
    })
})
module.exports= router