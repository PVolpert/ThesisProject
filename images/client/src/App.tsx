import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Call from './pages/Call.tsx';
import LoginPage from './pages/Login.tsx';
import RedirectPage, { loader as redirectLoader } from './pages/Redirect.tsx';
import RootLayout from './pages/Root.tsx';
import ErrorPage from './pages/Error.tsx';
import P2PPage from './pages/P2P.tsx';
import HomePage from './pages/Home.tsx';
import ConferencePage from './pages/Conference.tsx';

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

            { path: 'login', element: <LoginPage /> },
            {
                path: 'redirect/:redirectId',
                loader: redirectLoader,
                element: <RedirectPage />,
            },

            {
                path: 'call',
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

export default function App() {
    return <RouterProvider router={router} />;
}
