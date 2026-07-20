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

import type { OIDCConfig } from "@auth/core/providers";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { inferAccessLevel, normalizeOptionalString, toStringList } from "@/features/auth/lib/claims";

interface AuthentikProfile extends Record<string, unknown> {
    sub: string;
    name?: unknown;
    email?: unknown;
    picture?: unknown;
    preferred_username?: unknown;
    groups?: unknown;
    entitlements?: unknown;
}

const authentikIssuer = process.env.AUTH_AUTHENTIK_ISSUER;
const authentikClientId = process.env.AUTH_AUTHENTIK_ID;
const authentikClientSecret = process.env.AUTH_AUTHENTIK_SECRET;

export const isAuthentikConfigured = Boolean(authentikIssuer && authentikClientId && authentikClientSecret);

function buildAuthentikProvider(): OIDCConfig<AuthentikProfile> {
    if (!authentikIssuer || !authentikClientId || !authentikClientSecret) {
        throw new Error("Authentik OIDC provider requires issuer, client id and client secret");
    }

    return {
        id: "authentik",
        name: "EDUmind Access",
        type: "oidc",
        issuer: authentikIssuer,
        clientId: authentikClientId,
        clientSecret: authentikClientSecret,
        authorization: {
            params: {
                scope: "openid profile email offline_access groups",
            },
        },
        profile(profile) {
            const groups = toStringList(profile.groups);
            const entitlements = toStringList(profile.entitlements);

            return {
                id: String(profile.sub),
                name: normalizeOptionalString(profile.name) ?? normalizeOptionalString(profile.preferred_username) ?? "EDUmind User",
                email: normalizeOptionalString(profile.email),
                image: normalizeOptionalString(profile.picture),
                username: normalizeOptionalString(profile.preferred_username),
                accessLevel: inferAccessLevel(groups, entitlements),
                groups,
                entitlements,
            };
        },
    };
}

const providers = isAuthentikConfigured ? [buildAuthentikProvider()] : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET ?? "geobreath-local-dev-secret",
    trustHost: true,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    providers,
    callbacks: {
        authorized({ request, auth: session }) {
            if (!isAuthentikConfigured) return true;

            if (!request.nextUrl.pathname.startsWith("/app")) {
                return true;
            }

            if (session?.user) {
                return true;
            }

            const signInUrl = new URL("/sign-in", request.nextUrl);
            signInUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
            return NextResponse.redirect(signInUrl);
        },
        jwt({ token, user }) {
            if (user) {
                token.username = user.username ?? null;
                token.accessLevel = user.accessLevel ?? "member";
                token.groups = user.groups ?? [];
                token.entitlements = user.entitlements ?? [];
            }

            return token;
        },
        session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            session.user.username = typeof token.username === "string" ? token.username : null;
            session.user.accessLevel =
                token.accessLevel === "admin" ||
                token.accessLevel === "premium" ||
                token.accessLevel === "member" ||
                token.accessLevel === "preview"
                    ? token.accessLevel
                    : "member";
            session.user.groups = Array.isArray(token.groups) ? token.groups.filter((group): group is string => typeof group === "string") : [];
            session.user.entitlements = Array.isArray(token.entitlements)
                ? token.entitlements.filter((entitlement): entitlement is string => typeof entitlement === "string")
                : [];
            return session;
        },
    },
});
