import { Outlet, Link, useLoaderData, LinksFunction } from "remix";

import { getPosts } from "~/api/post";
import type { Post } from "~/api/post";

import adminStyles from "~/styles/admin.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export const loader = async () => {
    return getPosts();
};

export default function Admin() {
    const posts = useLoaderData<Post[]>();
    return (
        <div className="admin">
            <nav>
                <h2>Admin</h2>
                <ul>
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <Link reloadDocument to={`${post.slug}/edit`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
