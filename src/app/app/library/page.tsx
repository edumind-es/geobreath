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

import { BookMarked, Crown, WandSparkles } from "lucide-react";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import ProgramCard from "@/features/premium/components/ProgramCard";
import { premiumPrograms } from "@/features/premium/data/programs";
import { getPremiumExperience } from "@/server/dal/premium";

export default async function PremiumLibraryPage() {
    const viewer = (await getViewerContext()) ?? buildPreviewViewer();
    const experience = await getPremiumExperience(viewer);

    return (
        <div className="grid gap-6">
            <section className="rounded-[32px] border border-white/10 bg-[rgba(8,14,27,0.84)] p-6 shadow-[0_22px_54px_rgba(2,6,23,0.26)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Biblioteca</p>
                        <h1 className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold text-slate-50 md:text-4xl">
                            Programas de respiracion
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                            Rutinas de respiracion disenadas por objetivo: foco, sueno, calma, regulacion y preparacion para exponer. Cada programa tiene su cadencia, duracion y nivel de acceso.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-teal-100">
                                <BookMarked size={18} />
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-slate-50">{premiumPrograms.length}</p>
                            <p className="text-sm text-slate-400">programas disponibles</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-fuchsia-100">
                                <Crown size={18} />
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-slate-50">
                                {premiumPrograms.filter((program) => program.access === "premium").length}
                            </p>
                            <p className="text-sm text-slate-400">exclusivos premium</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-emerald-100">
                                <WandSparkles size={18} />
                            </div>
                            <p className="mt-3 text-2xl font-semibold text-slate-50">{experience.summary.favoriteCount}</p>
                            <p className="text-sm text-slate-400">favoritos guardados</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                {premiumPrograms.map((program) => {
                    const progress = experience.programProgress[program.slug];

                    return (
                        <ProgramCard
                            key={program.slug}
                            completionCount={progress?.completionCount ?? 0}
                            isFavorite={progress?.isFavorite ?? false}
                            lastCompletedAt={progress?.lastCompletedAt ?? null}
                            program={program}
                            premiumUnlocked={viewer.hasPremium}
                            source="library"
                        />
                    );
                })}
            </section>
        </div>
    );
}
