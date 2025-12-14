import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
	title: 'WTSA Community Resource Hub',
	description: 'Connecting Washington TSA chapters through shared resources, mentorship, and community collaboration',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${dmSans.className} flex flex-col min-h-screen grid-bg`}>
				<AnimatedBackground />
				<Header />
				<main className="flex-grow relative z-10">{children}</main>
				<Footer />
			</body>
		</html>
	)
}
