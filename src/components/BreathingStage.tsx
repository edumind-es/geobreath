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

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    buildSchedule,
    easeBreath,
    geoBreathSequence,
    getPointAtLapFraction,
    getPolygonPoints,
    Phase,
    PhaseStep,
    stepAtTime,
} from "@/lib/geoLogic";

const STAGE_SIZE = 320;
const CENTER = STAGE_SIZE / 2;
const RADIUS = 118;

// Paleta de fase — Cinco Mundos en su variante noche (legible sobre oscuro, calmada)
const PHASE_COLOR: Record<Phase, string> = {
    I: "#6aa3bf", // mental — inspira (sereno)
    H: "#f2bc55", // social — aguanta (atención cálida)
    E: "#8cc26a", // emocional — exhala (soltar)
};

// Respiración de escala del conjunto: se abre al inspirar, se recoge al exhalar
const PHASE_SCALE: Record<Phase, number> = { I: 1.06, H: 1.0, E: 0.93 };

// Nº de destellos que forman la estela tipo cometa detrás del punto guía
const TRAIL_STEPS = 6;
const TRAIL_GAP = 0.014; // fracción de vuelta entre destellos

// Tope de avance por frame (s). Evita el salto al volver de segundo plano.
const MAX_FRAME_DELTA = 0.25;

interface BreathingStageTranslations {
    inspire: string;
    exhale: string;
    hold: string;
}

interface BreathingStageProps {
    n: number;
    secPerPhase: number;
    isPlaying: boolean;
    onPhaseChange?: (phase: Phase) => void;
    onCycleComplete?: () => void;
    translations?: BreathingStageTranslations;
    // Patrón con tiempos por fase (opcional). Si se pasa, manda sobre n/secPerPhase.
    pattern?: PhaseStep[];
}

