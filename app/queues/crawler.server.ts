import { Queue } from "~/utils/queue.server";

import twitter from '~/scrapers/twitter';

type QueueData = {
    provider: "twitter" | "github" | "youtube";
};

export const queue = Queue<QueueData>("crawler", async (job) => {
    console.log(`Starting ${job.data.provider} crawl`);
    await twitter();
    console.log(`Completed crawling ${job.data.provider}`);
});
