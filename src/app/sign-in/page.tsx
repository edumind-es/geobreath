/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
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
                {/* Izquierda: propuesta de valor */}
                <section className="rounded-2xl border-2 border-rule-strong bg-paper-2 p-6 md:p-8">
                    <div className="inline-flex items-center gap-2 border border-interior-deep px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-interior-deep">
                        <Sparkles size={14} />
                        GeoBreath Premium
                    </div>

                    <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                        Tu experiencia de respiración personalizada
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-ink-2 md:text-base">
                        Accede a tu perfil, historial de sesiones y programas adaptados a tus objetivos. Todo en un espacio privado y continuo.
                    </p>

                    <div className="mt-8 border-t-2 border-rule-strong">
                        <div className="border-b border-rule py-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">Programas guiados</p>
                            <p className="mt-2 text-sm leading-7 text-ink-2">
                                Rutinas de respiración diseñadas para foco, sueño, calma y regulación emocional.
                            </p>
                        </div>
                        <div className="border-b border-rule py-4">
                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">Seguimiento personal</p>
                            <p className="mt-2 text-sm leading-7 text-ink-2">
                                Historial de sesiones, racha de práctica y sugerencias basadas en tu objetivo.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Derecha: formulario de acceso */}
                <section className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-mental/10 text-mental-deep">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Acceso seguro</p>
                            <h2 className="mt-1 font-display text-2xl font-bold text-ink">Inicia sesión</h2>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-ink-2">
                        Usa tu cuenta EDUmind para acceder a tu espacio premium. El acceso es seguro y privado.
                    </p>

                    <div className="mt-8 flex flex-col gap-4">
                        {isAuthentikConfigured ? (
                            <form action={handleSignIn}>
                                <button type="submit" className="lm-btn h-12 w-full">
                                    <ShieldCheck size={18} />
                                    Entrar con mi cuenta EDUmind
                                </button>
                            </form>
                        ) : (
                            <Link href="/app" className="lm-btn-ghost h-12 w-full">
                                Explorar sin cuenta
                            </Link>
                        )}

                        <Link href="/" className="text-center text-sm text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline">
                            Volver a la experiencia pública
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
