/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
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
            <section className="rounded-[32px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-6 shadow-[0_22px_54px_rgba(2,6,23,0.26)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Tu cuenta</p>
                <h1 className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold text-slate-50 md:text-4xl">
                    Perfil y preferencias
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    Ajusta tu objetivo de practica, ventana horaria preferida y notas personales. Tus preferencias guian las sugerencias de programas.
                </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                {/* Viewer info */}
                <article className="rounded-[28px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-5 shadow-[0_20px_48px_rgba(2,6,23,0.24)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-300/10 text-teal-100">
                            <UserRound size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Identidad</p>
                            <h2 className="mt-1 text-2xl font-semibold text-slate-50">{viewer.name}</h2>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {viewer.email ? (
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Correo</p>
                                <p className="mt-2 text-base font-semibold text-slate-50">{viewer.email}</p>
                            </div>
                        ) : null}
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Plan</p>
                            <p className="mt-2 text-base font-semibold text-slate-50 capitalize">{viewer.hasPremium ? "Premium" : "Basico"}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Objetivo actual</p>
                            <p className="mt-2 text-base font-semibold text-slate-50">{describePrimaryGoal(experience.profile.primaryGoal)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Sesiones totales</p>
                            <p className="mt-2 text-base font-semibold text-slate-50">{experience.summary.totalSessions}</p>
                        </div>
                    </div>

                    {viewer.authConfigured && viewer.isAuthenticated ? (
                        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-300/15 bg-emerald-300/5 px-4 py-3">
                            <ShieldCheck size={14} className="text-emerald-300" />
                            <p className="text-xs text-emerald-200">Sesion verificada y activa</p>
                        </div>
                    ) : null}
                </article>

                {/* Profile form */}
                <article className="rounded-[28px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-5 shadow-[0_20px_48px_rgba(2,6,23,0.24)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300/10 text-sky-100">
                            <Save size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Preferencias</p>
                            <h2 className="mt-1 text-2xl font-semibold text-slate-50">Ajusta tu practica</h2>
                        </div>
                    </div>

                    <form action={savePremiumProfileAction} className="mt-5 grid gap-4">
                        <label className="grid gap-2">
                            <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Objetivo principal</span>
                            <select
                                name="primaryGoal"
                                defaultValue={experience.profile.primaryGoal}
                                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-teal-300/40"
                            >
                                {premiumGoals.map((goal) => (
                                    <option key={goal} value={goal} className="bg-slate-950">
                                        {premiumGoalLabels[goal]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2">
                                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Horario preferido</span>
                                <input
                                    type="text"
                                    name="preferredWindow"
                                    placeholder="Ej: 07:30 - 09:00"
                                    defaultValue={experience.profile.preferredWindow}
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-teal-300/40"
                                />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Sesiones por semana</span>
                                <input
                                    type="number"
                                    name="weeklyTarget"
                                    min={1}
                                    max={14}
                                    defaultValue={experience.profile.weeklyTarget}
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-teal-300/40"
                                />
                            </label>
                        </div>

                        <label className="grid gap-2">
                            <span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Notas personales</span>
                            <textarea
                                name="notes"
                                rows={4}
                                placeholder="Observaciones sobre tu practica, sensaciones o metas..."
                                defaultValue={experience.profile.notes}
                                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-teal-300/40"
                            />
                        </label>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-teal-300 to-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_36px_rgba(61,218,215,0.22)] transition-transform hover:scale-[1.01]"
                        >
                            <Save size={16} />
                            Guardar preferencias
                        </button>
                    </form>
                </article>
            </section>

            {/* Groups display (only if user has groups) */}
            {viewer.groups.length > 0 ? (
                <section className="rounded-[28px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-5 shadow-[0_20px_48px_rgba(2,6,23,0.24)]">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Accesos y permisos</p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-50">Tu nivel de acceso</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {viewer.groups.map((group) => (
                            <span key={group} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                                {group}
                            </span>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
