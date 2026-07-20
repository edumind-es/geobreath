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

export const premiumGoals = ["focus", "sleep", "calm", "speaking", "recovery"] as const;

export type PremiumGoal = (typeof premiumGoals)[number];

export const premiumGoalLabels: Record<PremiumGoal, string> = {
    focus: "Focus y estudio",
    sleep: "Sueño y descanso",
    calm: "Calma y regulación",
    speaking: "Speaking y exposición",
    recovery: "Recuperación y reset",
};

export interface PremiumProfile {
    primaryGoal: PremiumGoal;
    preferredWindow: string;
    weeklyTarget: number;
    notes: string;
    updatedAt: string;
}

export interface PremiumSessionRecord {
    id: string;
    programSlug: string;
    programTitle: string;
    durationMinutes: number;
    cadence: string;
    completedAt: string;
    source: "library" | "dashboard";
}

export interface PremiumUserRecord {
    createdAt: string;
    profile: PremiumProfile;
    favoriteProgramSlugs: string[];
    sessionHistory: PremiumSessionRecord[];
}

export interface PremiumStore {
    version: 1;
    users: Record<string, PremiumUserRecord>;
}
