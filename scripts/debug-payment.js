const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("=== LATEST DONATIONS ===")
    const donations = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: false // Just basic info
      }
    })
    
    if (donations.length === 0) {
        console.log("No donations found.")
    } else {
        donations.forEach(d => {
           console.log(`[${d.createdAt.toISOString()}] ID: ${d.id}`)
           console.log(`   Amount: ${d.amount} ${d.currency}`)
           console.log(`   Status: ${d.paymentStatus}`)
           console.log(`   Method: ${d.paymentMethod}`)
           console.log(`   Ref: ${d.reference}`)
           console.log(`   MChanga ID: ${d.mchangaCheckoutId}`)
           console.log("--------------------------------")
        })
    }

    console.log("\n=== LATEST ERROR LOGS ===")
    const errors = await prisma.errorLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    
    if (errors.length === 0) {
        console.log("No error logs found.")
    } else {
        errors.forEach(e => {
            console.log(`[${e.createdAt.toISOString()}] ${e.message}`)
            console.log(`   Path: ${e.path}`)
            console.log("--------------------------------")
        })
    }

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
