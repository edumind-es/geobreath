/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

"use client";

import { ArrowLeft, CheckCircle, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import BreathingStage from "@/components/BreathingStage";
import { recordProgramSessionAction } from "@/features/premium/server/actions";
import type { PremiumProgram } from "@/features/premium/data/programs";

interface Props {
    program: PremiumProgram;
    completionCount: number;
}

export default function SessionRunner({ program, completionCount }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isPlaying, setIsPlaying] = useState(false);
    const [cycles, setCycles] = useState(0);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [currentPhaseLabel, setCurrentPhaseLabel] = useState("Inspira");

    const { n, secPerPhase, targetCycles } = program.sessionParams;

    const handleCycleComplete = () => {
        setCycles((prev) => {
            const next = prev + 1;
            if (next >= targetCycles) {
                setIsPlaying(false);
                setSessionComplete(true);
            }
            return next;
        });
    };

    const handleRecord = () => {
        startTransition(async () => {
            const fd = new FormData();
            fd.set("programSlug", program.slug);
            fd.set("source", "library");
            await recordProgramSessionAction(fd);
            router.push("/app/history");
            router.refresh();
        });
    };

    const progress = Math.min(cycles / targetCycles, 1);
    const phaseMap: Record<string, string> = { I: "Inspira", E: "Exhala", H: "Aguanta" };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#020617]">
            {/* Progress bar */}
            <div className="h-1 w-full bg-white/10">
                <div
                    className="h-full bg-gradient-to-r from-teal-300 to-sky-400 transition-all duration-1000"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Volver</span>
                </button>

                <div className="text-center">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{program.focus}</p>
                    <h1 className="text-lg font-semibold text-slate-50">{program.title}</h1>
                </div>

                <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Ciclos</p>
                    <p className="text-lg font-semibold text-slate-50">
                        {cycles}
                        <span className="text-sm text-slate-400"> / {targetCycles}</span>
                    </p>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4">
                {sessionComplete ? (
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-300/10 text-teal-300">
                            <CheckCircle size={48} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold text-slate-50">Sesion completada</h2>
                            <p className="mt-2 text-slate-400">
                                {cycles} ciclos · {program.duration} · {program.cadence}
                            </p>
                            {completionCount > 0 && (
                                <p className="mt-1 text-sm text-teal-300">
                                    Sesion numero {completionCount + 1} de este programa
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRecord}
                            disabled={isPending}
                            className="inline-flex h-14 items-center gap-3 rounded-full bg-gradient-to-r from-teal-300 to-sky-400 px-8 text-base font-semibold text-slate-950 shadow-[0_12px_28px_rgba(61,218,215,0.24)] transition-all hover:scale-[1.02] disabled:opacity-60"
                        >
                            {isPending ? "Guardando..." : "Guardar sesion"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/app/library")}
                            className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
                        >
                            Ver biblioteca
                        </button>
                    </div>
                ) : (
                    <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
                        <div className="relative flex w-full flex-1 items-center justify-center">
                            {/* Ambient glow blobs */}
                            <div className="pointer-events-none absolute -left-12 top-12 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl" />
                            <div className="pointer-events-none absolute -right-12 bottom-12 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
                            <BreathingStage
                                n={n}
                                secPerPhase={secPerPhase}
                                isPlaying={isPlaying}
                                onCycleComplete={handleCycleComplete}
                                onPhaseChange={(phase) => setCurrentPhaseLabel(phaseMap[phase] ?? "Inspira")}
                                translations={{
                                    inspire: "Inspira",
                                    exhale: "Exhala",
                                    hold: "Aguanta",
                                }}
                            />
                        </div>

                        {!isPlaying && cycles === 0 && (
                            <p className="text-center text-sm leading-6 text-slate-400">{program.summary}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer controls */}
            {!sessionComplete && (
                <div className="flex items-center justify-center gap-4 px-4 pb-8 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsPlaying((v) => !v)}
                        className="inline-flex h-14 items-center gap-3 rounded-full border border-teal-300/30 bg-gradient-to-r from-teal-300 to-sky-400 px-8 text-base font-semibold text-slate-950 shadow-[0_12px_28px_rgba(61,218,215,0.24)] transition-all hover:scale-[1.02]"
                    >
                        {isPlaying ? (
                            <>
                                <Pause size={20} /> Pausar
                            </>
                        ) : cycles === 0 ? (
                            <>
                                <Play size={20} /> Comenzar sesion
                            </>
                        ) : (
                            <>
                                <Play size={20} /> Continuar
                            </>
                        )}
                    </button>

                    {cycles > 0 && !isPlaying && (
                        <button
                            type="button"
                            onClick={() => {
                                setSessionComplete(true);
                            }}
                            className="inline-flex h-14 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                        >
                            <CheckCircle size={16} />
                            Finalizar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
