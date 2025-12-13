import { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Student Work Log - WTSA Resource Hub',
    description: 'Detailed log of student work, tasks, and development process for the WTSA Community Resource Hub.',
};

export default function StudentWorkLogPage() {
    const workLog = [
        {
            dateRange: 'Week 1: Nov 18-24, 2025',
            tasks: [
                {
                    task: 'Project Planning & Requirements Analysis',
                    members: 'All Team Members',
                    tools: 'Google Docs, Figma',
                    notes: 'Analyzed competition brief, brainstormed "Unity Through Community" interpretation, created initial wireframes',
                },
                {
                    task: 'Database Schema Design',
                    members: 'Backend Developer',
                    tools: 'Prisma, PostgreSQL, DrawSQL',
                    notes: 'Designed complete data model with tables for chapters, resources, events, users, and mentorship relationships',
                },
                {
                    task: 'Visual Design System',
                    members: 'UI/UX Designer',
                    tools: 'Figma, Tailwind',
                    notes: 'Created color palette inspired by TSA branding (blues/reds), designed component library and layouts',
                },
            ],
        },
        {
            dateRange: 'Week 2: Nov 25 - Dec 1, 2025',
            tasks: [
                {
                    task: 'Next.js Project Setup',
                    members: 'Full Stack Developer',
                    tools: 'Next.js 14, TypeScript, Tailwind CSS',
                    notes: 'Initialized project with App Router, configured TypeScript and Tailwind, set up dev environment',
                },
                {
                    task: 'Database Implementation',
                    members: 'Backend Developer',
                    tools: 'Prisma, PostgreSQL',
                    notes: 'Created migrations, implemented all models, wrote seed script with Washington chapter data',
                },
                {
                    task: 'Core UI Components',
                    members: 'Frontend Developer',
                    tools: 'React, TypeScript, Tailwind',
                    notes: 'Built Button, Card, Header, Footer, and specialized card components (Resource, Chapter, Event)',
                },
            ],
        },
        {
            dateRange: 'Week 3: Dec 2-8, 2025',
            tasks: [
                {
                    task: 'Home Page Development',
                    members: 'Full Stack Developer',
                    tools: 'Next.js, Prisma, React',
                    notes: 'Created hero section, highlighted resources display, directory preview, chapter connection area',
                },
                {
                    task: 'Resource Hub & Search',
                    members: 'Frontend + Backend',
                    tools: 'React, Next.js, Prisma',
                    notes: 'Built interactive search/filter system, resource cards grid, detail pages with related resources',
                },
                {
                    task: 'Chapter Pages',
                    members: 'Full Stack Developer',
                    tools: 'Next.js, Prisma',
                    notes: 'Developed chapter directory with regional grouping, individual chapter profiles showing resources and mentorship',
                },
            ],
        },
        {
            dateRange: 'Week 4: Dec 9-15, 2025',
            tasks: [
                {
                    task: 'Resource Suggestion System',
                    members: 'Full Stack Developer',
                    tools: 'React Hook Form, Next.js API Routes',
                    notes: 'Created submission form with validation, API endpoint to store suggestions in database',
                },
                {
                    task: 'Events & About Pages',
                    members: 'Frontend Developer',
                    tools: 'Next.js, React, Prisma',
                    notes: 'Built Events calendar view with filtering, comprehensive About page with theme explanation',
                },
                {
                    task: 'About & Judges Pages',
                    members: 'Content Writer + Developer',
                    tools: 'Next.js, Markdown',
                    notes: 'Wrote comprehensive About page explaining solution, created Judges page with tech docs and compliance info',
                },
            ],
        },
        {
            dateRange: 'Week 5: Dec 16-22, 2025',
            tasks: [
                {
                    task: 'Student Work Log & Copyright Pages',
                    members: 'Documentation Lead',
                    tools: 'Next.js, research',
                    notes: 'Created this work log with task timeline, compiled copyright checklist with all asset attributions',
                },
                {
                    task: 'Accessibility Audit',
                    members: 'Full Team',
                    tools: 'Lighthouse, axe DevTools, manual testing',
                    notes: 'Verified semantic HTML, keyboard navigation, color contrast, ARIA labels. Fixed accessibility issues.',
                },
                {
                    task: 'Responsive Design Testing',
                    members: 'Frontend Developer',
                    tools: 'Chrome DevTools, real devices',
                    notes: 'Tested all pages at 320px, 768px, 1024px, 1440px. Fixed layout issues, verified mobile menu works.',
                },
            ],
        },
        {
            dateRange: 'Week 6: Dec 23-29, 2025',
            tasks: [
                {
                    task: 'Cross-Browser Testing',
                    members: 'QA Team',
                    tools: 'Chrome, Firefox, Safari, Edge',
                    notes: 'Verified functionality across all major browsers, fixed browser-specific CSS issues',
                },
                {
                    task: 'Performance Optimization',
                    members: 'Full Stack Developer',
                    tools: 'Lighthouse, Next.js Image',
                    notes: 'Optimized images, implemented static generation where possible, added database indexes, achieved 90+ Lighthouse score',
                },
                {
                    task: 'Content Review & Polish',
                    members: 'All Team Members',
                    tools: 'Grammarly, peer review',
                    notes: 'Reviewed all copy for grammar/clarity, ensured consistent voice, verified all links work',
                },
            ],
        },
        {
            dateRange: 'Final Week: Dec 30 - Jan 5, 2026',
            tasks: [
                {
                    task: 'Final Testing & Bug Fixes',
                    members: 'All Team Members',
                    tools: 'Full application',
                    notes: 'End-to-end testing of all features, fixed final bugs, verified form submissions work',
                },
                {
                    task: 'Documentation Finalization',
                    members: 'Documentation Lead',
                    tools: 'Work Log, Copyright Checklist',
                    notes: 'Completed all required competition documentation, ensured judges have clear access to required pages',
                },
                {
                    task: 'Deployment & Submission',
                    members: 'DevOps Lead',
                    tools: 'Vercel, production environment',
                    notes: 'Deployed to production, verified database connectivity, prepared submission materials',
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
                <div className="container">
                    <div className="flex items-center gap-4 mb-4">
                        <FileText className="w-10 h-10" />
                        <h1 className="text-4xl md:text-5xl font-bold">Student Work Log</h1>
                    </div>
                    <p className="text-xl text-primary-50 max-w-3xl">
                        Complete timeline of tasks, team member responsibilities, tools used, and development
                        process for the WTSA Community Resource Hub
                    </p>
                </div>
            </section>

            {/* Work Log */}
            <section className="section">
                <div className="container max-w-6xl">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl font-bold text-primary-600 mb-2">7</div>
                            <div className="text-neutral-600">Weeks</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                            <div className="text-neutral-600">Files Created</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
                            <div className="text-neutral-600">Pages</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                            <div className="text-neutral-600">Team Effort</div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-8">
                        {workLog.map((week, weekIdx) => (
                            <div key={weekIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-4">
                                    <h2 className="text-xl font-bold">{week.dateRange}</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {week.tasks.map((task, taskIdx) => (
                                            <div key={taskIdx} className="border-l-4 border-primary-200 pl-6 py-2">
                                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                                    <div className="lg:col-span-2">
                                                        <h3 className="font-semibold text-neutral-900 mb- 1">{task.task}</h3>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                                                            Team Members
                                                        </div>
                                                        <div className="text-sm text-neutral-700">{task.members}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                                                            Tools Used
                                                        </div>
                                                        <div className="text-sm text-neutral-700">{task.tools}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                                                        Notes & Iterations
                                                    </div>
                                                    <p className="text-sm text-neutral-600">{task.notes}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tools Summary */}
                    <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Tools & Technologies Used</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[
                                'Next.js 14',
                                'React 18',
                                'TypeScript',
                                'Tailwind CSS',
                                'PostgreSQL',
                                'Prisma ORM',
                                'Figma',
                                'Git/GitHub',
                                'VS Code',
                                'Chrome DevTools',
                                'Lighthouse',
                                'Vercel',
                            ].map((tool) => (
                                <div
                                    key={tool}
                                    className="px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg text-center text-sm font-medium text-primary-900"
                                >
                                    {tool}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
