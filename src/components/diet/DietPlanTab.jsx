import React, { useState } from 'react';
import DaySelector from './DaySelector';
import MealPlanCard from './MealPlanCard';
import DietMealModal from './DietMealModal';
import { Plus, Copy, Info } from 'lucide-react';

const DietPlanTab = ({ dietPlan, onUpdatePlan }) => {
    const [selectedDay, setSelectedDay] = useState('monday');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);

    const currentDayPlan = dietPlan?.[selectedDay] || { meals: [], macros: { calories: 0, protein: 0, carbs: 0, fat: 0 } };

    const handleOpenModal = (meal = null) => {
        setEditingMeal(meal);
        setIsModalOpen(true);
    };

    const handleSaveMeal = (mealData) => {
        const newMeals = editingMeal
            ? currentDayPlan.meals.map(m => m.id === editingMeal.id ? { ...mealData, id: m.id } : m)
            : [...(currentDayPlan.meals || []), { ...mealData, id: Date.now() }];

        // Sort by time
        newMeals.sort((a, b) => a.time.localeCompare(b.time));

        onUpdatePlan(selectedDay, {
            ...currentDayPlan,
            meals: newMeals
        });
    };

    const handleDeleteMeal = (mealId) => {
        if (window.confirm('Tem certeza que deseja excluir esta refeição?')) {
            const newMeals = currentDayPlan.meals.filter(m => m.id !== mealId);
            onUpdatePlan(selectedDay, {
                ...currentDayPlan,
                meals: newMeals
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold">Planejamento Semanal</h3>
                    <p className="text-muted-foreground">Defina as refeições para cada dia da semana.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                        <Copy className="w-4 h-4" /> Replicar Dia
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" /> Nova Refeição
                    </button>
                </div>
            </div>

            {/* Day Navigation */}
            <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

            {/* Macro Summary for the Day */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">Resumo do Dia:</span>
                </div>
                <div className="flex gap-4 text-sm">
                    <span><strong>{currentDayPlan.macros?.calories || 0}</strong> kcal</span>
                    <span className="text-muted-foreground">|</span>
                    <span>P: <strong>{currentDayPlan.macros?.protein || 0}g</strong></span>
                    <span>C: <strong>{currentDayPlan.macros?.carbs || 0}g</strong></span>
                    <span>G: <strong>{currentDayPlan.macros?.fat || 0}g</strong></span>
                </div>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentDayPlan.meals?.length > 0 ? (
                    currentDayPlan.meals.map((meal) => (
                        <MealPlanCard
                            key={meal.id}
                            meal={meal}
                            onEdit={() => handleOpenModal(meal)}
                            onDelete={() => handleDeleteMeal(meal.id)}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        <p>Nenhuma refeição planejada para este dia.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-2 text-primary font-medium hover:underline"
                        >
                            + Adicionar Refeição
                        </button>
                    </div>
                )}
            </div>

            <DietMealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMeal}
                initialData={editingMeal}
            />
        </div>
    );
};

export default DietPlanTab;
