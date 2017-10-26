var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');
colors.setTheme({
  myTheme:'cyan', 
  myBold: 'bold',
  myBG: 'bgMagenta',
  myPink: 'magenta'

});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1187",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  readProducts();
});
      


      function readProducts() {
        console.log("");
        console.log("");
        console.log("");
        console.log("Welcome to Bamazon!");
        console.log("Showing all our current products...\n");
        connection.query("SELECT * FROM products", function(error, response) {
         var table = new Table({
                head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock Quantity'].map(function(header)
                {return header.myTheme.myBold.myBG})
                , colWidths: [10, 20, 20, 20, 20]
            });
        if (error) throw error;
            for (var i = 0; i < response.length; i++) {
             
                var tableArray = [response[i].item_id, response[i].product_name, 
                response[i].department_name, response[i].price, 
                response[i].stock_quantity].map(function(header){return typeof header === 'string'? 
                header.myBold.myPink: (header + '').myBold.myPink})
                table.push (tableArray)
                }
                
        console.log(table.toString());
        console.log("");
        console.log("");
        console.log("");
  userPurchase();
  });
}
 function userPurchase() {
inquirer
      .prompt([
        {
          name: "choice",
          type: "input",
          message: "Enter the ID of the item you would like to buy."
        },
        {
          name: "howMany",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ])
      .then(function(answer) {
      	var item = answer.choice;
      	var quantity = answer.howMany;
        
        connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(error, response) {
        	if (error) throw error;

        	if (response.length === 0) {
        		console.log("Invalid item number");
            readProducts();
          if (response.length === NaN){
            console.log("Please select a valid item number");
            readProducts();
          }
        	} else {
        		var productData = response[0];

        		if (quantity <= productData.stock_quantity) {
        			console.log("Your item is in stock. Your order has been placed!");
              
        			connection.query("UPDATE products SET stock_quantity = " + (productData.stock_quantity - quantity) + " WHERE item_id = " + item, function(error, response) {
        				if (error) throw error;

        				console.log("Your total is $" + productData.price * quantity);
        				connection.end();
        			})
        		} else {
        			console.log("Your item is out of stock!");
        		
        		}
            readProducts();
        	}
        
      })
    })
  }




