import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Helper to generate realistic UUIDs that match Supabase Auth format
function generateUUID() {
  return '00000000-0000-0000-0000-' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')
}

async function main() {
  console.log('Seeding database with mock workers...')

  const workers = [
    {
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      category: 'Skilled Home Trades',
      subcategory: 'Plumbing',
      gradeTier: 'PLATINUM',
      rating: 4.8,
      vouchCount: 12,
      payRate: 450,
      radius: 15
    },
    {
      name: 'Priya Sharma',
      phone: '+919876543211',
      category: 'Education & Tutoring',
      subcategory: 'Math Tutor',
      gradeTier: 'GOLD',
      rating: 4.5,
      vouchCount: 8,
      payRate: 600,
      radius: 10
    },
    {
      name: 'Amit Patel',
      phone: '+919876543212',
      category: 'Skilled Home Trades',
      subcategory: 'Electrical Repair',
      gradeTier: 'SILVER',
      rating: 4.2,
      vouchCount: 3,
      payRate: 350,
      radius: 20
    },
    {
      name: 'Suresh Verma',
      phone: '+919876543213',
      category: 'Appliance Repair',
      subcategory: 'AC Servicing',
      gradeTier: 'BRONZE',
      rating: 4.9,
      vouchCount: 20,
      payRate: 500,
      radius: 25
    },
    {
      name: 'Anita Desai',
      phone: '+919876543214',
      category: 'Personal Care',
      subcategory: 'Beautician',
      gradeTier: 'PLATINUM',
      rating: 4.7,
      vouchCount: 15,
      payRate: 800,
      radius: 5
    }
  ]

  for (const w of workers) {
    const userId = generateUUID()
    
    // Create Core User
    const user = await prisma.user.create({
      data: {
        id: userId,
        phone: w.phone,
        verificationTier: 'BACKGROUND_CHECKED',
      }
    })

    // Create Worker Profile
    // Using explicit casting to match WorkerGrade enum
    const workerProfile = await prisma.workerProfile.create({
      data: {
        userId: user.id,
        name: w.name,
        cumulativeRating: w.rating,
        ratingCount: Math.floor(Math.random() * 50) + 10,
        vouchCount: w.vouchCount,
        gradeTier: w.gradeTier as any,
        serviceRadiusKm: w.radius,
      }
    })

    // Create Worker Service
    await prisma.workerService.create({
      data: {
        workerId: workerProfile.id,
        category: w.category,
        subcategory: w.subcategory,
        payRate: w.payRate,
        payUnit: 'HOURLY',
        supportsOnline: w.category === 'Education & Tutoring',
        supportsOffline: true
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
