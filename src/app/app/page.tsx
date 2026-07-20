/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
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
            {/* Bienvenida */}
            <section className="rounded-2xl border-2 border-rule-strong bg-paper-2 p-6 md:p-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                    <div>
                        <p className="font-mono text-xs uppercase capitalize tracking-[0.12em] text-ink-2">{formatDate()}</p>
                        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                            {greeting(viewer.name)}
                        </h1>
                        <p className="mt-2 text-sm text-ink-2">
                            Objetivo: <span className="font-semibold text-ink">{describePrimaryGoal(profile.primaryGoal)}</span>
                            {profile.preferredWindow ? (
                                <> · Ventana ideal: <span className="font-semibold text-ink">{profile.preferredWindow}</span></>
                            ) : null}
                        </p>

                        {/* Progreso semanal */}
                        <div className="mt-6 max-w-md">
                            <div className="mb-2 flex items-center justify-between font-mono text-xs text-ink-2">
                                <span>Progreso semanal</span>
                                <span className="font-semibold text-ink">
                                    {summary.sessionsThisWeek} / {summary.weeklyTarget} sesiones
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-black/[0.06]">
                                <div
                                    className="h-full rounded-full bg-mental transition-all duration-700"
                                    style={{ width: `${weeklyPercent}%` }}
                                />
                            </div>
                            {weeklyPercent >= 100 && (
                                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emocional-deep">
                                    <ShieldCheck size={12} /> Meta semanal alcanzada
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="flex flex-row gap-3 lg:flex-col">
                        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-rule bg-paper p-4 text-center lg:min-w-[120px]">
                            <Flame size={20} className="text-social-deep" />
                            <p className="mt-2 font-display text-2xl font-bold text-ink">{summary.currentStreak}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">días</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-rule bg-paper p-4 text-center lg:min-w-[120px]">
                            <Sparkles size={20} className="text-mental-deep" />
                            <p className="mt-2 font-display text-2xl font-bold text-ink">{summary.totalMinutes}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">minutos</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-rule bg-paper p-4 text-center lg:min-w-[120px]">
                            <Heart size={20} className="text-fisico-deep" />
                            <p className="mt-2 font-display text-2xl font-bold text-ink">{summary.favoriteCount}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">favoritos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA sesión sugerida */}
            <section className="rounded-2xl border border-mental/40 bg-mental/[0.06] p-6 md:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-md border border-mental-deep bg-mental/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-mental-deep">
                            <Sparkles size={12} />
                            Sesión sugerida
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-bold text-ink">{suggestedProgram.title}</h2>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-ink-2">{suggestedProgram.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-ink-2">
                            <span className="rounded-md border border-rule bg-paper px-3 py-1">{suggestedProgram.duration}</span>
                            <span className="rounded-md border border-rule bg-paper px-3 py-1">{suggestedProgram.cadence}</span>
                            <span className="rounded-md border border-rule bg-paper px-3 py-1">{suggestedProgram.focus}</span>
                        </div>
                    </div>
                    <Link href={`/app/session/${suggestedProgram.slug}`} className="lm-btn h-12 shrink-0">
                        <PlayCircle size={18} />
                        Comenzar ahora
                    </Link>
                </div>
            </section>

            {/* Actividad reciente + programas */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                {/* Actividad reciente */}
                <article className="rounded-2xl border border-rule bg-paper-2 p-6">
                    <div className="flex items-center justify-between gap-4 border-b-2 border-rule-strong pb-3">
                        <h2 className="font-display text-lg font-bold text-ink">Actividad reciente</h2>
                        <Link href="/app/history" className="flex items-center gap-1 font-mono text-xs text-ink-2 hover:text-ink">
                            Ver todo <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="mt-2 grid">
                        {recentSessions.length > 0 ? (
                            recentSessions.slice(0, 5).map((session) => (
                                <div key={session.id} className="flex items-start justify-between gap-3 border-b border-rule py-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-ink">{session.programTitle}</p>
                                        <p className="mt-1 font-mono text-xs text-ink-2">
                                            {session.durationMinutes} min · {session.cadence}
                                        </p>
                                    </div>
                                    <p className="shrink-0 font-mono text-xs text-ink-2">
                                        {new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(
                                            new Date(session.completedAt),
                                        )}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="mt-3 rounded-lg border border-dashed border-rule bg-paper p-6 text-center">
                                <p className="text-sm text-ink-2">Aún no hay sesiones registradas.</p>
                                <p className="mt-1 text-xs text-ink-3">Comienza con la sesión sugerida arriba.</p>
                            </div>
                        )}
                    </div>
                </article>

                {/* Programas destacados */}
                <article className="rounded-2xl border border-rule bg-paper-2 p-6">
                    <div className="flex items-center justify-between gap-4 border-b-2 border-rule-strong pb-3">
                        <h2 className="font-display text-lg font-bold text-ink">
                            {experience.favoritePrograms.length > 0 ? "Tus favoritos" : "Programas recomendados"}
                        </h2>
                        <Link href="/app/library" className="flex items-center gap-1 font-mono text-xs text-ink-2 hover:text-ink">
                            Ver biblioteca <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {featuredPrograms.map((program) => {
                            const progress = programProgress[program.slug];
                            const locked = program.access === "premium" && !viewer.hasPremium;

                            return (
                                <div
                                    key={program.slug}
                                    className={`relative overflow-hidden rounded-lg border border-rule bg-paper p-4 ${locked ? "opacity-70" : ""}`}
                                >
                                    <div className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 ${program.access === "premium" ? "bg-interior" : "bg-mental"}`} />
                                    <div className="relative z-10 flex items-center justify-between gap-4 pl-2">
                                        <div className="min-w-0">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">{program.focus}</p>
                                            <p className="mt-1 truncate text-base font-semibold text-ink">{program.title}</p>
                                            <p className="mt-1 font-mono text-xs text-ink-2">
                                                {program.duration} · {progress?.completionCount ?? 0} sesiones
                                            </p>
                                        </div>
                                        {locked ? (
                                            <span className="shrink-0 rounded-md border border-social-deep bg-social/10 px-3 py-1 text-xs font-semibold text-social-deep">
                                                Premium
                                            </span>
                                        ) : (
                                            <Link
                                                href={`/app/session/${program.slug}`}
                                                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-mental-deep bg-mental/10 px-3 py-1 text-xs font-semibold text-mental-deep transition-colors hover:bg-mental/20"
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

            {/* Todos los programas */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-ink">Todos los programas</h2>
                    <Link href="/app/library" className="flex items-center gap-1 font-mono text-xs text-ink-2 hover:text-ink">
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
