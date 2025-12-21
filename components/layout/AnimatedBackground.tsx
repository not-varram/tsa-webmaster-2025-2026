'use client'

import { useEffect, useRef } from 'react'

interface Particle {
	x: number
	y: number
	size: number
	speedX: number
	speedY: number
	opacity: number
	twinkleSpeed: number
	twinklePhase: number
}

export function AnimatedBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationRef = useRef<number>(0)
	const particlesRef = useRef<Particle[]>([])
	const mouseRef = useRef({ x: 0, y: 0 })

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const resizeCanvas = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
			initParticles()
		}

		const initParticles = () => {
			const particleCount = Math.floor((canvas.width * canvas.height) / 15000) // Density based on screen size
			particlesRef.current = []

			for (let i = 0; i < particleCount; i++) {
				particlesRef.current.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: Math.random() * 2 + 0.5,
					speedX: (Math.random() - 0.5) * 0.3,
					speedY: (Math.random() - 0.5) * 0.3 - 0.1, // Slight upward drift
					opacity: Math.random() * 0.5 + 0.2,
					twinkleSpeed: Math.random() * 0.02 + 0.01,
					twinklePhase: Math.random() * Math.PI * 2,
				})
			}
		}

		const handleMouseMove = (e: MouseEvent) => {
			mouseRef.current = { x: e.clientX, y: e.clientY }
		}

		resizeCanvas()
		window.addEventListener('resize', resizeCanvas)
		window.addEventListener('mousemove', handleMouseMove)

		let time = 0

		const animate = () => {
			time += 0.016 // ~60fps

			ctx.clearRect(0, 0, canvas.width, canvas.height)

			particlesRef.current.forEach((particle) => {
				// Update position
				particle.x += particle.speedX
				particle.y += particle.speedY

				// Wrap around edges
				if (particle.x < 0) particle.x = canvas.width
				if (particle.x > canvas.width) particle.x = 0
				if (particle.y < 0) particle.y = canvas.height
				if (particle.y > canvas.height) particle.y = 0

				// Twinkle effect
				const twinkle = Math.sin(time * particle.twinkleSpeed * 60 + particle.twinklePhase)
				const currentOpacity = particle.opacity * (0.5 + twinkle * 0.5)

				// Mouse interaction - particles gently move away from cursor
				const dx = particle.x - mouseRef.current.x
				const dy = particle.y - mouseRef.current.y
				const dist = Math.sqrt(dx * dx + dy * dy)
				if (dist < 150) {
					const force = (150 - dist) / 150
					particle.x += (dx / dist) * force * 0.5
					particle.y += (dy / dist) * force * 0.5
				}

				// Draw particle (star shape for some, dots for others)
				ctx.save()
				ctx.globalAlpha = currentOpacity

				if (particle.size > 1.5) {
					// Draw as a small cross/star
					ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)'
					ctx.lineWidth = 0.5
					ctx.beginPath()
					ctx.moveTo(particle.x - particle.size, particle.y)
					ctx.lineTo(particle.x + particle.size, particle.y)
					ctx.moveTo(particle.x, particle.y - particle.size)
					ctx.lineTo(particle.x, particle.y + particle.size)
					ctx.stroke()

					// Add glow
					ctx.fillStyle = 'rgba(37, 99, 235, 0.3)'
					ctx.beginPath()
					ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
					ctx.fill()
				} else {
					// Draw as dot
					ctx.fillStyle = 'rgba(37, 99, 235, 0.5)'
					ctx.beginPath()
					ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
					ctx.fill()
				}

				ctx.restore()
			})

			// Draw occasional connecting lines between nearby particles
			ctx.strokeStyle = 'rgba(37, 99, 235, 0.05)'
			ctx.lineWidth = 0.5
			for (let i = 0; i < particlesRef.current.length; i++) {
				for (let j = i + 1; j < particlesRef.current.length; j++) {
					const p1 = particlesRef.current[i]
					const p2 = particlesRef.current[j]
					const dx = p1.x - p2.x
					const dy = p1.y - p2.y
					const dist = Math.sqrt(dx * dx + dy * dy)

					if (dist < 100) {
						ctx.globalAlpha = (100 - dist) / 100 * 0.15
						ctx.beginPath()
						ctx.moveTo(p1.x, p1.y)
						ctx.lineTo(p2.x, p2.y)
						ctx.stroke()
					}
				}
			}

			animationRef.current = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			window.removeEventListener('mousemove', handleMouseMove)
			cancelAnimationFrame(animationRef.current)
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-0"
			style={{ opacity: 0.7 }}
		/>
	)
}




