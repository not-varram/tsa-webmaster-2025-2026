'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Users, Sparkles } from 'lucide-react'

const phrases = [
	'The WTSA Chapter Resource Hub',
	'Share Resources',
	'Conduct Outreach',
	'Host Events',
	'Chapter Mentorship',
]

export function HeroSection() {
	const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
	const [displayText, setDisplayText] = useState(phrases[0])
	const [isScrambling, setIsScrambling] = useState(false)

	useEffect(() => {
		const cycleInterval = setInterval(() => {
			setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
			setIsScrambling(true)
		}, 3000)

		return () => clearInterval(cycleInterval)
	}, [])

	useEffect(() => {
		if (!isScrambling) return

		const targetText = phrases[currentPhraseIndex]
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
		let iteration = 0
		const maxIterations = Math.max(targetText.length, displayText.length) * 2

		const interval = setInterval(() => {
			setDisplayText(
				targetText
					.split('')
					.map((char, index) => {
						if (char === ' ') return ' '
						if (index < iteration / 2) {
							return targetText[index]
						}
						return chars[Math.floor(Math.random() * chars.length)]
					})
					.join('')
			)

			iteration += 1

			if (iteration >= maxIterations) {
				setDisplayText(targetText)
				setIsScrambling(false)
				clearInterval(interval)
			}
		}, 30)

		return () => clearInterval(interval)
	}, [currentPhraseIndex, isScrambling])

	return (
		<section className="relative wtsa-hero-gradient text-white overflow-hidden">
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
				<div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
					<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4" />
						<span>Unity Through Community</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold leading-tight h-[1.2em] md:h-[1.3em] flex items-center justify-center">
						<span className="text-white">{displayText}</span>
					</h1>
					<p className="text-xl md:text-2xl text-primary-50 max-w-2xl mx-auto">
						Connecting Washington TSA chapters through shared resources, mentorship, and
						collaboration
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<Link href="/resources">
							<Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl">
								Explore Resources
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
						</Link>
						<Link href="/chapters">
							<Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
								Meet the Chapters
								<Users className="ml-2 w-5 h-5" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
		</section>
	)
}
