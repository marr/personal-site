import { db } from '~/utils/db.server';

const pipeline = [
    { 
        "$match" : { 
            "type" : { 
                "$eq" : null
            }
        }
    }, 
    { 
        "$lookup" : { 
            "from" : "TwitterUser", 
            "localField" : "authorId", 
            "foreignField" : "_id", 
            "as" : "author"
        }
    }, 
    { 
        "$unwind" : { 
            "path" : "$author"
        }
    }, 
    { 
        "$lookup" : { 
            "from" : "TwitterMedia", 
            "localField" : "attachments.mediaKeys", 
            "foreignField" : "_id", 
            "as" : "media"
        }
    }, 
    { 
        "$lookup" : { 
            "from" : "Tweet", 
            "localField" : "referencedTweets.id", 
            "foreignField" : "_id", 
            "as" : "referencedTweets"
        }
    }
];

export async function getActivity() {
    return await db.tweet.aggregateRaw({
        pipeline
    })
}