export type TwitterLike = {
    id: string,
    created_at: string,
    text: string
};

export const getActivity = async (limit = 10) => {
    const likesUrl = new URL('https://api.twitter.com/2/users/6685592/liked_tweets');
    likesUrl.searchParams.set('max_results', String(limit));
    likesUrl.searchParams.set('tweet.fields', 'author_id,created_at');
    const response = await fetch(likesUrl.toString(), {
        headers: {
            authorization: `Bearer ${process.env.TWITTER_AUTH_TOKEN}`
        }
    });
    if (!response.ok) {
        throw response;
    }

    return response.json();
}