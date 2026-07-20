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

export type AccessLevel = "preview" | "member" | "premium" | "admin";

const PREMIUM_HINTS = [
    "premium",
    "pro",
    "plus",
    "team",
    "subscription:premium",
    "geobreath-premium",
];

const ADMIN_HINTS = ["admin", "staff", "superuser", "owner"];

function normalizeEntry(value: unknown) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function normalizeOptionalString(value: unknown) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function toStringList(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.trim()).filter(Boolean);
    }

    if (typeof value === "string" && value.trim().length > 0) {
        return value
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean);
    }

    return [];
}

export function inferAccessLevel(groups: string[], entitlements: string[]): AccessLevel {
    const normalized = [...groups, ...entitlements].map(normalizeEntry).filter(Boolean);

    if (normalized.some((entry) => ADMIN_HINTS.some((hint) => entry.includes(hint)))) {
        return "admin";
    }

    if (normalized.some((entry) => PREMIUM_HINTS.some((hint) => entry.includes(hint)))) {
        return "premium";
    }

    return "member";
}

export function hasPremiumAccess(accessLevel: AccessLevel) {
    // All authenticated users (member, premium, admin) get full premium access.
    // Only unauthenticated preview sessions are excluded.
    return accessLevel !== "preview";
}
