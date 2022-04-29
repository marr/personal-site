import camelcaseKeys from 'camelcase-keys';
import { byDate } from '~/utils/date';
import { deepMerge, sortByField } from '~/utils/general';
import likedTweets from '../../tests/fixtures/liked-tweets.json';
import tweets from '../../tests/fixtures/tweets.json';

export const getActivity = async () => {
    const {
        data: likedData,
        includes: likedIncludes
    } = likedTweets;
    const {
        data: tweetData,
        includes: tweetIncludes
    } = tweets;

    return camelcaseKeys({
        data: [
            ...likedData,
            ...tweetData
        ].sort(sortByField(
            ({ created_at }: any) => new Date(created_at),
            byDate()
        )),
        includes: deepMerge(likedIncludes, tweetIncludes)
    }, { deep: true, stopPaths: ['data.entities'] });
};