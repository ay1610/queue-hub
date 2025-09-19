import React from "react";

export interface ChecklistItem {
    id: string;
    label: string;
    checked: boolean;
}

interface ChecklistProps {
    items: ChecklistItem[];
    onChange: (itemId: string, checked: boolean) => void;
    className?: string;
}

export function Checklist({ items, onChange, className = "" }: ChecklistProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item) => (
                <label
                    key={item.id}
                    className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:opacity-80 cursor-pointer"
                >
                    <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => onChange(item.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span>{item.label}</span>
                </label>
            ))}
        </div>
    );
}