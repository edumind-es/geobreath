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

import { randomUUID } from "node:crypto";
import type { ViewerContext } from "@/features/auth/server/viewer";
import { premiumPrograms, type PremiumProgram } from "@/features/premium/data/programs";
import {
    premiumGoalLabels,
    type PremiumGoal,
    type PremiumProfile,
    type PremiumSessionRecord,
    type PremiumUserRecord,
} from "@/features/premium/lib/types";
import { readPremiumStore, writePremiumStore } from "@/server/repos/premium-store";

interface ProgramProgress {
    completionCount: number;
    isFavorite: boolean;
    lastCompletedAt: string | null;
}

interface PremiumSummary {
    currentStreak: number;
    favoriteCount: number;
    preferredWindow: string;
    sessionsThisWeek: number;
    totalMinutes: number;
    totalSessions: number;
    weeklyTarget: number;
}

export interface PremiumExperience {
    favoritePrograms: PremiumProgram[];
    profile: PremiumProfile;
    programProgress: Record<string, ProgramProgress>;
    recentSessions: PremiumSessionRecord[];
    suggestedProgram: PremiumProgram;
    summary: PremiumSummary;
}

interface UpdatePremiumProfileInput {
    notes: string;
    preferredWindow: string;
    primaryGoal: PremiumGoal;
    weeklyTarget: number;
}

const goalProgramMap: Record<PremiumGoal, string[]> = {
    calm: ["classroom-reset", "public-speaking"],
    focus: ["deep-study", "adhd-flow"],
    recovery: ["sleep-descent", "classroom-reset"],
    sleep: ["sleep-descent", "deep-study"],
    speaking: ["public-speaking", "classroom-reset"],
};

function parseDurationMinutes(duration: string) {
    const match = duration.match(/\d+/);
    return match ? Number(match[0]) : 0;
}

function todayIso() {
    return new Date().toISOString();
}

function startOfUtcDay(date: Date) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function countCurrentStreak(history: PremiumSessionRecord[]) {
    if (history.length === 0) {
        return 0;
    }

    const distinctDays = [...new Set(history.map((entry) => entry.completedAt.slice(0, 10)))];
    if (distinctDays.length === 0) {
        return 0;
    }

    let streak = 1;
    let previousDay = startOfUtcDay(new Date(`${distinctDays[0]}T00:00:00.000Z`));

    for (const day of distinctDays.slice(1)) {
        const currentDay = startOfUtcDay(new Date(`${day}T00:00:00.000Z`));
        const distance = Math.round((previousDay - currentDay) / 86400000);

        if (distance === 1) {
            streak += 1;
            previousDay = currentDay;
            continue;
        }

        break;
    }

    return streak;
}

function countSessionsThisWeek(history: PremiumSessionRecord[]) {
    const now = Date.now();
    const sevenDaysAgo = now - 6 * 86400000;
    return history.filter((entry) => new Date(entry.completedAt).getTime() >= sevenDaysAgo).length;
}

function createDefaultProfile(viewer: ViewerContext): PremiumProfile {
    return {
        notes: viewer.accessLevel === "preview" ? "Explorando shell premium antes de activar login." : "Perfil premium listo para personalizar.",
        preferredWindow: viewer.accessLevel === "preview" ? "07:30 - 09:00" : "20:30 - 22:00",
        primaryGoal: viewer.hasPremium ? "sleep" : "focus",
        updatedAt: todayIso(),
        weeklyTarget: viewer.hasPremium ? 5 : 4,
    };
}

function createDefaultUserRecord(viewer: ViewerContext): PremiumUserRecord {
    const now = todayIso();

    return {
        createdAt: now,
        favoriteProgramSlugs: [],
        profile: {
            ...createDefaultProfile(viewer),
            updatedAt: now,
        },
        sessionHistory: [],
    };
}

function getUserRecord(viewer: ViewerContext, users: Record<string, PremiumUserRecord>) {
    return users[viewer.storageKey] ?? createDefaultUserRecord(viewer);
}

function hasProgramAccess(program: PremiumProgram, viewer: ViewerContext) {
    return program.access === "member" || viewer.hasPremium;
}

function isPremiumProgram(program: PremiumProgram | undefined): program is PremiumProgram {
    return Boolean(program);
}

function pickSuggestedProgram(viewer: ViewerContext, record: PremiumUserRecord) {
    const favoriteCandidate = record.favoriteProgramSlugs
        .map((slug) => premiumPrograms.find((program) => program.slug === slug))
        .filter(isPremiumProgram)
        .find((program) => hasProgramAccess(program, viewer));

    if (favoriteCandidate) {
        return favoriteCandidate;
    }

    const goalCandidates = goalProgramMap[record.profile.primaryGoal]
        .map((slug) => premiumPrograms.find((program) => program.slug === slug))
        .filter(isPremiumProgram)
        .find((program) => hasProgramAccess(program, viewer));

    if (goalCandidates) {
        return goalCandidates;
    }

    return premiumPrograms.find((program) => hasProgramAccess(program, viewer)) ?? premiumPrograms[0];
}

