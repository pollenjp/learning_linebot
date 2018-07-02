

- https://github.com/snlangsuan/line-messaging
- Multi-Reply
  - https://developers.line.me/en/docs/messaging-api/reference/#request-body
  - https://github.com/line/line-bot-sdk-python/issues/67
  - https://github.com/line/line-bot-sdk-php/issues/28


# 課題
- メモ帳やエディタを使って以下の内容を打ち込む。
- 以下の項目を各地方に対して埋めてください。
  - 矢印は書かなくていい
  - <地方>
  - <都道府県名・日本語漢字>
  - <都道府県名・ローマ字>
  - <県庁所在地・ローマ字>
    - https://openweathermap.org/find
    - このサイトに「<県庁所在地・ローマ字>,JP」と入力して存在しているかどうかを確認
    - 泣ければメモしておいて後で報告してください。

```
->      case "<地方>":
          reply = {
            "type": "template",
            "altText": "This is a buttons template",
            "template": {
              "type": "buttons",
              "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
              "imageAspectRatio": "rectangle",
              "imageSize": "cover",
              "imageBackgroundColor": "#FFFFFF",
              "title": "どこの都道府県ですか？",
              "text": "選択してください。",
              "actions": [
                {
                "type" : "postback",
->              "label": "<都道府県名・日本語漢字>",
->              "data" : "question=prefecture" + "&" + "prefecture=<都道府県名・ローマ字>" + "&" + "capital=<県庁所在地・ローマ字>"
                },
                {
                "type" : "postback",
->              "label": "<都道府県名・日本語漢字>",
->              "data" : "question=prefecture" + "&" + "prefecture=<都道府県名・ローマ字>" + "&" + "capital=<県庁所在地・ローマ字>"
                },
->              {
->              ....
->              }
              ]
            }
          };
          break;
```


- 例

```
        case "kantou":
          reply = {
            "type": "template",
            "altText": "This is a buttons template",
            "template": {
              "type": "buttons",
              "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
              "imageAspectRatio": "rectangle",
              "imageSize": "cover",
              "imageBackgroundColor": "#FFFFFF",
              "title": "どこの都道府県ですか？",
              "text": "選択してください。",
              "actions": [
                {
                  "type" : "postback",
                  "label": "東京",
                  "data" : "question=prefecture" + "&" + "prefecture=Tokyo" + "&" + "capital=Tokyo"
                },
                {
                  "type" : "postback",
                  "label": "千葉",
                  "data" : "question=prefecture" + "&" + "prefecture=Chiba" + "&" + "capital=Chiba"
                },
                {
                  // 関東地方の他の県もあり。
                }
                }
              ]
            }
          };
          break;
```
