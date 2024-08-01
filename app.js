const http = require('http');
const mysql = require('mysql2');

// Import the Express.js framework
const express = require('express');

//TODO: Include code for body-parser
const bodyParser = require('body-parser');
const { name } = require('ejs');

// Create an instance of the Express application. This app variable will be used to define routes and configure the server.
const app = express();

//TODO: Include code for Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true}));


// Specify the port for the server to listen on
const port = 3001;

//code to set EJS as the view engine
app.set('view engine', 'ejs');

// Routes for CRUD operations


// Example route to render 'buyproduct.ejs'
app.get('/buyproduct', function(req, res) {
    const sql = 'SELECT * FROM products';
  
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Database Query error:', error.message);
        return res.status(500).send('Error Retrieving Products');
      }
  
      // Render 'buyproduct.ejs' and pass 'products' data
      res.render('buyproduct', { products: results });
    });
  });
  

// Alog in
app.get('/login', function(req, res) {
  //TODO: Insert code to render a view called "login"
  res.render('login');
});

// Create MySQL connection
const connection = mysql.createConnection({
//host: 'localhost',
//user: 'root',
//password: '',
//database: 'mini_product_cart1'
host: 'db4free.net',
user: 'jordon',
password: 'Bangk0k0!0416',
database: 'project_jordon'

});
connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL:', err);
return;
}
console.log('Connected to MySQL database');
});
// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
//enable form processing
app.use(express.urlencoded({
    extended: false
}))
// Define routes

// Route to retrieve and display all products
app.get('/', function(req, res) {
    const sql = 'SELECT * FROM products';
    
    // Fetch data from MySQL
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Database Query error:', error.message);
        return res.status(500).send('Error Retrieving Products');
      }
      
      // Render HTML page with data
      res.render('index', { products: results });
    });
  });
  
  
//display a specific product by ID
app.get('/product/:id',(req, res) => {
    //Extract the product ID from the request parameters
    const productId =  req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    //Fetch data from MySQL based on the product ID
    connection.query( sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retriving product by ID');
        }
        //Check if any product with the given ID was found
        if (results.length > 0) {
            //Render HTML page with the product data
            res.render('product', { product: results[0] });
        } else {
            //If no product with the given ID was found,render a 404 page or handle it accordingly
            res.status (404).send('Product not found');
        }
    });
});
  
//add new product
app.get('/addProduct', (req,res) => {
    res.render('addProduct');
});

app.post('/addProduct',(req, res) => {
    //Extract product data from the request body
    const { name, quantity, price, date, description } = req.body
    const sql = 'INSERT INTO products (productName, quantity, price, date, description) VALUES (?,?,?,?,?)';
    //Insert the new product into the database
    connection.query( sql , [name, quantity, price, date, description], (error, results) =>{
        if (error){
            //handle any error occurs during the database operation
            console.error("Error adding ticket:", error);
            res.status(500).send('Error adding ticket');
        } else {
            //send a success response
            const { name, quantity, price, date, description} = req.body;
            res.render('submitted', {name, quantity, price, date, description})
        }
    })
})

//edit product
app.get('/editProduct/:id', (req,res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE productId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query( sql , [productId], (error, results) => {
      if (error) {
          console.error('Database query error:', error.message);
          return res.status(500).send('Error retrieving product by ID');
      }
      // Check if any product with the given ID was found
      if (results.length > 0) {
          // Render HTML page with the product data
          res.render('editProduct', { product: results[0] });
      } else {
          // If no product with the given ID was found, render a 404 page or handle it accordingly
          res.status(404).send('Product not found');
      }
  });
});

app.post('/editProduct/:id', (req, res) => {
  const productId = req.params.id;
  // Extract product data from the request body
  const { name, quantity, price, date, description } = req.body;

  const sql = 'UPDATE products SET productName = ?, quantity = ?, price = ?, date = ?, description = ? WHERE productId = ?';

  // Update the product in the database
  connection.query(sql, [name, quantity, price, date, description, productId], (error, results) => {
      if (error) {
          // Handle any error that occurs during the database operation
          console.error("Error updating product:", error);
          res.status(500).send('Error updating product');
      } else {
          // Send a success response
          const { name, quantity, price, date, description} = req.body;
          res.render('submitted', {name, quantity, price, date, description})
      }
  });
});

app.get('/deleteProduct/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE productId = ?';
  connection.query(sql, [productId], (error, results) => {
      if (error) {
          // Handle any error that occurs during the database operation
          console.error("Error deleting product:", error);
          res.status(500).send('Error deleting product');
      } else {
          // Send a success response
          res.redirect('/buyProduct');
      }
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message when the server is successfully started
    console.log(`Server is running at http://localhost:${port}`);
  });