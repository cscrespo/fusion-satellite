import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const DoctorModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        crm: '',
        rqe: '',
        bio: '',
        price: '',
        avatar: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                specialty: '',
                crm: '',
                rqe: '',
                bio: '',
                price: '',
                avatar: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            price: parseFloat(formData.price),
            rating: initialData ? initialData.rating : 5.0,
            reviews: initialData ? initialData.reviews : 0,
            status: initialData ? initialData.status : 'offline',
            nextAvailable: initialData ? initialData.nextAvailable : 'A definir'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{initialData ? 'Editar Especialista' : 'Cadastrar Novo Especialista'}</h2>
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
                            placeholder="Dr. Nome Sobrenome"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Especialidade</label>
                            <select
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.specialty}
                                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                <option value="Nutrólogo">Nutrólogo</option>
                                <option value="Endocrinologista">Endocrinologista</option>
                                <option value="Cardiologista">Cardiologista</option>
                                <option value="Psicólogo">Psicólogo</option>
                                <option value="Nutricionista">Nutricionista</option>
                                <option value="Personal Trainer">Personal Trainer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Preço da Consulta (R$)</label>
                            <input
                                type="number"
                                required
                                placeholder="0.00"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">CRM / Registro</label>
                            <input
                                type="text"
                                required
                                placeholder="123456-SP"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.crm}
                                onChange={e => setFormData({ ...formData, crm: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">RQE (Opcional)</label>
                            <input
                                type="text"
                                placeholder="12345"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.rqe}
                                onChange={e => setFormData({ ...formData, rqe: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Biografia Profissional</label>
                        <textarea
                            rows="3"
                            required
                            placeholder="Breve descrição da experiência e foco de atuação..."
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Foto de Perfil (URL)</label>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                placeholder="https://..."
                                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={formData.avatar}
                                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                            />
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-4 h-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
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
                            {initialData ? 'Salvar Alterações' : 'Cadastrar Especialista'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorModal;
