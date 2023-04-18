import { NavLink } from 'react-router-dom';

import Button from './UI/Button';
import useModal from '../hooks/useModal';
import { useZustandStore } from '../stores/zustand/ZustandStore';
import CallOptions from './Call/CallOptions/CallOptions';
import CallOptionsButton from './Call/CallOptions/CallOptionsButton';

import classes from './MainNavigation.module.css';

function MainNavigation() {
    const accessToken = useZustandStore((state) => state.accessToken);
    const idToken = useZustandStore((state) => state.idToken);
    const resetAuth = useZustandStore((state) => state.resetAuth);
    const resetICTs = useZustandStore((state) => {
        return state.resetICTs;
    });
    const {
        isModalShown: isShowCallOptions,
        hideModal: hideCallOptions,
        showModal: showCallOptions,
    } = useModal({ shownInitial: false });

    function logOutHandler() {
        resetAuth();
        resetICTs();
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
                            <Button onClick={logOutHandler} style="ternary">
                                Log out
                            </Button>
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
