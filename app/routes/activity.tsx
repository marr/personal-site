import { LoaderFunction, useLoaderData } from "remix";

import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';

import { getActivity as getGithubActivity, GithubStar } from "~/api/github";
import { getActivity as getTwitterActivity, TwitterLike } from "~/api/twitter";
import _emojis from '~/assets/emojis.json';
import React from "react";

type GithubEmojis = typeof _emojis;

const emojis: GithubEmojis = _emojis;
const replaceGithubShortcodes = (str: string) => str.replaceAll(/:(\w*):/g, (_, key: keyof GithubEmojis) => {
    return `<img src=${emojis[key]} style="width: 20px; height: 20px;" />`;
});

const sanitizeHTML = (str: string) => str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const loader: LoaderFunction = async () => {
    const items = await getGithubActivity();
    const likes = await getTwitterActivity();
    return {
        items,
        twitterLikes: likes.data
    };
};

export default function Activity() {
    const data = useLoaderData();
    let lastStarredAt: Date;
    return (
        <section>
            <h2>Recent twitter likes</h2>
            {data.twitterLikes.map((item: TwitterLike) => (
                <React.Fragment key={item.id}>
                    <div className="twitter-liked-item">
                        <p>{item.text}</p>
                    </div>
                </React.Fragment>
            ))}
            <h2>Recent github starred repos</h2>
            {data.items.map((item: GithubStar) => {
                let timeStamp;
                let {
                    starred_at: starredAt,
                    repo: {
                        description,
                        full_name: fullName,
                        html_url: htmlUrl,
                        id
                    }
                } = item;
                starredAt = new Date(starredAt);
                if (!isSameDay(starredAt, lastStarredAt)) {
                    timeStamp = format(starredAt, 'PP');
                    lastStarredAt = starredAt;
                } 
 
                return (
                    <React.Fragment key={id}>
                        {timeStamp && <p className="timestamp">{timeStamp}</p>}
                        <div className="github-starred-item">
                            <a href={htmlUrl}>{fullName}</a>
                            {description && (
                                <p dangerouslySetInnerHTML={{
                                    __html: replaceGithubShortcodes(sanitizeHTML(description))
                                }} />
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </section>
    );
}
