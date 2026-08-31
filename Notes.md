Form Validations => when we enter the data in the form, the browser and/or the web server will check to see that the data is in the correct format and within the constraints set by the application 

Express Router:-  Way to organise your express application such that our primary app.js file does not become bloated.

const router = express.Router();

Cookies = Http cookies are small blocks of data created by a web server while a user is browsing a website and placed on the users computer or other devices by the users web browser

State ==> Stateful Protocol require server to save the status and session information

Stateless protocol does not require the server to retain the server information 

Express Session => An attempt to make our session stateful

Connect-flash => the flash is a special area of the session used for storing messages.messages are written to the flash and cleared after being displayed to the user

Authentication:- It is the process of verifying who someone is 

Authorization:- Authorization is the process of verifying what specific applications , files , and data a user has access to

Storing Password :- we never store the passwords as it is. we store their hashed form.

Hashing :- For every input there is a fixed output. they are one-way functions. we cant get input from the output. for a different input, there is a different output but of same length. small changes in input should bring large changes in output

Salting:- Password salting technique to protect passwords stored in a database by adding a string of 32 or more characters adn then hashing them.