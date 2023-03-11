import React from 'react';

import classes from './Card.module.css';

interface CardProps {
    className ?: string
    children : React.ReactNode
}

function Card  ({className,children}:CardProps)  {
  return <div className={`${classes.card} ${className}`}>{children}</div>;
};

export default Card;