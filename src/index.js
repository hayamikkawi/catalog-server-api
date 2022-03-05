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
app.patch('/books/cost/:id', (req, res)=>{
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
app.patch('/books/count/:id', (req, res)=>{
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
app.listen(port, ()=>{
    console.log('server is listening')
})