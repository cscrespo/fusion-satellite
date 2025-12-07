import React from 'react';
import { X, Calendar, Clock, User, DollarSign, FileText, Star, CheckCircle2, Activity } from 'lucide-react';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Detalhes da Transação</h2>
                        <p className="text-sm text-muted-foreground mt-1">ID: #{transaction.id}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Data da Consulta</p>
                                    <p className="font-bold text-foreground">{transaction.consultationDate}</p>
                                    <p className="text-xs text-muted-foreground">{transaction.consultationTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Valor Líquido</p>
                                    <p className="font-bold text-2xl text-emerald-600">R$ {transaction.netAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground">Informações do Paciente</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nome</p>
                                <p className="font-medium">{transaction.patientName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Protocolo</p>
                                <p className="font-medium">{transaction.protocol}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="p-4 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground">Detalhamento Financeiro</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Valor Bruto da Consulta</span>
                                <span className="font-medium">R$ {transaction.grossAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="text-sm text-muted-foreground">Taxa da Plataforma (20%)</span>
                                <span className="font-medium text-red-600">-R$ {transaction.platformFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-bold text-foreground">Valor Líquido</span>
                                <span className="font-bold text-lg text-emerald-600">R$ {transaction.netAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="p-4 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground">Status do Pagamento</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status Atual</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${transaction.status === 'Pago' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        transaction.status === 'Disponível' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            transaction.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-purple-50 text-purple-700 border-purple-100'
                                    }`}>
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Data de Liberação</span>
                                <span className="font-medium">{transaction.releaseDate}</span>
                            </div>
                            {transaction.paymentDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Data do Pagamento</span>
                                    <span className="font-medium text-emerald-600">{transaction.paymentDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Patient Rating */}
                    {transaction.patientRating && (
                        <div className="p-4 bg-background rounded-xl border border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <Star className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-foreground">Avaliação do Paciente</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < transaction.patientRating.score
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 font-bold text-lg">{transaction.patientRating.score}/5</span>
                                </div>
                                {transaction.patientRating.comment && (
                                    <div className="mt-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                        <p className="text-sm text-muted-foreground italic">"{transaction.patientRating.comment}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Transcription Info */}
                    {transaction.transcription && (
                        <div className="p-4 bg-background rounded-xl border border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-foreground">Informações da Consulta</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Duração</p>
                                    <p className="font-medium">{transaction.transcription.duration}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status da Auditoria</p>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <p className="font-medium text-emerald-600">{transaction.transcription.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
