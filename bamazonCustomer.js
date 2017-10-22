var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


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


// // instantiate 
// var table = new Table({
//    head: ['Department', 'Item', 'Price', 'Quantity in Stock']
//  , colWidths: [20, 20, 20, 20]
// });

// // table is an Array, so you can `push`, `unshift`, `splice` and friends 
// table.push(
//    ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']
//  , ['First value', 'Second value']

// );

// console.log(table.toString());


function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(error, response) {
    if (error) throw error;
    console.log("Inventory: ");
    console.log("...........\n");

    var output = "";
    for (var i = 0; i < response.length; i++) {
    	output = "";
    	output += "Item ID: " + response[i].item_id + "  //  ";
    	output += "Product Name: " + response[i].product_name + "  //  ";
    	output += "Department: " + response[i].department_name + "  //  ";
    	output += "Price: " + response[i].price + "  //  ";
    	output += "In Stock: " + response[i].stock_quantity + "  //  ";

    	console.log(output);

    }
    var table = new Table({
         head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Quantity in Stock']
       , colWidths: [20, 20, 20, 20, 20]
      });
      
    
      for (var i = 0; i < response.length; i++)
      table.push(
        var output = "";
        for (var i = 0; i < response.length; i++) {
          output = "";
          output += response[i].item_id ;
          output += response[i].product_name ;
          output += response[i].department_name ;
          output += response[i].price 
          output += response[i].stock_quantity
         
          [ 'item_ID',
          'response.product_name', 
         'department_name', 
         'price', 
         'stock_quantity'
        ]
      );
      
      console.log(table.toString());
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
        		console.log("INVALID ID");
        		readProducts();
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
        			readProducts();
        		}

        	}
        
      })
    })
  }





// function start() {
//   inquirer
//     .prompt({
//       name: "topsong",
//       type: "rawlist",
//       message: "Would you like to [SEE SONGS BY] sung by a specific artist, see [ARTISTS MORE THAN ONCE] on the list, see all data within a [SPECIFIC RANGE], or see data for a specific [SONG]?",
//       choices: ["SEE SONGS BY", "ARTISTS MORE THAN ONCE", "SPECIFIC RANGE", "SONG"]
//     })
//     .then(function(answer) {
//         switch (answer){
//             case "SEE SONGS BY":
//                 songsBy();
//                 break;
//             default: 
//                 console.log("Wrong input.");
//         