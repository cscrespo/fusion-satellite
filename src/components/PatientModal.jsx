import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PatientModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        address: '',
        avatar: '',
        startWeight: '',
        currentWeight: '',
        goalWeight: '',
        status: 'Active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                age: '',
                phone: '',
                address: '',
                avatar: '',
                startWeight: '',
                currentWeight: '',
                goalWeight: '',
                status: 'Active'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            age: parseInt(formData.age),
            startWeight: parseFloat(formData.startWeight),
            currentWeight: parseFloat(formData.currentWeight),
            goalWeight: parseFloat(formData.goalWeight)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{initialData ? 'Editar Paciente' : 'Adicionar Novo Paciente'}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Maria Silva"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium mb-1">Idade</label>
                            <input
                                type="number"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Telefone</label>
                            <input
                                type="tel"
                                placeholder="(11) 99999-9999"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Endereço de Entrega</label>
                        <textarea
                            rows="2"
                            placeholder="Rua, Número, Bairro, Cidade - UF"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                            value={formData.address || ''}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Foto de Perfil (URL)</label>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                placeholder="https://exemplo.com/foto.jpg"
                                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.avatar || ''}
                                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                            />
                            {formData.avatar && (
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                                    <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Ativo</option>
                                <option value="Inactive">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Inicial (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.startWeight}
                                onChange={e => setFormData({ ...formData, startWeight: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Atual</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.currentWeight}
                                onChange={e => setFormData({ ...formData, currentWeight: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Meta</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.goalWeight}
                                onChange={e => setFormData({ ...formData, goalWeight: e.target.value })}
                            />
                        </div>
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
                            {initialData ? 'Salvar Alterações' : 'Adicionar Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientModal;
