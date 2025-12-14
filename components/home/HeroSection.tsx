'use client'

import { useState, useEffect, useCallback } from 'react'
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

// Typing speed constants (in ms)
const TYPE_SPEED = 40 // Speed for typing each character
const DELETE_SPEED = 10 // Speed for deleting each character (faster)
const PAUSE_BEFORE_DELETE = 1500 // Pause after fully typed
const PAUSE_BEFORE_TYPE = 0 // Start typing immediately after deletion

export function HeroSection() {
	const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
	const [displayText, setDisplayText] = useState('')
	const [isDeleting, setIsDeleting] = useState(false)
	const [isPaused, setIsPaused] = useState(false)

	const currentPhrase = phrases[currentPhraseIndex]

	const typeNextChar = useCallback(() => {
		if (isPaused) return

		if (!isDeleting) {
			// Typing mode
			if (displayText.length < currentPhrase.length) {
				setDisplayText(currentPhrase.slice(0, displayText.length + 1))
			} else {
				// Finished typing - pause then start deleting
				setIsPaused(true)
				setTimeout(() => {
					setIsPaused(false)
					setIsDeleting(true)
				}, PAUSE_BEFORE_DELETE)
			}
		} else {
			// Deleting mode
			if (displayText.length > 0) {
				setDisplayText(displayText.slice(0, -1))
			} else {
				// Finished deleting - move to next phrase immediately
				setIsDeleting(false)
				setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
			}
		}
	}, [displayText, currentPhrase, isDeleting, isPaused])

	useEffect(() => {
		if (isPaused) return

		const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED
		const timer = setTimeout(typeNextChar, speed)

		return () => clearTimeout(timer)
	}, [typeNextChar, isDeleting, isPaused])

	return (
		<section className="relative wtsa-hero-gradient text-white overflow-hidden">
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
				<div className="max-w-5xl mx-auto text-center space-y-6 animate-fade-in">
					<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4" />
						<span>Unity Through Community</span>
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight h-[1.2em] md:h-[1.3em] flex items-center justify-center whitespace-nowrap">
						<span className="text-white">{displayText}</span>
						<span 
							className="inline-block w-[3px] h-[1em] bg-white ml-1 animate-cursor-blink"
							aria-hidden="true"
						/>
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
