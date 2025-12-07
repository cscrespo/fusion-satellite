import React, { useState } from 'react';
import { X, Mail, MessageCircle, Send } from 'lucide-react';

const SendInvoiceModal = ({ isOpen, onClose, invoice }) => {
    const [method, setMethod] = useState('email'); // 'email' or 'whatsapp'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen || !invoice) return null;

    const handleSend = () => {
        alert(`Fatura enviada para ${method === 'email' ? email : phone} com sucesso!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Enviar Fatura</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex p-1 bg-secondary rounded-lg">
                        <button
                            onClick={() => setMethod('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${method === 'email' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                        <button
                            onClick={() => setMethod('whatsapp')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${method === 'whatsapp' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </button>
                    </div>

                    <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                        <p className="text-sm font-medium text-foreground mb-1">Resumo da Fatura</p>
                        <p className="text-xs text-muted-foreground">#{invoice.id} • {invoice.patient}</p>
                        <p className="text-lg font-bold text-primary mt-2">R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>

                    {method === 'email' ? (
                        <div>
                            <label className="block text-sm font-medium mb-1">Email do Destinatário</label>
                            <input
                                type="email"
                                placeholder="exemplo@email.com"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-1">WhatsApp</label>
                            <input
                                type="tel"
                                placeholder="(11) 99999-9999"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSend}
                        className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Enviar Agora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendInvoiceModal;
