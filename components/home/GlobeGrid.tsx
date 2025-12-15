'use client'

import { useEffect, useRef, useState } from 'react'

// WTSA Chapter schools with their positions on the grid
const CHAPTER_NODES = [
	{ name: 'Lake Washington HS', shortName: 'LWHS', x: 0.35, y: 0.25 },
	{ name: 'Tesla STEM HS', shortName: 'TSHS', x: 0.65, y: 0.20 },
	{ name: 'Redmond HS', shortName: 'RHS', x: 0.55, y: 0.45 },
	{ name: 'Juanita HS', shortName: 'JHS', x: 0.25, y: 0.55 },
	{ name: 'Eastlake HS', shortName: 'EHS', x: 0.75, y: 0.60 },
	{ name: 'Kirkland MS', shortName: 'KMS', x: 0.40, y: 0.72 },
	{ name: 'Einstein MS', shortName: 'EMS', x: 0.60, y: 0.80 },
]

interface Pulse {
	id: number
	fromNode: number
	toNode: number
	progress: number
}

export function GlobeGrid() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [hoveredNode, setHoveredNode] = useState<number | null>(null)
	const animationRef = useRef<number>(0)
	const pulsesRef = useRef<Pulse[]>([])
	const pulseIdRef = useRef(0)
	const timeRef = useRef(0)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const resizeCanvas = () => {
			const rect = canvas.getBoundingClientRect()
			const dpr = window.devicePixelRatio || 1
			canvas.width = rect.width * dpr
			canvas.height = rect.height * dpr
			ctx.scale(dpr, dpr)
		}

		resizeCanvas()
		window.addEventListener('resize', resizeCanvas)

		// Create random pulses between nodes
		const createPulse = () => {
			const fromNode = Math.floor(Math.random() * CHAPTER_NODES.length)
			let toNode = Math.floor(Math.random() * CHAPTER_NODES.length)
			while (toNode === fromNode) {
				toNode = Math.floor(Math.random() * CHAPTER_NODES.length)
			}
			pulsesRef.current.push({
				id: pulseIdRef.current++,
				fromNode,
				toNode,
				progress: 0,
			})
		}

		// Initial pulses
		createPulse()
		createPulse()

		const pulseInterval = setInterval(() => {
			if (pulsesRef.current.length < 4) {
				createPulse()
			}
		}, 2000)

		const animate = () => {
			const rect = canvas.getBoundingClientRect()
			const width = rect.width
			const height = rect.height

			timeRef.current += 0.005

			// Clear with white background
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, width, height)

			// Draw curved grid lines to simulate globe effect
			ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)'
			ctx.lineWidth = 1

			const gridSpacing = 40
			const centerX = width / 2
			const centerY = height / 2
			const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY)

			// Horizontal curved lines
			for (let y = 0; y <= height; y += gridSpacing) {
				ctx.beginPath()
				const distFromCenter = Math.abs(y - centerY) / centerY
				const curvature = Math.cos(distFromCenter * Math.PI * 0.5) * 20

				for (let x = 0; x <= width; x += 5) {
					const xDistFromCenter = (x - centerX) / centerX
					const yOffset = Math.sin(xDistFromCenter * Math.PI) * curvature
					const waveOffset = Math.sin(timeRef.current + x * 0.01) * 2

					if (x === 0) {
						ctx.moveTo(x, y + yOffset + waveOffset)
					} else {
						ctx.lineTo(x, y + yOffset + waveOffset)
					}
				}
				ctx.stroke()
			}

			// Vertical curved lines
			for (let x = 0; x <= width; x += gridSpacing) {
				ctx.beginPath()
				const distFromCenter = Math.abs(x - centerX) / centerX
				const curvature = Math.cos(distFromCenter * Math.PI * 0.5) * 20

				for (let y = 0; y <= height; y += 5) {
					const yDistFromCenter = (y - centerY) / centerY
					const xOffset = Math.sin(yDistFromCenter * Math.PI) * curvature
					const waveOffset = Math.sin(timeRef.current + y * 0.01) * 2

					if (y === 0) {
						ctx.moveTo(x + xOffset + waveOffset, y)
					} else {
						ctx.lineTo(x + xOffset + waveOffset, y)
					}
				}
				ctx.stroke()
			}

			// Draw connection lines between nodes
			ctx.strokeStyle = 'rgba(37, 99, 235, 0.15)'
			ctx.lineWidth = 1
			CHAPTER_NODES.forEach((node, i) => {
				CHAPTER_NODES.forEach((otherNode, j) => {
					if (i < j) {
						const dist = Math.sqrt(
							Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
						)
						// Only draw connections to nearby nodes
						if (dist < 0.4) {
							ctx.beginPath()
							ctx.moveTo(node.x * width, node.y * height)
							ctx.lineTo(otherNode.x * width, otherNode.y * height)
							ctx.stroke()
						}
					}
				})
			})

			// Animate pulses
			pulsesRef.current = pulsesRef.current.filter((pulse) => {
				pulse.progress += 0.008

				if (pulse.progress >= 1) return false

				const from = CHAPTER_NODES[pulse.fromNode]
				const to = CHAPTER_NODES[pulse.toNode]

				const currentX = from.x + (to.x - from.x) * pulse.progress
				const currentY = from.y + (to.y - from.y) * pulse.progress

				// Draw pulse
				const gradient = ctx.createRadialGradient(
					currentX * width,
					currentY * height,
					0,
					currentX * width,
					currentY * height,
					8
				)
				gradient.addColorStop(0, 'rgba(37, 99, 235, 0.8)')
				gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')

				ctx.beginPath()
				ctx.arc(currentX * width, currentY * height, 8, 0, Math.PI * 2)
				ctx.fillStyle = gradient
				ctx.fill()

				return true
			})

			// Draw nodes
			CHAPTER_NODES.forEach((node, index) => {
				const x = node.x * width
				const y = node.y * height
				const isHovered = hoveredNode === index

				// Outer glow
				const glowRadius = isHovered ? 24 : 16 + Math.sin(timeRef.current * 2 + index) * 2
				const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
				gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)')
				gradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.1)')
				gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')

				ctx.beginPath()
				ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
				ctx.fillStyle = gradient
				ctx.fill()

				// Inner circle
				const innerRadius = isHovered ? 8 : 6
				ctx.beginPath()
				ctx.arc(x, y, innerRadius, 0, Math.PI * 2)
				ctx.fillStyle = isHovered ? '#1d4ed8' : '#2563eb'
				ctx.fill()

				// White center
				ctx.beginPath()
				ctx.arc(x, y, innerRadius * 0.4, 0, Math.PI * 2)
				ctx.fillStyle = '#ffffff'
				ctx.fill()
			})

			animationRef.current = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			cancelAnimationFrame(animationRef.current)
			clearInterval(pulseInterval)
		}
	}, [hoveredNode])

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = (e.clientX - rect.left) / rect.width
		const y = (e.clientY - rect.top) / rect.height

		let closest = -1
		let closestDist = 0.05 // Max distance to detect hover

		CHAPTER_NODES.forEach((node, index) => {
			const dist = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
			if (dist < closestDist) {
				closestDist = dist
				closest = index
			}
		})

		setHoveredNode(closest >= 0 ? closest : null)
	}

	return (
		<div className="relative w-full h-full">
			<canvas
				ref={canvasRef}
				className="w-full h-full cursor-pointer"
				onMouseMove={handleMouseMove}
				onMouseLeave={() => setHoveredNode(null)}
			/>

			{/* Node labels */}
			{CHAPTER_NODES.map((node, index) => (
				<div
					key={node.name}
					className={`absolute transform -translate-x-1/2 pointer-events-none transition-all duration-200 ${
						hoveredNode === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
					}`}
					style={{
						left: `${node.x * 100}%`,
						top: `${node.y * 100 - 6}%`,
					}}
				>
					<div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-primary-200 whitespace-nowrap">
						<span className="text-sm font-semibold text-primary-700">{node.name}</span>
					</div>
				</div>
			))}

			{/* Legend */}
			<div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-neutral-200">
				<div className="text-xs font-medium text-neutral-500 mb-2">WTSA Chapter Network</div>
				<div className="flex items-center gap-2 text-xs text-neutral-600">
					<div className="w-2 h-2 rounded-full bg-primary-600"></div>
					<span>{CHAPTER_NODES.length} Connected Chapters</span>
				</div>
			</div>
		</div>
	)
}



