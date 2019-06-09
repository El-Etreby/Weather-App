// Constants
const weatherAPIKey = 'f3a36440c1e4ab173cf8b18889a0d307';
const city = 'Cairo,EG';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}&units=metric`;
const messagebirdAPIKey = 'a9ZQ8t6QNDwiRbLbzAl2FSIy5';
const originatorMobileNumber = '+201065781197';

// Imports
const express = require('express');
const request = require('request-promise-native');
const { promisify } = require('util');
const messagebird = require('messagebird')(messagebirdAPIKey);

const messagebirdCreate = promisify(messagebird.messages.create);

// Controller
async function handleAPI(req, res) {
  try {
    // Get Current Weather
    const body = await request.get(url);
    const weather = JSON.parse(body);
    const message = `It's ${weather.main.temp} degrees in ${weather.name}!`;

    // Send Message
    const recipientMobileNumber = req.body.phone_number;

    const response = await messagebirdCreate({
      originator: originatorMobileNumber,
      recipients: [recipientMobileNumber],
      body: message,
    });
    console.log(response);

    // Response
    res.status(200).json({
      SUCCESS: true,
    });
  } catch (error) {
    console.log(error);

    // Response
    res.status(400).json({
      SUCCESS: false,
    });
  }
}

const app = express();

app.use(express.json());

// Route
app.post('/weather', handleAPI);

// Port number
const port = process.env.PORT || 3000;

// Starting the server
app.listen(port, () => console.log(`App listening on port ${port}`));
