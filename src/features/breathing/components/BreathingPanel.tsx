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

import Image from "next/image";
import Link from "next/link";
import { HelpCircle, LogIn, Maximize, Minimize, Pause, Play, Wind } from "lucide-react";
import BreathingStage from "@/components/BreathingStage";
import type { BreathingSession } from "../hooks/useBreathingSession";

interface BreathingPanelProps {
    session: BreathingSession;
}

// Panel principal: cabecera en papel + escenario de respiración en modo noche.
export default function BreathingPanel({ session }: BreathingPanelProps) {
    const {
        t,
        embedded,
        focusMode,
        isPlaying,
        seconds,
        pattern,
        ladosEfectivos,
        activeShapeLabel,
        activeSupportCount,
        activePhaseLabel,
        activePictogram,
        showPictos,
        cycles,
        challengeGoal,
        progress,
        togglePlaying,
        setFocusMode,
        setShowFaq,
        handleCycle,
        setCurrentPhase,
    } = session;

    return (
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border-2 border-rule-strong bg-paper-2 shadow-[0_20px_60px_rgba(28,26,22,0.10)]">
            {/* Cabecera (papel) */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-rule-strong px-4 py-3 md:px-5">
                <div className="min-w-0">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">Respira LME</h1>
                    <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-2">
                        {activeShapeLabel} · {seconds.toFixed(1)} s · {activeSupportCount}/4 apoyos
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {!embedded ? (
                        <Link href="/app" className="lm-btn-ghost h-11" aria-label="Acceso EDUmind" title="Acceso EDUmind">
                            <LogIn size={18} />
                            <span className="hidden xl:inline">Acceso</span>
                        </Link>
                    ) : null}

                    <button type="button" onClick={togglePlaying} className="lm-btn h-11 min-w-[8.5rem]" aria-label={isPlaying ? t.pause : t.start}>
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        <span>{isPlaying ? t.pause : t.start}</span>
                    </button>

                    <button type="button" onClick={() => setShowFaq(true)} className="lm-btn-ghost h-11 w-11 !p-0" aria-label={t.help} title={t.help}>
                        <HelpCircle size={18} />
                    </button>

                    {!embedded ? (
                        <button
                            type="button"
                            onClick={() => setFocusMode((value) => !value)}
                            className="lm-btn-ghost h-11 w-11 !p-0"
                            aria-label={focusMode ? t.exitFocusMode : t.focusMode}
                            title={focusMode ? t.exitFocusMode : t.focusMode}
                        >
                            {focusMode ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    ) : null}
                </div>
            </header>

            {/* Escenario (modo noche) con sus overlays */}
            <div className={`relative flex flex-1 items-stretch justify-center ${embedded ? "min-h-[340px]" : "min-h-[540px] md:min-h-[620px]"}`}>
                {/* Indicador de fase */}
                <div className="pointer-events-none absolute left-4 top-4 z-20 flex max-w-[70%] items-center gap-3 rounded-xl border border-white/10 bg-[rgba(8,20,23,0.78)] px-4 py-3 backdrop-blur-md">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[#8cc26a]">
                        <Wind size={22} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">{t.currentPhase}</p>
                        <p className="text-2xl font-semibold leading-tight text-[#f4f1e8]">{activePhaseLabel}</p>
                    </div>
                </div>

                {/* Medidor de reto */}
                <div className="pointer-events-none absolute right-4 top-4 z-20 hidden w-64 rounded-xl border border-white/10 bg-[rgba(8,20,23,0.78)] p-4 backdrop-blur-md sm:block">
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
                            {t.challenge} {ladosEfectivos} {t.sides}
                        </p>
                        <p className="text-sm font-semibold text-white/90">
                            {cycles} / {challengeGoal}
                        </p>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10" aria-hidden="true">
                        <div className="h-full rounded-full bg-[#6aa3bf] transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Pictogramas */}
                {showPictos ? (
                    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-center gap-3 rounded-xl border border-white/10 bg-[rgba(8,20,23,0.8)] p-3 backdrop-blur-md md:right-auto">
                        <Image src={activePictogram} alt="" width={86} height={86} className="h-16 w-16 rounded-lg object-contain" aria-hidden="true" />
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">{t.pictograms}</p>
                            <p className="text-lg font-semibold text-[#f4f1e8]">{activePhaseLabel}</p>
                        </div>
                    </div>
                ) : null}

                {/* Anuncio de fase para lectores de pantalla: sin esto, quien no ve
                    la figura no sabe cuándo inspirar. */}
                <p className="sr-only" role="status" aria-live="polite">
                    {activePhaseLabel}
                </p>

                <BreathingStage
                    key={ladosEfectivos}
                    n={ladosEfectivos}
                    secPerPhase={seconds}
                    pattern={pattern}
                    isPlaying={isPlaying}
                    onCycleComplete={handleCycle}
                    onPhaseChange={setCurrentPhase}
                    translations={{ inspire: t.inspire, exhale: t.exhale, hold: t.hold }}
                />
            </div>

            {/* CTA en móvil */}
            <div className="flex items-center justify-center border-t-2 border-rule-strong px-4 py-3 md:hidden">
                <button type="button" onClick={togglePlaying} className="lm-btn h-14 min-w-[11rem] text-base" aria-label={isPlaying ? t.pause : t.start}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    {isPlaying ? t.pause : t.start}
                </button>
            </div>

            <p className="sr-only" aria-live="polite">
                {t.currentPhase}: {activePhaseLabel}
            </p>
        </div>
    );
}
