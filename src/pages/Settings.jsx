import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Bell, Shield, Palette, Globe, Save, Camera, Check, X } from 'lucide-react';
import ChangePasswordModal from '../components/settings/ChangePasswordModal';
import TwoFactorModal from '../components/settings/TwoFactorModal';

const Settings = () => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [saveNotification, setSaveNotification] = useState(false);

    const [formData, setFormData] = useState({
        name: 'Dr. Smith',
        email: 'dr.smith@bloom.com',
        phone: '+55 11 98765-4321',
        specialty: 'Nutricionista',
        crm: '123456-SP',
        bio: 'Especialista em nutrição clínica e esportiva com mais de 10 anos de experiência.',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',

        // Notificações
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,

        // Privacidade
        profileVisible: true,
        showEmail: false,

        // Preferências
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        theme: 'light'
    });

    // Load saved data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('userSettings', JSON.stringify(formData));

        // Show success notification
        setSaveNotification(true);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setSaveNotification(false);
        }, 3000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-6">
            {/* Success Notification Toast */}
            {saveNotification && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-medium">Configurações salvas!</p>
                            <p className="text-sm text-emerald-100">Suas alterações foram aplicadas com sucesso</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
                <p className="text-muted-foreground mt-1">Gerencie suas preferências e informações da conta</p>
            </div>

            {/* Profile Section */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Perfil</h2>
                </div>

                <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <img
                                src={formData.avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400';
                                }}
                            />
                            <button
                                onClick={() => setShowPhotoModal(true)}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg group-hover:scale-110 duration-200"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg">{formData.name}</h3>
                            <p className="text-sm text-muted-foreground">{formData.specialty}</p>
                            <button
                                onClick={() => setShowPhotoModal(true)}
                                className="text-sm text-primary hover:underline mt-2 font-medium"
                            >
                                Alterar foto
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Especialidade</label>
                            <input
                                type="text"
                                value={formData.specialty}
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">CRM</label>
                            <input
                                type="text"
                                value={formData.crm}
                                onChange={(e) => handleChange('crm', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Biografia</label>
                        <textarea
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Segurança</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
                        <div>
                            <h3 className="font-medium text-foreground">Senha</h3>
                            <p className="text-sm text-muted-foreground">Altere sua senha regularmente</p>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
                        >
                            Alterar Senha
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
                        <div>
                            <h3 className="font-medium text-foreground">Autenticação de Dois Fatores</h3>
                            <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                        </div>
                        <button
                            onClick={() => setShowTwoFactorModal(true)}
                            className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium"
                        >
                            Configurar
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Notificações</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Notificações por Email</h3>
                            <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.emailNotifications}
                                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Notificações por SMS</h3>
                            <p className="text-sm text-muted-foreground">Receba alertas por mensagem</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.smsNotifications}
                                onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Lembretes de Consultas</h3>
                            <p className="text-sm text-muted-foreground">Receba lembretes antes das consultas</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.appointmentReminders}
                                onChange={(e) => handleChange('appointmentReminders', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Palette className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Preferências</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Idioma</label>
                        <select
                            value={formData.language}
                            onChange={(e) => handleChange('language', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Fuso Horário</label>
                        <select
                            value={formData.timezone}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        >
                            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                            <option value="America/New_York">New York (GMT-5)</option>
                            <option value="Europe/London">London (GMT+0)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                </button>
            </div>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={(data) => {
                    console.log('Password changed:', data);
                    alert('Senha alterada com sucesso!');
                }}
            />

            <TwoFactorModal
                isOpen={showTwoFactorModal}
                onClose={() => setShowTwoFactorModal(false)}
                onSubmit={(data) => {
                    console.log('2FA enabled:', data);
                    alert('Autenticação de dois fatores ativada!');
                }}
            />

            {/* Photo Upload Modal */}
            {showPhotoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">Alterar Foto do Perfil</h2>
                            <button
                                onClick={() => setShowPhotoModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Current Photo */}
                            <div className="flex justify-center">
                                <img
                                    src={formData.avatar}
                                    alt="Current avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                                />
                            </div>

                            {/* URL Input */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    URL da Imagem
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://exemplo.com/foto.jpg"
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleChange('avatar', e.target.value);
                                            setShowPhotoModal(false);
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Cole a URL de uma imagem ou pressione Enter para aplicar
                                </p>
                            </div>

                            {/* Suggested Photos */}
                            <div>
                                <p className="text-sm font-medium text-foreground mb-3">Ou escolha uma sugestão:</p>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
                                        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                                        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
                                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'
                                    ].map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                handleChange('avatar', url);
                                                setShowPhotoModal(false);
                                            }}
                                            className="w-full aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all hover:scale-105"
                                        >
                                            <img
                                                src={url}
                                                alt={`Suggestion ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-border flex gap-3">
                            <button
                                onClick={() => setShowPhotoModal(false)}
                                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
