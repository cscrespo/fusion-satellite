import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Utensils } from 'lucide-react';

const DietMealModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        time: '',
        items: [{ id: Date.now(), food: '', quantity: '' }]
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (isOpen) {
            setFormData({
                name: '',
                time: '',
                items: [{ id: Date.now(), food: '', quantity: '' }]
            });
        }
    }, [isOpen, initialData]);

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { id: Date.now(), food: '', quantity: '' }]
        });
    };

    const handleRemoveItem = (id) => {
        setFormData({
            ...formData,
            items: formData.items.filter(item => item.id !== id)
        });
    };

    const handleItemChange = (id, field, value) => {
        setFormData({
            ...formData,
            items: formData.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold">{initialData ? 'Editar Refeição' : 'Nova Refeição'}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome da Refeição</label>
                            <div className="relative">
                                <Utensils className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Café da Manhã"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Horário</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Alimentos</label>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                            >
                                <Plus className="w-3 h-3" /> Adicionar Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item, index) => (
                                <div key={item.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
                                    <input
                                        type="text"
                                        placeholder="Alimento (Ex: Ovos)"
                                        required
                                        value={item.food}
                                        onChange={(e) => handleItemChange(item.id, 'food', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Qtd (Ex: 2 un)"
                                        required
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                        className="w-24 px-3 py-2 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Salvar Refeição
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DietMealModal;
