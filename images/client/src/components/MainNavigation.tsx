import { NavLink } from 'react-router-dom';

import Button from './UI/Button';
import useModal from '../hooks/useModal';
import CallOptions from './Call/CallOptions/CallOptions';
import CallOptionsButton from './Call/CallOptions/CallOptionsButton';

import classes from './MainNavigation.module.css';
import Signaling from './Signaling';
import { useToken } from '../hooks/useToken';

function MainNavigation() {
    const { accessToken, idToken, doLogout: logOutHandler } = useToken();
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
                    {idToken?.name?.toString() && (
                        <li>Hello {idToken.name.toString()} ! </li>
                    )}
                    {accessToken && <Signaling />}
                    {accessToken && (
                        <CallOptionsButton showCallOptions={showCallOptions} />
                    )}
                    {accessToken && isShowCallOptions && (
                        <CallOptions hideCallOptions={hideCallOptions} />
                    )}
                    {accessToken && (
                        <li>
                            <Button onClick={logOutHandler} style={'ternary'}>
                                Log out
                            </Button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
