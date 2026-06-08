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

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { geoBreathSequence, getPolygonPoints, getPointOnTrail, Phase } from "@/lib/geoLogic";

const STAGE_SIZE = 320;
const CENTER = STAGE_SIZE / 2;
const RADIUS = 124;

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
}

export default function BreathingStage({
    n,
    secPerPhase,
    isPlaying,
    onPhaseChange,
    onCycleComplete,
    translations,
}: BreathingStageProps) {
    const validSides = typeof n === "number" && !Number.isNaN(n) && n >= 2 ? n : 3;
    const t = translations ?? {
        inspire: "Inspira",
        exhale: "Exhala",
        hold: "Aguanta",
    };

    const [phase, setPhase] = useState<Phase>(() => geoBreathSequence(validSides)[0] ?? "I");
    const [dotPos, setDotPos] = useState<[number, number]>(() => getPointOnTrail(validSides, 0, 0, CENTER, CENTER, RADIUS));

    const phaseRef = useRef<Phase>(geoBreathSequence(validSides)[0] ?? "I");
    const pauseOffsetRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const points = getPolygonPoints(validSides, CENTER, CENTER, RADIUS);

    const polygonPath =
        validSides === 2
            ? `M ${CENTER + RADIUS} ${CENTER} A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER - RADIUS} ${CENTER} A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER + RADIUS} ${CENTER}`
            : points.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`).join(" ") + " Z";

    useEffect(() => {
        if (!isPlaying) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            onPhaseChange?.(phaseRef.current);
            return;
        }

        let lastFrameTime = performance.now();
        let accumulated = pauseOffsetRef.current;
        const activeSequence = geoBreathSequence(validSides);

        const animate = (time: number) => {
            const deltaSeconds = (time - lastFrameTime) / 1000;
            lastFrameTime = time;
            accumulated += deltaSeconds;

            const totalCycleTime = activeSequence.length * secPerPhase;
            if (accumulated >= totalCycleTime) {
                accumulated %= totalCycleTime;
                onCycleComplete?.();
            }

            const exactIndex = accumulated / secPerPhase;
            const phaseIndex = Math.max(0, Math.floor(exactIndex)) % activeSequence.length;
            const progress = exactIndex - Math.floor(exactIndex);
            const nextPhase = activeSequence[phaseIndex] ?? "I";

            if (phaseRef.current !== nextPhase) {
                phaseRef.current = nextPhase;
                setPhase(nextPhase);
                onPhaseChange?.(nextPhase);
            }

            setDotPos(getPointOnTrail(validSides, phaseIndex, progress, CENTER, CENTER, RADIUS));
            pauseOffsetRef.current = accumulated;
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [isPlaying, onCycleComplete, onPhaseChange, secPerPhase, validSides]);

    const auraVariants = {
        I: { scale: 1.18, opacity: 0.55, filter: "blur(12px)" },
        E: { scale: 0.88, opacity: 0.32, filter: "blur(6px)" },
        H: { scale: 1.02, opacity: 0.44, filter: "blur(8px)" },
    };

    const colorMap: Record<Phase, string> = {
        I: "#3ddad7",
        E: "#3c7dff",
        H: "#90f0b3",
    };

    const currentLabel = phase === "I" ? t.inspire : phase === "E" ? t.exhale : t.hold;

    return (
        <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-6">
            <svg viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`} className="aspect-square w-full max-w-[min(100%,39rem,66vh)] overflow-visible" role="img" aria-label={currentLabel}>
                <defs>
                    <linearGradient id="lmeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3ddad7" />
                        <stop offset="100%" stopColor="#3c7dff" />
                    </linearGradient>
                    <filter id="lmeGlow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <motion.path
                    d={validSides === 2 ? `M ${CENTER},${CENTER} m -${RADIUS},0 a ${RADIUS},${RADIUS} 0 1,0 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,0 -${RADIUS * 2},0` : polygonPath}
                    fill="none"
                    stroke={colorMap[phase]}
                    strokeWidth="5"
                    initial="I"
                    animate={phase}
                    variants={auraVariants}
                    transition={{ duration: secPerPhase, ease: "easeInOut" }}
                    className="opacity-55"
                />

                {validSides === 2 ? (
                    <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.2" />
                ) : (
                    <path d={polygonPath} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.2" />
                )}

                {points.map((point, index) => (
                    <circle
                        key={`${point[0]}-${point[1]}`}
                        cx={point[0]}
                        cy={point[1]}
                        r={index === 0 ? "5.5" : "4.5"}
                        fill={index === 0 ? "#f8fafc" : "rgba(255,255,255,0.45)"}
                    />
                ))}

                <circle cx={dotPos[0]} cy={dotPos[1]} r="9.5" fill={colorMap[phase]} filter="url(#lmeGlow)" />

                <circle cx={CENTER} cy={CENTER} r="62" fill="rgba(4, 10, 28, 0.82)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <text
                    x={CENTER}
                    y={CENTER - 12}
                    textAnchor="middle"
                    fill="rgba(148,163,184,0.95)"
                    style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                >
                    Breath
                </text>
                <text
                    x={CENTER}
                    y={CENTER + 20}
                    textAnchor="middle"
                    fill="#ffffff"
                    style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "0" }}
                >
                    {currentLabel}
                </text>
            </svg>
        </div>
    );
}
