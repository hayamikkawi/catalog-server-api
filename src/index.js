require('./db/mongoose') //so that this runs
const express = require('express')
const Book = require('./models/book.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) //to parse incoming json to object.

//add a book
app.post('/books', (req, res)=>{
    const book = new Book (req.body)
    book.save().then(()=>{
        res.send(book)
    }).then((error)=>{
        res.status(400).send(error)
    })
})
//get a book by number 
app.get('/books/info/:id', (req, res)=>{
    Book.findOne({itemNumber:req.params.id}).then((book)=>{
        if(!book){
            return res.status(404).send("Invalid item id")
        }
        res.send(book)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})
//get a book by topic
app.get('/books/search/:topic', (req, res)=>{
    Book.find({topic: req.params.topic}).then((books)=>{
        if(!books.length){
            return res.status(404).send("No items found with the specified topic.")
        }
        res.send(books)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})
//update cost 
app.patch('/books/:id', (req, res)=>{
    const cost = req.body.cost
    const numberOfItems = req.body.numberOfItems
    Book.findOneAndUpdate(req.params.id, {cost, numberOfItems}).then((response)=>{
        res.send(response)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})
app.listen(port, ()=>{
    console.log('server is listening')
})