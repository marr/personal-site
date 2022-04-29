import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./tests/setup.js"],
    },
    resolve: {
        alias: {
            "~": resolve("./app"),
        },
    },
});