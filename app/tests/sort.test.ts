import { byDate } from '../utils/date';

const sortByField = (fieldName: any, sortFunc: any) => {
    if (typeof fieldName === 'function') {
        return (a: any, b: any) => sortFunc(fieldName(a), fieldName(b));
    }
    return (a: any, b: any) => sortFunc(a[fieldName], b[fieldName]);
};


const b1 = {
    "data": [
        {
            "entities": {
                "mentions": [{ "start": 0, "end": 5, "username": "jack", "id": "12" }],
                "annotations": [{ "start": 47, "end": 53, "probability": 0.6204, "type": "Product", "normalized_text": "Twitter" }]
            },
            "in_reply_to_user_id": "12",
            "created_at": "2022-04-02T18:17:58.000Z",
            "text": "@jack You shouldn't beat yourself up about it, Twitter is great!\n\nWhere do I apply to help you build the next cool thing?",
            "public_metrics": { "retweet_count": 0, "reply_count": 0, "like_count": 3, "quote_count": 0 },
            "id": "1510320650124247044",
            "author_id": "6685592",
            "referenced_tweets": [{ "type": "replied_to", "id": "1510314535671922689" }]
        },
        {
            "entities": {
                "mentions": [{ "start": 12, "end": 26, "username": "StackOverflow", "id": "128700677" }],
                "urls": [
                    {
                        "start": 27,
                        "end": 50,
                        "url": "https://t.co/mWt034aRx6",
                        "expanded_url": "https://bukk.it/popcorn3d.gif",
                        "display_url": "bukk.it/popcorn3d.gif"
                    }
                ]
            },
            "created_at": "2022-04-03T13:28:51.000Z",
            "text": "Very funny, @StackOverflow https://t.co/mWt034aRx6",
            "public_metrics": { "retweet_count": 0, "reply_count": 0, "like_count": 0, "quote_count": 0 },
            "id": "1509885504170438682",
            "author_id": "6685592"
        },
        {
            "entities": { "mentions": [{ "start": 0, "end": 11, "username": "midjourney", "id": "1307056292465274880" }] },
            "in_reply_to_user_id": "1307056292465274880",
            "created_at": "2023-03-28T21:29:48.000Z",
            "text": "@midjourney Can i keep it!",
            "public_metrics": { "retweet_count": 0, "reply_count": 0, "like_count": 0, "quote_count": 0 },
            "id": "1508556989357514760",
            "author_id": "6685592",
            "referenced_tweets": [{ "type": "replied_to", "id": "1508555785554386948" }]
        },
        {
            "entities": { "mentions": [{ "start": 0, "end": 11, "username": "midjourney", "id": "1307056292465274880" }] },
            "in_reply_to_user_id": "1307056292465274880",
            "created_at": "2022-03-28T19:36:03.000Z",
            "text": "@midjourney \uD83D\uDC86\uD83C\uDFFC‍♂️\uD83C\uDF2C",
            "public_metrics": { "retweet_count": 0, "reply_count": 1, "like_count": 0, "quote_count": 0 },
            "id": "1508528363715051532",
            "author_id": "6685592",
            "referenced_tweets": [{ "type": "replied_to", "id": "1508519799487225858" }]
        }
    ]
}

const b2 = {
    "data": [
        {
            "text": "Shout out to all the devs who spent hours installing MySQL manually using @danbenjamin’s old school instructions.",
            "public_metrics": { "retweet_count": 1, "reply_count": 1, "like_count": 10, "quote_count": 0 },
            "author_id": "18884269",
            "created_at": "2022-04-04T09:57:33.000Z",
            "id": "1509183051502272512",
            "entities": { "mentions": [{ "start": 74, "end": 86, "username": "danbenjamin", "id": "5905672" }] }
        },
        {
            "text": "JS devs: I've made a JS library that reliably maps US zip codes to states for &lt;3k.  \n\nYour users should never need to enter their state into a form field again.\n\nhttps://t.co/Ll4JaEVM9c",
            "public_metrics": { "retweet_count": 0, "reply_count": 0, "like_count": 4, "quote_count": 0 },
            "author_id": "1797691",
            "created_at": "2022-03-30T13:20:18.000Z",
            "entities": {
                "urls": [
                    {
                        "start": 165,
                        "end": 188,
                        "url": "https://t.co/Ll4JaEVM9c",
                        "expanded_url": "https://github.com/Meandmybadself/zip2state",
                        "display_url": "github.com/Meandmybadself…"
                    }
                ]
            },
            "id": "1509158579529469964"
        },
        {
            "text": "@anthonygore Remix, probably",
            "public_metrics": { "retweet_count": 0, "reply_count": 0, "like_count": 3, "quote_count": 0 },
            "author_id": "995546167",
            "created_at": "2022-03-30T03:11:12.000Z",
            "referenced_tweets": [{ "type": "replied_to", "id": "1508963137693052929" }],
            "id": "1509005294063403014",
            "in_reply_to_user_id": "13802782",
            "entities": { "mentions": [{ "start": 0, "end": 12, "username": "anthonygore", "id": "13802782" }] }
        },
        {
            "text": "\"there are several reasons why choices ≠ preferences — or, more precisely, why observing that a choice was made does not always tell you the reasons it was made.\" https://t.co/fhWfuMHh5y",
            "public_metrics": { "retweet_count": 0, "reply_count": 0, "like_count": 5, "quote_count": 0 },
            "author_id": "435324476",
            "created_at": "2022-03-26T00:31:23.000Z",
            "entities": {
                "urls": [
                    {
                        "start": 163,
                        "end": 186,
                        "url": "https://t.co/fhWfuMHh5y",
                        "expanded_url": "https://medium.com/understanding-recommenders/what-does-it-mean-to-give-someone-what-they-want-the-nature-of-preferences-in-recommender-systems-82b5a1559157",
                        "display_url": "medium.com/understanding-…"
                    }
                ]
            },
            "id": "1507515522362974208"
        }
    ]
};

type DataType = {
    created_at: string
};

const sorted1 = {
    data: [...b1.data, ...b2.data].sort(sortByField(
        ({ created_at }: DataType) => new Date(created_at),
        byDate(false)
    ))
};

// console.log(sorted1.data);

const deep = {
    data: [
        ...b1.data,
        ...b2.data
    ]
};

console.dir(deep.data.map(({ entities }: any) => entities.urls));