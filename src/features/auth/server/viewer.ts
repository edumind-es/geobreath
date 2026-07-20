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

import type { Session } from "next-auth";
import { auth, isAuthentikConfigured } from "@/auth";
import { hasPremiumAccess, type AccessLevel } from "@/features/auth/lib/claims";

export interface ViewerContext {
    authConfigured: boolean;
    isAuthenticated: boolean;
    name: string;
    email: string | null;
    image: string | null;
    username: string | null;
    accessLevel: AccessLevel;
    groups: string[];
    entitlements: string[];
    hasPremium: boolean;
    storageKey: string;
}

function buildStorageKey(input: { id?: string; email?: string | null; username?: string | null }) {
    if (input.id?.trim()) {
        return `user:${input.id.trim()}`;
    }

    if (input.email?.trim()) {
        return `mail:${input.email.trim().toLowerCase()}`;
    }

    if (input.username?.trim()) {
        return `handle:${input.username.trim().toLowerCase()}`;
    }

    return "member:anonymous";
}

export function buildPreviewViewer(): ViewerContext {
    return {
        authConfigured: false,
        isAuthenticated: false,
        name: "Modo preview",
        email: null,
        image: null,
        username: null,
        accessLevel: "preview",
        groups: [],
        entitlements: [],
        hasPremium: false,
        storageKey: "preview",
    };
}

export function buildViewerFromSession(session: Session | null): ViewerContext | null {
    if (!session?.user) return null;

    const accessLevel = session.user.accessLevel ?? "member";

    return {
        authConfigured: true,
        isAuthenticated: true,
        name: session.user.name ?? session.user.username ?? "Usuario EDUmind",
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        username: session.user.username ?? null,
        accessLevel,
        groups: session.user.groups ?? [],
        entitlements: session.user.entitlements ?? [],
        hasPremium: hasPremiumAccess(accessLevel),
        storageKey: buildStorageKey({
            email: session.user.email,
            id: session.user.id,
            username: session.user.username,
        }),
    };
}

export async function getViewerContext() {
    if (!isAuthentikConfigured) {
        return buildPreviewViewer();
    }

    const session = await auth();
    return buildViewerFromSession(session);
}
