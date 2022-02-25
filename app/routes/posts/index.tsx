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
            <ul>
                {posts.map(post => (
                    <li key={post.slug}>
                        <Link to={post.slug}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}