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

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import BreathingStage from "@/components/BreathingStage";
import {
    Activity,
    Circle,
    HelpCircle,
    Hexagon,
    LogIn,
    Maximize,
    MessageSquare,
    Minimize,
    Pause,
    Play,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Square,
    Timer,
    Triangle,
    Volume2,
    VolumeX,
    Wind,
} from "lucide-react";
import { useBreathingFeedback } from "@/lib/useBreathingFeedback";
import { Phase } from "@/lib/geoLogic";
import { translations, type AppTranslations, type Language } from "@/lib/i18n";

const LANGUAGE_OPTIONS: Language[] = ["es", "gl", "cat", "eu", "en", "zh"];
const SHAPE_VALUES = [2, 3, 4, 5, 6] as const;

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function phaseLabel(phase: Phase, t: AppTranslations) {
    if (phase === "I") return t.inspire;
    if (phase === "E") return t.exhale;
    return t.hold;
}

function shapeLabel(sides: number, t: AppTranslations) {
    if (sides === 2) return t.shape2;
    if (sides === 3) return t.shape3;
    if (sides === 4) return t.shape4;
    if (sides === 5) return t.shape5;
    return t.shape6;
}

interface ToggleButtonProps {
    active: boolean;
    activeIcon: ReactNode;
    inactiveIcon?: ReactNode;
    label: string;
    onClick: () => void;
}

function ToggleButton({ active, activeIcon, inactiveIcon, label, onClick }: ToggleButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label={label}
            className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                active
                    ? "border-teal-300/55 bg-teal-300/12 text-slate-50"
                    : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
            }`}
        >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-teal-300/12 text-teal-200" : "bg-white/5 text-slate-400"}`}>
                {active ? activeIcon : inactiveIcon ?? activeIcon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold leading-tight">{label}</span>
                <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{active ? "ON" : "OFF"}</span>
            </span>
        </button>
    );
}

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string;
    helper?: string;
    footer?: ReactNode;
}

