import { useTransition } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

// import { queue } from "~/queues/crawler.server";
import scrapeTwitter from "~/scrapers/twitter";
import scrapeGithub from "~/scrapers/github";

export const loader: LoaderFunction = async () => {
    // await queue.add("crawl twitter", {
    //     provider: "twitter",
    // });
    await Promise.all([scrapeTwitter(), scrapeGithub()]);
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
