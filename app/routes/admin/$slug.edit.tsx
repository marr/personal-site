import {
    Form,
    LoaderFunction,
    redirect,
    useActionData,
    useLoaderData,
    useTransition,
} from "remix";
import type { ActionFunction } from "remix";
import invariant from "tiny-invariant";

type PostError = {
  title?: boolean;
  markdown?: boolean;
};

import { editPost, getPost } from "~/api/post";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");

    invariant(typeof slug === "string");

    const errors:PostError = {};
    if (!title) errors.title = true;
    if (!markdown) errors.markdown = true;

    if (Object.keys(errors).length) {
        return errors;
    }

    invariant(typeof title === "string");
    invariant(typeof markdown === "string");
    await editPost({ title, slug, markdown });

    return redirect("/admin");
};

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, "slug is required");
    const post = getPost(params.slug);
    return post;
}

export default function EditPost() {
    const data = useLoaderData();
    const errors = useActionData();
    const transition = useTransition();
    return (
        <Form method="post" >
            <input name="slug" type="hidden" value={data.slug} />
            <p>
                <label>
                    Post Title:{" "}
                    {errors?.title ? (
                        <em>Title is required</em>
                    ) : null}
                    <input type="text" name="title" defaultValue={data.title}/>
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:</label>{" "}
                {errors?.markdown ? (
                <em>Markdown is required</em>
                ) : null}
                <br />
                <textarea defaultValue={data.markdown} id="markdown" rows={20} name="markdown" />
            </p>
            <p>
                <button type="submit">
                    {transition.submission
                        ? "Saving..."
                        : "Save Post"
                    }
                </button>
            </p>
        </Form>
    );
}
