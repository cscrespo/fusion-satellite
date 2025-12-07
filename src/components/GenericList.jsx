import React from 'react';
import { Trash2, Plus, Edit2 } from 'lucide-react';

const GenericList = ({ title, items, onItemAdd, onItemDelete, onItemEdit, renderItem, emptyMessage, addItemLabel }) => {
    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                    onClick={onItemAdd}
                    className="text-primary hover:bg-primary/10 p-1 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    {addItemLabel || 'Adicionar'}
                </button>
            </div>

            <div className="space-y-3">
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="group flex justify-between items-start p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors">
                            <div className="flex-1 pr-4">
                                {renderItem(item)}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                {onItemEdit && (
                                    <button
                                        onClick={() => onItemEdit(item)}
                                        className="text-muted-foreground hover:text-primary p-1 hover:bg-secondary rounded-md transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onItemDelete(item.id)}
                                    className="text-muted-foreground hover:text-destructive p-1 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">{emptyMessage || 'Nenhum item ainda.'}</p>
                )}
            </div>
        </div>
    );
};

export default GenericList;
