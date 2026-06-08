/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { ArrowRight, Flame, Heart, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import ProgramCard from "@/features/premium/components/ProgramCard";
import { premiumPrograms } from "@/features/premium/data/programs";
import { describePrimaryGoal, getPremiumExperience } from "@/server/dal/premium";

function greeting(name: string | null) {
    const hour = new Date().getHours();
    const saludo = hour < 13 ? "Buenos dias" : hour < 20 ? "Buenas tardes" : "Buenas noches";
    return name ? `${saludo}, ${name.split(" ")[0]}` : saludo;
}

function formatDate() {
    return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
}

export default async function PremiumDashboardPage() {
    const viewer = (await getViewerContext()) ?? buildPreviewViewer();
    const experience = await getPremiumExperience(viewer);

    const featuredPrograms = (
        experience.favoritePrograms.length > 0 ? experience.favoritePrograms : premiumPrograms
    ).slice(0, 3);

    const { summary, suggestedProgram, profile, recentSessions, programProgress } = experience;
    const weeklyPercent = Math.min(Math.round((summary.sessionsThisWeek / summary.weeklyTarget) * 100), 100);

    return (
        <div className="grid gap-6">
            {/* Welcome hero */}
            <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(61,218,215,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(60,125,255,0.12),transparent_40%),linear-gradient(180deg,rgba(7,12,24,0.94),rgba(2,6,23,0.98))] p-6 shadow-[0_26px_70px_rgba(2,6,23,0.36)] md:p-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                    <div>
                        <p className="text-sm capitalize text-slate-400">{formatDate()}</p>
                        <h1 className="mt-2 font-[family:var(--font-display)] text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                            {greeting(viewer.name)}
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Objetivo: <span className="text-slate-200">{describePrimaryGoal(profile.primaryGoal)}</span>
                            {profile.preferredWindow ? (
                                <> · Ventana ideal: <span className="text-slate-200">{profile.preferredWindow}</span></>
                            ) : null}
                        </p>

                        {/* Weekly progress */}
                        <div className="mt-6 max-w-md">
                            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                                <span>Progreso semanal</span>
                                <span className="font-semibold text-slate-200">
                                    {summary.sessionsThisWeek} / {summary.weeklyTarget} sesiones
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-400 transition-all duration-700"
                                    style={{ width: `${weeklyPercent}%` }}
                                />
                            </div>
                            {weeklyPercent >= 100 && (
                                <p className="mt-2 flex items-center gap-1 text-xs text-teal-300">
                                    <ShieldCheck size={12} /> Meta semanal alcanzada
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex flex-row gap-3 lg:flex-col">
                        <div className="flex flex-1 flex-col items-center justify-center rounded-[22px] border border-white/10 bg-black/20 p-4 text-center lg:min-w-[120px]">
                            <Flame size={20} className="text-amber-300" />
                            <p className="mt-2 text-2xl font-semibold text-slate-50">{summary.currentStreak}</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">dias</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center rounded-[22px] border border-white/10 bg-black/20 p-4 text-center lg:min-w-[120px]">
                            <Sparkles size={20} className="text-teal-300" />
                            <p className="mt-2 text-2xl font-semibold text-slate-50">{summary.totalMinutes}</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">minutos</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center rounded-[22px] border border-white/10 bg-black/20 p-4 text-center lg:min-w-[120px]">
                            <Heart size={20} className="text-rose-300" />
                            <p className="mt-2 text-2xl font-semibold text-slate-50">{summary.favoriteCount}</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">favoritos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Suggested session CTA */}
            <section className="overflow-hidden rounded-[32px] border border-teal-300/20 bg-[radial-gradient(circle_at_top_left,rgba(61,218,215,0.12),transparent_48%),linear-gradient(135deg,rgba(8,14,27,0.92),rgba(4,8,20,0.98))] p-6 shadow-[0_18px_48px_rgba(2,6,23,0.28)] md:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-teal-200">
                            <Sparkles size={12} />
                            Sesion sugerida
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-50">{suggestedProgram.title}</h2>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{suggestedProgram.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{suggestedProgram.duration}</span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{suggestedProgram.cadence}</span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{suggestedProgram.focus}</span>
                        </div>
                    </div>
                    <Link
                        href={`/app/session/${suggestedProgram.slug}`}
                        className="inline-flex shrink-0 items-center gap-3 rounded-full border border-teal-300/30 bg-gradient-to-r from-teal-300 to-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_28px_rgba(61,218,215,0.22)] transition-all hover:scale-[1.02]"
                    >
                        <PlayCircle size={18} />
                        Comenzar ahora
                    </Link>
                </div>
            </section>

            {/* Recent sessions + programs */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                {/* Recent sessions */}
                <article className="rounded-[32px] border border-white/10 bg-[rgba(8,14,27,0.82)] p-6 shadow-[0_22px_54px_rgba(2,6,23,0.26)]">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-slate-50">Actividad reciente</h2>
                        <Link href="/app/history" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                            Ver todo <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {recentSessions.length > 0 ? (
                            recentSessions.slice(0, 5).map((session) => (
                                <div key={session.id} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-50">{session.programTitle}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {session.durationMinutes} min · {session.cadence}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-xs text-slate-400">
                                        {new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(
                                            new Date(session.completedAt),
                                        )}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center">
                                <p className="text-sm text-slate-400">Aun no hay sesiones registradas.</p>
                                <p className="mt-1 text-xs text-slate-500">Comienza con la sesion sugerida arriba.</p>
                            </div>
                        )}
                    </div>
                </article>

                {/* Featured programs */}
                <article className="rounded-[32px] border border-white/10 bg-[rgba(8,14,27,0.82)] p-6 shadow-[0_22px_54px_rgba(2,6,23,0.26)]">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-slate-50">
                            {experience.favoritePrograms.length > 0 ? "Tus favoritos" : "Programas recomendados"}
                        </h2>
                        <Link href="/app/library" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                            Ver biblioteca <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="mt-5 grid gap-4">
                        {featuredPrograms.map((program) => {
                            const progress = programProgress[program.slug];
                            const locked = program.access === "premium" && !viewer.hasPremium;

                            return (
                                <div
                                    key={program.slug}
                                    className={`relative overflow-hidden rounded-[20px] border border-white/10 bg-black/20 p-4 ${locked ? "opacity-70" : ""}`}
                                >
                                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-br ${program.accent}`} />
                                    <div className="relative z-10 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{program.focus}</p>
                                            <p className="mt-1 truncate text-base font-semibold text-slate-50">{program.title}</p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {program.duration} · {progress?.completionCount ?? 0} sesiones
                                            </p>
                                        </div>
                                        {locked ? (
                                            <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
                                                Premium
                                            </span>
                                        ) : (
                                            <Link
                                                href={`/app/session/${program.slug}`}
                                                className="shrink-0 inline-flex items-center gap-1 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs text-teal-200 transition-colors hover:border-teal-300/40 hover:bg-teal-300/20"
                                            >
                                                <PlayCircle size={12} />
                                                Iniciar
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </div>

            {/* All programs (compact) */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-50">Todos los programas</h2>
                    <Link href="/app/library" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                        Biblioteca completa <ArrowRight size={12} />
                    </Link>
                </div>
                <div className="grid gap-4 xl:grid-cols-3">
                    {featuredPrograms.map((program) => {
                        const prog = programProgress[program.slug];
                        return (
                            <ProgramCard
                                key={program.slug}
                                completionCount={prog?.completionCount ?? 0}
                                isFavorite={prog?.isFavorite ?? false}
                                lastCompletedAt={prog?.lastCompletedAt ?? null}
                                program={program}
                                premiumUnlocked={viewer.hasPremium}
                                source="dashboard"
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
