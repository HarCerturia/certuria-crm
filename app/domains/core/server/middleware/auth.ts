import { createSessionClient } from "../utils/appwrite";

export default defineEventHandler(async (event) => {
  // Skip auth middleware for auth endpoints to avoid circular calls
  if (event.node.req.url?.startsWith('/api/auth')) {
    return;
  }

  try {
    const { isAuthenticated, account, teams } = createSessionClient(event);

    if (isAuthenticated) {
      try {
        const user = await account.get();
        const teamsList = await teams.list();
        const team = teamsList.teams.map(team => team.name);

        event.context.user = {
          ...user,
          team
        }
      } catch {
        // Session cookie exists but is invalid - ignore silently
        // This is normal behavior when session is expired/deleted in Appwrite
      }
    }

  } catch (error: unknown) {
    // Only log unexpected errors, not auth-related ones
    const errorMessage = error instanceof Error ? error.message : '';
    if (!errorMessage.includes('missing scope') && !errorMessage.includes('role: guests')) {
      console.error('Auth middleware error:', error instanceof Error ? error.message : String(error));
    }
  }
});
