import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend, subtext }) => (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-muted-foreground font-medium mb-1 text-sm uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-2 font-medium">{subtext}</p>}
        </div>
    </div>
);

export default StatCard;
