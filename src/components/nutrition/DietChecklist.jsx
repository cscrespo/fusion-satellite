import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const DietChecklist = ({ items, onToggle }) => {
    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-full">
            <h3 className="text-lg font-bold mb-4">Checklist Diário</h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onToggle(item.id)}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                            ${item.completed
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900'
                                : 'bg-secondary/10 border-border hover:bg-secondary/30'}
                        `}
                    >
                        <div className={`
                            shrink-0 transition-colors
                            ${item.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}
                        `}>
                            {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <span className={`
                            text-sm font-medium transition-all
                            ${item.completed ? 'text-green-800 dark:text-green-300 line-through opacity-70' : 'text-foreground'}
                        `}>
                            {item.task}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DietChecklist;
