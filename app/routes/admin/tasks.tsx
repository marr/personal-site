import { useTransition } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

import { queue } from "~/queues/crawler.server";
import crawl from "~/crawlers/twitter";

export const loader: LoaderFunction = async () => {
    // await queue.add("crawl twitter", {
    //     provider: "twitter",
    // });
    await crawl();

    return null;
};

export default function Index() {
    const transition = useTransition();

    return (
        <section>
            <p>Task queue</p>
        </section>
    );
}
