import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create chapters
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
            },
        }),
        prisma.chapter.create({
            data: {
                slug: 'bellevue-hs',
                name: 'Bellevue High School TSA',
                schoolName: 'Bellevue High School',
                city: 'Bellevue',
                region: 'King County',
                about: 'Our chapter emphasizes community service through technology and has won multiple awards at state and national competitions.',
                focusTags: ['Community Service', 'Innovation', 'Competition', 'Mentorship'],
                latitude: 47.6101,
                longitude: -122.1754,
            },
        }),
        prisma.chapter.create({
            data: {
                slug: 'olympia-hs',
                name: 'Olympia High School TSA',
                schoolName: 'Olympia High School',
                city: 'Olympia',
                region: 'Thurston County',
                about: 'A newer chapter looking to build connections with established programs. We specialize in architectural design and sustainability projects.',
                focusTags: ['Architecture', 'Sustainability', 'Design', 'New Chapter'],
                latitude: 47.0379,
                longitude: -122.9007,
            },
        }),
        prisma.chapter.create({
            data: {
                slug: 'spokane-hs',
                name: 'Spokane Central High School TSA',
                schoolName: 'Spokane Central High School',
                city: 'Spokane',
                region: 'Spokane County',
                about: 'Representing Eastern Washington, we focus on manufacturing, engineering, and practical problem-solving.',
                focusTags: ['Manufacturing', 'Engineering', 'Problem Solving', 'Regional Leadership'],
                latitude: 47.6588,
                longitude: -117.4260,
            },
        }),
        prisma.chapter.create({
            data: {
                slug: 'seattle-prep',
                name: 'Seattle Prep TSA',
                schoolName: 'Seattle Preparatory School',
                city: 'Seattle',
                region: 'King County',
                about: 'Small but mighty chapter focused on biotechnology, research, and collaborative learning.',
                focusTags: ['Biotechnology', 'Research', 'Collaboration'],
                latitude: 47.6414,
                longitude: -122.3193,
            },
        }),
    ]);

    console.log(`✅ Created ${chapters.length} chapters`);

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
                chapterId: chapters[1].id,
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
                chapterId: chapters[2].id,
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
    ]);

    console.log(`✅ Created ${resources.length} resources`);

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
    ]);

    console.log(`✅ Created ${events.length} events`);

    // Create Unity Stories
    const stories = await Promise.all([
        prisma.story.create({
            data: {
                slug: 'cross-chapter-mentorship-success',
                title: 'How Lake Washington and Olympia Built a Lasting Partnership',
                excerpt: 'When Olympia HS started their TSA chapter, they turned to Lake Washington for guidance. Two years later, they\'re competing at nationals together.',
                body: `
When Olympia High School decided to start a TSA chapter in 2023, they faced the typical challenges: limited resources, no competition experience, and uncertainty about where to begin. That's when they reached out through the WTSA Community Hub.

Lake Washington High School, with their 8-year TSA legacy, immediately volunteered to mentor. What started as a few video calls became a full mentorship program.

"They shared everything," says Maya Chen, Olympia's chapter president. "From their competition strategies to their fundraising contacts. They even invited us to practice with them."

The partnership paid off. Olympia placed in three events at their first state competition, and two of their members qualified for nationals. Now, they're paying it forward by mentoring a new chapter in Tacoma.

This is Unity Through Community in action—chapters lifting each other up, creating a stronger TSA network across Washington.
        `,
                chapterLinks: {
                    create: [
                        { chapterId: chapters[0].id },
                        { chapterId: chapters[3].id },
                    ],
                },
            },
        }),
        prisma.story.create({
            data: {
                slug: 'resource-sharing-platform',
                title: 'The Template Library That United Three Chapters',
                excerpt: 'Redmond, Bellevue, and Seattle Prep pooled their resources to create a shared library that now serves chapters statewide.',
                body: `
It started with a simple question in a WTSA meeting: "Why is every chapter recreating the same templates?"

Three chapter officers—one each from Redmond, Bellevue, and Seattle Prep—decided to do something about it. They created a shared Google Drive with meeting agendas, fundraising letters, social media graphics, and competition prep guides.

"We figured if we're all working on the same problems, why not share solutions?" explains Jordan Park from Redmond HS.

The library grew quickly. Soon, other chapters were contributing their best resources. The collection now includes over 50 templates and tools, all freely available through the WTSA Hub.

The real magic? Chapters stopped seeing each other as just competitors. They became collaborators, united by the goal of making every Washington TSA chapter stronger.
        `,
                chapterLinks: {
                    create: [
                        { chapterId: chapters[1].id },
                        { chapterId: chapters[2].id },
                        { chapterId: chapters[5].id },
                    ],
                },
            },
        }),
        prisma.story.create({
            data: {
                slug: 'bridging-east-west-washington',
                title: 'Bridging the Gap: East Meets West',
                excerpt: 'Spokane and Kirkland chapters prove that distance is no barrier to collaboration.',
                body: `
With nearly 300 miles between them, Spokane Central and Lake Washington High Schools don't have much in common geographically. But in TSA, they found common ground.

When Spokane wanted to strengthen their engineering and CAD programs, Lake Washington offered virtual workshops. When Lake Washington needed feedback on manufacturing processes, Spokane's hands-on expertise was invaluable.

"The Hub made it possible," says Alex Rodriguez from Spokane. "We scheduled monthly video sessions, shared screen recordings of our work, and even set up a shared Slack channel."

The collaboration led to both chapters placing higher in engineering events than ever before. More importantly, it broke down the perceived divide between Eastern and Western Washington TSA chapters.

Now, they're working on a joint project for nationals—a first for WTSA.
        `,
                chapterLinks: {
                    create: [
                        { chapterId: chapters[0].id },
                        { chapterId: chapters[4].id },
                    ],
                },
            },
        }),
    ]);

    console.log(`✅ Created ${stories.length} stories`);

    // Create mentor pairs
    const mentorPairs = await Promise.all([
        prisma.mentorPair.create({
            data: {
                mentorChapterId: chapters[0].id, // Lake Washington
                menteeChapterId: chapters[3].id, // Olympia
                status: 'ACTIVE',
                notes: 'Focused on competition prep and chapter organization',
            },
        }),
        prisma.mentorPair.create({
            data: {
                mentorChapterId: chapters[1].id, // Redmond
                menteeChapterId: chapters[5].id, // Seattle Prep
                status: 'ACTIVE',
                notes: 'Software development and webmaster mentorship',
            },
        }),
    ]);

    console.log(`✅ Created ${mentorPairs.length} mentor pairs`);

    // Create some suggestions
    await prisma.suggestion.create({
        data: {
            resourceName: '3D Printing Guide',
            description: 'Comprehensive guide for setting up and maintaining a 3D printing lab',
            url: 'https://example.com/3d-printing',
            audience: 'Advisors, Students',
            category: 'Manufacturing',
            chapterName: 'Bellevue High School',
            email: 'advisor@example.com',
            status: 'PENDING',
        },
    });

    console.log('✅ Created sample suggestion');

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
