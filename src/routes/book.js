const express = require('express')
const Book = require('../models/book')
const invalidate = require('../utils/invalidate')
const router = express.Router()
const notify = require('../utils/notify')
const log = require('../middleware/log')

//add a book
router.post('/books',log, (req, res)=>{
    const book = new Book (req.body)
    book.save().then(()=>{
        res.send(book)
    }).then((error)=>{
        res.status(400).send(error)
    })
})

router.get('/',log, (req, res)=>{
	res.send('heeey')
})

//get a book by number 
router.get('/books/info/:id', log, async(req, res)=>{
    try{
        const book = await Book.findOne({itemNumber:req.params.id})
        if(!book){
            return res.status(404).send("Invalid Item Id")
        }
        res.status(200).send(book)
    } catch(err){
        console.log(err)
        res.status(500).send(err)
        }
})


//get a book by topic
router.get('/books/search/:topic', log, async(req, res)=>{
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

//notify to patch
// router.patch('/notify/:id', (req, res)=>{
//     url = 'http://127.0.0.1:3000/'+req.params.id
//     request({url, JSON:true, method:"PATCH", body: res.body}, (req, res)=>{
//         if(error){
//             return reject(error)
//         } if(res.statusCode ==404 || res.statusCode ==400){
//             return reject(res.body)
//         }
//         return resolve(res.body)
//     })
// })

//update cost or number of items
router.patch('/books/:id', log, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['cost', 'numberOfItems']
    try {
        const book = await Book.findOne({ itemNumber: req.params.id })
        if (!book) {
            return res.status(404).send("Invalid Item Id")
        }
        const isValidUpdate= updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate) {
            return res.status(400).send( "invalid update operation")
        }

        updates.forEach((update) => { book[update] = req.body[update] })
        await book.save()
        await notify(req.params.id, req.body)
        await invalidate(req.params.id)
        res.status(200).send("Book was successfully updated")
    } catch (e) {
        res.status(500).send(e)
    }

})


//got a notification
router.patch('/notify/books/:id', log, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['cost', 'numberOfItems']
    try {
        const book = await Book.findOne({ itemNumber: req.params.id })
        if (!book) {
            return res.status(404).send("Invalid Item Id")
        }
        const isValidUpdate= updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate) {
            return res.status(400).send( "invalid update operation")
        }

        updates.forEach((update) => { book[update] = req.body[update] })
        await book.save()
        console.log('got a notification to change, book id:'+ req.params.id)
        res.status(200).send("Book was successfully updated")
    } catch (e) {
    	console.log(e)
        res.status(500).send(e)
    }

})
module.exports= router
