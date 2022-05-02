import { createElement, useEffect } from "react";
import {  useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import twemoji from "twemoji";
import { getActivity } from "~/api/activity";
import { getActivity as getTwitterActivity } from "~/api/twitter";
import type ActivityItem from '~/api/activity';
// import { getActivity as getGithubActivity } from "~/api/github";

import GithubStarredRepo from "~/components/GithubStarredRepo";
import TwitterConversation from "~/components/TwitterConversation";

import activityStyles from '~/styles/activity.css';
import twitterStyles from '~/styles/twitter.css';

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: activityStyles },
    { rel: "stylesheet", href: twitterStyles }
];

export const loader: LoaderFunction = async () => {
    const [twitterActivity] = await Promise.all([
        getTwitterActivity()
        // getActivity(),
        // getGithubActivity()
    ]);
    return twitterActivity.map((item, index) => ({
        id: index,
        data: item,
        provider: 'twitter'
    }));
};

const providerMap = {
    twitter: TwitterConversation,
    github: GithubStarredRepo,
    // youtube: null
};

export default function Activity() {
    const [activity] = useLoaderData();
    useEffect(() => {
        twemoji.parse(document.body);
    }, []);
    return (
        <section className="activity-items">
            <h2>Recent Activity</h2>
            <p>The following items are recent things I have liked, starred, tweeted, etc.</p>
            {activity.map((item: ActivityItem) => {
                if (item.provider === 'twitter') {
                    return <TwitterConversation key={item.id} conversationId={item.id} tweets={item.data} />;
                } else {
                    return createElement(providerMap[item.provider], item.data);
                }
            })}
            {/* <p><a href="https://github.com/marr?tab=stars">See all my Github stars</a></p> */}
        </section>
    );
}
