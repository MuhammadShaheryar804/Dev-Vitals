
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className, titleClassName }) => {
  return (
    <div className={`bg-slate-800 shadow-xl rounded-lg p-6 ${className || ''}`}>
      {title && <h2 className={`text-2xl font-semibold mb-4 text-teal-400 ${titleClassName || ''}`}>{title}</h2>}
      {children}
    </div>
  );
};
