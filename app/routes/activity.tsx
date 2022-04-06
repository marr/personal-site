import { useEffect } from 'react';
import { LinksFunction, LoaderFunction, useLoaderData } from "remix";
import twemoji from 'twemoji';
import twitter from 'twitter-text';

import format from 'date-fns/format';

import { getActivity as getGithubActivity, GithubStar } from "~/api/github";
import { getActivity as getTwitterActivity, TwitterLike } from "~/api/twitter";
import _emojis from '~/assets/emojis.json';

import activityStyles from '~/styles/activity.css';

type GithubEmojis = typeof _emojis;

const emojis: GithubEmojis = _emojis;
const replaceGithubShortcodes = (str: string) => str.replaceAll(/:(\w*):/g, (_, key: keyof GithubEmojis) => {
    return `<img src=${emojis[key]} style="width: 20px; height: 20px;" />`;
});

const formatDate = (date: string | Date, formatStr: string = 'PP') => format(new Date(date), formatStr);
const sanitizeHTML = (str: string) => str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: activityStyles }
];

export const loader: LoaderFunction = async () => {
    const items = await getGithubActivity();
    const likes = await getTwitterActivity();
    return {
        items,
        twitterLikes: likes.data
    };
};

export default function Activity() {
    useEffect(() => {
        twemoji.parse(document.body);
    }, []);
    const data = useLoaderData();
    return (
        <section className="activity-items">
            <div>
                <h2>Recent Twitter likes</h2>
                {data.twitterLikes.map((item: TwitterLike) => (
                    <div key={item.id} className="activity-list-item">
                        <div dangerouslySetInnerHTML={{ __html: twitter.autoLink(item.text) }} />
                        <p className="timestamp tweeted-at">
                            <a className="" href={`https://twitter.com/twitter/status/${item.id}`}>
                                {formatDate(item.created_at)}
                            </a>
                        </p>
                    </div>
                ))}
                <p><a href="https://twitter.com/dmarr/likes">See all my Twitter likes</a></p>
            </div>
            <div>
                <h2>Recent Github starred repos</h2>
                {data.items.map((item: GithubStar) => {
                    const {
                        starred_at: starredAt,
                        repo: {
                            description,
                            full_name: fullName,
                            html_url: htmlUrl,
                            id
                        }
                    } = item;
    
                    return (
                        <div key={id} className="activity-list-item">
                            <a href={htmlUrl}>{fullName}</a>
                            {description && (
                                <p dangerouslySetInnerHTML={{
                                    __html: replaceGithubShortcodes(sanitizeHTML(description))
                                }} />
                            )}
                            <p className="timestamp starred-at">{formatDate(starredAt)}</p>
                        </div>
                    );
                })}
                <p><a href="https://github.com/marr?tab=stars">See all my Github stars</a></p>
            </div>
        </section>
    );
}
