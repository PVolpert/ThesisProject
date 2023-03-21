import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useModal from '../hooks/useModal';
import { useZustandStore } from '../stores/zustand/ZustandStore';
import CallOptions from './Call/CallOptions/CallOptions';
import CallOptionsButton from './Call/CallOptions/CallOptionsButton';

import classes from './MainNavigation.module.css';

function MainNavigation() {
    const accessToken = useZustandStore((state) => state.accessToken);
    const idToken = useZustandStore((state) => state.idToken);
    const reset = useZustandStore((state) => state.reset);
    const {
        isModalShown: isShowCallOptions,
        hideModal: hideCallOptions,
        showModal: showCallOptions,
    } = useModal({ shownInitial: false });

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
