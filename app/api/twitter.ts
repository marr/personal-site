import camelcaseKeys from 'camelcase-keys';

import { byDate } from '~/utils/date';
import { deepMerge, sortByField } from '~/utils/general';
export interface TweetAuthorProps {
    id: string,
    name: string,
    profileImageUrl: string,
    url: string,
    username: string,
    verified: boolean
};
export interface MediaProps {
    _id: string
    width: number
    height: number
    previewImageUrl?: string
    type: string
    url?: string
};
export interface TweetTextProps {
    text: string
    entities: any[]
};
export interface TweetProps {
    id: string
    author: any
    authorId: string
    children: TweetProps[]
    className?: string
    conversationId: string
    createdAt: string
    isReferencedTweet?: boolean
    text: string
    referencedTweets: any[]
    replies: TweetProps[]
    entities: any
    media: MediaProps[]
};
export interface UnavailableTweetProps {
    id: string
}

export interface TwitterConversationProps {
    conversationId: string
    tweets: TweetProps[]
};

const getTwitterData = async (url: URL) => {
    const response = await fetch(url.toString(), {
        headers: {
            authorization: `Bearer ${process.env.TWITTER_AUTH_TOKEN}`
        }
    });
    if (!response.ok) {
        throw response;
    }
    return response.json();
}

const getTweetsUrl = (path: string) => {
    const url = new URL(`https://api.twitter.com/2/${path}`);
    url.searchParams.set('expansions', 'author_id,referenced_tweets.id,referenced_tweets.id.author_id,in_reply_to_user_id,attachments.media_keys');
    url.searchParams.set('max_results', '15');
    url.searchParams.set('media.fields', 'preview_image_url,url,width,height,alt_text');
    url.searchParams.set('tweet.fields', 'created_at,in_reply_to_user_id,public_metrics,referenced_tweets,entities,conversation_id');
    url.searchParams.set('user.fields', 'name,username,profile_image_url,url,public_metrics,verified,entities');
    return url;
}

export const getActivity = async () => {
    const [likedData, tweetData] = await Promise.all([
        getTwitterData(getTweetsUrl('users/6685592/liked_tweets')),
        getTwitterData(getTweetsUrl('users/6685592/tweets'))
    ]);

    const mergedResults = camelcaseKeys({
        data: [
            ...likedData.data,
            ...tweetData.data
        ].sort(sortByField(
            ({ createdAt }: TweetProps) => new Date(createdAt),
            byDate()
        )),
        includes: deepMerge(likedData.includes, tweetData.includes)
    }, { deep: true, stopPaths: ['data.entities'] });

    
}
