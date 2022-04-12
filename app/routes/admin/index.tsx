import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/api/post";
import type { Post } from "~/api/post";

export const loader = async () => {
    return getPosts();
};

export default function AdminIndex() {
    const posts = useLoaderData<Post[]>();
    return (
        <article>
            <p>
                <Link to="tasks">Manage tasks</Link>
            </p>
            <hr />
            <div>
                <Link to="new">Create a new post</Link>
                <ul className="posts">
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <Link reloadDocument to={`${post.slug}/edit`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}
