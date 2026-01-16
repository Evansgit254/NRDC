/**
 * NRDC Production Validation Script
 * Run this script to verify that your environment is ready for production.
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_APP_URL',
    'MCHANGA_PAYBILL',
    'MCHANGA_API_KEY',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'RESEND_API_KEY',
    'JWT_SECRET'
];

function checkEnv() {
    console.log('🚀 Starting NRDC Production Check...\n');
    let missingCount = 0;

    requiredEnvVars.forEach(envVar => {
        const value = process.env[envVar];
        if (!value || value.includes('your_') || value.includes('...') || value === 'your_paybill_id') {
            console.error(`❌ MISSING/INVALID: ${envVar}`);
            missingCount++;
        } else {
            console.log(`✅ OK: ${envVar}`);
        }
    });

    if (missingCount > 0) {
        console.error(`\n⚠️  Found ${missingCount} issues. Please fix them before deploying.`);
    } else {
        console.log('\n✨ All critical production variables are set correctly!');
    }
}

checkEnv();
