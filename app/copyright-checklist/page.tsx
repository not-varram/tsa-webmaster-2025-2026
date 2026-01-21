import { Metadata } from 'next';
import { CheckCircle, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Copyright Checklist - WTSA Resource Hub',
    description: 'Complete list of all assets, sources, licenses, and attributions used in the WTSA Community Resource Hub.',
};

export default function CopyrightChecklistPage() {
    const assets = [
        {
            category: 'Fonts',
            items: [
                {
                    name: 'Inter',
                    type: 'Font',
                    source: 'Google Fonts',
                    url: 'https://fonts.google.com/specimen/Inter',
                    license: 'Open Font License',
                    attribution: 'Used via Google Fonts CDN',
                    original: false,
                },
            ],
        },
        {
            category: 'Icons',
            items: [
                {
                    name: 'Lucide React Icons',
                    type: 'Icon Library',
                    source: 'Lucide',
                    url: 'https://lucide.dev',
                    license: 'ISC License',
                    attribution: 'Icons: Search, Users, Menu, X, ArrowRight, MapPin, Calendar, Tag, etc.',
                    original: false,
                },
            ],
        },
        {
            category: 'Images & Graphics',
            items: [
                {
                    name: 'Website Logo',
                    type: 'Graphic',
                    source: 'Student-designed via Adobe Illustrator',
                    url: 'N/A - CSS gradient design',
                    license: 'Original Work',
                    attribution: 'Created by using Adobe Illustrator with gradients',
                    original: true,
                },
            ],
        },
        {
            category: 'Code Libraries & Frameworks',
            items: [
                {
                    name: 'Next.js',
                    type: 'React Framework',
                    source: 'Vercel',
                    url: 'https://nextjs.org',
                    license: 'MIT License',
                    attribution: 'Core framework for application',
                    original: false,
                },
                {
                    name: 'React',
                    type: 'JavaScript Library',
                    source: 'Meta/Facebook',
                    url: 'https://react.dev',
                    license: 'MIT License',
                    attribution: 'UI component library',
                    original: false,
                },
                {
                    name: 'Tailwind CSS',
                    type: 'CSS Framework',
                    source: 'Tailwind Labs',
                    url: 'https://tailwindcss.com',
                    license: 'MIT License',
                    attribution: 'Utility-first CSS framework',
                    original: false,
                },
                {
                    name: 'Prisma',
                    type: 'ORM',
                    source: 'Prisma Data Inc.',
                    url: 'https://www.prisma.io',
                    license: 'Apache 2.0',
                    attribution: 'Database ORM and query builder',
                    original: false,
                },
                {
                    name: 'clsx',
                    type: 'Utility',
                    source: 'NPM Package',
                    url: 'https://www.npmjs.com/package/clsx',
                    license: 'MIT License',
                    attribution: 'Conditional className utility',
                    original: false,
                },
                {
                    name: 'tailwind-merge',
                    type: 'Utility',
                    source: 'NPM Package',
                    url: 'https://www.npmjs.com/package/tailwind-merge',
                    license: 'MIT License',
                    attribution: 'Tailwind class merging utility',
                    original: false,
                },
            ],
        },
        {
            category: 'Content',
            items: [
                {
                    name: 'Sample Chapter Data (Names, Locations)',
                    type: 'Data',
                    source: 'Demo Data',
                    url: 'N/A',
                    license: 'Original Work',
                    attribution: 'Demo data regarding TSA chapters is entirely fictional for demonstration purposes',
                    original: true,
                },
                {
                    name: 'Resource Descriptions',
                    type: 'Content',
                    source: 'Demo Content',
                    url: 'N/A',
                    license: 'Original Work',
                    attribution: 'All resource descriptions are original content created for demo purposes',
                    original: true,
                },
            ],
        },
        {
            category: 'Code',
            items: [
                {
                    name: 'Codebase',
                    type: 'Source Code',
                    source: 'Student developed',
                    url: 'N/A',
                    license: 'Original Work',
                    attribution: 'All custom components, pages, API routes, and database schema written by us',
                    original: true,
                },
                {
                    name: 'Database Seed Data',
                    type: 'Data Script',
                    source: 'Student developed',
                    url: 'N/A',
                    license: 'Original Work',
                    attribution: 'Custom seed script with demo data',
                    original: true,
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="page-header-accent py-16 relative">
                <div className="container relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <CheckCircle className="w-10 h-10 text-primary-600" />
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">Copyright Checklist</h1>
                    </div>
                    <p className="text-xl text-neutral-600 max-w-3xl">
                        Complete attribution for all external assets, libraries, and content used in the WTSA
                        Community Resource Hub, along with identification of original student work
                    </p>
                </div>
            </section>

            {/* Summary */}
            <section className="section">
                <div className="container max-w-6xl">
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-12">
                        <div className="flex items-start gap-4">
                            <div>
                                <p className="text-green-800">
                                    All external assets are properly licensed (MIT, Open Font License, Apache 2.0). All original work created by us is clearly
                                    identified. No copyright violations exist in this project.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assets by Category */}
                    <div className="space-y-8">
                        {assets.map((category, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
                                <div className="bg-neutral-800 text-white px-6 py-4">
                                    <h2 className="text-xl font-bold">{category.category}</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-neutral-100 border-b border-neutral-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                                    Asset Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                                    Source
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                                    License
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                                    Attribution
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                                                    Original
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-200">
                                            {category.items.map((item, itemIdx) => (
                                                <tr key={itemIdx} className="hover:bg-neutral-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-neutral-900">{item.name}</div>
                                                        {item.url && item.url.startsWith('http') && (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary-600 hover:underline flex items-center gap-1 mt-1"
                                                            >
                                                                View Source <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-neutral-600">{item.type}</td>
                                                    <td className="px-6 py-4 text-sm text-neutral-600">{item.source}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.original
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                }`}
                                                        >
                                                            {item.license}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-neutral-600 max-w-md">
                                                        {item.attribution}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.original ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <span className="text-neutral-400">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* License Information */}
                    <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">License Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-3">MIT License</h3>
                                <p className="text-sm text-neutral-700">
                                    Permissive license allowing commercial use, modification, distribution, and
                                    private use. Used by Next.js, React, Tailwind CSS, and utility libraries.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-3">Open Font License</h3>
                                <p className="text-sm text-neutral-700">
                                    License for fonts allowing use in websites and applications. Applies to Inter font
                                    from Google Fonts.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-3">Apache 2.0 License</h3>
                                <p className="text-sm text-neutral-700">
                                    Permissive license with patent protection. Used by Prisma ORM for database
                                    operations.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-neutral-900 mb-3">ISC License</h3>
                                <p className="text-sm text-neutral-700">
                                    Functionally equivalent to MIT License. Used by Lucide icon library.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
