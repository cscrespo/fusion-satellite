import React from 'react';
import { X } from 'lucide-react';

const GenericModal = ({ isOpen, onClose, title, children, onSave, saveLabel = 'Salvar' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                    >
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericModal;
