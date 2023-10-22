import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();

    useEffect(() => console.log(error), []);

    let title = 'An error occured';
    let message = <p>Something went wrong</p>;

    return (
        <div className="text-center">
            <h1>{title}</h1>
            {message}
        </div>
    );
}
