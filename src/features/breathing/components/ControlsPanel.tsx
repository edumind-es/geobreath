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

import { Circle, Hexagon, MessageSquare, Pause, Play, Smartphone, Square, Triangle, Volume2, VolumeX, Wind } from "lucide-react";
import { RONDAS_MAX, RONDAS_MIN } from "@/lib/almacenLocal";
import { SHAPE_VALUES, shapeLabel, type ShapeValue } from "../lib/breathing";
import type { BreathingSession } from "../hooks/useBreathingSession";
import ToggleControl from "./ToggleControl";
import EditorTiempos from "./EditorTiempos";

function ShapeIcon({ value }: { value: ShapeValue }) {
    if (value === 2) return <Circle size={18} />;
    if (value === 3) return <Triangle size={18} />;
    if (value === 4) return <Square size={18} />;
    if (value === 5) return <span className="text-base font-semibold">5</span>;
    return <Hexagon size={18} />;
}

// Panel de configuración: forma, ritmo y apoyos sensoriales
export default function ControlsPanel({ session }: { session: BreathingSession }) {
    const { t, sides, seconds, objetivoRondas, cambiarObjetivoRondas, sound, vibe, tts, showPictos, isPlaying, activeShapeLabel, handleShapeChange, setSeconds, adjustSeconds, setSound, setVibe, setTts, setShowPictos, togglePlaying } = session;

    return (
        <section className="rounded-2xl border border-rule bg-paper-2 p-5">
            <div className="mb-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.shape}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">{activeShapeLabel}</h3>
            </div>

            {/* Selector de forma */}
            <div className="grid grid-cols-5 gap-2" role="group" aria-label={t.shape}>
                {SHAPE_VALUES.map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleShapeChange(value)}
                        aria-pressed={sides === value}
                        aria-label={`${t.shape}: ${shapeLabel(value, t)}`}
                        title={shapeLabel(value, t)}
                        className={`flex h-14 items-center justify-center rounded-lg border transition-colors ${
                            sides === value ? "border-mental/60 bg-mental/10 text-mental-deep" : "border-rule bg-paper text-ink-2 hover:border-ink-3 hover:text-ink"
                        }`}
                    >
                        <ShapeIcon value={value} />
                    </button>
                ))}
            </div>

            {/* Ritmo (segundos por lado) */}
            <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-4">
                    <label htmlFor="seconds-range" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
                        {t.seconds}
                    </label>
                    <div className="rounded-md border border-rule bg-paper px-3 py-1 font-mono text-sm font-semibold text-ink">{seconds.toFixed(1)} s</div>
                </div>

                <div className="mb-2 flex items-center gap-1 rounded-lg border border-rule bg-paper p-1">
                    <button type="button" onClick={() => adjustSeconds(-0.5)} className="flex h-11 w-11 items-center justify-center rounded-md text-mental-deep transition-colors hover:bg-black/[0.04]" aria-label={`-0.5 ${t.seconds}`}>
                        −
                    </button>
                    <input id="seconds-range" type="range" min="1" max="10" step="0.5" value={seconds} onChange={(event) => setSeconds(Number(event.target.value))} className="h-2 w-full accent-mental" />
                    <button type="button" onClick={() => adjustSeconds(0.5)} className="flex h-11 w-11 items-center justify-center rounded-md text-mental-deep transition-colors hover:bg-black/[0.04]" aria-label={`+0.5 ${t.seconds}`}>
                        +
                    </button>
                </div>

                <div className="flex justify-between font-mono text-[11px] text-ink-3">
                    <span>1.0 s</span>
                    <span>10.0 s</span>
                </div>
            </div>

            {/* Tiempos por fase: personalización fina del ciclo */}
            <EditorTiempos session={session} />

            {/* Apoyos sensoriales */}
            <div className="mt-6">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.feedback}</div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <ToggleControl active={sound} activeIcon={<Volume2 size={18} />} inactiveIcon={<VolumeX size={18} />} label={t.sound} onClick={() => setSound((value) => !value)} />
                    <ToggleControl active={vibe} activeIcon={<Smartphone size={18} />} label={t.vibration} onClick={() => setVibe((value) => !value)} />
                    <ToggleControl active={showPictos} activeIcon={<Wind size={18} />} label={t.pictograms} onClick={() => setShowPictos((value) => !value)} />
                    <ToggleControl active={tts} activeIcon={<MessageSquare size={18} />} label={t.voice} onClick={() => setTts((value) => !value)} />
                </div>
            </div>

            {/* Modo aula: rondas objetivo */}
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.roundsTarget}</span>
                    <div className="flex items-center gap-1 rounded-lg border border-rule bg-paper p-1">
                        <button
                            type="button"
                            onClick={() => cambiarObjetivoRondas(objetivoRondas === null ? null : objetivoRondas - 1)}
                            disabled={objetivoRondas === null || objetivoRondas <= RONDAS_MIN}
                            aria-label={`${t.roundsTarget} −1`}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-mental-deep transition-colors hover:bg-black/[0.04] disabled:opacity-30"
                        >
                            −
                        </button>
                        <span className="min-w-[4rem] text-center font-mono text-sm font-semibold text-ink">
                            {objetivoRondas === null ? t.roundsFree : objetivoRondas}
                        </span>
                        <button
                            type="button"
                            onClick={() => cambiarObjetivoRondas(objetivoRondas === null ? 5 : objetivoRondas + 1)}
                            disabled={objetivoRondas !== null && objetivoRondas >= RONDAS_MAX}
                            aria-label={`${t.roundsTarget} +1`}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-mental-deep transition-colors hover:bg-black/[0.04] disabled:opacity-30"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs leading-5 text-ink-2">{t.roundsTargetHint}</p>
                    {objetivoRondas !== null ? (
                        <button
                            type="button"
                            onClick={() => cambiarObjetivoRondas(null)}
                            className="shrink-0 font-mono text-[11px] text-ink-2 underline underline-offset-2 hover:text-ink"
                        >
                            {t.roundsFree}
                        </button>
                    ) : null}
                </div>
            </div>

            <button type="button" onClick={togglePlaying} className="lm-btn mt-6 h-14 w-full text-base">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? t.pause : t.start}
            </button>
        </section>
    );
}
