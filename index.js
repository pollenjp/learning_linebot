// index.js

//--------------------
//  Require
//--------------------
const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').load();               // require and load dotenv

var getWeather = require("./openWeatherAPI/getWeatherInfo_sync.js");


//--------------------
//  config
//--------------------
const config = {
  channelAccessToken : process.env.MY_CHANNEL_ACCESS_TOKEN,  // .env
  channelSecret      : process.env.MY_CHANNEL_SECRET         // .env
}


//--------------------------------------------------------------------------------
//  Main
//--------------------------------------------------------------------------------
const app = express();
app.post("/webhook", line.middleware(config),
  function(req, res)
  {
    Promise
      .all(req.body.events.map(handleEvent))
      .then(function(result){ res.json(result); });
  }
);



//--------------------
//  handleEvent
const client = new line.Client(config);
function handleEvent(event)
{
  if (event.type !== "message" || event.message.type !== "text"){
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  //----------------------------------------
  // reply
  //----------------------------------------
  //--------------------
  //  type : message
  //--------------------
  //if (event.type == "message" && event.message.type == "text"){
    //----------
    //  Text Message
    //----------
    //var weatherInfo = getWeather.getWeatherInfo();
    //console.log(weatherInfo);
    //const reply = {  // Text Message
    //  type: "text",
    //  text: weatherInfo[0].city_name
    //};
    //----------
    //  Button Template Message
    //----------
    const reply = {  // Button Template Message
      "type": "template",
      "altText": "This is a buttons template",
      "template": {
        "type": "buttons",
        //"thumbnailImageUrl": "http://openweathermap.org/img/w/01d.png",
        "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
        "imageAspectRatio": "rectangle",
        "imageSize": "cover",
        "imageBackgroundColor": "#FFFFFF",  // white
        "title": "傘の有無を調べますか？",
        "text": "選択してください。",
        "defaultAction": {
          "type": "uri",
          "label": "View detail",
          "uri": "http://example.com/page/123"
        },
        "actions": [
          {
            "type": "postback",
            "label": "Buy",
            "data": "action=buy&itemid=123"
          },
          {
            "type": "postback",
            "label": "Add to cart",
            "data": "action=add&itemid=123"
          },
          {
            "type": "uri",
            "label": "View detail",
            "uri": "http://example.com/page/123"
          }
        ]
      }
    };
  //}
  //--------------------
  //  type : postback
  //--------------------
  //if (event.type == "postback"){
  //  const reply = {};
  //  console.log("event:postback");
  //  console.log(event);
  //  reply = {  // Text Message
  //    type: "text",
  //    text: "event:postback"
  //  };
  //}

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

