require('dotenv').config()

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SITE_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'NEXTAUTH_SECRET',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
]

console.log('--- Environment Variable Audit ---')
let missingCount = 0

requiredEnvVars.forEach(envVar => {
    const isDefined = !!process.env[envVar]
    if (!isDefined) {
        console.error(`❌ MISSING: ${envVar}`)
        missingCount++
    } else {
        // Mask sensitive values
        const value = process.env[envVar]
        const masked = value.length > 8 ? value.substring(0, 4) + '...' + value.substring(value.length - 4) : '********'
        console.log(`✅ DEFINED: ${envVar} (${masked})`)
    }
})

console.log('---------------------------------')
if (missingCount > 0) {
    console.error(`Total Missing: ${missingCount}`)
    process.exit(1)
} else {
    console.log('All critical environment variables are defined.')
    process.exit(0)
}
