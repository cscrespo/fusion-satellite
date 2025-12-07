import React from 'react';
import clsx from 'clsx';

const TabButton = ({ active, onClick, children, icon: Icon, variant = 'default' }) => {
    const variants = {
        default: active ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        blue: active ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600/20" : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
        purple: active ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-600/20" : "text-slate-500 hover:bg-purple-50 hover:text-purple-700",
    };

    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ease-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
                variants[variant]
            )}
        >
            {Icon && <Icon className={clsx("w-4 h-4", active && "animate-pulse-once")} />}
            {children}
        </button>
    );
};

export default TabButton;
