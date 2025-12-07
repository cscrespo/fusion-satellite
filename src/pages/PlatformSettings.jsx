import React, { useState } from 'react';
import { Save, RotateCcw, Sparkles, Palette, Type, Image as ImageIcon, Check } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import ColorPicker from '../components/branding/ColorPicker';
import LogoUploader from '../components/branding/LogoUploader';

const PlatformSettings = () => {
    const { branding, updateBranding, resetBranding } = useBranding();
    const [formData, setFormData] = useState(branding);
    const [saveNotification, setSaveNotification] = useState(false);

    const handleSave = () => {
        updateBranding(formData);
        setSaveNotification(true);
        setTimeout(() => setSaveNotification(false), 3000);
    };

    const handleReset = () => {
        if (confirm('Deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
            resetBranding();
            setFormData(branding);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">
                        Configurações da Plataforma
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Personalize a aparência e identidade visual
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar Padrão
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center gap-2 text-sm font-medium"
                    >
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                    </button>
                </div>
            </div>

            {/* Success Notification */}
            {saveNotification && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-medium">Configurações salvas!</p>
                            <p className="text-sm text-emerald-100">As alterações foram aplicadas</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Logos Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold text-foreground">Logos</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LogoUploader
                                label="Logo Interno (Sidebar)"
                                value={formData.logoInternal}
                                onChange={(value) => setFormData({ ...formData, logoInternal: value })}
                            />
                            <LogoUploader
                                label="Logo Auth (Login/Registro)"
                                value={formData.logoAuth}
                                onChange={(value) => setFormData({ ...formData, logoAuth: value })}
                            />
                        </div>
                    </div>

                    {/* Colors Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Palette className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold text-foreground">Cores</h3>
                        </div>
                        <div className="space-y-6">
                            <ColorPicker
                                label="Cor Principal"
                                description="Usada em botões, links e destaques"
                                value={formData.colors.primary}
                                onChange={(value) => setFormData({
                                    ...formData,
                                    colors: { ...formData.colors, primary: value }
                                })}
                            />
                            <ColorPicker
                                label="Cor de Destaque"
                                description="Usada em badges e notificações"
                                value={formData.colors.accent}
                                onChange={(value) => setFormData({
                                    ...formData,
                                    colors: { ...formData.colors, accent: value }
                                })}
                            />
                            <ColorPicker
                                label="Cor de Sucesso"
                                description="Usada em mensagens de confirmação"
                                value={formData.colors.success}
                                onChange={(value) => setFormData({
                                    ...formData,
                                    colors: { ...formData.colors, success: value }
                                })}
                            />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Type className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold text-foreground">Informações</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Nome da Plataforma
                                </label>
                                <input
                                    type="text"
                                    value={formData.platformName}
                                    onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Bloom"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Plataforma completa de gestão de saúde"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Título do Navegador
                                </label>
                                <input
                                    type="text"
                                    value={formData.browserTitle}
                                    onChange={(e) => setFormData({ ...formData, browserTitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Bloom - Patient Tracking"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Favicon Section */}
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold text-foreground">Favicon</h3>
                        </div>
                        <LogoUploader
                            label="Ícone do Navegador (16x16 ou 32x32 pixels)"
                            value={formData.favicon}
                            onChange={(value) => setFormData({ ...formData, favicon: value })}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Recomendado: arquivo .ico, .png ou .svg de 16x16 ou 32x32 pixels
                        </p>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-6">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Preview
                        </h3>
                        <div className="space-y-4">
                            {/* Logo Preview */}
                            <div className="bg-secondary p-4 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-3">Logo Interno</p>
                                {formData.logoInternal ? (
                                    <img
                                        src={formData.logoInternal}
                                        alt="Logo"
                                        className="h-10 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML += '<p class="text-sm text-red-500">Erro ao carregar</p>';
                                        }}
                                    />
                                ) : (
                                    <p className="text-2xl font-bold" style={{ color: formData.colors.primary }}>
                                        {formData.platformName}
                                    </p>
                                )}
                            </div>

                            {/* Auth Logo Preview */}
                            <div className="bg-secondary p-4 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-3">Logo Auth</p>
                                {formData.logoAuth ? (
                                    <img
                                        src={formData.logoAuth}
                                        alt="Logo Auth"
                                        className="h-10 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML += '<p class="text-sm text-red-500">Erro ao carregar</p>';
                                        }}
                                    />
                                ) : (
                                    <div className="text-center">
                                        <p className="text-2xl font-bold" style={{ color: formData.colors.primary }}>
                                            {formData.platformName}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">{formData.tagline}</p>
                                    </div>
                                )}
                            </div>

                            {/* Color Preview */}
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Paleta de Cores</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded-lg shadow-sm"
                                            style={{ backgroundColor: formData.colors.primary }}
                                        />
                                        <p className="text-xs text-center text-muted-foreground">Primary</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded-lg shadow-sm"
                                            style={{ backgroundColor: formData.colors.accent }}
                                        />
                                        <p className="text-xs text-center text-muted-foreground">Accent</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="h-12 rounded-lg shadow-sm"
                                            style={{ backgroundColor: formData.colors.success }}
                                        />
                                        <p className="text-xs text-center text-muted-foreground">Success</p>
                                    </div>
                                </div>
                            </div>

                            {/* Button Preview */}
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Botões</p>
                                <button
                                    className="w-full py-2.5 rounded-xl text-white font-medium shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: formData.colors.primary }}
                                >
                                    Botão Principal
                                </button>
                                <button
                                    className="w-full py-2.5 rounded-xl text-white font-medium shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: formData.colors.accent }}
                                >
                                    Botão Destaque
                                </button>
                            </div>

                            {/* Badge Preview */}
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Badges</p>
                                <div className="flex gap-2 flex-wrap">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: formData.colors.primary }}
                                    >
                                        Primary
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: formData.colors.success }}
                                    >
                                        Success
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: formData.colors.accent }}
                                    >
                                        Accent
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
