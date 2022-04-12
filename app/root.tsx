import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import MainHeader, { links as headerLinks } from './components/MainHeader';
import styles from "~/styles/shared.css";

export const meta: MetaFunction = () => {
    return { title: "Crushing Code - a blog by David Marr" };
};

export const links: LinksFunction = () => {
    return [
        ...headerLinks(),
        {
            rel: 'stylesheet',
            href: styles
        }
    ]
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <header>
                    <MainHeader /> 
                </header>
                <main>
                    <Outlet />
                </main>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
