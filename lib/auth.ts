import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from './db';

type UserRole = 'PUBLIC' | 'STUDENT' | 'ADVISOR' | 'ADMIN';

/**
 * Get the current user from the database using Clerk auth
 */
export async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) return null;

    // Find user in database by Clerk ID
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { chapter: true },
    });

    return user;
}

/**
 * Check if the current user is a WTSA admin
 */
export async function isWTSAAdmin() {
    const user = await getCurrentUser();
    if (!user) return false;

    // Check if user's email is the WTSA admin email
    return user.email === 'email@varram.me' || user.role === UserRole.ADMIN;
}

/**
 * Check if the current user is a chapter admin
 */
export async function isChapterAdmin(chapterId?: string) {
    const user = await getCurrentUser();
    if (!user || !user.chapterId) return false;

    //WTSA admins can act as chapter admins
    if (await isWTSAAdmin()) return true;

    // If specific chapter provided, check if user is admin of that chapter
    if (chapterId) {
        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
        });

        return chapter?.adminEmails.includes(user.email) || false;
    }

    // Check if user is admin of their own chapter
    if (!user.chapter) return false;
    return user.chapter.adminEmails.includes(user.email);
}

/**
 * Sync Clerk user to database
 * Called after sign-in/sign-up
 */
export async function syncClerkUserToDatabase() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });

    // Determine role
    let role = UserRole.STUDENT; // Default to student

    // Check if WTSA admin
    if (email === 'email@varram.me') {
        role = UserRole.ADMIN;
    }

    if (user) {
        // Update existing user
        user = await prisma.user.update({
            where: { clerkId: clerkUser.id },
            data: {
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email,
                email,
                role,
            },
        });
    } else {
        // Create new user
        user = await prisma.user.create({
            data: {
                clerkId: clerkUser.id,
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email,
                email,
                role,
                verified: role === UserRole.ADMIN, // Auto-verify WTSA admin
            },
        });
    }

    return user;
}

/**
 * Get user's permissions for a specific chapter
 */
export async function getUserChapterPermissions(chapterId: string) {
    const user = await getCurrentUser();
    if (!user) {
        return {
            canManageChapter: false,
            canApproveStudents: false,
            canManageResources: false,
        };
    }

    const isAdmin = await isWTSAAdmin();
    const isChapAdmin = await isChapterAdmin(chapterId);

    return {
        canManageChapter: isAdmin || isChapAdmin,
        canApproveStudents: isAdmin || isChapAdmin,
        canManageResources: isAdmin || isChapAdmin,
    };
}
