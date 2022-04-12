import {  useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { getActivity } from "~/api/activity";
import { getActivity as getGithubActivity } from "~/api/github";
import type { GithubStarProps } from "~/api/github";

import activityStyles from '~/styles/activity.css';
import GithubStarredRepo from "~/components/GithubStarredRepo";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: activityStyles }
];

export const loader: LoaderFunction = async () => {
    return await Promise.all([
        getActivity(),
        getGithubActivity()
    ]);
};

export default function Activity() {
    const [activity, githubStars] = useLoaderData();
    console.log(activity);
    return (
        <section className="activity-items">
            <h2>Recent Github starred repos</h2>
            {githubStars.map((item: GithubStarProps) => <GithubStarredRepo key={item.repo.id} {...item} />)}
            <p><a href="https://github.com/marr?tab=stars">See all my Github stars</a></p>
        </section>
    );
}
