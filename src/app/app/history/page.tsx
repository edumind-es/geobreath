/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { CalendarRange, Clock, Flame, PlayCircle } from "lucide-react";
import Link from "next/link";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import { describePrimaryGoal, getPremiumExperience } from "@/server/dal/premium";

export default async function PremiumHistoryPage() {
    const viewer = (await getViewerContext()) ?? buildPreviewViewer();
    const experience = await getPremiumExperience(viewer);
    const { summary, suggestedProgram, recentSessions, profile } = experience;

    const weeklyPercent = Math.min(Math.round((summary.sessionsThisWeek / summary.weeklyTarget) * 100), 100);

    return (
        <div className="grid gap-6">
            {/* Header */}
            <section className="rounded-[32px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-6 shadow-[0_22px_54px_rgba(2,6,23,0.26)] md:p-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Historial</p>
                <h1 className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold text-slate-50 md:text-4xl">
                    Tu practica acumulada
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    Sesiones completadas, racha activa y progreso hacia tu objetivo semanal.
                </p>

                {/* Metric cards */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-teal-100">
                            <Clock size={18} />
                        </div>
                        <p className="mt-3 text-3xl font-semibold text-slate-50">{summary.totalSessions}</p>
                        <p className="mt-1 text-sm text-slate-400">sesiones completadas</p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-amber-100">
                            <Flame size={18} />
                        </div>
                        <p className="mt-3 text-3xl font-semibold text-slate-50">{summary.currentStreak}</p>
                        <p className="mt-1 text-sm text-slate-400">dias de racha</p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sky-100">
                            <CalendarRange size={18} />
                        </div>
                        <p className="mt-3 text-3xl font-semibold text-slate-50">{summary.totalMinutes}</p>
                        <p className="mt-1 text-sm text-slate-400">minutos practicados</p>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                {/* Weekly rhythm */}
                <article className="rounded-[28px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-6 shadow-[0_20px_48px_rgba(2,6,23,0.24)]">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Ritmo semanal</p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-50">Objetivo y ventana</h2>

                    <div className="mt-5 grid gap-4">
                        {/* Weekly progress bar */}
                        <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-slate-300">Sesiones esta semana</p>
                                <span className="text-sm font-semibold text-slate-50">
                                    {summary.sessionsThisWeek} / {summary.weeklyTarget}
                                </span>
                            </div>
                            <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${weeklyPercent >= 100 ? "bg-emerald-400" : "bg-gradient-to-r from-teal-300 to-sky-400"}`}
                                    style={{ width: `${weeklyPercent}%` }}
                                />
                            </div>
                            {weeklyPercent >= 100 ? (
                                <p className="mt-2 text-xs text-emerald-300">Meta semanal alcanzada</p>
                            ) : (
                                <p className="mt-2 text-xs text-slate-500">
                                    {summary.weeklyTarget - summary.sessionsThisWeek} sesion{summary.weeklyTarget - summary.sessionsThisWeek !== 1 ? "es" : ""} para completar la semana
                                </p>
                            )}
                        </div>

                        <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Horario preferido</p>
                            <p className="mt-2 text-base font-semibold text-slate-50">{summary.preferredWindow}</p>
                        </div>

                        <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Objetivo de practica</p>
                            <p className="mt-2 text-base font-semibold text-slate-50">{describePrimaryGoal(profile.primaryGoal)}</p>
                        </div>
                    </div>
                </article>

                {/* Suggested next session */}
                <article className="rounded-[28px] border border-teal-300/15 bg-[radial-gradient(circle_at_top_left,rgba(61,218,215,0.08),transparent_50%),rgba(8,14,27,0.84)] p-6 shadow-[0_20px_48px_rgba(2,6,23,0.24)]">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Siguiente sesion</p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-50">{suggestedProgram.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{suggestedProgram.summary}</p>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-[16px] border border-white/10 bg-black/20 p-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Duracion</p>
                            <p className="mt-2 text-sm font-semibold text-slate-50">{suggestedProgram.duration}</p>
                        </div>
                        <div className="rounded-[16px] border border-white/10 bg-black/20 p-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Cadencia</p>
                            <p className="mt-2 text-sm font-semibold text-slate-50">{suggestedProgram.cadence}</p>
                        </div>
                        <div className="rounded-[16px] border border-white/10 bg-black/20 p-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Enfoque</p>
                            <p className="mt-2 text-sm font-semibold text-slate-50 leading-tight">{suggestedProgram.focus}</p>
                        </div>
                    </div>

                    <Link
                        href={`/app/session/${suggestedProgram.slug}`}
                        className="mt-5 flex items-center justify-center gap-2 rounded-[20px] border border-teal-300/25 bg-teal-300/10 px-4 py-3 text-sm font-medium text-teal-100 transition-colors hover:border-teal-300/40 hover:bg-teal-300/15"
                    >
                        <PlayCircle size={16} />
                        Comenzar esta sesion
                    </Link>
                </article>
            </div>

            {/* Session timeline */}
            <section className="rounded-[32px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-6 shadow-[0_22px_54px_rgba(2,6,23,0.26)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Actividad</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-50">Todas las sesiones</h2>

                <div className="mt-5 grid gap-2">
                    {recentSessions.length > 0 ? (
                        recentSessions.map((session, index) => (
                            <article
                                key={session.id}
                                className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-black/20 px-5 py-4 transition-colors hover:border-white/20"
                            >
                                {/* Index indicator */}
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-300/10 text-xs font-semibold text-teal-300">
                                    {recentSessions.length - index}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-50">{session.programTitle}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {session.durationMinutes} min · {session.cadence}
                                    </p>
                                </div>

                                <time className="shrink-0 text-xs text-slate-400">
                                    {new Intl.DateTimeFormat("es-ES", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }).format(new Date(session.completedAt))}
                                </time>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-[22px] border border-dashed border-white/10 bg-black/10 p-8 text-center">
                            <p className="text-sm text-slate-300">Aun no hay sesiones registradas.</p>
                            <Link
                                href="/app/library"
                                className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-sm text-teal-200 hover:border-teal-300/40"
                            >
                                <PlayCircle size={14} />
                                Ir a la biblioteca
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
