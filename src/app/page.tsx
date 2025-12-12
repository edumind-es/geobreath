"use client";

import { useState, useEffect } from "react";
import BreathingStage from "@/components/BreathingStage";
import { Play, Pause, Volume2, VolumeX, Smartphone, MessageSquare, Activity, Timer, Hexagon, Circle, Triangle, Square, Wind, Maximize, Minimize, Globe, HelpCircle, X } from "lucide-react";
import { useBreathingFeedback } from "@/lib/useBreathingFeedback";
import { Phase } from "@/lib/geoLogic";
import { translations, Language } from "@/lib/i18n";

export default function Home() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sides, setSides] = useState(4);
    const [seconds, setSeconds] = useState(4);
    const [currentPhase, setCurrentPhase] = useState<Phase>('I');
    const [lang, setLang] = useState<Language>('es');
    const [focusMode, setFocusMode] = useState(false);
    const [showFaq, setShowFaq] = useState(false);
    const t = translations[lang];

    // Toggles
    const [sound, setSound] = useState(true);
    const [vibe, setVibe] = useState(true);
    const [tts, setTts] = useState(false);

    // Gamification / Challenge
    const challengeGoal = (sides - 1) * 5; // C(2)->5, T(3)->10, S(4)->15...
    const [showPictos, setShowPictos] = useState(false);

    // Ephemeral Stats
    const [sessionTime, setSessionTime] = useState(0);
    const [cycles, setCycles] = useState(0);

    // Hook for Audio/Haptic Feedback
    useBreathingFeedback(currentPhase, isPlaying, { sound, vibe, tts });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setSessionTime((t) => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60).toString().padStart(2, "0");
        const secs = (s % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const handleCycle = () => {
        setCycles((c) => c + 1);
    };

    const handleDistraction = () => {
        setCycles(0);
        // Maybe play a sound or visual cue?
    };

    return (
        <main className={`min-h-screen p-4 md:p-8 grid transition-all duration-500 ${focusMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[380px_1fr]'} gap-6 max-w-7xl mx-auto`}>
            {/* Sidebar Controls (Hidden in Focus Mode) */}
            <aside className={`space-y-6 transition-all duration-500 ${focusMode ? 'hidden opacity-0 w-0' : 'opacity-100'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <img src="/logo_geobreath.png" alt="GeoBreath Logo" className="w-16 h-16 object-contain" />
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
                                Respira LME
                            </h1>
                            <div className="flex gap-2 mt-1">
                                {(['es', 'gl', 'cat', 'eu', 'en', 'zh'] as Language[]).map((l) => (
                                    <button key={l} onClick={() => setLang(l)} className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${lang === l ? 'bg-teal-500/20 text-teal-300' : 'text-slate-600 hover:text-slate-400'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowFaq(true)} className="p-2 text-slate-500 hover:text-teal-400 transition-colors">
                        <HelpCircle size={24} />
                    </button>
                </div>

                {/* Main Control Card */}
                <div className="bg-[rgba(13,22,38,0.65)] backdrop-blur-xl border border-[rgba(90,126,181,0.38)] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    {/* Visual Noise Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                    <div className="space-y-6 relative z-10">
                        {/* Shape Selector */}
                        <div>
                            <label className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3 block">{t.shape}</label>
                            <div className="flex justify-between gap-2 p-1 bg-black/20 rounded-xl">
                                {[2, 3, 4, 5, 6].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setSides(n)}
                                        className={`flex-1 aspect-square rounded-lg flex items-center justify-center transition-all ${sides === n
                                            ? 'bg-gradient-to-br from-teal-400/20 to-blue-500/20 border border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(61,218,215,0.2)]'
                                            : 'hover:bg-white/5 border border-transparent text-slate-400'
                                            }`}
                                    >
                                        {n === 2 && <Circle size={20} />}
                                        {n === 3 && <Triangle size={20} />}
                                        {n === 4 && <Square size={20} />}
                                        {n === 5 && <span className="font-bold text-lg">5</span>}
                                        {n === 6 && <Hexagon size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hero Play Button */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#3ddad7] to-[#3c7dff] text-[#040614] font-black text-xl flex items-center justify-center gap-3 shadow-[0_12px_32px_rgba(61,218,215,0.3)] hover:scale-[1.02] hover:shadow-[0_20px_48px_rgba(61,218,215,0.45)] active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                            {isPlaying ? t.pause : t.start}
                        </button>

                        {/* Inputs Row */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2 block">{t.seconds}</label>
                                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl h-12">
                                    <button onClick={() => setSeconds(Math.max(1, seconds - 0.5))} className="w-10 h-full flex items-center justify-center text-teal-400 hover:bg-white/5">-</button>
                                    <div className="flex-1 text-center font-bold text-lg">{seconds}</div>
                                    <button onClick={() => setSeconds(Math.min(10, seconds + 0.5))} className="w-10 h-full flex items-center justify-center text-teal-400 hover:bg-white/5">+</button>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2 block">{t.feedback}</label>
                                <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl h-12 px-2">
                                    <button onClick={() => setSound(!sound)} className={`p-2 rounded-lg transition-colors ${sound ? 'text-teal-400 bg-teal-400/10' : 'text-slate-600'}`} title="Sonido">
                                        {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                    </button>
                                    <button onClick={() => setVibe(!vibe)} className={`p-2 rounded-lg transition-colors ${vibe ? 'text-blue-400 bg-blue-400/10' : 'text-slate-600'}`} title="Vibración">
                                        <Smartphone size={18} />
                                    </button>
                                    <button onClick={() => setShowPictos(!showPictos)} className={`p-2 rounded-lg transition-colors ${showPictos ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600'}`} title="Pictogramas">
                                        <Wind size={18} />
                                    </button>
                                    <button onClick={() => setTts(!tts)} className={`p-2 rounded-lg transition-colors ${tts ? 'text-purple-400 bg-purple-400/10' : 'text-slate-600'}`} title="Voz (Narrador)">
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Presets Grid */}
                <section>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">{t.quickRoutines}</h3>
                    <div className="grid gap-3">
                        <button onClick={() => { setSides(3); setSeconds(3.5); setSound(true); }} className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(13,22,38,0.6)] border border-white/5 hover:bg-white/5 hover:border-teal-500/50 transition-all group text-left">
                            <div className="text-2xl group-hover:scale-110 transition-transform">🧘‍♀️</div>
                            <div>
                                <div className="font-bold text-slate-200">{t.calm}</div>
                                <div className="text-xs text-slate-400">{t.calmDesc}</div>
                            </div>
                        </button>
                        <button onClick={() => { setSides(4); setSeconds(4); setTts(true); }} className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(13,22,38,0.6)] border border-white/5 hover:bg-white/5 hover:border-teal-500/50 transition-all group text-left">
                            <div className="text-2xl group-hover:scale-110 transition-transform">🎯</div>
                            <div>
                                <div className="font-bold text-slate-200">{t.focus}</div>
                                <div className="text-xs text-slate-400">{t.focusDesc}</div>
                            </div>
                        </button>
                        <button onClick={() => { setSides(6); setSeconds(2.5); setVibe(true); }} className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(13,22,38,0.6)] border border-white/5 hover:bg-white/5 hover:border-teal-500/50 transition-all group text-left">
                            <div className="text-2xl group-hover:scale-110 transition-transform">⚡</div>
                            <div>
                                <div className="font-bold text-slate-200">{t.recover}</div>
                                <div className="text-xs text-slate-400">{t.recoverDesc}</div>
                            </div>
                        </button>
                    </div>
                </section>

                <footer className="mt-8 text-center opacity-40 text-[10px] uppercase tracking-widest">
                    {t.footer}
                </footer>
            </aside>

            {/* Main Stage */}
            <section className={`flex flex-col gap-4 h-[calc(100vh-4rem)] sticky top-8 transition-all duration-500 ${focusMode ? 'fixed inset-4 z-50 h-auto' : ''}`}>
                <div className="flex-1 bg-[rgba(13,22,38,0.65)] backdrop-blur-3xl border border-[rgba(90,126,181,0.38)] rounded-3xl relative overflow-hidden flex items-center justify-center p-8 shadow-2xl">
                    <BreathingStage
                        n={sides}
                        secPerPhase={seconds}
                        isPlaying={isPlaying}
                        onCycleComplete={handleCycle}
                        onPhaseChange={setCurrentPhase}
                        translations={t}
                    />

                    {/* Focus Toggle */}
                    <button
                        onClick={() => setFocusMode(!focusMode)}
                        className="absolute top-4 left-4 p-2 rounded-full bg-white/5 hover:bg-teal-400/20 text-slate-400 hover:text-teal-300 transition-colors z-20"
                        title={focusMode ? "Salir Modo Foco" : "Modo Foco"}
                    >
                        {focusMode ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>

                    {/* Pictograms Overlay - Better visibility */}
                    {showPictos && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 z-0">
                            {currentPhase === 'I' && <img src="/pictogram_inspire.png" className="w-80 h-80 object-contain" />}
                            {currentPhase === 'E' && <img src="/pictogram_exhale.png" className="w-80 h-80 object-contain" />}
                            {currentPhase === 'H' && <img src="/pictogram_hold.png" className="w-80 h-80 object-contain" />}
                        </div>
                    )}

                    {/* Challenge Progress (Circle) */}
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                            <span>{t.challenge} {sides} {t.sides}</span>
                            <span>{cycles} / {challengeGoal}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${cycles >= challengeGoal ? 'bg-green-400' : 'bg-teal-400'}`}
                                style={{ width: `${Math.min(100, (cycles / challengeGoal) * 100)}%` }}
                            ></div>
                        </div>
                        {cycles >= challengeGoal && (
                            <div className="mt-2 text-center text-xs font-bold text-green-400 animate-bounce">
                                {t.challengeWon}
                            </div>
                        )}
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-slate-400 pointer-events-none z-10">
                        <span>🔒</span> {t.private}
                    </div>
                </div>

                {/* Ephemeral Stats Stick (Hidden in Focus) */}
                <div className={`h-20 bg-[rgba(13,22,38,0.8)] backdrop-blur border border-white/10 rounded-2xl flex items-center justify-between px-8 duration-500 transition-all ${focusMode ? 'hidden' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Timer size={20} /></div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{t.sessionTime}</div>
                            <div className="text-xl font-mono font-bold tabular-nums text-slate-200">{formatTime(sessionTime)}</div>
                        </div>
                    </div>

                    <div className="w-px h-10 bg-white/10"></div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400"><Activity size={20} /></div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{t.cycles}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-mono font-bold tabular-nums text-slate-200">{cycles}</span>
                                <button
                                    onClick={handleDistraction}
                                    className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded hover:bg-red-500/30 transition shadow-sm border border-red-500/10"
                                    title="Reiniciar"
                                >
                                    {t.distracted}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-px h-10 bg-white/10 hidden sm:block"></div>

                    {/* Challenge Goal Display */}
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/20 text-green-400"><Activity size={20} /></div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{t.goal}</div>
                            <div className="text-xl font-mono font-bold tabular-nums text-slate-200">{challengeGoal}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Modal */}
            {showFaq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in active:fade-out">
                    <div className="bg-[#0D1626] border border-slate-700/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setShowFaq(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="p-8">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400 mb-6 flex items-center gap-3">
                                <HelpCircle size={24} className="text-teal-400" />
                                {t.faqTitle || 'FAQ'}
                            </h2>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {(t.faq || []).map((item: any, i: number) => (
                                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-teal-500/30 transition-colors">
                                        <h3 className="font-bold text-slate-200 mb-2">{item.q}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-black/20 text-center border-t border-white/5">
                            <button
                                onClick={() => setShowFaq(false)}
                                className="px-6 py-2 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-bold text-sm transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
