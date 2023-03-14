import { NavLink } from 'react-router-dom';
import { useTokenStore } from '../stores/TokenZustand';

import classes from './MainNavigation.module.css';

function MainNavigation() {
    const accessToken = useTokenStore((state) => state.accessToken);
    const idToken = useTokenStore((state) => state.idToken);
    const reset = useTokenStore((state) => state.reset);
    return (
        <header className={classes.header}>
            <nav>
                <ul className={classes.list}>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? classes.active : undefined
                            }
                            end
                        >
                            Home
                        </NavLink>
                    </li>
                    {accessToken && (
                        <li>
                            <NavLink
                                to="/call"
                                className={({ isActive }) =>
                                    isActive ? classes.active : undefined
                                }
                            >
                                Make a Call
                            </NavLink>
                        </li>
                    )}
                    {!accessToken && (
                        <li>
                            <NavLink
                                to="/auth/login"
                                className={({ isActive }) =>
                                    isActive ? classes.active : undefined
                                }
                            >
                                Authentication
                            </NavLink>
                        </li>
                    )}
                    {accessToken && (
                        <li>
                            <button onClick={reset}>Log out</button>
                        </li>
                    )}
                    {idToken?.name?.toString() && (
                        <li>Hello {idToken.name.toString()} </li>
                    )}
                    {/*TODO Include Button for Call Option Button*/}
                    {/* TODO Include Modal for Call Options*/}
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
