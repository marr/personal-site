import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "remix";
import type { MetaFunction } from "remix";
import MainHeader, { links as headerLinks } from './components/MainHeader';
import styles from "~/styles/shared.css";

export const meta: MetaFunction = () => {
    return { title: "New Remix App" };
};

export function links() {
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
