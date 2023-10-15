import Page from '../UI/Page';
import { useToken } from '../../hooks/useToken';
import { NavLink } from 'react-router-dom';

export default function HomeDisplay() {
    const { accessToken } = useToken();
    return (
        <Page>
            <div className=" container mx-aut text-center">
                <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                    SAFEGUARD
                </h1>

                <div className="mt-6">
                    <p className="mt-3 text-lg sm:text-xl lg:text-2xl">
                        Secure Authentication and Fast Encrypted Group Unified
                        Audio-Visual Real-time Delivery
                    </p>
                    <div className="mt-4">
                        <ul className="list-disc list-inside">
                            <li className="mb-2">
                                <strong className="text-yellow-500">
                                    End-to-End Security:
                                </strong>{' '}
                                We take your privacy seriously. SAFEGUARD
                                employs state-of-the-art encryption to safeguard
                                your conversations from end to end.
                            </li>

                            <li className="mb-2">
                                <strong className="text-yellow-500">
                                    OIDC<sup>2</sup> Authentication:
                                </strong>{' '}
                                Our OpenID Connect-based authentication ensures
                                that only authorized users gain access to your
                                meetings, making impersonation a thing of the
                                past.
                            </li>
                        </ul>
                    </div>
                    {!accessToken && (
                        <div className="mt-8">
                            {!accessToken && (
                                <NavLink
                                    to="/login"
                                    className={`border-2 rounded-lg px-2 md:px-8 py-2 shadow-md border-springred text-white hover:text-springred bg-springred hover:bg-inherit`}
                                >
                                    Log in
                                </NavLink>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
}
