/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
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
            {/* Cabecera */}
            <section className="rounded-2xl border-2 border-rule-strong bg-paper-2 p-6 md:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">Historial</p>
                <h1 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
                    Tu práctica acumulada
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-2">
                    Sesiones completadas, racha activa y progreso hacia tu objetivo semanal.
                </p>

                {/* Métricas */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-rule bg-paper p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mental/10 text-mental-deep">
                            <Clock size={18} />
                        </div>
                        <p className="mt-3 font-display text-3xl font-bold text-ink">{summary.totalSessions}</p>
                        <p className="mt-1 text-sm text-ink-2">sesiones completadas</p>
                    </div>
                    <div className="rounded-xl border border-rule bg-paper p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-social/10 text-social-deep">
                            <Flame size={18} />
                        </div>
                        <p className="mt-3 font-display text-3xl font-bold text-ink">{summary.currentStreak}</p>
                        <p className="mt-1 text-sm text-ink-2">días de racha</p>
                    </div>
                    <div className="rounded-xl border border-rule bg-paper p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-interior/10 text-interior-deep">
                            <CalendarRange size={18} />
                        </div>
                        <p className="mt-3 font-display text-3xl font-bold text-ink">{summary.totalMinutes}</p>
                        <p className="mt-1 text-sm text-ink-2">minutos practicados</p>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                {/* Ritmo semanal */}
                <article className="rounded-2xl border border-rule bg-paper-2 p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Ritmo semanal</p>
                    <h2 className="mt-3 font-display text-xl font-bold text-ink">Objetivo y ventana</h2>

                    <div className="mt-5 grid gap-4">
                        <div className="rounded-lg border border-rule bg-paper p-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-ink-2">Sesiones esta semana</p>
                                <span className="text-sm font-semibold text-ink">
                                    {summary.sessionsThisWeek} / {summary.weeklyTarget}
                                </span>
                            </div>
                            <div className="mt-3 h-2 w-full rounded-full bg-black/[0.06]">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${weeklyPercent >= 100 ? "bg-emocional" : "bg-mental"}`}
                                    style={{ width: `${weeklyPercent}%` }}
                                />
                            </div>
                            {weeklyPercent >= 100 ? (
                                <p className="mt-2 text-xs font-semibold text-emocional-deep">Meta semanal alcanzada</p>
                            ) : (
                                <p className="mt-2 text-xs text-ink-2">
                                    {summary.weeklyTarget - summary.sessionsThisWeek} {summary.weeklyTarget - summary.sessionsThisWeek !== 1 ? "sesiones" : "sesión"} para completar la semana
                                </p>
                            )}
                        </div>

                        <div className="rounded-lg border border-rule bg-paper p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Horario preferido</p>
                            <p className="mt-2 text-base font-semibold text-ink">{summary.preferredWindow}</p>
                        </div>

                        <div className="rounded-lg border border-rule bg-paper p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Objetivo de práctica</p>
                            <p className="mt-2 text-base font-semibold text-ink">{describePrimaryGoal(profile.primaryGoal)}</p>
                        </div>
                    </div>
                </article>

                {/* Siguiente sesión */}
                <article className="rounded-2xl border border-mental/40 bg-mental/[0.06] p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Siguiente sesión</p>
                    <h2 className="mt-3 font-display text-xl font-bold text-ink">{suggestedProgram.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-2">{suggestedProgram.summary}</p>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-lg border border-rule bg-paper p-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">Duración</p>
                            <p className="mt-2 text-sm font-semibold text-ink">{suggestedProgram.duration}</p>
                        </div>
                        <div className="rounded-lg border border-rule bg-paper p-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">Cadencia</p>
                            <p className="mt-2 text-sm font-semibold text-ink">{suggestedProgram.cadence}</p>
                        </div>
                        <div className="rounded-lg border border-rule bg-paper p-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2">Enfoque</p>
                            <p className="mt-2 text-sm font-semibold leading-tight text-ink">{suggestedProgram.focus}</p>
                        </div>
                    </div>

                    <Link href={`/app/session/${suggestedProgram.slug}`} className="lm-btn mt-5 h-12 w-full">
                        <PlayCircle size={16} />
                        Comenzar esta sesión
                    </Link>
                </article>
            </div>

            {/* Línea de tiempo de sesiones */}
            <section className="rounded-2xl border border-rule bg-paper-2 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Actividad</p>
                <h2 className="mt-3 font-display text-2xl font-bold text-ink">Todas las sesiones</h2>

                <div className="mt-4 grid">
                    {recentSessions.length > 0 ? (
                        recentSessions.map((session, index) => (
                            <article
                                key={session.id}
                                className="flex items-center gap-4 border-b border-rule px-1 py-4 transition-colors hover:bg-black/[0.02]"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-mental/10 font-mono text-xs font-semibold text-mental-deep">
                                    {recentSessions.length - index}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-ink">{session.programTitle}</p>
                                    <p className="mt-0.5 font-mono text-xs text-ink-2">
                                        {session.durationMinutes} min · {session.cadence}
                                    </p>
                                </div>

                                <time className="shrink-0 font-mono text-xs text-ink-2">
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
                        <div className="rounded-lg border border-dashed border-rule bg-paper p-8 text-center">
                            <p className="text-sm text-ink-2">Aún no hay sesiones registradas.</p>
                            <Link href="/app/library" className="lm-btn-ghost mt-4 inline-flex">
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
