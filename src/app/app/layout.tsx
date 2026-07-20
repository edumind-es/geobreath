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

import { redirect } from "next/navigation";
import { isAuthentikConfigured } from "@/auth";
import PremiumShell from "@/features/premium/components/PremiumShell";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import { getPremiumExperience } from "@/server/dal/premium";

export const dynamic = "force-dynamic";

export default async function PremiumLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const viewer = isAuthentikConfigured ? await getViewerContext() : buildPreviewViewer();

    if (!viewer) {
        redirect("/sign-in?callbackUrl=/app");
    }

    const experience = await getPremiumExperience(viewer);

    return (
        <PremiumShell
            viewer={viewer}
            summary={experience.summary}
            suggestedProgram={{ slug: experience.suggestedProgram.slug, title: experience.suggestedProgram.title }}
        >
            {children}
        </PremiumShell>
    );
}
