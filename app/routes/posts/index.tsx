import { Link, useLoaderData } from "remix";

import { getPosts } from "~/post";
import type { Post } from "~/post";

export const loader = async () => {
    return getPosts();
};

export default function Posts() {
    const posts = useLoaderData<Post[]>();
    return (
        <section>
            <h2>Some thoughts on technology</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.slug}>
                        <Link to={post.slug}>{post.title}</Link>
                        <span className="timestamp-year">{post.publishDate}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}