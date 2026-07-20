/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { notFound, redirect } from "next/navigation";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import { premiumPrograms } from "@/features/premium/data/programs";
import { getPremiumExperience } from "@/server/dal/premium";
import SessionRunner from "./SessionRunner";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function SessionPage({ params }: Props) {
    const { slug } = await params;
    const viewer = (await getViewerContext()) ?? buildPreviewViewer();
    const program = premiumPrograms.find((p) => p.slug === slug);

    if (!program) notFound();

    if (program.access === "premium" && !viewer.hasPremium) {
        redirect("/app/library");
    }

    const experience = await getPremiumExperience(viewer);
    const progress = experience.programProgress[program.slug];

    return (
        <SessionRunner
            program={program}
            completionCount={progress?.completionCount ?? 0}
        />
    );
}
