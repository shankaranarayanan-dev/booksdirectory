const express = require("express");
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'booksdir',
    password: 'admin123',
    port: 5432,
});

const app = express();

app.use(express.json());

let books = [{name: 'c'}, {name: 'c++'}, {name: 'java'}, {name: 'php'}, {name: 'python'}];

app.get("/", (req,res) => {
    pool.query('select * from books', (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    })
});

app.get("/:id", (req,res) => {
    const id = req.params.id;

    pool.query('select * from books Where id = $1', [id],(error, results) => {
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    })
});

app.post("/", (req,res) => {
    const {bookname, pubyear} = req.body;
    pool.query('INSERT INTO books (bookname, pubyear) VALUES ($1, $2) RETURNING *', [bookname, pubyear], (error, results) => {
        if(error){
            throw error;
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    });
});

app.delete("/:id", (req,res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM books WHERE id = $1', [id], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Row deleted = ${id}`);
    })
});

app.put('/:id', (req,res)=>{
    const id = req.params.id;
    const {bookname , pubyear} = req.body;

    pool.query('UPDATE books SET bookname = $1, pubyear = $2 WHERE id = $3', [bookname, pubyear, id], (error, results) => {
        if(error){
            throw error;
        }
        res.status(200).send(`User modified with ID = ${id}`);
    })
})



app.listen(3000);