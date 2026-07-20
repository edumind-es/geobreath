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
import { Hexagon, Sparkles, Square, Triangle } from "lucide-react";
import type { Preset } from "../hooks/useBreathingSession";
import type { BreathingSession } from "../hooks/useBreathingSession";

interface Routine {
    preset: Preset;
    title: string;
    desc: string;
    icon: ReactNode;
    accent: string;
}

// Rutinas rápidas (presets) — cada una con su acento de mundo
export default function PresetsCard({ session }: { session: BreathingSession }) {
    const { t, applyPreset } = session;

    const routines: Routine[] = [
        { preset: "calm", title: t.calm, desc: t.calmDesc, icon: <Triangle size={18} />, accent: "text-emocional-deep" },
        { preset: "focus", title: t.focus, desc: t.focusDesc, icon: <Square size={18} />, accent: "text-mental-deep" },
        { preset: "recover", title: t.recover, desc: t.recoverDesc, icon: <Hexagon size={18} />, accent: "text-social-deep" },
    ];

    return (
        <section className="rounded-2xl border border-rule bg-paper-2 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.quickRoutines}</p>
                    <h3 className="mt-2 font-display text-xl font-bold text-ink">{t.ready}</h3>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-social-deep">
                    <Sparkles size={18} />
                </div>
            </div>

            <div className="grid gap-2">
                {routines.map((routine) => (
                    <button
                        key={routine.preset}
                        type="button"
                        onClick={() => applyPreset(routine.preset)}
                        className="rounded-lg border border-rule bg-paper p-4 text-left transition-colors hover:border-ink-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-display text-base font-semibold text-ink">{routine.title}</p>
                                <p className="mt-1 text-sm leading-6 text-ink-2">{routine.desc}</p>
                            </div>
                            <span className={`mt-1 shrink-0 ${routine.accent}`}>{routine.icon}</span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
