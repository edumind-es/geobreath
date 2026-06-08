/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles } from "lucide-react";
import { auth, isAuthentikConfigured, signIn } from "@/auth";

interface SignInPageProps {
    searchParams?: Promise<{
        callbackUrl?: string;
    }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const callbackUrl = resolvedSearchParams.callbackUrl ?? "/app";
    const session = await auth();

    if (session?.user) {
        redirect(callbackUrl);
    }

    async function handleSignIn() {
        "use server";
        await signIn("authentik", { redirectTo: callbackUrl });
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 md:px-6">
            <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Left: value proposition */}
                <section className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(61,218,215,0.18),transparent_30%),linear-gradient(180deg,rgba(7,12,24,0.92),rgba(2,6,23,0.96))] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.45)] md:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                        <Sparkles size={14} className="text-teal-300" />
                        GeoBreath Premium
                    </div>

                    <h1 className="mt-5 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
                        Tu experiencia de respiracion personalizada
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                        Accede a tu perfil, historial de sesiones y programas adaptados a tus objetivos. Todo en un espacio privado y continuo.
                    </p>

                    <div className="mt-8 grid gap-3">
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Programas guiados</p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                                Rutinas de respiracion disenadas para foco, sueno, calma y regulacion emocional.
                            </p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Seguimiento personal</p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                                Historial de sesiones, racha de practica y sugerencias basadas en tu objetivo.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Right: login form */}
                <section className="rounded-[36px] border border-white/10 bg-[rgba(7,12,24,0.9)] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.32)] md:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-300/10 text-teal-100">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Acceso seguro</p>
                            <h2 className="mt-1 text-2xl font-semibold text-slate-50">Inicia sesion</h2>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-300">
                        Usa tu cuenta EDUmind para acceder a tu espacio premium. El acceso es seguro y privado.
                    </p>

                    <div className="mt-8 flex flex-col gap-3">
                        {isAuthentikConfigured ? (
                            <form action={handleSignIn}>
                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-teal-300 to-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_36px_rgba(61,218,215,0.22)] transition-transform hover:scale-[1.01]"
                                >
                                    <ShieldCheck size={18} />
                                    Entrar con mi cuenta EDUmind
                                </button>
                            </form>
                        ) : (
                            <Link
                                href="/app"
                                className="flex items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                            >
                                Explorar sin cuenta
                            </Link>
                        )}

                        <Link
                            href="/"
                            className="text-center text-sm text-slate-400 transition-colors hover:text-slate-200"
                        >
                            Volver a la experiencia publica
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
