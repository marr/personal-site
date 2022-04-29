import { db } from '~/utils/db.server';

const pipeline = [
    // { 
    //     "$match" : { 
    //         "type" : { 
    //             "$eq" : null
    //         }
    //     }
    // }, 
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
    },
    { 
        "$lookup" : { 
            "from" : "TwitterUser", 
            "localField" : "referencedTweets.authorId", 
            "foreignField" : "_id", 
            "as" : "referencedAuthor"
        }
    },
    {
        "$unwind": "$referencedAuthor"
    },
    { 
        "$addFields" : { 
            "provider" : "twitter", 
            "sortDate" : "$createdAt",
            "referencedTweets.author": "$referencedAuthor"
        }
    },
    {
        "$unset": "referencedAuthor"
    },
    { 
        "$unionWith" : { 
            "coll" : "GithubStar", 
            "pipeline" : [
                { 
                    "$addFields" : { 
                        "provider" : "github", 
                        "sortDate" : "$starredAt"
                    }
                }
            ]
        }
    }, 
    { 
        "$group" : { 
            "_id" : { 
                "externalId" : "$_id", 
                "provider" : "$provider"
            }, 
            "provider" : { 
                "$first" : "$provider"
            }, 
            "data" : { 
                "$push" : "$$ROOT"
            }
        }
    }, 
    { 
        "$sort" : { 
            "data.sortDate" : -1.0
        }
    }, 
    { 
        "$unset" : [
            "_id", 
            "data.provider"
        ]
    }, 
    { 
        "$unwind" : { 
            "path" : "$data"
        }
    }
];

const pipeline2 = [
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
    },
    { 
        "$lookup" : { 
            "from" : "TwitterUser", 
            "localField" : "referencedTweets.authorId", 
            "foreignField" : "_id", 
            "as" : "referencedAuthor"
        }
    },
    {
        "$unwind": "$referencedAuthor"
    },
    { 
        "$addFields" : { 
            "provider" : "twitter", 
            "sortDate" : "$createdAt",
            "referencedTweets.author": "$referencedAuthor"
        }
    },
    {
        "$unset": "referencedAuthor"
    },
    { 
        "$group" : { 
            "_id" : "$conversationId", 
            "data" : { 
                "$push" : "$$ROOT"
            },
            "provider" : { 
                "$first" : "$provider"
            },
        }
    }
];

const pipeline3 = [
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
        "$group" : { 
            "_id" : "$conversationId", 
            "data" : { 
                "$push" : "$$ROOT"
            },
            "sortDate" : {
                $last: "$createdAt"
            } 
        }
    },
    {
        "$addFields": {
            "provider": "twitter"
        }
    },
    { 
        "$sort" : { 
            "sortDate" : -1.0
        }
    }, 
]

type ActivityItem = {
    id: string
    provider: 'twitter' | 'github'
    data: any
};

const transformTweet = (tweet: any) => {
    return {
        ...tweet,
        createdAt: tweet.createdAt.$date
    };
};

export async function getActivity() {
    const res: ActivityItem[] = await db.tweet.aggregateRaw({
        pipeline: pipeline3
    });

    // postprocess: replace date objects with strings, and tack on a className for activities
    for (const obj of res) {
        obj.id = obj._id;
        obj.className = 'activity-list-item';
        obj.key = `${obj.provider}-${obj._id}`;
        if (obj.provider === 'twitter') {
            obj.data = obj.data.map(transformTweet);
        } else if (obj.provider === 'github') {
            obj.data.starredAt = obj.data.starredAt.$date;
        }
    };
    return res;
}