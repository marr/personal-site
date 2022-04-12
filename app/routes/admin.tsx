import { Outlet, useMatches, Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import adminStyles from "~/styles/admin.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export default function Admin() {
    const matches = useMatches();
    return (
        <section>
            <h2><Link to="/admin">Admin</Link></h2>
            <Outlet />
        </section>
    );
}
