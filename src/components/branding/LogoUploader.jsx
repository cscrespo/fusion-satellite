import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const LogoUploader = ({ label, value, onChange, preview = true }) => {
    const [urlInput, setUrlInput] = useState(value || '');

    const handleUrlSubmit = () => {
        onChange(urlInput);
    };

    const handleRemove = () => {
        setUrlInput('');
        onChange(null);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>

            {/* URL Input */}
            <div className="flex gap-2">
                <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                    className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <button
                    type="button"
                    onClick={handleUrlSubmit}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
                >
                    Aplicar
                </button>
            </div>

            {/* Preview */}
            {preview && value && (
                <div className="relative w-full h-32 bg-secondary rounded-xl border border-border flex items-center justify-center overflow-hidden p-4">
                    <img
                        src={value}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent) {
                                parent.innerHTML = '<p class="text-muted-foreground text-sm">Erro ao carregar imagem</p>';
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Placeholder */}
            {preview && !value && (
                <div className="w-full h-32 bg-secondary rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma logo configurada</p>
                        <p className="text-xs mt-1">Cole a URL da imagem acima</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogoUploader;
