import { useEffect } from 'react';
import { HeadersFunction, json, LinksFunction, LoaderFunction, useLoaderData } from 'remix';
import { getActivity } from '~/api/twitter';
import twemoji from 'twemoji';
import twitterStyles from '~/styles/twitter.css';
import Tweet from '~/components/Tweet';

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
    const { data, includes } = await getActivity(50);
    return json({
        data,
        includes
    }, {
        headers: {
            ...cacheHeader
        }
    });
}

const byField = (fieldName:string) => (acc: any, next: any) => ({
    ...acc,
    [next[fieldName]]: next
});

export default function Index() {
    const { data, includes } = useLoaderData();
    useEffect(() => {
        twemoji.parse(document.body);
    }, []);
    const authors = includes.users?.reduce(byField('id'), {});
    const media = includes.media?.reduce(byField('media_key'), {});
    const tweets = includes.tweets?.reduce(byField('id'), {});
    return (
        <section>
            {data.map(activityItem => (
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

