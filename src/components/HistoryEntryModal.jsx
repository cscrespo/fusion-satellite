import React, { useState, useEffect } from 'react';
import { X, Calendar, Scale, Activity } from 'lucide-react';

const HistoryEntryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        fatMass: '',
        leanMass: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
                weight: initialData.weight || '',
                fatMass: initialData.fatMass || '',
                leanMass: initialData.leanMass || ''
            });
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                weight: '',
                fatMass: '',
                leanMass: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            weight: parseFloat(formData.weight),
            fatMass: parseFloat(formData.fatMass),
            leanMass: parseFloat(formData.leanMass)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border bg-secondary/30">
                    <h2 className="text-xl font-bold">{initialData ? 'Editar Registro' : 'Novo Registro'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> Data do Registro
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full p-3 bg-secondary/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Scale className="w-4 h-4 text-blue-500" /> Peso (kg)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            required
                            placeholder="Ex: 78.5"
                            className="w-full p-3 bg-secondary/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Activity className="w-4 h-4 text-amber-500" /> Massa Gorda (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 22.5"
                                className="w-full p-3 bg-secondary/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.fatMass}
                                onChange={(e) => setFormData({ ...formData, fatMass: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" /> Massa Magra (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 45.0"
                                className="w-full p-3 bg-secondary/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.leanMass}
                                onChange={(e) => setFormData({ ...formData, leanMass: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-border font-medium hover:bg-secondary transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                        >
                            {initialData ? 'Salvar Alterações' : 'Adicionar Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HistoryEntryModal;
