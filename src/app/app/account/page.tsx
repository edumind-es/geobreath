/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Save, ShieldCheck, UserRound } from "lucide-react";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import { premiumGoalLabels, premiumGoals } from "@/features/premium/lib/types";
import { savePremiumProfileAction } from "@/features/premium/server/actions";
import { describePrimaryGoal, getPremiumExperience } from "@/server/dal/premium";

export default async function PremiumAccountPage() {
    const viewer = (await getViewerContext()) ?? buildPreviewViewer();
    const experience = await getPremiumExperience(viewer);

    return (
        <div className="grid gap-6">
            <section className="rounded-2xl border-2 border-rule-strong bg-paper-2 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">Tu cuenta</p>
                <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
                    Perfil y preferencias
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-2">
                    Ajusta tu objetivo de práctica, ventana horaria preferida y notas personales. Tus preferencias guían las sugerencias de programas.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                {/* Identidad */}
                <article className="rounded-2xl border border-rule bg-paper-2 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-mental/10 text-mental-deep">
                            <UserRound size={18} />
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Identidad</p>
                            <h2 className="mt-1 font-display text-2xl font-bold text-ink">{viewer.name}</h2>
                        </div>
                    </div>

                    <div className="mt-5 border-t-2 border-rule-strong">
                        {viewer.email ? (
                            <div className="border-b border-rule py-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Correo</p>
                                <p className="mt-1 text-base font-semibold text-ink">{viewer.email}</p>
                            </div>
                        ) : null}
                        <div className="border-b border-rule py-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Plan</p>
                            <p className="mt-1 text-base font-semibold capitalize text-ink">{viewer.hasPremium ? "Premium" : "Básico"}</p>
                        </div>
                        <div className="border-b border-rule py-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Objetivo actual</p>
                            <p className="mt-1 text-base font-semibold text-ink">{describePrimaryGoal(experience.profile.primaryGoal)}</p>
                        </div>
                        <div className="border-b border-rule py-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Sesiones totales</p>
                            <p className="mt-1 text-base font-semibold text-ink">{experience.summary.totalSessions}</p>
                        </div>
                    </div>

                    {viewer.authConfigured && viewer.isAuthenticated ? (
                        <div className="mt-4 flex items-center gap-2 rounded-md border border-emocional-deep bg-emocional/10 px-4 py-3">
                            <ShieldCheck size={14} className="text-emocional-deep" />
                            <p className="text-xs font-semibold text-emocional-deep">Sesión verificada y activa</p>
                        </div>
                    ) : null}
                </article>

                {/* Formulario de preferencias */}
                <article className="rounded-2xl border border-rule bg-paper-2 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-interior/10 text-interior-deep">
                            <Save size={18} />
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Preferencias</p>
                            <h2 className="mt-1 font-display text-2xl font-bold text-ink">Ajusta tu práctica</h2>
                        </div>
                    </div>

                    <form action={savePremiumProfileAction} className="mt-5 grid gap-4">
                        <label className="grid gap-2">
                            <span className="lm-label">Objetivo principal</span>
                            <select name="primaryGoal" defaultValue={experience.profile.primaryGoal} className="lm-select">
                                {premiumGoals.map((goal) => (
                                    <option key={goal} value={goal}>
                                        {premiumGoalLabels[goal]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2">
                                <span className="lm-label">Horario preferido</span>
                                <input type="text" name="preferredWindow" placeholder="Ej: 07:30 - 09:00" defaultValue={experience.profile.preferredWindow} className="lm-input" />
                            </label>
                            <label className="grid gap-2">
                                <span className="lm-label">Sesiones por semana</span>
                                <input type="number" name="weeklyTarget" min={1} max={14} defaultValue={experience.profile.weeklyTarget} className="lm-input" />
                            </label>
                        </div>

                        <label className="grid gap-2">
                            <span className="lm-label">Notas personales</span>
                            <textarea name="notes" rows={4} placeholder="Observaciones sobre tu práctica, sensaciones o metas..." defaultValue={experience.profile.notes} className="lm-textarea" />
                        </label>

                        <button type="submit" className="lm-btn h-12 w-full">
                            <Save size={16} />
                            Guardar preferencias
                        </button>
                    </form>
                </article>
            </section>

            {/* Accesos y permisos (solo si hay grupos) */}
            {viewer.groups.length > 0 ? (
                <section className="rounded-2xl border border-rule bg-paper-2 p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Accesos y permisos</p>
                    <h2 className="mt-3 font-display text-xl font-bold text-ink">Tu nivel de acceso</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {viewer.groups.map((group) => (
                            <span key={group} className="rounded-md border border-rule bg-paper px-3 py-1 font-mono text-xs text-ink-2">
                                {group}
                            </span>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
