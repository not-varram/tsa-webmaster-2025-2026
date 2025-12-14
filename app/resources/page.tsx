import prisma from '@/lib/db'
import { ResourcesClient } from '@/components/resources/ResourcesClient'
import { CommunityPostsClient } from '@/components/posts/CommunityPostsClient'
import { getSession, isVerifiedUser } from '@/lib/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Resource Hub - WTSA Community',
    description: 'Browse and search our comprehensive directory of TSA resources including templates, guides, workshops, and tools shared by WTSA and chapters.',
}

export const revalidate = 0 // Dynamic for user-specific content

export default async function ResourcesPage() {
    const session = await getSession()
    const isVerified = await isVerifiedUser()
    const isAdmin = session?.role === 'ADMIN' || session?.role === 'CHAPTER_ADMIN'
    
    const resources = await prisma.resource.findMany({
        include: {
            chapter: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: [
            { highlighted: 'desc' },
            { createdAt: 'desc' },
        ],
    })

    const serializedResources = resources.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }))

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="page-header-accent py-16 relative">
                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">Resource Hub</h1>
                        <p className="text-xl text-neutral-600">
                            Discover tools, templates, guides, and workshops created by WTSA and shared by
                            chapters across Washington. Request resources you need or share what you have with the community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Community Posts */}
            <section className="section border-b border-neutral-200">
                <div className="container">
                    <CommunityPostsClient 
                        isSignedIn={!!session} 
                        isVerified={isVerified}
                        isAdmin={isAdmin}
                    />
                </div>
            </section>

            {/* Official Resources */}
            <section className="section">
                <div className="container">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900">Official Resources</h2>
                        <p className="text-neutral-600 mt-1">
                            Curated resources from WTSA and chapters across Washington
                        </p>
                    </div>
                    <ResourcesClient initialResources={serializedResources} />
                </div>
            </section>
        </div>
    )
}