function buildProgramProgress(record: PremiumUserRecord) {
    const progress: Record<string, ProgramProgress> = {};

    for (const program of premiumPrograms) {
        const history = record.sessionHistory.filter((entry) => entry.programSlug === program.slug);

        progress[program.slug] = {
            completionCount: history.length,
            isFavorite: record.favoriteProgramSlugs.includes(program.slug),
            lastCompletedAt: history[0]?.completedAt ?? null,
        };
    }

    return progress;
}

function buildSummary(record: PremiumUserRecord): PremiumSummary {
    const totalMinutes = record.sessionHistory.reduce((total, entry) => total + entry.durationMinutes, 0);

    return {
        currentStreak: countCurrentStreak(record.sessionHistory),
        favoriteCount: record.favoriteProgramSlugs.length,
        preferredWindow: record.profile.preferredWindow,
        sessionsThisWeek: countSessionsThisWeek(record.sessionHistory),
        totalMinutes,
        totalSessions: record.sessionHistory.length,
        weeklyTarget: record.profile.weeklyTarget,
    };
}

function sortRecentSessions(history: PremiumSessionRecord[]) {
    return [...history].sort((left, right) => right.completedAt.localeCompare(left.completedAt));
}

function mergeProfile(record: PremiumUserRecord, input: UpdatePremiumProfileInput): PremiumUserRecord {
    return {
        ...record,
        profile: {
            notes: input.notes,
            preferredWindow: input.preferredWindow,
            primaryGoal: input.primaryGoal,
            updatedAt: todayIso(),
            weeklyTarget: input.weeklyTarget,
        },
    };
}

export function describePrimaryGoal(goal: PremiumGoal) {
    return premiumGoalLabels[goal];
}

export async function getPremiumExperience(viewer: ViewerContext): Promise<PremiumExperience> {
    const store = await readPremiumStore();
    const record = getUserRecord(viewer, store.users);
    const sortedHistory = sortRecentSessions(record.sessionHistory);
    const favoritePrograms = record.favoriteProgramSlugs
        .map((slug) => premiumPrograms.find((program) => program.slug === slug))
        .filter(isPremiumProgram);

    return {
        favoritePrograms,
        profile: record.profile,
        programProgress: buildProgramProgress(record),
        recentSessions: sortedHistory.slice(0, 8),
        suggestedProgram: pickSuggestedProgram(viewer, record),
        summary: buildSummary({
            ...record,
            sessionHistory: sortedHistory,
        }),
    };
}

export async function updatePremiumProfile(viewer: ViewerContext, input: UpdatePremiumProfileInput) {
    const store = await readPremiumStore();
    const record = getUserRecord(viewer, store.users);

    store.users[viewer.storageKey] = mergeProfile(record, input);
    await writePremiumStore(store);
}

export async function toggleFavoriteProgram(viewer: ViewerContext, programSlug: string) {
    const program = premiumPrograms.find((entry) => entry.slug === programSlug);
    if (!program) {
        return;
    }

    const store = await readPremiumStore();
    const record = getUserRecord(viewer, store.users);
    const favoriteProgramSlugs = record.favoriteProgramSlugs.includes(programSlug)
        ? record.favoriteProgramSlugs.filter((slug) => slug !== programSlug)
        : [programSlug, ...record.favoriteProgramSlugs];

    store.users[viewer.storageKey] = {
        ...record,
        favoriteProgramSlugs,
        profile: {
            ...record.profile,
            updatedAt: todayIso(),
        },
    };

    await writePremiumStore(store);
}

export async function recordPremiumSession(viewer: ViewerContext, programSlug: string, source: "library" | "dashboard") {
    const program = premiumPrograms.find((entry) => entry.slug === programSlug);

    if (!program || !hasProgramAccess(program, viewer)) {
        return;
    }

    const store = await readPremiumStore();
    const record = getUserRecord(viewer, store.users);
    const session: PremiumSessionRecord = {
        cadence: program.cadence,
        completedAt: todayIso(),
        durationMinutes: parseDurationMinutes(program.duration),
        id: randomUUID(),
        programSlug: program.slug,
        programTitle: program.title,
        source,
    };

    store.users[viewer.storageKey] = {
        ...record,
        profile: {
            ...record.profile,
            updatedAt: todayIso(),
        },
        sessionHistory: [session, ...record.sessionHistory].slice(0, 40),
    };

    await writePremiumStore(store);
}
