import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting Official Email update (non-destructive)...')

    const newEmail = 'nrdcofficial12@gmail.com';

    // Update SiteContent with key 'contact_email'
    const updatedContent = await prisma.siteContent.updateMany({
        where: { key: 'contact_email' },
        data: { value: newEmail }
    });

    console.log(`Updated ${updatedContent.count} SiteContent records.`);

    // Also update any translations for contact_email if they exist in the DB
    // Usually email isn't translated, but good to check.
    const contactEmailContent = await prisma.siteContent.findUnique({
        where: { key: 'contact_email' }
    });

    if (contactEmailContent) {
        const updatedTranslations = await prisma.siteContentTranslation.updateMany({
            where: { siteContentId: contactEmailContent.id },
            data: { value: newEmail }
        });
        console.log(`Updated ${updatedTranslations.count} SiteContentTranslation records.`);
    }

    console.log('Official Email update completed successfully.');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
