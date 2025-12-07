import React from 'react';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const MacroCard = ({ title, current, target, unit, color, icon: Icon }) => {
    const percentage = Math.min(100, (current / target) * 100);

    return (
        <div className="bg-card p-4 rounded-xl border border-border flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
                <div className={`p-2 rounded-lg ${color.bg} ${color.text}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{percentage.toFixed(0)}%</span>
            </div>

            <div className="mt-4 z-10">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{current}</span>
                    <span className="text-xs text-muted-foreground">/ {target}{unit}</span>
                </div>
            </div>

            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary">
                <div
                    className={`h-full ${color.bar} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const NutritionSummary = ({ goals, meals }) => {
    // Calculate totals from logs
    const totals = meals.reduce((acc, meal) => {
        return {
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.macros.p,
            carbs: acc.carbs + meal.macros.c,
            fat: acc.fat + meal.macros.f
        };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MacroCard
                title="Calorias"
                current={totals.calories}
                target={goals.calories}
                unit="kcal"
                icon={Flame}
                color={{ bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-500' }}
            />
            <MacroCard
                title="Proteínas"
                current={totals.protein}
                target={goals.protein}
                unit="g"
                icon={Beef}
                color={{ bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' }}
            />
            <MacroCard
                title="Carboidratos"
                current={totals.carbs}
                target={goals.carbs}
                unit="g"
                icon={Wheat}
                color={{ bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500' }}
            />
            <MacroCard
                title="Gorduras"
                current={totals.fat}
                target={goals.fat}
                unit="g"
                icon={Droplet}
                color={{ bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' }}
            />
        </div>
    );
};

export default NutritionSummary;
