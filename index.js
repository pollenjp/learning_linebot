// index.js

//------------------------------------------------------------
//  Require
//------------------------------------------------------------
const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').load();               // require and load dotenv

var getWeather = require("./openWeatherAPI/getWeatherInfo_sync.js");


//------------------------------------------------------------
//  KEY
//------------------------------------------------------------
const config = {
  channelAccessToken: process.env.MY_CHANNEL_ACCESS_TOKEN,  // .env
  channelSecret:      process.env.MY_CHANNEL_SECRET         // .env
}


//------------------------------------------------------------
//  app
//------------------------------------------------------------
const app = express();
app.post("/webhook", line.middleware(config),
  function(req, res)
  {
    Promise
      .all(req.body.events.map(handleEvent))
      .then(function(result){ res.json(result); });
  }
);


const client = new line.Client(config);
function handleEvent(event)
{
  if (event.type !== "message" || event.message.type !== "text"){
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  //--------------------
  // reply
  var weatherInfo = getWeather.getWeatherInfo();
  console.log(weatherInfo);
  const reply = {
    type: "text",
    text: weatherInfo[0].city_name
  };
  return client.replyMessage(event.replyToken, reply);
}


//------------------------------------------------------------
//  Listen Port
//------------------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, function()
  {
    console.log("Listening on ${port}");
  }
);

