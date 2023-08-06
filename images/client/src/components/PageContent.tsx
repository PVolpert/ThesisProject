import { ReactNode } from 'react';

interface PageContentProps {
    title: string;
    children?: ReactNode;
}

function PageContent({ title, children }: PageContentProps) {
    return (
        <div className="text-center">
            <h1>{title}</h1>
            {children}
        </div>
    );
}

export default PageContent;