export default function BreathingStage({
    n,
    secPerPhase,
    isPlaying,
    onPhaseChange,
    onCycleComplete,
    translations,
    pattern,
}: BreathingStageProps) {
    const validSides = typeof n === "number" && !Number.isNaN(n) && n >= 2 ? n : 3;
    const t = translations ?? { inspire: "Inspira", exhale: "Exhala", hold: "Aguanta" };

    // Pasos del ciclo: patrón con tiempos por fase, o ritmo uniforme (portada).
    const steps: PhaseStep[] =
        pattern && pattern.length >= 2
            ? pattern
            : geoBreathSequence(validSides).map((ph) => ({ phase: ph, seconds: secPerPhase }));
    const sides = steps.length;
    const isCircle = sides === 2;

    const [phase, setPhase] = useState<Phase>(() => steps[0]?.phase ?? "I");
    // Fracción global de la vuelta (0→1). De ella derivamos punto, estela y progreso.
    const [lapFraction, setLapFraction] = useState(0);
    const [reduceMotion, setReduceMotion] = useState(false);

    const phaseRef = useRef<Phase>(steps[0]?.phase ?? "I");
    const pauseOffsetRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    // Callbacks en refs: SessionRunner pasa una arrow inline a onPhaseChange y
    // los handlers de la portada se recrean en cada render. Sin esto, el efecto
    // del rAF se destruía y recreaba en cada cambio de fase.
    const onPhaseChangeRef = useRef(onPhaseChange);
    const onCycleCompleteRef = useRef(onCycleComplete);
    const patternRef = useRef(pattern);

    // Las refs se refrescan en un efecto, no durante el render: escribir en
    // `.current` mientras se renderiza no está permitido. Este efecto no lleva
    // lista de dependencias a propósito —corre tras cada render— y va antes que
    // el del bucle, así que cuando aquel arranca ya tiene los valores frescos.
    useEffect(() => {
        onPhaseChangeRef.current = onPhaseChange;
        onCycleCompleteRef.current = onCycleComplete;
        patternRef.current = pattern;
    });

    // El patrón llega como array nuevo en cada render. Comparamos por contenido
    // (fase + segundos) para no reiniciar la animación sin motivo.
    const patternKey =
        pattern && pattern.length >= 2 ? pattern.map((step) => `${step.phase}:${step.seconds}`).join("|") : "";

    // Respeto a la preferencia de movimiento reducido
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduceMotion(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const points = getPolygonPoints(sides, CENTER, CENTER, RADIUS);

    // Camino de la figura (polígono o círculo) — empieza arriba, sentido horario
    const figurePath = isCircle
        ? `M ${CENTER},${CENTER - RADIUS} A ${RADIUS},${RADIUS} 0 1 1 ${CENTER},${CENTER + RADIUS} A ${RADIUS},${RADIUS} 0 1 1 ${CENTER},${CENTER - RADIUS}`
        : points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";

    useEffect(() => {
        if (!isPlaying) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            onPhaseChangeRef.current?.(phaseRef.current);
            return;
        }

        // Reconstruye los pasos y los tiempos de inicio acumulados de cada fase
        const activePattern = patternRef.current;
        const activeSteps: PhaseStep[] =
            activePattern && activePattern.length >= 2
                ? activePattern
                : geoBreathSequence(validSides).map((ph) => ({ phase: ph, seconds: secPerPhase }));
        const sidesN = activeSteps.length;
        const schedule = buildSchedule(activeSteps);
        const total = schedule.total;
        if (total <= 0) return;

        let lastFrameTime = performance.now();
        let accumulated = pauseOffsetRef.current % total;

        const animate = (time: number) => {
            // Con la pestaña oculta o la pantalla apagada el rAF deja de emitir
            // frames. Al volver, el delta sería de minutos y el guía saltaría
            // varios ciclos de golpe. Lo acotamos: la respiración se queda donde
            // el usuario la dejó en vez de avanzar sin él.
            const deltaSeconds = Math.min((time - lastFrameTime) / 1000, MAX_FRAME_DELTA);
            lastFrameTime = time;
            accumulated += deltaSeconds;

            if (accumulated >= total) {
                accumulated %= total;
                onCycleCompleteRef.current?.();
            }

            // Paso activo según el tiempo acumulado y su progreso local (0→1)
            const { index: idx, phase: nextPhase, local } = stepAtTime(schedule, accumulated);

            if (phaseRef.current !== nextPhase) {
                phaseRef.current = nextPhase;
                setPhase(nextPhase);
                onPhaseChangeRef.current?.(nextPhase);
            }

            // Avance suavizado por fase → la figura se dibuja «respirando»
            const eased = easeBreath(nextPhase, local);
            setLapFraction((idx + eased) / sidesN);

            pauseOffsetRef.current = accumulated;
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
        // patternKey representa el contenido de `pattern`; los callbacks viven en refs.
    }, [isPlaying, secPerPhase, validSides, patternKey]);

    const color = PHASE_COLOR[phase];
    const currentLabel = phase === "I" ? t.inspire : phase === "E" ? t.exhale : t.hold;

    const dot = getPointAtLapFraction(sides, lapFraction, CENTER, CENTER, RADIUS);

    // Destellos de la estela (posiciones ligeramente por detrás del punto guía)
    const trail = reduceMotion
        ? []
        : Array.from({ length: TRAIL_STEPS }, (_, i) => {
              const gf = lapFraction - (i + 1) * TRAIL_GAP;
              if (gf <= 0) return null;
              return getPointAtLapFraction(sides, gf, CENTER, CENTER, RADIUS);
          }).filter((p): p is [number, number] => p !== null);

    return (
        <div
            data-lm-theme="noche"
            className="geo-stage relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.25rem] p-2 sm:p-6"
        >
            <svg
                viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}
                className="aspect-square w-full max-w-[min(100%,39rem,66vh)] overflow-visible"
                role="img"
                aria-label={currentLabel}
            >
                <defs>
                    <radialGradient id="geoVignette" cx="50%" cy="42%" r="60%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.14" />
                        <stop offset="70%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                    <filter id="geoGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="3.4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Halo de fase */}
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="url(#geoVignette)" />

                {/* Figura que respira de escala */}
                <motion.g
                    animate={{ scale: reduceMotion ? 1 : PHASE_SCALE[phase] }}
                    transition={{ duration: secPerPhase, ease: "easeInOut" }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                    {/* Pista base tenue */}
                    <path d={figurePath} fill="none" stroke="rgba(236,232,221,0.16)" strokeWidth="2" />

                    {/* Progreso: dibuja la figura conforme avanza la respiración */}
                    <path
                        d={figurePath}
                        fill="none"
                        stroke={color}
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        style={{
                            strokeDasharray: 1,
                            strokeDashoffset: 1 - lapFraction,
                            transition: "stroke 0.6s ease",
                        }}
                        opacity={0.92}
                    />

                    {/* Vértices (el de inicio, destacado) */}
                    {!isCircle &&
                        points.map((p, index) => (
                            <circle
                                key={`${p[0]}-${p[1]}`}
                                cx={p[0]}
                                cy={p[1]}
                                r={index === 0 ? 4.6 : 3.2}
                                fill={index === 0 ? "#f4f1e8" : "rgba(236,232,221,0.5)"}
                            />
                        ))}

                    {/* Estela tipo cometa */}
                    {trail.map((p, i) => {
                        const k = 1 - i / TRAIL_STEPS;
                        return (
                            <circle
                                key={`trail-${i}`}
                                cx={p[0]}
                                cy={p[1]}
                                r={2 + k * 4.5}
                                fill={color}
                                opacity={0.06 + k * 0.28}
                            />
                        );
                    })}

                    {/* Punto guía */}
                    <circle cx={dot[0]} cy={dot[1]} r={8.5} fill={color} filter="url(#geoGlow)" />
                    <circle cx={dot[0]} cy={dot[1]} r={3.4} fill="#fbfaf6" />
                </motion.g>

                {/* Lectura central (fuera de la escala para que el texto quede estable) */}
                <circle cx={CENTER} cy={CENTER} r={58} fill="rgba(8,20,23,0.72)" stroke="rgba(236,232,221,0.12)" strokeWidth="1.2" />
                <text
                    x={CENTER}
                    y={CENTER - 12}
                    textAnchor="middle"
                    fill="rgba(236,232,221,0.6)"
                    style={{ fontFamily: "var(--lm-mono)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" }}
                >
                    Respira
                </text>
                <text
                    x={CENTER}
                    y={CENTER + 20}
                    textAnchor="middle"
                    fill="#f4f1e8"
                    style={{ fontFamily: "var(--lm-display)", fontSize: "27px", fontWeight: 700 }}
                >
                    {currentLabel}
                </text>
            </svg>
        </div>
    );
}
