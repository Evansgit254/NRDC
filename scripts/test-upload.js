require('dotenv').config()

async function testUpload() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    console.log('Testing upload with:')
    console.log('Cloud Name:', cloudName)
    console.log('Preset:', uploadPreset)

    if (!cloudName || !uploadPreset) {
        console.error('❌ Missing configuration')
        return
    }

    const formData = new FormData()
    formData.append('file', 'https://res.cloudinary.com/demo/image/upload/sample.jpg')
    formData.append('upload_preset', uploadPreset)

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        const data = await res.json()

        if (res.ok) {
            console.log('✅ Upload Successful!')
            console.log('URL:', data.secure_url)
        } else {
            console.error('❌ Upload Failed')
            console.error('Error:', JSON.stringify(data, null, 2))
        }
    } catch (error) {
        console.error('❌ Network Error:', error)
    }
}

testUpload()
