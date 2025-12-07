import React, { useState, useEffect } from 'react';
import GenericModal from './GenericModal';
import { Plus, Trash2 } from 'lucide-react';

export const EditPlanModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data || { name: '', frequency: '' });

    useEffect(() => { if (isOpen) setFormData(data); }, [isOpen, data]);

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title="Editar Plano Atual" onSave={() => onSave(formData)}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome do Protocolo</label>
                    <input
                        className="w-full p-2 rounded-lg border border-border bg-background"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Frequência</label>
                    <input
                        className="w-full p-2 rounded-lg border border-border bg-background"
                        value={formData.frequency}
                        onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    />
                </div>
            </div>
        </GenericModal>
    );
};

export const EditStatusModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data || { currentWeight: 0 });

    useEffect(() => { if (isOpen) setFormData(data); }, [isOpen, data]);

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title="Atualizar Status Geral" onSave={() => onSave(formData)}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Peso Atual (kg)</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded-lg border border-border bg-background"
                        value={formData.currentWeight}
                        onChange={e => setFormData({ ...formData, currentWeight: Number(e.target.value) })}
                    />
                </div>
            </div>
        </GenericModal>
    );
};

export const EditGoalsModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data || { goalWeight: 0, fat: 0, leanMass: 0 });

    useEffect(() => { if (isOpen) setFormData(data); }, [isOpen, data]);

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title="Editar Metas Gerais" onSave={() => onSave(formData)}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Peso Alvo (kg)</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded-lg border border-border bg-background"
                        value={formData.goalWeight}
                        onChange={e => setFormData({ ...formData, goalWeight: Number(e.target.value) })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Gordura Corporal (%)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            value={formData.fat}
                            onChange={e => setFormData({ ...formData, fat: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Massa Magra (kg)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            value={formData.leanMass}
                            onChange={e => setFormData({ ...formData, leanMass: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        </GenericModal>
    );
};

export const EditFollowUpModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(data || { startDate: '', currentPhase: '', weekCurrent: 1, weekTotal: 12, focus: '', nextEvaluation: '' });

    useEffect(() => { if (isOpen) setFormData(data); }, [isOpen, data]);

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title="Editar Plano de Acompanhamento" onSave={() => onSave(formData)}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Início do Protocolo</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Próxima Avaliação</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            value={formData.nextEvaluation}
                            onChange={e => setFormData({ ...formData, nextEvaluation: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Fase Atual</label>
                    <input
                        className="w-full p-2 rounded-lg border border-border bg-background"
                        value={formData.currentPhase}
                        onChange={e => setFormData({ ...formData, currentPhase: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Semana Atual</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            value={formData.weekCurrent}
                            onChange={e => setFormData({ ...formData, weekCurrent: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Total de Semanas</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            value={formData.weekTotal}
                            onChange={e => setFormData({ ...formData, weekTotal: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Foco da Fase</label>
                    <textarea
                        className="w-full p-2 rounded-lg border border-border bg-background resize-none"
                        rows={3}
                        value={formData.focus}
                        onChange={e => setFormData({ ...formData, focus: e.target.value })}
                    />
                </div>
            </div>
        </GenericModal>
    );
};

export const ManageItemsModal = ({ isOpen, onClose, title, items, onSave }) => {
    const [list, setList] = useState(items || []);
    const [newItem, setNewItem] = useState('');

    useEffect(() => { if (isOpen) setList(items || []); }, [isOpen, items]);

    const handleAdd = () => {
        if (newItem.trim()) {
            setList([...list, { id: Date.now(), text: newItem }]);
            setNewItem('');
        }
    };

    const handleDelete = (id) => {
        setList(list.filter(item => item.id !== id));
    };

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title={title} onSave={() => onSave(list)}>
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-2 rounded-lg border border-border bg-background"
                        placeholder="Adicionar novo item..."
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    />
                    <button onClick={handleAdd} className="p-2 bg-primary text-primary-foreground rounded-lg">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {list.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                            <span>{item.text}</span>
                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {list.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">Nenhum item na lista.</p>}
                </div>
            </div>
        </GenericModal>
    );
};
