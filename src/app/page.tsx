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

import { useBreathingSession } from "@/features/breathing/hooks/useBreathingSession";
import BreathingPanel from "@/features/breathing/components/BreathingPanel";
import SessionStats from "@/features/breathing/components/SessionStats";
import BrandCard from "@/features/breathing/components/BrandCard";
import ControlsPanel from "@/features/breathing/components/ControlsPanel";
import PresetsCard from "@/features/breathing/components/PresetsCard";
import FaqDialog from "@/features/breathing/components/FaqDialog";

export default function Home() {
    const session = useBreathingSession();
    const { embedded, focusMode, compactMode, showFaq, t, setShowFaq } = session;

    // Empotrado se ocupa todo el ancho; la columna de controles aparece salvo
    // en modo compacto (empotrado sin `panel=1`, o en modo foco).
    const clasesRejilla = [
        embedded ? "geobreath-embed" : "",
        compactMode ? "" : "lg:grid-cols-[minmax(0,1fr)_390px]",
    ].filter(Boolean).join(" ");

    return (
        <main className={`mx-auto grid max-w-[1500px] gap-5 px-4 py-5 md:px-6 ${clasesRejilla}`}>
            <section
                className={`order-1 flex flex-col gap-4 ${
                    focusMode ? "fixed inset-4 z-50" : compactMode ? "min-h-screen" : "lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)]"
                }`}
            >
                <BreathingPanel session={session} />
                {!compactMode ? <SessionStats session={session} /> : null}
            </section>

            {!compactMode ? (
                <aside className="order-2 flex flex-col gap-4">
                    <BrandCard session={session} />
                    <ControlsPanel session={session} />
                    <PresetsCard session={session} />
                </aside>
            ) : null}

            {showFaq ? <FaqDialog t={t} onClose={() => setShowFaq(false)} /> : null}
        </main>
    );
}
