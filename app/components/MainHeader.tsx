import { NavLink } from 'remix';
import styles from '~/styles/header.css';

export function links() {
    return [{ rel: 'stylesheet', href: styles}];
}

export default () => (
    <div data-header>
        <h1><a href="/">David Marr</a></h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/posts">Posts</NavLink>
            <NavLink to="/activity">Activity</NavLink>
        </nav>
    </div>
);