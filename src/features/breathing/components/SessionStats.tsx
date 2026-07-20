/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

"use client";

import type { ReactNode } from "react";
import { Activity, ShieldCheck, Timer } from "lucide-react";
import { formatTime } from "../lib/breathing";
import type { BreathingSession } from "../hooks/useBreathingSession";

function StatTile({ icon, label, value, helper, footer }: { icon: ReactNode; label: string; value: string; helper?: string; footer?: ReactNode }) {
    return (
        <div className="rounded-xl border border-rule bg-paper-2 p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{label}</p>
                    <p className="mt-2 font-display text-2xl font-bold text-ink">{value}</p>
                    {helper ? <p className="mt-2 text-sm leading-6 text-ink-2">{helper}</p> : null}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-mental-deep">{icon}</div>
            </div>
            {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
    );
}

// Filas de estadística de la sesión (tiempo, ciclos, meta) — lámina papel
export default function SessionStats({ session }: { session: BreathingSession }) {
    const { t, sessionTime, cycles, activeShapeLabel, seconds, challengeGoal, progress, resetChallenge } = session;

    return (
        <div className="grid gap-3 md:grid-cols-3">
            <StatTile icon={<Timer size={20} />} label={t.sessionTime} value={formatTime(sessionTime)} helper={t.shortcuts} />
            <StatTile icon={<Activity size={20} />} label={t.cycles} value={cycles.toString()} helper={`${activeShapeLabel} · ${seconds.toFixed(1)} s`} />
            <StatTile
                icon={<ShieldCheck size={20} />}
                label={t.goal}
                value={challengeGoal.toString()}
                helper={progress >= 100 ? t.challengeWon : `${t.challenge}: ${progress.toFixed(0)}%`}
                footer={
                    <button type="button" onClick={resetChallenge} className="lm-btn-ghost !border-fisico/40 !py-2 text-sm !text-fisico-deep">
                        {t.reset}
                    </button>
                }
            />
        </div>
    );
}
