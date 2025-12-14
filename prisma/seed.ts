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
				focusTags: ['Robotics', 'Engineering', 'Leadership', 'CAD'],
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
				focusTags: ['STEM', 'Innovation', 'Computer Science', 'Robotics'],
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
				focusTags: ['Software Development', 'Webmaster', 'Game Design', 'STEM'],
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
				focusTags: ['Community Service', 'Innovation', 'Competition', 'Mentorship'],
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
				focusTags: ['Engineering Design', 'Architecture', 'Digital Media', 'Collaboration'],
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
				focusTags: ['Middle School', 'Foundations', 'Teamwork', 'Problem Solving'],
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
				focusTags: ['Middle School', 'STEM Exploration', 'Hands-on Learning', 'Science'],
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
			name: 'Alex Student',
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
				name: 'Jordan Pending',
				role: UserRole.STUDENT,
				chapterId: chapters[0].id,
				verificationStatus: VerificationStatus.PENDING,
			},
			{
				email: 'pending2@lwhs.edu',
				password: hashedPassword,
				name: 'Taylor Waiting',
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
				summary: 'Everything you need to start or revitalize a TSA chapter',
				description: 'Comprehensive guide including recruitment strategies, organizational structure, meeting templates, and first-year competition recommendations. Perfect for new advisors and student officers.',
				type: 'GUIDE',
				audience: ['Advisors', 'Chapter Officers', 'New Chapters'],
				category: 'Operations',
				tags: ['startup', 'recruitment', 'organization'],
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
				description: 'Join WTSA leaders for monthly workshops covering communication, team management, conflict resolution, and more. Open to all chapter officers and aspiring leaders.',
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
				slug: 'fundraising-playbook',
				title: 'Fundraising Playbook',
				summary: 'Proven fundraising strategies from successful chapters',
				description: 'Collection of fundraising ideas, grant templates, and sponsor outreach strategies that have worked for WTSA chapters. Includes case studies and budget templates.',
				type: 'GUIDE',
				audience: ['Advisors', 'Chapter Officers'],
				category: 'Operations',
				tags: ['fundraising', 'grants', 'sponsors'],
				origin: 'CHAPTER',
				chapterId: chapters[0].id,
				highlighted: true,
				url: 'https://example.com/fundraising',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'webmaster-competition-guide',
				title: 'Webmaster Competition Guide',
				summary: 'Step-by-step guide for the Webmaster event',
				description: 'Detailed breakdown of Webmaster event requirements, judging criteria, technology recommendations, and portfolio tips from past winners.',
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
				slug: 'cad-tutorial-videos',
				title: 'CAD Tutorial Video Series',
				summary: '10-part video series on SolidWorks and Fusion 360',
				description: 'Beginner to intermediate CAD tutorials covering basic modeling, assemblies, and engineering drawings. Created by student members for student members.',
				type: 'VIDEO',
				audience: ['Students'],
				category: 'Competition Prep',
				tags: ['CAD', 'SolidWorks', 'Fusion360', 'tutorials'],
				origin: 'CHAPTER',
				chapterId: chapters[0].id,
				url: 'https://example.com/cad-tutorials',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'state-competition-prep',
				title: 'Washington State Competition Prep Sessions',
				summary: 'In-person prep sessions before state competition',
				description: 'Regional meetups organized by WTSA to help chapters prepare for state competition. Includes practice rounds, feedback sessions, and networking.',
				type: 'EVENT',
				audience: ['Students', 'Advisors'],
				category: 'Competition Prep',
				tags: ['state competition', 'practice', 'networking'],
				origin: 'WTSA',
				url: 'https://example.com/state-prep',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'chapter-marketing-templates',
				title: 'Chapter Marketing Templates',
				summary: 'Social media and poster templates for promotion',
				description: 'Ready-to-use Canva templates for Instagram, flyers, and chapter announcements. Includes WTSA branding guidelines.',
				type: 'TEMPLATE',
				audience: ['Students', 'Chapter Officers'],
				category: 'Marketing',
				tags: ['marketing', 'social media', 'templates', 'branding'],
				origin: 'CHAPTER',
				chapterId: chapters[3].id,
				url: 'https://example.com/marketing-templates',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'community-service-projects',
				title: 'Community Service Project Ideas',
				summary: 'Technology-focused community service opportunities',
				description: 'List of community service projects that chapters can adapt, from teaching coding to elementary students to recycling electronics.',
				type: 'GUIDE',
				audience: ['Students', 'Advisors'],
				category: 'Community Service',
				tags: ['community service', 'outreach', 'STEM education'],
				origin: 'WTSA',
				url: 'https://example.com/service-projects',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'robotics-getting-started',
				title: 'Robotics Getting Started Guide',
				summary: 'Introduction to competitive robotics for TSA',
				description: 'Everything you need to know to start a robotics program at your chapter. Covers equipment, programming basics, and competition preparation.',
				type: 'GUIDE',
				audience: ['Students', 'Advisors'],
				category: 'Competition Prep',
				tags: ['robotics', 'VEX', 'programming', 'getting started'],
				origin: 'CHAPTER',
				chapterId: chapters[1].id,
				url: 'https://example.com/robotics-guide',
			},
		}),
		prisma.resource.create({
			data: {
				slug: 'middle-school-tsa-handbook',
				title: 'Middle School TSA Handbook',
				summary: 'Comprehensive guide for middle school chapters',
				description: 'Tailored resources and competition tips specifically for middle school TSA chapters. Includes age-appropriate project ideas and mentorship guidance.',
				type: 'GUIDE',
				audience: ['Middle School Students', 'Advisors'],
				category: 'Operations',
				tags: ['middle school', 'handbook', 'getting started'],
				origin: 'CHAPTER',
				chapterId: chapters[5].id,
				url: 'https://example.com/ms-handbook',
			},
		}),
	])

	console.log(`✅ Created ${resources.length} resources`)

	// Create events
	const events = await Promise.all([
		prisma.event.create({
			data: {
				slug: 'fall-leadership-conference',
				title: 'Fall Leadership Conference',
				description: 'Annual conference bringing together chapter leaders from across Washington for workshops, networking, and team building.',
				startDatetime: new Date('2025-10-15T09:00:00'),
				endDatetime: new Date('2025-10-15T16:00:00'),
				type: 'Conference',
				audience: ['Chapter Officers', 'Advisors'],
				location: 'University of Washington, Seattle',
			},
		}),
		prisma.event.create({
			data: {
				slug: 'state-competition-2026',
				title: 'Washington TSA State Competition 2026',
				description: 'The premier event for Washington TSA chapters. Compete, connect, and celebrate excellence in technology and leadership.',
				startDatetime: new Date('2026-03-20T08:00:00'),
				endDatetime: new Date('2026-03-22T17:00:00'),
				type: 'Competition',
				audience: ['Students', 'Advisors'],
				location: 'Tacoma Convention Center',
			},
		}),
		prisma.event.create({
			data: {
				slug: 'winter-webmaster-workshop',
				title: 'Winter Webmaster Workshop',
				description: 'Virtual workshop covering modern web development, competition strategies, and portfolio building for the Webmaster event.',
				startDatetime: new Date('2026-01-10T14:00:00'),
				endDatetime: new Date('2026-01-10T16:00:00'),
				type: 'Workshop',
				audience: ['Students'],
				location: 'Virtual (Zoom)',
			},
		}),
		prisma.event.create({
			data: {
				slug: 'new-advisor-orientation',
				title: 'New Advisor Orientation',
				description: 'Introduction to TSA for new chapter advisors covering rules, competition events, resources, and support systems.',
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
				description: 'Bring your robots and meet other chapters! Practice sessions, friendly scrimmages, and technical workshops.',
				startDatetime: new Date('2026-02-08T10:00:00'),
				endDatetime: new Date('2026-02-08T15:00:00'),
				type: 'Meetup',
				audience: ['Students'],
				location: 'Tesla STEM High School, Redmond',
			},
		}),
	])

	console.log(`✅ Created ${events.length} events`)

	// Create mentor pairs
	const mentorPairs = await Promise.all([
		prisma.mentorPair.create({
			data: {
				mentorChapterId: chapters[0].id, // Lake Washington
				menteeChapterId: chapters[5].id, // Kirkland MS
				status: 'ACTIVE',
				notes: 'High school mentoring middle school on competition prep and chapter organization',
			},
		}),
		prisma.mentorPair.create({
			data: {
				mentorChapterId: chapters[1].id, // Tesla STEM
				menteeChapterId: chapters[6].id, // Einstein MS
				status: 'ACTIVE',
				notes: 'STEM-focused mentorship for robotics and coding events',
			},
		}),
		prisma.mentorPair.create({
			data: {
				mentorChapterId: chapters[2].id, // Redmond HS
				menteeChapterId: chapters[3].id, // Juanita HS
				status: 'ACTIVE',
				notes: 'Collaboration on webmaster and software development events',
			},
		}),
	])

	console.log(`✅ Created ${mentorPairs.length} mentor pairs`)

	// Create some suggestions
	await prisma.suggestion.create({
		data: {
			resourceName: '3D Printing Guide',
			description: 'Comprehensive guide for setting up and maintaining a 3D printing lab',
			url: 'https://example.com/3d-printing',
			audience: 'Advisors, Students',
			category: 'Manufacturing',
			chapterName: 'Juanita High School',
			email: 'advisor@example.com',
			status: 'PENDING',
		},
	})

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
