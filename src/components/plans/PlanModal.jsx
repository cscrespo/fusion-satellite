import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const PlanModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'medication',
        price: '',
        duration: 3,
        billingCycle: 'monthly',
        status: 'active',
        features: [],
        contraindications: [],
        requirements: [],
        icon: '💊',
        maxPatients: ''
    });

    const [newFeature, setNewFeature] = useState('');
    const [newContraindication, setNewContraindication] = useState('');
    const [newRequirement, setNewRequirement] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                description: '',
                category: 'medication',
                price: '',
                duration: 3,
                billingCycle: 'monthly',
                status: 'active',
                features: [],
                contraindications: [],
                requirements: [],
                icon: '💊',
                maxPatients: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            price: parseFloat(formData.price),
            duration: parseInt(formData.duration),
            maxPatients: formData.maxPatients ? parseInt(formData.maxPatients) : null
        });
        onClose();
    };

    const addItem = (field, value, setter) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    };

    const removeItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const categoryOptions = {
        medication: { label: 'Medicamento', icon: '💊' },
        nutrition: { label: 'Nutrição', icon: '🥗' },
        fitness: { label: 'Fitness', icon: '🏃' },
        wellness: { label: 'Bem-estar', icon: '🧘' },
        other: { label: 'Outro', icon: '📋' }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-3xl rounded-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">
                        {initialData ? 'Editar Plano' : 'Novo Plano'}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nome do Plano *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Protocolo Mounjaro"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Descrição *
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                placeholder="Descrição detalhada do plano..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Categoria *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => {
                                    const category = e.target.value;
                                    setFormData({
                                        ...formData,
                                        category,
                                        icon: categoryOptions[category].icon
                                    });
                                }}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            >
                                {Object.entries(categoryOptions).map(([value, { label, icon }]) => (
                                    <option key={value} value={value}>
                                        {icon} {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ícone
                            </label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="💊"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Preço (R$) *
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="890.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ciclo de Cobrança *
                            </label>
                            <select
                                required
                                value={formData.billingCycle}
                                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            >
                                <option value="monthly">Mensal</option>
                                <option value="quarterly">Trimestral</option>
                                <option value="annual">Anual</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Duração (meses) *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Máximo de Pacientes
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxPatients}
                                onChange={(e) => setFormData({ ...formData, maxPatients: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Status *
                            </label>
                            <select
                                required
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Recursos Incluídos
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('features', newFeature, setNewFeature))}
                                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Ex: Consultas mensais"
                            />
                            <button
                                type="button"
                                onClick={() => addItem('features', newFeature, setNewFeature)}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg text-sm"
                                >
                                    {feature}
                                    <button
                                        type="button"
                                        onClick={() => removeItem('features', index)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contraindications */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Contraindicações
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newContraindication}
                                onChange={(e) => setNewContraindication(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('contraindications', newContraindication, setNewContraindication))}
                                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Ex: Gravidez"
                            />
                            <button
                                type="button"
                                onClick={() => addItem('contraindications', newContraindication, setNewContraindication)}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.contraindications.map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                                >
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => removeItem('contraindications', index)}
                                        className="hover:text-red-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Requisitos
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', newRequirement, setNewRequirement))}
                                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Ex: IMC > 27"
                            />
                            <button
                                type="button"
                                onClick={() => addItem('requirements', newRequirement, setNewRequirement)}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requirements.map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm"
                                >
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => removeItem('requirements', index)}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium shadow-lg shadow-primary/20"
                        >
                            {initialData ? 'Salvar Alterações' : 'Criar Plano'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanModal;
