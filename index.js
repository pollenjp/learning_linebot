// index.js

//--------------------
//  Require
//--------------------
const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').load();               // require and load dotenv

var getWeather = require("./openWeatherMap/getWeatherInfo_sync.js");


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
const client = new line.Client(config);

app.post("/webhook", line.middleware(config),
  function(req, res)
  {
    console.log("get");
    Promise
      .all(req.body.events.map(handleEvent))
      .then(function(result){ res.json(result); });
  }
);


//------------------------------------------------------------
//  handleEvent
function handleEvent(event)
{
  console.log(event);
  console.log(event.type);
  console.log(event.timestamp);
  console.log(event.source);
  //if (event.type !== "message" || event.message.type !== "text"){
  //  // ignore non-text-message event
  //  return Promise.resolve(null);
  //}

  //----------------------------------------
  // reply
  //----------------------------------------
  var reply;
  //--------------------
  //  type : message
  //--------------------
  if (event.type == "message" && event.message.type == "text"){
    reply = replyToMessageEvent(event);
  }
  //--------------------
  //  type : postback
  //--------------------
  if (event.type == "postback"){
    reply = replyToPostbackEvent(event);
  }

  return client.replyMessage(event.replyToken, reply);
}


//------------------------------------------------------------
//  replyToMessageEvent
function replyToMessageEvent(event)
{
  //----------
  //  reply : Text Message
  //----------
  //var weatherInfo = getWeather.getWeatherInfo();
  //console.log(weatherInfo);
  //const reply = {  // Text Message
  //  type: "text",
  //  text: weatherInfo[0].city_name
  //};
  //----------
  //  reply : Button Template Message
  //----------
  var reply = {  // Button Template Message
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
      "type": "buttons",
      //"thumbnailImageUrl": "http://openweathermap.org/img/w/01d.png",
      "thumbnailImageUrl":
        "https://raw.githubusercontent.com/pollenjp/learning_linebot/feature/line-sdk/image/umbrella01.gif",
      //"thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
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
          "label": "はい",
          "data": "question=needUmbrella&action=yes"
        },
        {
          "type": "postback",
          "label": "いいえ",
          "data": "question=needUmbrella&action=no"
        }
      ]
    }
  };
  return reply;
}

//------------------------------------------------------------
function replyToPostbackEvent(event)
{
  var postback_data_obj = queryStringToJSON(event.postback.data);
  console.log(postback_data_obj);
  var reply;
  switch (postback_data_obj.question){
    case "needUmbrella":
      reply = [];
      var weatherInfo = getWeather.getWeatherInfo();
      var image_base_url = "https://raw.githubusercontent.com/pollenjp/learning_linebot/"
                           + "ba771488af16cf08fcb7fc81a16a89981c8abbdb"
                           + "/image/";
      reply.push({
        type: "text",
        text: weatherInfo[0].forecast
      });
      reply.push({
        "type": "image",
        "originalContentUrl": image_base_url + weatherInfo[0].icon + ".png",
        "previewImageUrl"   : image_base_url + weatherInfo[0].icon + ".png"
      });
      break;
    default:
      reply = {
        type: "text",
        text: "event:postback"
      };
  }
  return reply;
}


//--------------------------------------------------------------------------------
//  queryStringToJSON
function queryStringToJSON(qs) {
  // reference
  //    Carlo G
  //      - https://stackoverflow.com/questions/11557526/deserialize-query-string-to-json-object
  qs = qs || location.search.slice(1);

  var pairs = qs.split('&');
  var result = {};
  pairs.forEach(function(p) {
    var pair = p.split('=');
    var key = pair[0];
    var value = decodeURIComponent(pair[1] || '');

    if( result[key] ) {
      if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
        result[key].push( value );
      } else {
        result[key] = [ result[key], value ];
      }
    } else {
      result[key] = value;
    }
  });

  return JSON.parse(JSON.stringify(result));
};

//--------------------------------------------------------------------------------
//  Listen Port
//--------------------------------------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, function()
  {
    console.log("Listening on ${port}");
  }
);

