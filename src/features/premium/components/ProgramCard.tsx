/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Heart, Lock, PlayCircle, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { toggleFavoriteProgramAction } from "@/features/premium/server/actions";
import type { PremiumProgram } from "@/features/premium/data/programs";

interface ProgramCardProps {
    completionCount?: number;
    isFavorite?: boolean;
    lastCompletedAt?: string | null;
    program: PremiumProgram;
    premiumUnlocked: boolean;
    source?: "dashboard" | "library";
}

export default function ProgramCard({
    completionCount = 0,
    isFavorite = false,
    lastCompletedAt = null,
    program,
    premiumUnlocked,
    source = "library",
}: ProgramCardProps) {
    const locked = program.access === "premium" && !premiumUnlocked;
    const lastCompletedLabel = lastCompletedAt
        ? new Intl.DateTimeFormat("es-ES", {
              dateStyle: "medium",
          }).format(new Date(lastCompletedAt))
        : null;

    return (
        <article className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(8,14,27,0.78)] p-5 shadow-[0_18px_48px_rgba(2,6,23,0.24)] ${locked ? "opacity-90" : ""}`}>
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${program.accent}`} />
            <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{program.focus}</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-50">{program.title}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                                program.access === "premium"
                                    ? "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100"
                                    : "border-teal-300/25 bg-teal-300/10 text-teal-100"
                            }`}
                        >
                            {program.access === "premium" ? <Sparkles size={14} /> : <PlayCircle size={14} />}
                            {program.access === "premium" ? "Premium" : "Libre"}
                        </span>
                        {isFavorite ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs text-rose-100">
                                <Heart size={14} />
                                Favorito
                            </span>
                        ) : null}
                    </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{program.summary}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Duracion</p>
                        <p className="mt-2 text-base font-semibold text-slate-50">{program.duration}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Cadencia</p>
                        <p className="mt-2 text-base font-semibold text-slate-50">{program.cadence}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Sesiones</p>
                        <p className="mt-2 text-base font-semibold text-slate-50">{completionCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Ultima vez</p>
                        <p className="mt-2 text-sm font-semibold text-slate-50">{lastCompletedLabel ?? "Sin sesiones aun"}</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    <form action={toggleFavoriteProgramAction}>
                        <input type="hidden" name="programSlug" value={program.slug} />
                        <button
                            type="submit"
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                isFavorite
                                    ? "border-rose-300/20 bg-rose-300/10 text-rose-100 hover:border-rose-300/30"
                                    : "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/[0.08]"
                            }`}
                        >
                            <Heart size={16} />
                            {isFavorite ? "Quitar favorito" : "Guardar favorito"}
                        </button>
                    </form>

                    {locked ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
                            <Lock size={14} />
                            Requiere acceso premium
                        </div>
                    ) : (
                        <Link
                            href={`/app/session/${program.slug}`}
                            className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-gradient-to-r from-teal-300/10 to-sky-400/10 px-4 py-2 text-sm font-medium text-teal-100 transition-colors hover:border-teal-300/50 hover:from-teal-300/20 hover:to-sky-400/20"
                        >
                            {completionCount > 0 ? <RotateCcw size={16} /> : <PlayCircle size={16} />}
                            {completionCount > 0 ? "Repetir sesion" : "Iniciar sesion"}
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
