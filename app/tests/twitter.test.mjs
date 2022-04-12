import twitter from 'twitter-text';

const tweet = "@dmarr Here you go \"💆🏼‍♂️🌬\" https://t.co/1YbnShrrVA";
const linkedTweet = twitter.autoLink(tweet, {
    urlEntities: [
        {
            // indices: [28, 51],
            // "start": 28,
            // "end": 51,
            "url": "https://t.co/1YbnShrrVA",
            "expanded_url": "https://twitter.com/midjourney/status/1508555785554386948/photo/1",
            "display_url": "pic.twitter.com/1YbnShrrVA"
          }
    ]
})
console.log(linkedTweet);