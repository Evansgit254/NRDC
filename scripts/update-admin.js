require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    const args = process.argv.slice(2);

    // Help message
    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
        console.log(`
Admin Credential Management Tool
-------------------------------
Usage:
  node scripts/update-admin.js <new_email> <new_password> [old_email]

Arguments:
  new_email      The new email address for the admin
  new_password   The new password for the admin
  old_email      (Optional) The current email of the admin to update. Defaults to 'admin@nrdc.org'.

Example:
  node scripts/update-admin.js info@nrdc.africa SuperSecurePassword123 admin@nrdc.org
        `);
        return;
    }

    const newEmail = args[0];
    const newPassword = args[1];
    const oldEmail = args[2] || 'admin@nrdc.org';

    if (!newEmail || !newPassword) {
        console.error('❌ Missing arguments. Run with --help for usage.');
        process.exit(1);
    }

    console.log(`🔍 Searching for admin with email: ${oldEmail}...`);

    const existingUser = await prisma.user.findUnique({
        where: { email: oldEmail }
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (existingUser) {
        console.log(`✅ Found existing admin. Updating to ${newEmail}...`);
        await prisma.user.update({
            where: { email: oldEmail },
            data: {
                email: newEmail,
                password: hashedPassword
            }
        });
        console.log('✨ Admin credentials updated successfully.');
    } else {
        console.log(`⚠️ Admin ${oldEmail} not found. Creating new admin with email ${newEmail}...`);
        await prisma.user.create({
            data: {
                email: newEmail,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        });
        console.log('✨ New admin created successfully.');
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
