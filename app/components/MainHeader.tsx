import { NavLink } from '@remix-run/react';
import styles from '~/styles/header.css';

import Hero from './Hero';

export function links() {
    return [{ rel: 'stylesheet', href: styles}];
}

export default () => (
    <div data-header>
        <h1>
            <a href="/"><Hero /></a>
            <br />a blog by David Marr
        </h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/posts">Posts</NavLink>
            <NavLink to="/activity">Activity</NavLink>
        </nav>
    </div>
);