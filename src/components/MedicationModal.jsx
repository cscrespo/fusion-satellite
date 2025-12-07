import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MedicationModal = ({ isOpen, onClose, onSubmit, initialData, type }) => {
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: '',
        time: 'Morning',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                dosage: '',
                frequency: '',
                time: 'Manhã',
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const title = type === 'medications' ? 'Medicação' : 'Suplemento';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{initialData ? `Editar ${title}` : `Adicionar ${title}`}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input
                            type="text"
                            required
                            placeholder={`ex: ${type === 'medications' ? 'Lisinopril' : 'Vitamina D'}`}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Dosagem</label>
                            <input
                                type="text"
                                required
                                placeholder="ex: 10mg"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.dosage}
                                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Frequência</label>
                            <input
                                type="text"
                                required
                                placeholder="ex: Diariamente"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.frequency}
                                onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Horário</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={formData.time}
                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                        >
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
                            <option value="Madrugada">Madrugada</option>
                            <option value="Se Necessário">Se Necessário</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notas (Opcional)</label>
                        <textarea
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-20"
                            placeholder="Instruções ou comentários..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                        >
                            {initialData ? 'Salvar Alterações' : `Adicionar ${title}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicationModal;
