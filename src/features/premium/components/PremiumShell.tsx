/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import Link from "next/link";
import { Crown, Flame, LogOut, PlayCircle, Sparkles, Target } from "lucide-react";
import { signOut } from "@/auth";
import type { ViewerContext } from "@/features/auth/server/viewer";
import PremiumNavigation from "@/features/premium/components/PremiumNavigation";

interface PremiumSummary {
    currentStreak: number;
    sessionsThisWeek: number;
    weeklyTarget: number;
    totalSessions: number;
}

interface PremiumShellProps {
    viewer: ViewerContext;
    summary?: PremiumSummary;
    suggestedProgram?: { slug: string; title: string };
    children: React.ReactNode;
}

function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

function planLabel(viewer: ViewerContext) {
    if (viewer.accessLevel === "admin") return "Admin";
    if (viewer.hasPremium) return "Premium";
    return "Invitado";
}

function planColor(viewer: ViewerContext) {
    if (viewer.hasPremium) return "border-interior-deep bg-interior/10 text-interior-deep";
    return "border-mental-deep bg-mental/10 text-mental-deep";
}

export default function PremiumShell({ viewer, summary, suggestedProgram, children }: PremiumShellProps) {
    async function handleSignOut() {
        "use server";
        await signOut({ redirectTo: "/" });
    }

    const weeklyPercent = summary
        ? Math.min(Math.round((summary.sessionsThisWeek / summary.weeklyTarget) * 100), 100)
        : 0;

    return (
        <div className="min-h-screen bg-paper px-4 py-4 md:px-6 md:py-6">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

                {/* Barra lateral */}
                <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:overflow-y-auto">

                    {/* Marca */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 self-start rounded-md border border-rule bg-paper-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
                    >
                        <Sparkles size={13} className="text-interior-deep" />
                        GeoBreath
                    </Link>

                    {/* Tarjeta de usuario */}
                    <div className="rounded-2xl border border-rule bg-paper-2 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mental/12 font-display text-sm font-bold text-mental-deep">
                                {initials(viewer.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-ink">{viewer.name}</p>
                                {viewer.email ? <p className="truncate text-xs text-ink-2">{viewer.email}</p> : null}
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${planColor(viewer)}`}>
                                {viewer.hasPremium ? <Crown size={12} /> : <Sparkles size={12} />}
                                {planLabel(viewer)}
                            </span>
                        </div>
                    </div>

                    {/* Estadísticas de la semana */}
                    {summary ? (
                        <div className="rounded-2xl border border-rule bg-paper-2 p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">Esta semana</p>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-rule bg-paper p-3 text-center">
                                    <Flame size={16} className="mx-auto text-social-deep" />
                                    <p className="mt-1.5 font-display text-xl font-bold text-ink">{summary.currentStreak}</p>
                                    <p className="text-[10px] text-ink-2">días racha</p>
                                </div>
                                <div className="rounded-lg border border-rule bg-paper p-3 text-center">
                                    <Target size={16} className="mx-auto text-mental-deep" />
                                    <p className="mt-1.5 font-display text-xl font-bold text-ink">{summary.sessionsThisWeek}</p>
                                    <p className="text-[10px] text-ink-2">de {summary.weeklyTarget} sesiones</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="mb-1.5 flex justify-between font-mono text-[10px] text-ink-2">
                                    <span>Progreso semanal</span>
                                    <span>{weeklyPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-black/[0.06]">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${weeklyPercent >= 100 ? "bg-emocional" : "bg-mental"}`}
                                        style={{ width: `${weeklyPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* CTA sesión sugerida */}
                    {suggestedProgram ? (
                        <Link
                            href={`/app/session/${suggestedProgram.slug}`}
                            className="group flex items-center gap-3 rounded-xl border border-mental/40 bg-mental/[0.06] p-4 transition-colors hover:border-mental"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mental/12 text-mental-deep">
                                <PlayCircle size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">Sesión sugerida</p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-ink">{suggestedProgram.title}</p>
                            </div>
                        </Link>
                    ) : null}

                    {/* Navegación */}
                    <div className="rounded-2xl border border-rule bg-paper-2 p-3">
                        <PremiumNavigation />
                    </div>

                    {/* Cerrar sesión */}
                    {viewer.authConfigured && viewer.isAuthenticated ? (
                        <form action={handleSignOut}>
                            <button type="submit" className="lm-btn-ghost h-12 w-full">
                                <LogOut size={15} />
                                Cerrar sesión
                            </button>
                        </form>
                    ) : null}
                </aside>

                {/* Contenido principal */}
                <main className="min-w-0">{children}</main>
            </div>
        </div>
    );
}
