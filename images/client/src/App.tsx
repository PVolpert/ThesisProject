import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Call, { loader as callLoader } from './pages/Call';
import { loader as oidcProviderLoader } from './pages/Auth';
import LoginPage from './pages/Login';
import RedirectPage, { loader as redirectLoader } from './pages/Redirect';
import RootLayout from './pages/Root';
import ErrorPage from './pages/Error';
import P2PPage from './pages/P2P';
import HomePage from './pages/Home';
import ConferencePage from './pages/Conference';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'auth',
                id: 'auth',
                loader: oidcProviderLoader,
                children: [
                    { path: 'login', element: <LoginPage /> },
                    {
                        path: 'redirect/:redirectId',
                        loader: redirectLoader,
                        element: <RedirectPage />,
                    },
                ],
            },
            {
                path: 'call',
                loader: callLoader,
                id: 'call',
                children: [
                    {
                        index: true,
                        element: <Call />,
                    },
                    {
                        path: 'p2p',
                        element: <P2PPage />,
                    },
                    {
                        path: 'conference/:conferenceId',
                        element: <ConferencePage />,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
