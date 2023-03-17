import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../stores/ZustandStore';
import CallOptions from './Call/CallOptions/CallOptions';
import CallOptionsButton from './Call/CallOptions/CallOptionsButton';

import classes from './MainNavigation.module.css';

function MainNavigation() {
    const accessToken = useStore((state) => state.accessToken);
    const idToken = useStore((state) => state.idToken);
    const reset = useStore((state) => state.reset);
    // TODO Add State for CallOptions + Hide + Show Function
    const [isShowCallOptions, setIsShowCallOptions] = useState(false);
    function hideCallOptions() {
        setIsShowCallOptions(false);
    }
    function showCallOptions() {
        setIsShowCallOptions(true);
    }
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
                    {accessToken && (
                        <CallOptionsButton showCallOptions={showCallOptions} />
                    )}
                    {accessToken && isShowCallOptions && (
                        <CallOptions hideCallOptions={hideCallOptions} />
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
