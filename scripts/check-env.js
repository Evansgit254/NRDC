require('dotenv').config()

console.log('Checking Cloudinary Config:')
console.log('CLOUD_NAME:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'DEFINED' : 'MISSING')
console.log('UPLOAD_PRESET:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? 'DEFINED' : 'MISSING')
