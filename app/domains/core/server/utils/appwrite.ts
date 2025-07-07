import { Client, Account, Databases, Users, Teams } from "node-appwrite";
import type { H3Event } from "h3";

export const SESSION_COOKIE = "aw-session";

export function createAdminClient() {
    const config = useRuntimeConfig();

    // keys
    const ENDPOINT = config.public.awEndpoint as string
    const PROJECT = config.public.awProject as string
    const API_KEY = config.awApiKey as string

    const client = new Client()
        .setEndpoint(ENDPOINT!)
        .setProject(PROJECT!)
        .setKey(API_KEY!);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get users() {
            return new Users(client);
        }
    };
}

export function createSessionClient(event: H3Event) {
    const config = useRuntimeConfig();

    // keys
    const ENDPOINT = config.public.awEndpoint as string
    const PROJECT = config.public.awProject as string

    const client = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT)

    const session = getCookie(event, SESSION_COOKIE);
    const isAuthenticated = !!session;

    if (session) {
        client.setSession(session);
    }

    return {
        isAuthenticated,
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get teams() {
            return new Teams(client);
        },
    };
}

// Simplified session verification
export async function verifySession(sessionId: string) {
    try {
        const config = useRuntimeConfig()
        const client = new Client()
            .setEndpoint(config.public.awEndpoint)
            .setProject(config.public.awProject)
            .setSession(sessionId)

        const account = new Account(client)
        const user = await account.get()

        return { user, valid: true }
    } catch (error) {
        return { user: null, valid: false, error }
    }
}
