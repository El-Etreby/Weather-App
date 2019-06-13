// Constants
const weatherAPIKey =	process.env.weatherAPIKey || 'f3a36440c1e4ab173cf8b18889a0d307';
const city = 'Cairo,EG';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}&units=metric`;
const messagebirdAPIKey =	process.env.messagebirdAPIKey || 'yt5azs9neOwLop2l5GJXmj0ne';
const originatorMobileNumber =	process.env.originatorMobileNumber || '+201065781197';

// Imports
const express = require('express');
const request = require('request-promise-native');
const { check, validationResult } = require('express-validator/check');
const { promisify } = require('util');
const messagebird = require('messagebird')(messagebirdAPIKey);

const messagebirdCreate = promisify(messagebird.messages.create);

// Handle API Call
async function handleAPI(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        SUCCESS: false,
        MESSAGE: 'A validation error has occured.',
        ERRORS: errors.array(),
      });
    }

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
    if (response.recipients.items[0].status === 'sent') {
      return res.status(200).json({
        SUCCESS: true,
        MESSAGE: 'Your message has been successfully sent.',
      });
    }
    return res.status(400).json({
      SUCCESS: false,
      MESSAGE: 'An error occured while trying to send your message',
    });
  } catch (error) {
    return res.status(400).json({
      SUCCESS: false,
      MESSAGE: 'An error occured while trying to send your message',
    });
  }
}

const app = express();

app.use(express.json());

// Route
app.post(
  '/weather',
  [
    check('phone_number')
      .not()
      .isEmpty()
      .withMessage('Phone Number is required.')
      .isMobilePhone()
      .withMessage('Not a valid phone number.'),
  ],
  handleAPI,
);

// Port number
const port = process.env.PORT || 3000;

// Starting the server
app.listen(port, () => console.log(`App listening on port ${port}`));
