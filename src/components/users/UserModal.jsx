import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'doctor',
        specialty: '',
        phone: '',
        avatar: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                password: '' // Don't populate password when editing
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'doctor',
                specialty: '',
                phone: '',
                avatar: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                        {initialData ? 'Editar Usuário' : 'Novo Usuário'}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Dr. João Silva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="joao@exemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Senha {!initialData && '*'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required={!initialData}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full px-4 py-2 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder={initialData ? 'Deixe em branco para manter' : '••••••••'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="+55 11 98765-4321"
                            />
                        </div>
                    </div>

                    {/* Role & Specialty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Função *
                            </label>
                            <select
                                required
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            >
                                <option value="admin">Administrador</option>
                                <option value="doctor">Médico/Nutricionista</option>
                                <option value="assistant">Assistente</option>
                                <option value="receptionist">Recepcionista</option>
                            </select>
                        </div>

                        {(formData.role === 'doctor' || formData.role === 'admin') && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Especialidade
                                </label>
                                <input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={(e) => handleChange('specialty', e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Nutricionista, Cardiologista, etc."
                                />
                            </div>
                        )}
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            URL da Foto (opcional)
                        </label>
                        <input
                            type="url"
                            value={formData.avatar}
                            onChange={(e) => handleChange('avatar', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="https://exemplo.com/foto.jpg"
                        />
                        {formData.avatar && (
                            <div className="mt-3 flex items-center gap-3">
                                <img
                                    src={formData.avatar}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <span className="text-sm text-muted-foreground">Preview da foto</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
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
                            {initialData ? 'Salvar Alterações' : 'Criar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
