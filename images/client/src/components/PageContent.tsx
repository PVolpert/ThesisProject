import { ReactNode } from 'react';
import classes from './PageContent.module.css';

interface PageContentProps {
    title: string;
    children?: ReactNode;
}

function PageContent({ title, children }: PageContentProps) {
    return (
        <div className={classes.content}>
            <h1>{title}</h1>
            {children}
        </div>
    );
}

export default PageContent;
