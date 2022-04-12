import { useEffect } from 'react';
import { HeadersFunction, json, LinksFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getActivity } from '~/api/twitter';
import type { TweetProps } from '~/api/twitter';
import twemoji from 'twemoji';
import twitterStyles from '~/styles/twitter.css';
import Tweet from '~/components/Tweet';
import { reduceByField } from '~/utils/general';

const cacheHeader = {
    "Cache-Control": "max-age=300, s-maxage=3600", 
};

export const headers:HeadersFunction = () => {
    return {
        ...cacheHeader
    };
}

export const links:LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: twitterStyles }
    ];
}

export const loader:LoaderFunction = async () => {
    const { data, includes } = await getActivity();
    return json({
        data,
        includes
    }, {
        headers: {
            ...cacheHeader
        }
    });
}


export default function Index() {
    const { data, includes } = useLoaderData();
    useEffect(() => {
        twemoji.parse(document.body);
    }, []);
    const authors = includes.users?.reduce(reduceByField('id'), {});
    const media = includes.media?.reduce(reduceByField('mediaKey'), {});
    const tweets = includes.tweets?.reduce(reduceByField('id'), {});
    return (
        <section>
            {data.map((activityItem:TweetProps) => (
                <Tweet
                    key={activityItem.id}
                    {...activityItem}
                    authors={authors}
                    media={media}
                    tweets={tweets}
                />
            ))}
        </section>
    );
}

