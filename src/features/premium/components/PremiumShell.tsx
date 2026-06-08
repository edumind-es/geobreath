/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
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
    if (viewer.hasPremium) return "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100";
    return "border-teal-300/25 bg-teal-300/10 text-teal-100";
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
        <div className="min-h-screen bg-[#020617] px-4 py-4 md:px-6 md:py-6">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

                {/* Sidebar */}
                <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:overflow-y-auto">

                    {/* Brand */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                    >
                        <Sparkles size={13} className="text-teal-300" />
                        GeoBreath
                    </Link>

                    {/* User card */}
                    <div className="rounded-[28px] border border-white/10 bg-[rgba(5,10,21,0.88)] p-5 shadow-[0_20px_56px_rgba(2,6,23,0.36)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300/30 to-sky-400/20 text-sm font-bold text-slate-50">
                                {initials(viewer.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-50">{viewer.name}</p>
                                {viewer.email ? (
                                    <p className="truncate text-xs text-slate-400">{viewer.email}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${planColor(viewer)}`}>
                                {viewer.hasPremium ? <Crown size={12} /> : <Sparkles size={12} />}
                                {planLabel(viewer)}
                            </span>
                        </div>
                    </div>

                    {/* Live stats */}
                    {summary ? (
                        <div className="rounded-[24px] border border-white/10 bg-[rgba(5,10,21,0.88)] p-4 shadow-[0_16px_40px_rgba(2,6,23,0.28)]">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Esta semana</p>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="rounded-[16px] border border-white/10 bg-black/20 p-3 text-center">
                                    <Flame size={16} className="mx-auto text-amber-300" />
                                    <p className="mt-1.5 text-xl font-semibold text-slate-50">{summary.currentStreak}</p>
                                    <p className="text-[10px] text-slate-500">dias racha</p>
                                </div>
                                <div className="rounded-[16px] border border-white/10 bg-black/20 p-3 text-center">
                                    <Target size={16} className="mx-auto text-teal-300" />
                                    <p className="mt-1.5 text-xl font-semibold text-slate-50">{summary.sessionsThisWeek}</p>
                                    <p className="text-[10px] text-slate-500">de {summary.weeklyTarget} sesiones</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="mb-1.5 flex justify-between text-[10px] text-slate-500">
                                    <span>Progreso semanal</span>
                                    <span>{weeklyPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/10">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${weeklyPercent >= 100 ? "bg-emerald-400" : "bg-gradient-to-r from-teal-300 to-sky-400"}`}
                                        style={{ width: `${weeklyPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Suggested session CTA */}
                    {suggestedProgram ? (
                        <Link
                            href={`/app/session/${suggestedProgram.slug}`}
                            className="group flex items-center gap-3 rounded-[22px] border border-teal-300/20 bg-[radial-gradient(circle_at_top_left,rgba(61,218,215,0.10),transparent_60%),rgba(5,10,21,0.88)] p-4 shadow-[0_12px_32px_rgba(2,6,23,0.24)] transition-all hover:border-teal-300/40"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-300/10 text-teal-300 transition-colors group-hover:bg-teal-300/20">
                                <PlayCircle size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Sesion sugerida</p>
                                <p className="mt-0.5 truncate text-sm font-medium text-slate-100">{suggestedProgram.title}</p>
                            </div>
                        </Link>
                    ) : null}

                    {/* Navigation */}
                    <div className="rounded-[24px] border border-white/10 bg-[rgba(5,10,21,0.88)] p-3 shadow-[0_16px_40px_rgba(2,6,23,0.28)]">
                        <PremiumNavigation />
                    </div>

                    {/* Sign out */}
                    {viewer.authConfigured && viewer.isAuthenticated ? (
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-slate-200"
                            >
                                <LogOut size={15} />
                                Cerrar sesion
                            </button>
                        </form>
                    ) : null}
                </aside>

                {/* Main content */}
                <main className="min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