function StatCard({ icon, label, value, helper, footer }: StatCardProps) {
    return (
        <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
                    {helper ? <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p> : null}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-teal-300">
                    {icon}
                </div>
            </div>
            {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
    );
}

export default function Home() {
    const [embedded, setEmbedded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sides, setSides] = useState(4);
    const [seconds, setSeconds] = useState(4);
    const [currentPhase, setCurrentPhase] = useState<Phase>("I");
    const [lang, setLang] = useState<Language>("es");
    const [focusMode, setFocusMode] = useState(false);
    const [showFaq, setShowFaq] = useState(false);
    const [sound, setSound] = useState(true);
    const [vibe, setVibe] = useState(true);
    const [tts, setTts] = useState(false);
    const [showPictos, setShowPictos] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [cycles, setCycles] = useState(0);

    const t = translations[lang];
    const challengeGoal = Math.max(1, (sides - 1) * 5);
    const progress = Math.min(100, (cycles / challengeGoal) * 100);
    const activePhaseLabel = phaseLabel(currentPhase, t);
    const activeShapeLabel = shapeLabel(sides, t);
    const activePictogram = currentPhase === "I" ? "/img/inspiro.png" : currentPhase === "E" ? "/img/exhalo.png" : "/img/aguanta.png";
    const activeSupportCount = [sound, vibe, showPictos, tts].filter(Boolean).length;
    const compactMode = focusMode || embedded;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const nextEmbedded = params.get("embed") === "1" || params.get("board") === "1";
        setEmbedded(nextEmbedded);
        document.body.dataset.edumindEmbed = nextEmbedded ? "true" : "false";
        return () => {
            delete document.body.dataset.edumindEmbed;
        };
    }, []);

    useBreathingFeedback(currentPhase, isPlaying, {
        sound,
        vibe,
        tts,
        lang,
        labels: {
            inspire: t.inspire,
            exhale: t.exhale,
            hold: t.hold,
        },
    });

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isPlaying) {
            interval = setInterval(() => {
                setSessionTime((value) => value + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!showFaq) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowFaq(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [showFaq]);

    useEffect(() => {
        const handleShortcuts = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isEditableTarget = target ? ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) : false;

            if (isEditableTarget) return;
            if (showFaq && event.key !== "Escape") return;

            if (event.code === "Space") {
                event.preventDefault();
                setIsPlaying((value) => !value);
            }

            if (event.key.toLowerCase() === "f") {
                event.preventDefault();
                setFocusMode((value) => !value);
            }

            if (event.key === "?") {
                event.preventDefault();
                setShowFaq(true);
            }
        };

        window.addEventListener("keydown", handleShortcuts);
        return () => window.removeEventListener("keydown", handleShortcuts);
    }, [showFaq]);

    const applyPreset = (preset: "calm" | "focus" | "recover") => {
        setCycles(0);
        setCurrentPhase("I");

        if (preset === "calm") {
            setSides(3);
            setSeconds(3.5);
            setSound(true);
            setVibe(false);
            setTts(false);
            setShowPictos(true);
            return;
        }

        if (preset === "focus") {
            setSides(4);
            setSeconds(4);
            setSound(true);
            setVibe(false);
            setTts(true);
            setShowPictos(false);
            return;
        }

        setSides(6);
        setSeconds(2.5);
        setSound(false);
        setVibe(true);
        setTts(false);
        setShowPictos(true);
    };

    const handleShapeChange = (nextSides: (typeof SHAPE_VALUES)[number]) => {
        setSides(nextSides);
        setCycles(0);
        setCurrentPhase("I");
    };

    const handleCycle = () => {
        setCycles((value) => value + 1);
    };

    const resetChallenge = () => {
        setCycles(0);
    };

    return (
        <main className={`mx-auto grid min-h-screen max-w-[1500px] gap-5 px-4 py-4 md:px-6 md:py-5 ${embedded ? "geobreath-embed" : "lg:grid-cols-[minmax(0,1fr)_390px]"}`}>
            <section className={`order-1 flex flex-col gap-4 ${focusMode ? "fixed inset-4 z-50" : embedded ? "min-h-screen" : "lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)]"}`}>
                <div className={`relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,26,0.98),rgba(3,7,17,0.99))] shadow-[0_24px_70px_rgba(2,6,23,0.42)] ${embedded ? "min-h-0" : "min-h-[42rem]"}`}>

                    <div className="relative z-10 flex h-full flex-col">
                        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
                            <div className="min-w-0">
                                <h1 className="font-[family:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                                    Respira LME
                                </h1>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                                    {activeShapeLabel} · {seconds.toFixed(1)} s · {activeSupportCount}/4 apoyos
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {!embedded ? (
                                    <Link
                                        href="/app"
                                        className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 transition-colors hover:border-teal-300/30 hover:bg-teal-300/10 hover:text-teal-100"
                                        aria-label="Acceso EDUmind"
                                        title="Acceso EDUmind"
                                    >
                                        <LogIn size={18} />
                                        <span className="hidden xl:inline">Acceso</span>
                                    </Link>
                                ) : null}

                                <button
                                    type="button"
                                    onClick={() => setIsPlaying((value) => !value)}
                                    className="inline-flex h-11 min-w-[8.5rem] items-center justify-center gap-2 rounded-full border border-teal-300/30 bg-gradient-to-r from-teal-300 to-sky-400 px-4 text-sm font-semibold whitespace-nowrap text-slate-950 shadow-[0_10px_24px_rgba(61,218,215,0.18)] transition-transform hover:scale-[1.01]"
                                    aria-label={isPlaying ? t.pause : t.start}
                                >
                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                    <span>{isPlaying ? t.pause : t.start}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowFaq(true)}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10"
                                    aria-label={t.help}
                                    title={t.help}
                                >
                                    <HelpCircle size={18} />
                                </button>

                                {!embedded ? (
                                    <button
                                        type="button"
                                        onClick={() => setFocusMode((value) => !value)}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10"
                                        aria-label={focusMode ? t.exitFocusMode : t.focusMode}
                                        title={focusMode ? t.exitFocusMode : t.focusMode}
                                    >
                                        {focusMode ? <Minimize size={18} /> : <Maximize size={18} />}
                                    </button>
                                ) : null}
                            </div>
                        </header>

                        <div className={`relative flex flex-1 items-center justify-center px-3 pb-12 pt-3 md:px-5 md:pb-16 md:pt-5 ${embedded ? "min-h-[340px]" : "min-h-[540px] md:min-h-[620px]"}`}>
                            <div className="pointer-events-none absolute left-4 top-4 z-20 flex max-w-[70%] items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-md">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-300/12 text-teal-200">
                                    <Wind size={22} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{t.currentPhase}</p>
                                    <p className="text-2xl font-semibold leading-tight text-slate-50">{activePhaseLabel}</p>
                                </div>
                            </div>

                            <div className="pointer-events-none absolute right-4 top-4 z-20 hidden w-64 rounded-xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md sm:block">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                                        {t.challenge} {sides} {t.sides}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-100">
                                        {cycles} / {challengeGoal}
                                    </p>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-white/10" aria-hidden="true">
                                    <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            {showPictos ? (
                                <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/72 p-3 backdrop-blur-md md:right-auto">
                                    <Image src={activePictogram} alt="" width={86} height={86} className="h-16 w-16 rounded-lg object-contain" aria-hidden="true" />
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{t.pictograms}</p>
                                        <p className="text-lg font-semibold text-slate-50">{activePhaseLabel}</p>
                                    </div>
                                </div>
                            ) : null}

                            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl border border-white/[0.06] bg-[radial-gradient(circle_at_center,rgba(61,218,215,0.08),transparent_42%),rgba(2,6,23,0.26)]">
                                <BreathingStage
                                    key={sides}
                                    n={sides}
                                    secPerPhase={seconds}
                                    isPlaying={isPlaying}
                                    onCycleComplete={handleCycle}
                                    onPhaseChange={setCurrentPhase}
                                    translations={{
                                        inspire: t.inspire,
                                        exhale: t.exhale,
                                        hold: t.hold,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center pb-5 pt-1 md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsPlaying((value) => !value)}
                                className="inline-flex h-14 min-w-[11rem] items-center justify-center gap-3 rounded-full border border-teal-300/30 bg-gradient-to-r from-teal-300 to-sky-400 px-8 text-base font-semibold whitespace-nowrap text-slate-950 shadow-[0_12px_30px_rgba(61,218,215,0.2)] transition-transform hover:scale-[1.01]"
                                aria-label={isPlaying ? t.pause : t.start}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                {isPlaying ? t.pause : t.start}
                            </button>
                        </div>

                    </div>

                    <p className="sr-only" aria-live="polite">
                        {t.currentPhase}: {activePhaseLabel}
                    </p>
                </div>

                {!compactMode ? (
                    <div className="grid gap-3 md:grid-cols-3">
                        <StatCard
                            icon={<Timer size={20} />}
                            label={t.sessionTime}
                            value={formatTime(sessionTime)}
                            helper={t.shortcuts}
                        />
                        <StatCard
                            icon={<Activity size={20} />}
                            label={t.cycles}
                            value={cycles.toString()}
                            helper={`${activeShapeLabel} · ${seconds.toFixed(1)} s`}
                        />
                        <StatCard
                            icon={<ShieldCheck size={20} />}
                            label={t.goal}
                            value={challengeGoal.toString()}
                            helper={progress >= 100 ? t.challengeWon : `${t.challenge}: ${progress.toFixed(0)}%`}
                            footer={
                                <button
                                    type="button"
                                    onClick={resetChallenge}
                                    className="inline-flex rounded-full border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-400/15"
                                >
                                    {t.reset}
                                </button>
                            }
                        />
                    </div>
                ) : null}
            </section>

            {!compactMode ? (
                <aside className="order-2 flex flex-col gap-4">
                    <section className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-[0_18px_50px_rgba(2,6,23,0.28)]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                <Image src="/logo_geobreath.png" alt="GeoBreath" width={56} height={49} priority className="h-auto w-14 object-contain" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{t.footer}</p>
                                <h2 className="mt-1 font-[family:var(--font-display)] text-2xl font-semibold text-slate-50">GeoBreath</h2>
                                <p className="mt-1 text-sm leading-6 text-slate-400">{t.tagline}</p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {LANGUAGE_OPTIONS.map((language) => (
                                <button
                                    key={language}
                                    type="button"
                                    onClick={() => setLang(language)}
                                    aria-pressed={lang === language}
                                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                                        lang === language
                                            ? "border-teal-300/40 bg-teal-300/15 text-teal-100"
                                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                    }`}
                                >
                                    {language}
                                </button>
                            ))}
                        </div>

                        <Link
                            href="/app"
                            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-teal-300/30 bg-teal-300/10 text-sm font-semibold text-teal-100 transition-colors hover:border-teal-300/45 hover:bg-teal-300/15"
                            aria-label="Acceder con cuenta EDUmind"
                        >
                            <LogIn size={18} />
                            Acceso EDUmind
                        </Link>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-[0_18px_50px_rgba(2,6,23,0.28)]">
                        <div className="mb-5">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{t.shape}</p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-50">{activeShapeLabel}</h3>
                        </div>

                        <div className="grid grid-cols-5 gap-2" role="group" aria-label={t.shape}>
                            {SHAPE_VALUES.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleShapeChange(value)}
                                    aria-pressed={sides === value}
                                    aria-label={`${t.shape}: ${shapeLabel(value, t)}`}
                                    title={shapeLabel(value, t)}
                                    className={`flex h-14 items-center justify-center rounded-xl border transition-all ${
                                        sides === value
                                            ? "border-teal-300/45 bg-teal-300/12 text-teal-100"
                                            : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                                    }`}
                                >
                                    {value === 2 ? <Circle size={18} /> : null}
                                    {value === 3 ? <Triangle size={18} /> : null}
                                    {value === 4 ? <Square size={18} /> : null}
                                    {value === 5 ? <span className="text-base font-semibold">5</span> : null}
                                    {value === 6 ? <Hexagon size={18} /> : null}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <label htmlFor="seconds-range" className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                                    {t.seconds}
                                </label>
                                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-100">
                                    {seconds.toFixed(1)} s
                                </div>
                            </div>

                            <div className="mb-4 flex items-center rounded-full border border-white/10 bg-slate-950/35 p-1">
                                <button
                                    type="button"
                                    onClick={() => setSeconds((value) => Math.max(1, value - 0.5))}
                                    className="flex h-11 w-11 items-center justify-center rounded-full text-teal-200 transition-colors hover:bg-white/5"
                                    aria-label={`-0.5 ${t.seconds}`}
                                >
                                    -
                                </button>
                                <input
                                    id="seconds-range"
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={seconds}
                                    onChange={(event) => setSeconds(Number(event.target.value))}
                                    className="h-2 w-full accent-teal-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSeconds((value) => Math.min(10, value + 0.5))}
                                    className="flex h-11 w-11 items-center justify-center rounded-full text-teal-200 transition-colors hover:bg-white/5"
                                    aria-label={`+0.5 ${t.seconds}`}
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex justify-between text-xs text-slate-500">
                                <span>1.0 s</span>
                                <span>10.0 s</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">{t.feedback}</div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <ToggleButton
                                    active={sound}
                                    activeIcon={<Volume2 size={18} />}
                                    inactiveIcon={<VolumeX size={18} />}
                                    label={t.sound}
                                    onClick={() => setSound((value) => !value)}
                                />
                                <ToggleButton
                                    active={vibe}
                                    activeIcon={<Smartphone size={18} />}
                                    label={t.vibration}
                                    onClick={() => setVibe((value) => !value)}
                                />
                                <ToggleButton
                                    active={showPictos}
                                    activeIcon={<Wind size={18} />}
                                    label={t.pictograms}
                                    onClick={() => setShowPictos((value) => !value)}
                                />
                                <ToggleButton
                                    active={tts}
                                    activeIcon={<MessageSquare size={18} />}
                                    label={t.voice}
                                    onClick={() => setTts((value) => !value)}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsPlaying((value) => !value)}
                            className="mt-6 flex h-14 w-full min-w-0 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-300 to-sky-400 px-4 text-base font-semibold whitespace-nowrap text-slate-950 shadow-[0_12px_30px_rgba(61,218,215,0.2)] transition-transform hover:scale-[1.01]"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {isPlaying ? t.pause : t.start}
                        </button>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-[0_18px_50px_rgba(2,6,23,0.28)]">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{t.quickRoutines}</p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-50">{t.ready}</h3>
                            </div>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-teal-300">
                                <Sparkles size={18} />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <button
                                type="button"
                                onClick={() => applyPreset("calm")}
                                className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left transition-all hover:border-teal-300/25 hover:bg-white/[0.07]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-slate-50">{t.calm}</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-400">{t.calmDesc}</p>
                                    </div>
                                    <Triangle size={18} className="mt-1 text-teal-300" />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset("focus")}
                                className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left transition-all hover:border-teal-300/25 hover:bg-white/[0.07]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-slate-50">{t.focus}</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-400">{t.focusDesc}</p>
                                    </div>
                                    <Square size={18} className="mt-1 text-sky-300" />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset("recover")}
                                className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left transition-all hover:border-teal-300/25 hover:bg-white/[0.07]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-slate-50">{t.recover}</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-400">{t.recoverDesc}</p>
                                    </div>
                                    <Hexagon size={18} className="mt-1 text-emerald-300" />
                                </div>
                            </button>
                        </div>
                    </section>
                </aside>
            ) : null}

            {showFaq ? (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                    role="presentation"
                    onClick={() => setShowFaq(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="faq-title"
                        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[rgba(7,12,24,0.96)] shadow-[0_32px_90px_rgba(2,6,23,0.55)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{t.help}</p>
                                <h2 id="faq-title" className="mt-2 font-[family:var(--font-display)] text-2xl font-semibold text-slate-50">
                                    {t.faqTitle}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowFaq(false)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10"
                                aria-label={t.close}
                            >
                                <span className="text-xl leading-none">×</span>
                            </button>
                        </div>

                        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
                            {t.faq.map((item) => (
                                <article key={item.q} className="rounded-xl border border-white/10 bg-white/5 p-5">
                                    <h3 className="text-lg font-semibold text-slate-50">{item.q}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}
