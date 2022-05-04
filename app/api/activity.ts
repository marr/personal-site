import { db } from "~/utils/db.server";

const pipeline = [
    {
        $lookup: {
            from: "TwitterUser",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
        },
    },
    {
        $unwind: {
            path: "$author",
        },
    },
    {
        $lookup: {
            from: "TwitterMedia",
            localField: "attachments.mediaKeys",
            foreignField: "_id",
            as: "media",
        },
    },
    {
        $group: {
            _id: "$conversationId",
            data: {
                $push: "$$ROOT",
            },
            sortDate: {
                $last: "$createdAt",
            },
        },
    },
    {
        $set: {
            provider: "twitter"
        }
    }
];

export type ActivityItem = {
    id: string;
    provider: "twitter" | "github";
    data: any;
};

const transformTweet = (tweet: any) => {
    return {
        ...tweet,
        createdAt: tweet.createdAt.$date,
    };
};

export async function getActivity() {
    const res = await db.tweet.aggregateRaw({
        pipeline,
    });

    // postprocess: replace date objects with strings, and tack on a className for activities
    return res.map((obj:any) => {
        obj.id = obj._id;
        obj.className = "activity-list-item";
        obj.key = `${obj.provider}-${obj._id}`;
        if (obj.provider === "twitter") {
            obj.data = obj.data.map(transformTweet);
        } else if (obj.provider === "github") {
            obj.data.starredAt = obj.data.starredAt.$date;
        }
        return obj;
    });
}
