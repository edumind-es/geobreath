/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
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

    const { n, secPerPhase, targetCycles, pattern } = program.sessionParams;

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

    return (
        <div data-lm-theme="noche" className="geo-stage fixed inset-0 z-50 flex flex-col">
            {/* Barra de progreso */}
            <div className="h-1 w-full bg-white/10">
                <div
                    className="h-full bg-[#6aa3bf] transition-all duration-1000"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>

            {/* Cabecera */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-[#ece8dd] transition-colors hover:bg-white/10"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Volver</span>
                </button>

                <div className="text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{program.focus}</p>
                    <h1 className="font-display text-lg font-bold text-[#f4f1e8]">{program.title}</h1>
                </div>

                <div className="text-right">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Ciclos</p>
                    <p className="font-display text-lg font-bold text-[#f4f1e8]">
                        {cycles}
                        <span className="text-sm text-white/60"> / {targetCycles}</span>
                    </p>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex flex-1 flex-col items-center justify-center px-4">
                {sessionComplete ? (
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#8cc26a]/12 text-[#8cc26a]">
                            <CheckCircle size={48} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="font-display text-3xl font-bold text-[#f4f1e8]">Sesión completada</h2>
                            <p className="mt-2 text-white/65">
                                {cycles} ciclos · {program.duration} · {program.cadence}
                            </p>
                            {completionCount > 0 && (
                                <p className="mt-1 text-sm text-[#8cc26a]">
                                    Sesión número {completionCount + 1} de este programa
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRecord}
                            disabled={isPending}
                            className="inline-flex h-14 items-center gap-3 rounded-md bg-[#6aa3bf] px-8 text-base font-semibold text-[#08171a] transition-opacity hover:opacity-90 disabled:opacity-60"
                        >
                            {isPending ? "Guardando..." : "Guardar sesión"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/app/library")}
                            className="text-sm text-white/60 underline underline-offset-4 hover:text-white/90"
                        >
                            Ver biblioteca
                        </button>
                    </div>
                ) : (
                    <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
                        <div className="relative flex w-full flex-1 items-center justify-center">
                            <BreathingStage
                                n={n}
                                secPerPhase={secPerPhase}
                                pattern={pattern}
                                isPlaying={isPlaying}
                                onCycleComplete={handleCycleComplete}
                                translations={{
                                    inspire: "Inspira",
                                    exhale: "Exhala",
                                    hold: "Aguanta",
                                }}
                            />
                        </div>

                        {!isPlaying && cycles === 0 && (
                            <p className="text-center text-sm leading-6 text-white/65">{program.summary}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Controles */}
            {!sessionComplete && (
                <div className="flex items-center justify-center gap-4 px-4 pb-8 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsPlaying((v) => !v)}
                        className="inline-flex h-14 items-center gap-3 rounded-md bg-[#6aa3bf] px-8 text-base font-semibold text-[#08171a] transition-opacity hover:opacity-90"
                    >
                        {isPlaying ? (
                            <>
                                <Pause size={20} /> Pausar
                            </>
                        ) : cycles === 0 ? (
                            <>
                                <Play size={20} /> Comenzar sesión
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
                            className="inline-flex h-14 items-center gap-2 rounded-md border border-white/15 bg-white/[0.06] px-6 text-sm text-[#ece8dd] transition-colors hover:bg-white/10"
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
