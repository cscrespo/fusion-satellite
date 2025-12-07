import React from 'react';
import { Clock, Trash2, Edit2, Camera } from 'lucide-react';

const MealTimeline = ({ meals, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                {meals.map((meal, index) => (
                    <div key={meal.id} className="relative pl-8 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-sm"></div>

                        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border hover:shadow-md transition-all">
                            {/* Time & Type */}
                            <div className="min-w-[100px]">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {meal.time}
                                </div>
                                <h4 className="font-bold text-foreground">{meal.type}</h4>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{meal.name}</h3>
                                        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                                            <span className="bg-secondary px-2 py-1 rounded-md text-foreground">
                                                {meal.calories} kcal
                                            </span>
                                            <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-md">
                                                P: {meal.macros.p}g
                                            </span>
                                            <span className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-md">
                                                C: {meal.macros.c}g
                                            </span>
                                            <span className="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 px-2 py-1 rounded-md">
                                                G: {meal.macros.f}g
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(meal)}
                                            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(meal.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Photo Thumbnail */}
                            {meal.photo && (
                                <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border bg-secondary/30">
                                    <img
                                        src={meal.photo}
                                        alt={meal.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {meals.length === 0 && (
                    <div className="pl-8 text-muted-foreground text-sm italic">
                        Nenhuma refeição registrada hoje.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealTimeline;
