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

"use server";

import { revalidatePath } from "next/cache";
import { buildPreviewViewer, getViewerContext } from "@/features/auth/server/viewer";
import { premiumGoals, type PremiumGoal } from "@/features/premium/lib/types";
import { recordPremiumSession, toggleFavoriteProgram, updatePremiumProfile } from "@/server/dal/premium";

const validGoals = new Set<PremiumGoal>(premiumGoals);

function sanitizeText(value: FormDataEntryValue | null, fallback: string, maxLength: number) {
    if (typeof value !== "string") {
        return fallback;
    }

    const trimmed = value.trim().slice(0, maxLength);
    return trimmed.length > 0 ? trimmed : fallback;
}

function clampWeeklyTarget(value: FormDataEntryValue | null) {
    if (typeof value !== "string") {
        return 4;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return 4;
    }

    return Math.min(14, Math.max(1, parsed));
}

async function getActionViewer() {
    return (await getViewerContext()) ?? buildPreviewViewer();
}

function revalidatePremiumPaths() {
    for (const path of ["/app", "/app/library", "/app/history", "/app/account"]) {
        revalidatePath(path);
    }
}

export async function toggleFavoriteProgramAction(formData: FormData) {
    const programSlug = formData.get("programSlug");
    if (typeof programSlug !== "string") {
        return;
    }

    const viewer = await getActionViewer();
    await toggleFavoriteProgram(viewer, programSlug);
    revalidatePremiumPaths();
}

export async function recordProgramSessionAction(formData: FormData) {
    const programSlug = formData.get("programSlug");
    const source = formData.get("source") === "dashboard" ? "dashboard" : "library";

    if (typeof programSlug !== "string") {
        return;
    }

    const viewer = await getActionViewer();
    await recordPremiumSession(viewer, programSlug, source);
    revalidatePremiumPaths();
}

export async function savePremiumProfileAction(formData: FormData) {
    const primaryGoal = formData.get("primaryGoal");
    const viewer = await getActionViewer();

    await updatePremiumProfile(viewer, {
        notes: sanitizeText(formData.get("notes"), "", 240),
        preferredWindow: sanitizeText(formData.get("preferredWindow"), "07:30 - 09:00", 40),
        primaryGoal: typeof primaryGoal === "string" && validGoals.has(primaryGoal as PremiumGoal) ? (primaryGoal as PremiumGoal) : "focus",
        weeklyTarget: clampWeeklyTarget(formData.get("weeklyTarget")),
    });

    revalidatePremiumPaths();
}
