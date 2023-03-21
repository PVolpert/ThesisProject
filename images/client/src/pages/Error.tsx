import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

import PageContent from '../components/PageContent';

export default function ErrorPage() {
    const error = useRouteError();

    useEffect(() => console.log(error), []);

    let title = 'An error occured';
    let message = <p>Something went wrong</p>;

    return <PageContent title={title}>{message}</PageContent>;
}
