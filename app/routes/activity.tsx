import { LoaderFunction, useLoaderData } from "remix";

import isSameDay from 'date-fns/isSameDay';
import formatDistance from 'date-fns/formatDistance';

import { getActivity, GithubStar } from "~/api/activity";
import _emojis from '~/assets/emojis.json';
import React from "react";

type GithubEmojis = typeof _emojis;

const emojis: GithubEmojis = _emojis;
const replaceGithubShortcodes = (str: string) => str.replaceAll(/:(\w*):/g, (_, key: keyof GithubEmojis) => {
    return `<img src=${emojis[key]} style="width: 20px; height: 20px;" />`;
});

const sanitizeHTML = (str: string) => str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const loader: LoaderFunction = async () => {
    const items = await getActivity();
    return {
        items
    };
};

export default function Activity() {
    const data = useLoaderData();
    let lastStarredAt: Date;
    return (
        <section>
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
                    timeStamp = formatDistance(starredAt, new Date(), { addSuffix: true });
                    lastStarredAt = starredAt;
                } 
 
                return (
                    <React.Fragment key={id}>
                        {timeStamp && <p className="timestamp">{timeStamp}</p>}
                        <div className="github-starred-item">
                            <a href={htmlUrl}>{fullName}</a>
                            <p dangerouslySetInnerHTML={{
                                __html: replaceGithubShortcodes(sanitizeHTML(description))
                            }} />
                        </div>
                    </React.Fragment>
                );
            })}
        </section>
    );
}
