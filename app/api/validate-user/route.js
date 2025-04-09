import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function validateUser(req, createdBy) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail || userEmail !== createdBy) {
      return {
        error: "Unauthorized: Email mismatch",
        status: 401,
        debug: {
          userEmail,
          createdBy,
        },
      };
    }

    return { userEmail }; // Success
  } catch (err) {
    return {
      error: "Internal server error during validation",
      status: 500,
    };
  }
}
