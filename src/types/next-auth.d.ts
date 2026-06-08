/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
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

import { DefaultSession } from "next-auth";
import { AccessLevel } from "@/features/auth/lib/claims";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id?: string;
            username?: string | null;
            accessLevel: AccessLevel;
            groups: string[];
            entitlements: string[];
        };
    }

    interface User {
        username?: string | null;
        accessLevel?: AccessLevel;
        groups?: string[];
        entitlements?: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username?: string | null;
        accessLevel?: AccessLevel;
        groups?: string[];
        entitlements?: string[];
    }
}
