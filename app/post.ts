import path from "path";
import fs from "fs/promises";
import { format } from "date-fns";
import invariant from "tiny-invariant";
import { markdownToHtml, parseFrontMatter } from "./utils/markdown.server";

export type Post = {
    publishDate: string,
    slug: string,
    title: string,
    html: string,
    markdown: string
};

export type PostMarkdownAttributes = {
    date: string,
    title: string;
};

const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
    attributes: any
): attributes is PostMarkdownAttributes {
    return attributes?.title;
}

export async function getPosts() {
    const dir = await fs.readdir(postsPath);
    return Promise.all(
        dir.map(async filename => {
            const file = await fs.readFile(
                path.join(postsPath, filename)
            );
            const { attributes } = parseFrontMatter(
                file.toString()
            );
            invariant(
                isValidPostAttributes(attributes),
                `${filename} has bad meta data!`
            );
            return {
                publishDate: format(new Date(attributes.date), 'yyyy'),
                slug: filename.replace(/\.md$/, ""),
                title: attributes.title
            };
        })
    );
}

export async function getPost(slug: string) {
    const filepath = path.join(postsPath, slug + ".md");
    const file = await fs.readFile(filepath);
    const { attributes, body,  } = parseFrontMatter(file.toString());
    invariant(
        isValidPostAttributes(attributes),
        `Post ${filepath} is missing attributes`
    );
    const html = await markdownToHtml(body);
    return {
        html,
        markdown: body,
        publishDate: format(new Date(attributes.date), 'PP'),
        slug,
        title: attributes.title
    };
}

type NewPost = {
    title: string;
    slug: string;
    markdown: string;
};

export async function createPost(post: NewPost) {
    const publishDate = format(new Date(), 'MM-dd-yyyy');
    const md = `---\ntitle: ${post.title}\ndate: ${publishDate}\n---\n\n${post.markdown}`;
    await fs.writeFile(path.join(postsPath, post.slug + ".md"), md);
    return getPost(post.slug);
}

export async function editPost(post: NewPost) {
    const filepath = path.join(postsPath, post.slug + ".md");
    const file = await fs.readFile(filepath);
    const { attributes, body } = parseFrontMatter(file.toString());
    invariant(
        isValidPostAttributes(attributes),
        `Post ${filepath} is missing attributes`
    );
    const md = `---\ntitle: ${post.title}\ndate: ${attributes.date}\n---\n\n${post.markdown}`;
    await fs.writeFile(path.join(postsPath, post.slug + ".md"), md);
    return getPost(post.slug);
}