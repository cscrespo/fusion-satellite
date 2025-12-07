import React from 'react';

const ColorPicker = ({ label, value, onChange, description }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 h-16 rounded-xl border-2 border-border cursor-pointer"
                />
                <div className="flex-1">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                        placeholder="#3b82f6"
                        pattern="^#[0-9A-Fa-f]{6}$"
                    />
                </div>
                <div
                    className="w-16 h-16 rounded-xl border-2 border-border shadow-sm"
                    style={{ backgroundColor: value }}
                    title={value}
                />
            </div>
        </div>
    );
};

export default ColorPicker;
