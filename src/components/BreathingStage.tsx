"use client";

import { useEffect, useRef, useState } from "react";
import { geoBreathSequence, getPolygonPoints, getPointOnTrail, Phase } from "@/lib/geoLogic";
import { motion, AnimatePresence } from "framer-motion";

interface BreathingStageProps {
    n: number;
    secPerPhase: number;
    isPlaying: boolean;
    onPhaseChange?: (phase: Phase) => void;
    onCycleComplete?: () => void;
    translations?: any;
}

export default function BreathingStage({ n, secPerPhase, isPlaying, onPhaseChange, onCycleComplete, translations }: BreathingStageProps) {
    // Validate and sanitize n prop
    const validN = typeof n === 'number' && !isNaN(n) && n >= 2 ? n : 3;
    if (validN !== n) {
        console.warn(`BreathingStage received invalid n=${n}, using ${validN} instead`);
    }

    const svgRef = useRef<SVGSVGElement>(null);
    const [phase, setPhase] = useState<Phase>('I');
    const [dotPos, setDotPos] = useState<[number, number]>([150, 50]);

    const t = translations || { inspire: 'Inspira', exhale: 'Exhala', hold: 'Aguanta' };

    // Animation State
    const startTimeRef = useRef<number | null>(null);
    const pauseOffsetRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);

    // Dimensions
    const width = 320;
    const height = 320;
    const center = width / 2;
    const radius = 120;

    // Derived Geometry - Use validN instead of n
    const points = getPolygonPoints(validN, center, center, radius);
    const sequence = geoBreathSequence(validN);

    // SVG Path String for the polygon
    const pathData = validN === 2
        ? `M ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center}`
        : points.map((p, i) => (i === 0 ? "M" : "L") + ` ${p[0]} ${p[1]}`).join(" ") + " Z";

    useEffect(() => {
        let lastTime = performance.now();
        let acc = pauseOffsetRef.current; // Accumulated time in cycle

        const loop = (time: number) => {
            if (!isPlaying) {
                lastTime = time;
                rafRef.current = requestAnimationFrame(loop);
                return;
            }

            const dt = (time - lastTime) / 1000;
            lastTime = time;
            acc += dt;

            const totalCycleTime = sequence.length * secPerPhase;
            if (acc >= totalCycleTime) {
                acc %= totalCycleTime;
                onCycleComplete?.();
            }

            // Determine current index and sub-progress (t)
            const exactIdx = acc / secPerPhase;
            const idx = Math.max(0, Math.floor(exactIdx)) % sequence.length;
            const t = exactIdx - Math.floor(exactIdx);

            const currentPhase = sequence[idx];
            setPhase(currentPhase);
            onPhaseChange?.(currentPhase);

            // Update Dot Position
            const pos = getPointOnTrail(validN, idx, t, center, center, radius);
            setDotPos(pos);

            pauseOffsetRef.current = acc;
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isPlaying, validN, secPerPhase, sequence, onCycleComplete, onPhaseChange]);

    // Phase-based Aura Animation
    const auraVariants = {
        I: { scale: 1.25, opacity: 0.6, filter: 'blur(12px)' },
        E: { scale: 0.8, opacity: 0.3, filter: 'blur(4px)' },
        H: { scale: 1.0, opacity: 0.5, filter: 'blur(8px)' },
    };

    const colorMap = {
        I: "#3ddad7", // Mint
        E: "#3c7dff", // Sky
        H: "#a963ff", // Violet
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full max-h-[80vh] overflow-visible"
            >
                <defs>
                    <linearGradient id="lmeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--mint)" />
                        <stop offset="100%" stopColor="var(--sky)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Back Aura (Breathing Shape) */}
                <motion.path
                    d={validN === 2 ? `M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0` : pathData}
                    fill="none"
                    stroke={colorMap[phase]}
                    strokeWidth="4"
                    initial="I"
                    animate={phase}
                    variants={auraVariants}
                    transition={{ duration: secPerPhase, ease: "easeInOut" }}
                    className="opacity-50"
                />

                {/* Main Track */}
                {validN === 2 ? (
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                ) : (
                    <path d={pathData} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                )}

                {/* The Dot */}
                <circle
                    cx={dotPos[0]}
                    cy={dotPos[1]}
                    r="8"
                    fill={colorMap[phase]}
                    filter="url(#glow)"
                />

                {/* Phase Label (Center) */}
                <text
                    x={center}
                    y={center + 10}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-4xl font-bold opacity-80 pointer-events-none"
                    style={{ fill: 'white' }}
                >
                    {phase === 'I' ? (t.inspire || 'Inspira') : phase === 'E' ? (t.exhale || 'Exhala') : (t.hold || 'Aguanta')}
                </text>
            </svg>
        </div>
    );
}
