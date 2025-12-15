import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
    { name: 'Resource Hub', href: '/resources' },
    { name: 'Chapters', href: '/chapters' },
    { name: 'Events', href: '/events' },
    // { name: 'Student Work Log', href: '/student-work-log' },
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
                            <Image
                                src="/site-logo.png"
                                alt="WTSA Coalesce Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="flex items-baseline gap-1">
                                <span className="font-bold text-xl">WTSA</span>
                                <span className="font-coalesce text-xl italic text-primary-300">Coalesce</span>
                            </span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Unity Through Community: Connecting Washington TSA chapters through shared resources.
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
                            <p>Developers</p>
                            <p>
                                <a
                                    href="mailto:sigmasociety420@gmail.com"
                                    className="hover:text-white transition-colors"
                                >
                                    sigmasociety420@gmail.com
                                </a>
                            </p>
                            <div className="pt-4">
                                <p className="text-xs text-neutral-500">
                                    Copyright {new Date().getFullYear()} Washington TSA & LWHS Developers.
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
