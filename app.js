const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { handleFormSubmission } = require('./payrol-setup');

const app = express();
const port = 3080;

 app.use(express.static('public'));

// Assuming your images are in the 'images/public' directory
//const imagesPath = path.join(__dirname, 'images', 'public');

// Make the images accessible at the '/images' route
//app.use('/images', express.static(imagesPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine (EJS)
app.set('view engine', 'ejs');
// Define routes
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'views') });
});

// Endpoint to handle form submission
app.post('/submit', handleFormSubmission);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
