import React from 'react';
import { Clock, Edit2, Trash2, Plus } from 'lucide-react';

const MealPlanCard = ({ meal, onEdit, onDelete }) => {
    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {meal.time}
                    </div>
                    <h4 className="font-bold text-lg">{meal.name}</h4>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => onEdit(meal)} className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(meal.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {meal.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                        <span className="text-foreground">{item.food}</span>
                        <span className="text-sm font-medium text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded">
                            {item.quantity}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex justify-center">
                <button
                    onClick={() => onEdit(meal)}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                    <Plus className="w-3 h-3" /> Adicionar Alimento
                </button>
            </div>
        </div>
    );
};

export default MealPlanCard;
