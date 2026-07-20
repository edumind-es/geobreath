/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import type { ReactNode } from "react";

interface ToggleControlProps {
    active: boolean;
    activeIcon: ReactNode;
    inactiveIcon?: ReactNode;
    label: string;
    onClick: () => void;
}

// Interruptor de apoyo sensorial — estética lámina (papel + acento mundo mental)
export default function ToggleControl({ active, activeIcon, inactiveIcon, label, onClick }: ToggleControlProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label={label}
            className={`flex min-h-16 items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
                active
                    ? "border-mental/60 bg-mental/10 text-ink"
                    : "border-rule bg-paper text-ink-2 hover:border-ink-3"
            }`}
        >
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                    active ? "bg-mental/15 text-mental-deep" : "bg-black/[0.04] text-ink-3"
                }`}
            >
                {active ? activeIcon : inactiveIcon ?? activeIcon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold leading-tight">{label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                    {active ? "ON" : "OFF"}
                </span>
            </span>
        </button>
    );
}
