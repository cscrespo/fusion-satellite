import React, { useState } from 'react';
import { X, Smartphone, Key, Copy, Check } from 'lucide-react';

const TwoFactorModal = ({ isOpen, onClose, onEnable }) => {
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Mock secret key for demo
    const secretKey = 'JBSWY3DPEHPK3PXP';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Bloom:dr.smith@bloom.com?secret=${secretKey}&issuer=Bloom`;

    if (!isOpen) return null;

    const handleCopySecret = () => {
        navigator.clipboard.writeText(secretKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = () => {
        if (verificationCode.length === 6) {
            onEnable();
            setStep(1);
            setVerificationCode('');
            onClose();
        } else {
            alert('Por favor, digite o código de 6 dígitos');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">Autenticação de Dois Fatores</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Configure seu Autenticador</h3>
                            <p className="text-sm text-muted-foreground">
                                Escaneie o QR code abaixo com um aplicativo autenticador como Google Authenticator ou Authy
                            </p>
                        </div>

                        <div className="bg-background p-6 rounded-xl border border-border flex justify-center">
                            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ou digite manualmente:
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={secretKey}
                                    readOnly
                                    className="flex-1 px-4 py-2 rounded-xl border border-border bg-secondary text-sm font-mono"
                                />
                                <button
                                    onClick={handleCopySecret}
                                    className="p-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors"
                                    title="Copiar"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium shadow-lg shadow-primary/20"
                        >
                            Continuar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Key className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Verificar Código</h3>
                            <p className="text-sm text-muted-foreground">
                                Digite o código de 6 dígitos do seu aplicativo autenticador
                            </p>
                        </div>

                        <div>
                            <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-center text-2xl font-mono tracking-widest"
                                placeholder="000000"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors font-medium"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleVerify}
                                className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium shadow-lg shadow-primary/20"
                            >
                                Verificar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwoFactorModal;
