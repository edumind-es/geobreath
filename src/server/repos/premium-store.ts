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

import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PremiumStore, PremiumUserRecord } from "@/features/premium/lib/types";

const premiumDataFile = process.env.GEOBREATH_DATA_FILE ?? path.join(process.cwd(), ".local", "premium-store.json");

const defaultStore: PremiumStore = {
    version: 1,
    users: {},
};

// ---------------------------------------------------------------------------
// At-rest encryption — AES-256-GCM
// Key is derived from AUTH_SECRET via HKDF so user records are unreadable
// without the server secret even if the JSON file is exposed.
// ---------------------------------------------------------------------------

interface EncryptedBlob {
    enc: true;
    iv: string;   // 12-byte GCM nonce, hex-encoded
    tag: string;  // 16-byte GCM auth tag, hex-encoded
    data: string; // ciphertext, hex-encoded
}

/** Derives the 32-byte AES key from AUTH_SECRET via HKDF-SHA-256. */
function getStoreKey(): Buffer {
    const secret = process.env.AUTH_SECRET ?? "geobreath-local-dev-secret";
    return Buffer.from(
        hkdfSync("sha256", Buffer.from(secret, "utf8"), "geobreath-store-v1", "premium-records", 32),
    );
}

function encryptRecord(record: PremiumUserRecord): EncryptedBlob {
    const key = getStoreKey();
    const iv = randomBytes(12); // 96-bit nonce recommended for GCM
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const plaintext = JSON.stringify(record);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    return {
        enc: true,
        iv: iv.toString("hex"),
        tag: cipher.getAuthTag().toString("hex"),
        data: encrypted.toString("hex"),
    };
}

function decryptRecord(blob: EncryptedBlob): PremiumUserRecord {
    const key = getStoreKey();
    const decipher = createDecipheriv(
        "aes-256-gcm",
        key,
        Buffer.from(blob.iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(blob.tag, "hex"));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(blob.data, "hex")),
        decipher.final(),
    ]);
    return JSON.parse(decrypted.toString("utf8")) as PremiumUserRecord;
}

function isEncryptedBlob(value: unknown): value is EncryptedBlob {
    return (
        typeof value === "object" &&
        value !== null &&
        "enc" in value &&
        (value as Record<string, unknown>).enc === true &&
        typeof (value as Record<string, unknown>).iv === "string" &&
        typeof (value as Record<string, unknown>).tag === "string" &&
        typeof (value as Record<string, unknown>).data === "string"
    );
}

// ---------------------------------------------------------------------------
// Coercion — handles both v1 (plaintext) and v2 (encrypted) on-disk formats
// ---------------------------------------------------------------------------

interface StoredPremiumStore {
    version: number;
    users: Record<string, unknown>;
}

function coerceUsers(raw: unknown): Record<string, PremiumUserRecord> {
    if (!raw || typeof raw !== "object") return {};
    const users: Record<string, PremiumUserRecord> = {};

    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
        if (isEncryptedBlob(value)) {
            try {
                users[key] = decryptRecord(value);
            } catch {
                // Wrong key or corrupted blob — skip rather than crash
            }
        } else if (value && typeof value === "object") {
            // v1 plaintext record — kept for backwards compat, encrypted on next write
            users[key] = value as PremiumUserRecord;
        }
    }

    return users;
}

function coerceStore(value: unknown): PremiumStore {
    if (!value || typeof value !== "object") return defaultStore;
    const raw = value as Record<string, unknown>;
    return {
        version: 1,
        users: coerceUsers(raw.users),
    };
}

// ---------------------------------------------------------------------------
// File I/O
// ---------------------------------------------------------------------------

async function ensureStoreFile() {
    const directory = path.dirname(premiumDataFile);
    await mkdir(directory, { recursive: true });

    try {
        await readFile(premiumDataFile, "utf8");
    } catch (error) {
        const fileError = error as NodeJS.ErrnoException;
        if (fileError.code !== "ENOENT") {
            throw error;
        }

        await writeFile(
            premiumDataFile,
            JSON.stringify({ version: 2, users: {} } satisfies StoredPremiumStore, null, 2),
            "utf8",
        );
    }
}

export async function readPremiumStore(): Promise<PremiumStore> {
    await ensureStoreFile();
    const raw = await readFile(premiumDataFile, "utf8");
    return coerceStore(JSON.parse(raw));
}

export async function writePremiumStore(store: PremiumStore): Promise<void> {
    await ensureStoreFile();

    const encryptedUsers: Record<string, EncryptedBlob> = {};
    for (const [key, record] of Object.entries(store.users)) {
        encryptedUsers[key] = encryptRecord(record);
    }

    const stored: StoredPremiumStore = {
        version: 2,
        users: encryptedUsers,
    };

    const tempFile = `${premiumDataFile}.${process.pid}.tmp`;
    await writeFile(tempFile, JSON.stringify(stored, null, 2), "utf8");
    await rename(tempFile, premiumDataFile);
}
