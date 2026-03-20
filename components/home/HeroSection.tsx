'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { GlobeGrid } from './GlobeGrid'

const phrases = [
	'The WTSA Chapter Resource Hub',
	'Share Resources',
	'Conduct Outreach',
	'Host Events',
	'Chapter Mentorship',
]

const ROTATION_INTERVAL = 3000 // 3 seconds per phrase

export function HeroSection() {
	const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
		}, ROTATION_INTERVAL)

		return () => clearInterval(timer)
	}, [])

	return (
		<section className="relative bg-white overflow-hidden">
			{/* Globe Grid Background */}
			<div className="absolute inset-0 z-0">
				<GlobeGrid />
			</div>

			{/* Gradient overlay to ensure text readability */}
			<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90 z-[1]"></div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
				<div className="max-w-5xl mx-auto text-center space-y-6 animate-fade-in">
					<div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 px-4 py-2 rounded-full text-sm font-medium mb-4 text-primary-700">
						<Sparkles className="w-4 h-4" />
						<span>Unity Through Community</span>
					</div>
					<div className="h-[1.4em] overflow-hidden flex items-start justify-center text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
						<h1 
							className="flex flex-col items-center justify-start transition-transform duration-700 ease-in-out w-full m-0 p-0"
							style={{ transform: `translateY(-${currentPhraseIndex * (100 / phrases.length)}%)` }}
						>
							{phrases.map((phrase, index) => (
								<div 
									key={index}
									className="h-[1.4em] flex items-center justify-center whitespace-nowrap w-full shrink-0"
								>
									<span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent pb-1 md:pb-2">
										{phrase}
									</span>
								</div>
							))}
						</h1>
					</div>
					<p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
						Connecting Washington TSA chapters through shared resources, mentorship, and
						collaboration
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<Link href="/resources">
							<Button size="lg" className="shadow-lg shadow-primary-500/25">
								Community Resource Board
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
						</Link>
						<Link href="/events">
							<Button size="lg" variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
								Past/Current Events
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Bottom fade */}
			<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
		</section>
	)
}
