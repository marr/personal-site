import { useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import invariant from "tiny-invariant";

import { getPost, Post } from "~/post";

export const loader: LoaderFunction = async ({
    params
}) => {
    invariant(params.slug, "expected params.slug");
    return getPost(params.slug);
};

export const meta: MetaFunction = ({ data }) => {
    return {
        title: data.title
    }
}

export default function PostSlug() {
    const post: Post = useLoaderData();
    return (
        <section>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <p className="publishDate">Published on: {post.publishDate}</p>
        </section>
    );
}