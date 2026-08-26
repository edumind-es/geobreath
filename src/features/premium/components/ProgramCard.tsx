/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
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
    /** De dónde se abre la tarjeta. Lo pasan las páginas; hoy no altera el render. */
    source?: "dashboard" | "library";
}

export default function ProgramCard({
    completionCount = 0,
    isFavorite = false,
    lastCompletedAt = null,
    program,
    premiumUnlocked,
}: ProgramCardProps) {
    const locked = program.access === "premium" && !premiumUnlocked;
    const lastCompletedLabel = lastCompletedAt
        ? new Intl.DateTimeFormat("es-ES", {
              dateStyle: "medium",
          }).format(new Date(lastCompletedAt))
        : null;

    return (
        <article className={`relative overflow-hidden rounded-2xl border border-rule bg-paper-2 p-5 ${locked ? "opacity-90" : ""}`}>
            {/* Lomo de color del mundo (barra plana, sin gradiente) */}
            <div className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 ${program.access === "premium" ? "bg-interior" : "bg-mental"}`} />
            <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{program.focus}</p>
                        <h3 className="mt-2 font-display text-xl font-bold text-ink">{program.title}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span
                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${
                                program.access === "premium"
                                    ? "border-interior-deep bg-interior/10 text-interior-deep"
                                    : "border-mental-deep bg-mental/10 text-mental-deep"
                            }`}
                        >
                            {program.access === "premium" ? <Sparkles size={14} /> : <PlayCircle size={14} />}
                            {program.access === "premium" ? "Premium" : "Libre"}
                        </span>
                        {isFavorite ? (
                            <span className="inline-flex items-center gap-2 rounded-md border border-fisico-deep bg-fisico/10 px-3 py-1 text-xs font-semibold text-fisico-deep">
                                <Heart size={14} />
                                Favorito
                            </span>
                        ) : null}
                    </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-ink-2">{program.summary}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-lg border border-rule bg-paper p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Duración</p>
                        <p className="mt-2 font-display text-base font-bold text-ink">{program.duration}</p>
                    </div>
                    <div className="rounded-lg border border-rule bg-paper p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Cadencia</p>
                        <p className="mt-2 font-display text-base font-bold text-ink">{program.cadence}</p>
                    </div>
                    <div className="rounded-lg border border-rule bg-paper p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Sesiones</p>
                        <p className="mt-2 font-display text-base font-bold text-ink">{completionCount}</p>
                    </div>
                    <div className="rounded-lg border border-rule bg-paper p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">Última vez</p>
                        <p className="mt-2 text-sm font-semibold text-ink">{lastCompletedLabel ?? "Sin sesiones aún"}</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <form action={toggleFavoriteProgramAction}>
                        <input type="hidden" name="programSlug" value={program.slug} />
                        <button
                            type="submit"
                            className={`lm-btn-ghost ${isFavorite ? "!border-fisico-deep !text-fisico-deep" : ""}`}
                        >
                            <Heart size={16} />
                            {isFavorite ? "Quitar favorito" : "Guardar favorito"}
                        </button>
                    </form>

                    {locked ? (
                        <div className="inline-flex items-center gap-2 rounded-md border border-social-deep bg-social/10 px-3 py-2 text-sm font-semibold text-social-deep">
                            <Lock size={14} />
                            Requiere acceso premium
                        </div>
                    ) : (
                        <Link href={`/app/session/${program.slug}`} className="lm-btn">
                            {completionCount > 0 ? <RotateCcw size={16} /> : <PlayCircle size={16} />}
                            {completionCount > 0 ? "Repetir sesión" : "Iniciar sesión"}
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
