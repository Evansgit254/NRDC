const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database with sample content...')

    // Create additional sample programs
    const programs = [
        {
            title: 'Emergency Food Distribution',
            slug: 'emergency-food-distribution',
            description: 'Our Emergency Food Distribution program provides immediate nutritional support to displaced communities facing food insecurity. We work with local partners to deliver culturally appropriate food packages containing essential nutrients, grains, proteins, and fresh produce. Each package is designed to sustain a family of five for up to two weeks.',
            objectives: JSON.stringify([
                'Provide nutritious meals to 5,000 displaced families monthly',
                'Distribute emergency food packages within 48 hours of displacement',
                'Establish community feeding centers in 12 refugee camps',
                'Partner with local farmers for fresh produce supply',
                'Monitor nutritional outcomes and adjust distributions accordingly'
            ]),
            metrics: JSON.stringify({
                'families_served': '5,000+',
                'locations': '12 camps',
                'response_time': '48 hours',
                'success_rate': '95%'
            }),
            photos: JSON.stringify([
                'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800'
            ])
        },
        {
            title: 'Nutrition Education & Training',
            slug: 'nutrition-education-training',
            description: 'Empowering communities through knowledge is at the heart of sustainable change. Our Nutrition Education program trains community health workers and mothers on proper nutrition, food preparation, and hygiene practices. We provide hands-on cooking demonstrations, nutritional counseling, and educational materials in local languages.',
            objectives: JSON.stringify([
                'Train 500 community health workers annually',
                'Conduct monthly nutrition workshops for mothers',
                'Distribute educational materials in 5 local languages',
                'Establish mother-to-mother support groups',
                'Monitor child growth and development indicators'
            ]),
            metrics: JSON.stringify({
                'workers_trained': '500+',
                'workshops_monthly': '24',
                'languages': '5',
                'malnutrition_reduction': '40%'
            }),
            photos: JSON.stringify([
                'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'
            ])
        },
        {
            title: 'Mobile Healthcare Services',
            slug: 'mobile-healthcare-services',
            description: 'Access to quality healthcare is a basic human right. Our Mobile Healthcare program brings medical services directly to refugee camps and displacement sites. Our team of doctors, nurses, and nutritionists provide health screenings, treat malnutrition, and offer maternal and child health services. We also manage vaccination campaigns and health education.',
            objectives: JSON.stringify([
                'Provide mobile clinics to 15 displacement sites',
                'Screen 10,000 children for malnutrition quarterly',
                'Deliver maternal and child health services',
                'Conduct vaccination campaigns for preventable diseases',
                'Offer mental health and psychosocial support'
            ]),
            metrics: JSON.stringify({
                'clinics': '15',
                'children_screened': '10,000',
                'vaccinations': '15,000+',
                'consultations_monthly': '3,000'
            }),
            photos: JSON.stringify([
                'https://images.unsplash.com/photo-1584820927498-cfe5bae427d2?w=800'
            ])
        },
        {
            title: 'Water & Sanitation',
            slug: 'water-sanitation',
            description: 'Clean water and proper sanitation are fundamental to preventing disease and malnutrition. We install water points, build latrines, and promote hygiene practices in displacement camps. Our WASH (Water, Sanitation, and Hygiene) program ensures that communities have access to safe drinking water and maintain healthy living environments.',
            objectives: JSON.stringify([
                'Install 50 water points in refugee camps',
                'Construct 200 family latrines',
                'Train hygiene promoters in each camp',
                'Distribute hygiene kits to 2,000 families',
                'Monitor water quality weekly'
            ]),
            metrics: JSON.stringify({
                'water_points': '50',
                'latrines_built': '200',
                'hygiene_kits': '2,000',
                'water_access': '85%'
            }),
            photos: JSON.stringify([
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
            ])
        }
    ]

    console.log('Creating programs...')
    for (const program of programs) {
        await prisma.program.create({ data: program })
    }

    // Create sample blog posts
    const blogPosts = [
        {
            title: 'NRDC Celebrates 5 Years of Service to Displaced Communities',
            slug: 'nrdc-5-years-anniversary',
            content: `Five years ago, NRDC was founded with a simple but powerful mission: to provide nutrition and hope to refugee and displaced communities. Today, we celebrate this milestone by looking back at our journey and forward to the impact we will continue to make.

**Our Journey**

Since 2020, we have grown from a small team of passionate volunteers to a full-fledged organization operating in 12 refugee camps across the region. We have served over 50,000 families, distributed millions of meals, and trained hundreds of community health workers.

**Impact by the Numbers**
- 50,000+ families served
- 5 million+ meals distributed
- 500+ health workers trained
- 12 active program locations
- 95% beneficiary satisfaction rate

**Looking Forward**

As we enter our sixth year, we are more committed than ever to our mission. With your continued support, we plan to expand to 5 new locations, launch a youth nutrition program, and increase our emergency response capacity.

Thank you to all our donors, partners, volunteers, and most importantly, the communities we serve. Together, we are making a difference.`,
            excerpt: 'Join us in celebrating five years of providing nutrition and hope to displaced communities. A look back at our journey and the impact we have made together.',
            category: 'News',
            tags: 'anniversary, impact, milestone, celebration',
            published: true,
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'
        },
        {
            title: 'New Mobile Clinic Brings Healthcare to Remote Camps',
            slug: 'new-mobile-clinic-launch',
            content: `We are excited to announce the launch of our latest mobile health clinic, bringing essential medical services to three remote displacement camps that previously had limited access to healthcare.

**The Need**

Many displacement camps are located in areas with minimal healthcare infrastructure. Families often have to travel long distances to access basic medical services, which can be especially challenging for mothers with young children or those dealing with malnutrition.

**Our Solution**

Our new mobile clinic is equipped with:
- Medical examination facilities
- Vaccination capabilities
- Nutritional screening tools
- Maternal and child health services
- Basic laboratory equipment

The clinic operates on a rotating schedule, visiting each camp twice weekly and providing consultations, screenings, and treatments.

**Impact So Far**

In just the first month of operation:
- 1,200+ consultations provided
- 450 children screened for malnutrition
- 300 vaccinations administered
- 50 pregnant mothers received prenatal care

**What's Next**

Based on the overwhelming demand and positive outcomes, we are already planning to add a second mobile clinic to reach even more communities in need.`,
            excerpt: 'Our newest mobile health clinic is bringing essential medical services to remote displacement camps, making healthcare accessible to families who need it most.',
            category: 'Programs',
            tags: 'healthcare, mobile clinic, access, innovation',
            published: true,
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
        },
        {
            title: 'Success Story: Amina\'s Journey to Health',
            slug: 'success-story-amina',
            content: `When Amina arrived at the displacement camp six months ago with her three children, she was exhausted, worried, and her youngest child showed signs of severe malnutrition. Today, her family's story is one of resilience, hope, and the power of nutrition support.

**The Beginning**

"When we first arrived, I didn't know where to turn," Amina recalls. "My youngest, Hassan, was so weak and underweight. I was scared."

Through our emergency food distribution program, Amina's family received immediate nutritional support. Hassan was enrolled in our therapeutic feeding program, which provides specialized nutrition for severely malnourished children.

**The Transformation**

Over the following months:
- Hassan received daily therapeutic meals
- Amina attended our nutrition education workshops
- The family received regular food distributions
- Community health workers monitored Hassan's progress

"I learned so much about nutrition and how to prepare healthy meals with what we have," Amina says. "The health workers visited us every week and taught me how to care for my children better."

**Today**

Hassan has made a full recovery. He has gained healthy weight, his energy has returned, and he plays with other children in the camp. Amina has become a peer educator, sharing what she learned with other mothers in the camp.

"NRDC didn't just feed my child - they gave me knowledge and hope," Amina reflects. "Now I can help other mothers going through what I experienced."

**The Bigger Picture**

Amina's story represents thousands of families we serve. It illustrates that sustainable impact comes not just from providing food, but from empowering communities with knowledge and support systems.`,
            excerpt: 'Meet Amina and her youngest son Hassan, whose journey from severe malnutrition to full health demonstrates the life-changing impact of nutrition support and education.',
            category: 'Success Stories',
            tags: 'success story, testimonial, impact, transformation',
            published: true,
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'
        },
        {
            title: 'Partnerships for Greater Impact: Working Together',
            slug: 'partnerships-collaboration',
            content: `At NRDC, we believe that lasting change requires collaboration. We are proud to work alongside local communities, international organizations, and government agencies to maximize our impact.

**Our Partnership Approach**

We don't work in silos. Every program we implement involves collaboration with:
- Local community leaders
- Other humanitarian organizations
- Government health departments
- Local farmers and suppliers
- International donors

**Current Partnerships**

This year alone, we have:
- Partnered with 15 local organizations
- Collaborated with 3 international NGOs
- Worked with government health departments in 4 regions
- Engaged 50+ local suppliers and farmers

**Case Study: Farmer Partnership Program**

One of our most successful initiatives has been partnering with local farmers to supply fresh produce for our food distributions. This approach:
- Supports local economies
- Provides fresher, more nutritious food
- Reduces transportation costs
- Creates sustainable supply chains

**Looking Ahead**

We are actively seeking new partnerships with organizations that share our values and commitment to serving displaced communities. Together, we can do more.`,
            excerpt: 'Collaboration amplifies impact. Learn about NRDC\'s partnership approach and how working together creates sustainable solutions for displaced communities.',
            category: 'Updates',
            tags: 'partnerships, collaboration, community, sustainability',
            published: true,
            image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800'
        }
    ]

    console.log('Creating blog posts...')
    for (const post of blogPosts) {
        await prisma.blogPost.create({ data: post })
    }

    // Create sample gallery images
    const galleryImages = [
        {
            url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
            caption: 'Community members receiving food distribution packages',
            category: 'Programs'
        },
        {
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
            caption: 'Nutrition education workshop for mothers',
            category: 'Programs'
        },
        {
            url: 'https://images.unsplash.com/photo-1584820927498-cfe5bae427d2?w=800',
            caption: 'Mobile health clinic providing medical care',
            category: 'Programs'
        },
        {
            url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
            caption: 'Mothers and children at community center',
            category: 'Community'
        },
        {
            url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
            caption: 'New water point installation in refugee camp',
            category: 'Programs'
        },
        {
            url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
            caption: 'Community celebration event',
            category: 'Events'
        },
        {
            url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
            caption: 'Healthcare workers in mobile clinic',
            category: 'Programs'
        },
        {
            url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800',
            caption: 'Team meeting with community leaders',
            category: 'Community'
        }
    ]

    console.log('Creating gallery images...')
    for (const image of galleryImages) {
        await prisma.galleryImage.create({ data: image })
    }

    console.log('✅ Database seeded successfully!')
    console.log(`
Created:
- ${programs.length} programs
- ${blogPosts.length} blog posts
- ${galleryImages.length} gallery images
  `)
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
