var express = require('express');
//var bodyParser = require('body-parser');

var routes = function(Book) {
    var router = express.Router();
    var bookController = require('./bookController')(Book);




    // /api/books
    router.route('/')

        .post((req, res) => {

            var book = new Book(req.body);
            book.save();
            res.status(201).send(book);
        })

        .get((req, res) => {

        if(req.query){

            var query = req.query;

        };
            Book.find(query, (err, books) => {
               if(err) res.status(500).send(err);
                res.json(books);
            });
        });

    //Finds book by id in request param
    router.use('/:id', (req, res, next) => {
        Book.findById(req.params.id,(err, book) => {
            if(err) throw err;
            else if(book){
                req.book = book;
                next();
            }
            else
                res.status(404).send('Not Found');
        });
    });



    // /api/books/:id
    router.route('/:id')
        .get((req, res) => {

            res.json(req.book);

        })

        .put((req, res) => {

                  req.book.title = req.body.title;
                  req.book.author = req.body.author;
                  req.book.genre = req.body.genre;
                  req.book.read = req.body.read;

                  req.book.save((err)=> {
                      if(err) req.status(500).send(err);

                      else req.json(req.book);
                    });

                  })



            .patch((req, res) => {
                if(req.body._id)
                    delete req.body._id;

                for(var n in req.body) {
                    req.book[n] = req.body[n];
                }

                    req.book.save((err) => {
                        if(err) res.status(500).send(err);
                        res.json(req.book)
                    });
            })
    return router
        };




module.exports = routes;


