import { LinksFunction, LoaderFunction, useLoaderData } from "remix";

import { getActivity as getGithubActivity } from "~/api/github";
import type { GithubStarProps } from "~/api/github";

import activityStyles from '~/styles/activity.css';
import GithubStarredRepo from "~/components/GithubStarredRepo";


export const links: LinksFunction = () => [
    { rel: "stylesheet", href: activityStyles }
];

export const loader: LoaderFunction = async () => {
    return await Promise.all([
        getGithubActivity(),
    ]);
};

export default function Activity() {
    const [githubStars] = useLoaderData();
    return (
        <section className="activity-items">
            <h2>Recent Github starred repos</h2>
            {githubStars.map((item: GithubStarProps) => <GithubStarredRepo {...item} />)}
            <p><a href="https://github.com/marr?tab=stars">See all my Github stars</a></p>
        </section>
    );
}
