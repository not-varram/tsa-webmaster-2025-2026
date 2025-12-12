import Link from 'next/link';

const quickLinks = [
    { name: 'Resource Hub', href: '/resources' },
    { name: 'Chapters', href: '/chapters' },
    { name: 'Events', href: '/events' },
    { name: 'Unity Stories', href: '/stories' },
    { name: 'Student Work Log', href: '/student-work-log' },
    { name: 'Copyright Checklist', href: '/copyright-checklist' },
];

export function Footer() {
    return (
        <footer className="bg-neutral-900 text-white mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                W
                            </div>
                            <span className="font-bold text-xl">WTSA Hub</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Unity Through Community: Connecting Washington TSA chapters through shared
                            resources, mentorship, and collaboration.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-neutral-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <div className="space-y-2 text-sm text-neutral-400">
                            <p>Washington TSA</p>
                            <p>
                                <a
                                    href="mailto:info@watsa.org"
                                    className="hover:text-white transition-colors"
                                >
                                    info@watsa.org
                                </a>
                            </p>
                            <div className="pt-4">
                                <p className="text-xs text-neutral-500">
                                    © {new Date().getFullYear()} Washington TSA. All rights reserved.
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Built for the 2025-2026 TSA Webmaster Competition
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
