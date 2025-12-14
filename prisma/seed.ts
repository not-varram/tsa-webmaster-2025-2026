import { PrismaClient, UserRole, VerificationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12)
}

async function main() {
	console.log('🌱 Seeding database...')

	// Create chapters with admin emails - All 7 WTSA chapters
	const chapters = await Promise.all([
		prisma.chapter.create({
			data: {
				slug: 'lake-washington-hs',
				name: 'Lake Washington High School TSA',
				schoolName: 'Lake Washington High School',
				city: 'Kirkland',
				region: 'King County',
				about: 'We are a vibrant TSA chapter focused on engineering, robotics, and leadership development. Our students compete in various events and mentor newer chapters.',
				latitude: 47.7062,
				longitude: -122.1857,
				adminEmails: ['admin@lwhs.edu', 'advisor@lwhs.edu'],
			},
		}),
		prisma.chapter.create({
			data: {
				slug: 'tesla-stem-hs',
				name: 'Tesla STEM High School TSA',
				schoolName: 'Tesla STEM High School',
				city: 'Redmond',
				region: 'King County',
				about: 'A STEM-focused charter school with a strong emphasis on technology innovation, computer science, and competitive robotics. Our chapter excels in technical events.',
				latitude: 47.6848,
				longitude: -122.0932,
				adminEmails: ['admin@teslastem.edu'],
			},
		}),
		prisma.chapter.create({
			data: {
				slug: 'redmond-hs',
				name: 'Redmond High School TSA',
				schoolName: 'Redmond High School',
				city: 'Redmond',
				region: 'King County',
				about: 'A competitive TSA chapter with strong focus on software development, webmaster, and video game design. We love sharing resources with other chapters!',
				latitude: 47.6740,
				longitude: -122.1215,
				adminEmails: ['admin@rhs.edu'],
			},
		}),
		prisma.chapter.create({
			data: {
				slug: 'juanita-hs',
				name: 'Juanita High School TSA',
				schoolName: 'Juanita High School',
				city: 'Kirkland',
				region: 'King County',
				about: 'Our chapter emphasizes community service through technology and has won multiple awards at state and national competitions.',
				latitude: 47.7120,
				longitude: -122.2165,
				adminEmails: ['admin@jhs.edu'],
			},
		}),
		prisma.chapter.create({
			data: {
				slug: 'eastlake-hs',
				name: 'Eastlake High School TSA',
				schoolName: 'Eastlake High School',
				city: 'Sammamish',
				region: 'King County',
				about: 'Located in the heart of Sammamish, our chapter focuses on engineering design, architecture, and digital media. We actively collaborate with neighboring chapters.',
				latitude: 47.6081,
				longitude: -122.0548,
				adminEmails: ['admin@ehs.edu'],
			},
		}),
		prisma.chapter.create({
			data: {
				slug: 'kirkland-ms',
				name: 'Kirkland Middle School TSA',
				schoolName: 'Kirkland Middle School',
				city: 'Kirkland',
				region: 'King County',
				about: 'Introducing middle schoolers to the exciting world of TSA! Our chapter focuses on foundational skills in technology, teamwork, and problem-solving.',
				latitude: 47.6815,
				longitude: -122.2087,
				adminEmails: ['admin@kms.edu'],
			},
		}),
		prisma.chapter.create({
			data: {
				slug: 'einstein-ms',
				name: 'Einstein Middle School TSA',
				schoolName: 'Einstein Middle School',
				city: 'Shoreline',
				region: 'King County',
				about: 'Named after the great physicist, our chapter inspires young minds to explore science and technology. We specialize in STEM exploration and hands-on learning.',
				latitude: 47.7589,
				longitude: -122.3476,
				adminEmails: ['admin@ems.edu'],
			},
		}),
	])

	console.log(`✅ Created ${chapters.length} chapters`)

	// Create test users (password: "password123")
	const hashedPassword = await hashPassword('password123')

	// WTSA Admin
	const wtsaAdmin = await prisma.user.create({
		data: {
			email: 'admin@wtsa.org',
			password: hashedPassword,
			name: 'WTSA Administrator',
			role: UserRole.ADMIN,
			verificationStatus: VerificationStatus.APPROVED,
		},
	})

	// Chapter Admin for Lake Washington
	const lwChapterAdmin = await prisma.user.create({
		data: {
			email: 'admin@lwhs.edu',
			password: hashedPassword,
			name: 'Lake Washington Admin',
			role: UserRole.CHAPTER_ADMIN,
			chapterId: chapters[0].id,
			verificationStatus: VerificationStatus.APPROVED,
		},
	})

	// Chapter Admin for Tesla STEM
	const teslaChapterAdmin = await prisma.user.create({
		data: {
			email: 'admin@teslastem.edu',
			password: hashedPassword,
			name: 'Tesla STEM Admin',
			role: UserRole.CHAPTER_ADMIN,
			chapterId: chapters[1].id,
			verificationStatus: VerificationStatus.APPROVED,
		},
	})

	// Verified student
	const verifiedStudent = await prisma.user.create({
		data: {
			email: 'student@lwhs.edu',
			password: hashedPassword,
			name: 'Varshith Satti',
			role: UserRole.STUDENT,
			chapterId: chapters[0].id,
			verificationStatus: VerificationStatus.APPROVED,
			verifiedById: lwChapterAdmin.id,
			verifiedAt: new Date(),
		},
	})

	// Pending students
	await prisma.user.createMany({
		data: [
			{
				email: 'pending1@lwhs.edu',
				password: hashedPassword,
				name: 'Nick Pending',
				role: UserRole.STUDENT,
				chapterId: chapters[0].id,
				verificationStatus: VerificationStatus.PENDING,
			},
		],
	})

	console.log('✅ Created test users')

	// Create resources
	const resources = await Promise.all([
		prisma.resource.create({
			data: {
				slug: 'chapter-startup-toolkit',
				title: 'Chapter Startup Toolkit',
				summary: 'For new TSA chapters getting started',
				description: 'Comprehensive guide including organizational structure and logistical recommendations.',
				type: 'GUIDE',
				audience: ['Advisors', 'Chapter Officers', 'New Chapters'],
				category: 'Operations',
				tags: ['startup', 'organization'],
				origin: 'WTSA',
				highlighted: true,
				url: 'https://example.com/startup-toolkit',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'leadership-workshop-series',
				title: 'Leadership Workshop Series',
				summary: 'Monthly virtual workshops on leadership skills',
				description: 'WTSA monthly leadership workshops.',
				type: 'WORKSHOP',
				audience: ['Students', 'Chapter Officers'],
				category: 'Leadership',
				tags: ['leadership', 'workshops', 'virtual'],
				origin: 'WTSA',
				highlighted: true,
				url: 'https://example.com/leadership-workshops',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'webmaster-competition-guide',
				title: 'Webmaster Competition Guide',
				summary: 'Guide to do well in the Webmaster event',
				description: 'Detailed breakdown of Webmaster event requirements and tech stack recommendations, from the perspective of past winners.',
				type: 'GUIDE',
				audience: ['Students'],
				category: 'Competition Prep',
				tags: ['webmaster', 'competition', 'web development'],
				origin: 'CHAPTER',
				chapterId: chapters[2].id,
				url: 'https://example.com/webmaster-guide',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'robotics-getting-started',
				title: 'Robotics Getting Started Guide',
				summary: 'Introduction to competitive robotics',
				description: 'Everything you need to know to get started with the VEX V5 framework.',
				type: 'GUIDE',
				audience: ['Students', 'Advisors'],
				category: 'Competition Prep',
				tags: ['robotics', 'VEX', 'programming', 'getting started'],
				origin: 'CHAPTER',
				chapterId: chapters[1].id,
				url: 'https://example.com/robotics-guide',
			},
		}),
	])

	console.log(`✅ Created ${resources.length} resources`)

	// Create events
	const events = await Promise.all([
		prisma.event.create({
			data: {
				slug: 'state-competition-2026',
				title: 'Washington TSA State Competition 2026',
				description: 'The apotheosis of the 2025-2026 competitive year.',
				startDatetime: new Date('2026-04-15T08:00:00'),
				endDatetime: new Date('2026-04-18T17:00:00'),
				type: 'Competition',
				audience: ['Students', 'Advisors'],
				location: 'Spokane Convention Center',
			},
		}),
		prisma.event.create({
			data: {
				slug: 'new-advisor-orientation',
				title: 'New Advisor Orientation',
				description: 'Introduction to TSA for new chapter advisors.',
				startDatetime: new Date('2025-09-05T18:00:00'),
				endDatetime: new Date('2025-09-05T20:00:00'),
				type: 'Training',
				audience: ['Advisors'],
				location: 'Virtual (Google Meet)',
			},
		}),
		prisma.event.create({
			data: {
				slug: 'regional-robotics-meetup',
				title: 'Regional Robotics Meetup',
				description: 'Bring your robots and run practice matches with other chapters in the region.',
				startDatetime: new Date('2026-02-08T10:00:00'),
				endDatetime: new Date('2026-02-08T15:00:00'),
				type: 'Meetup',
				audience: ['Students'],
				location: 'Tesla STEM High School, Redmond',
			},
		}),
	])

	console.log(`✅ Created ${events.length} events`)

	console.log('✅ Created sample suggestion')

	console.log('🎉 Seeding completed successfully!')
	console.log('')
	console.log('📝 Test Accounts:')
	console.log('   WTSA Admin: admin@wtsa.org / password123')
	console.log('   Chapter Admin (LWHS): admin@lwhs.edu / password123')
	console.log('   Chapter Admin (Tesla): admin@teslastem.edu / password123')
	console.log('   Student: student@lwhs.edu / password123')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
