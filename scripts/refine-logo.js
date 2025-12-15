const sharp = require('sharp');
const path = require('path');

async function refineLogo() {
    const inputPath = path.join(__dirname, '../public/images/nrdc-logo-with-bg.png');
    const outputPath = path.join(__dirname, '../public/images/nrdc-logo-v3.png');

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const width = info.width;
        const height = info.height;
        const pixels = new Uint8ClampedArray(data);

        // Bounding box variables
        let minX = width;
        let minY = height;
        let maxX = 0;
        let maxY = 0;

        // Define a safe margin to ignore UI elements on edges (e.g., 10% from each side)
        const marginX = Math.floor(width * 0.15);
        const marginY = Math.floor(height * 0.15);

        // Scan the central area for logo pixels
        for (let y = marginY; y < height - marginY; y++) {
            for (let x = marginX; x < width - marginX; x++) {
                const i = (y * width + x) * 4;
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                // Check if pixel is NOT white (or close to white)
                // This detects the logo content
                if (r < 240 || g < 240 || b < 240) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // Add some padding to the bounding box
        const padding = 20;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(width, maxX + padding);
        maxY = Math.min(height, maxY + padding);

        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;

        console.log(`Cropping to: x=${minX}, y=${minY}, w=${cropWidth}, h=${cropHeight}`);

        if (cropWidth <= 0 || cropHeight <= 0) {
            throw new Error('Could not detect logo content in the center area.');
        }

        // Process: Crop -> Remove Background
        await sharp(inputPath)
            .extract({ left: minX, top: minY, width: cropWidth, height: cropHeight })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const croppedPixels = new Uint8ClampedArray(data);
                for (let i = 0; i < croppedPixels.length; i += 4) {
                    const r = croppedPixels[i];
                    const g = croppedPixels[i + 1];
                    const b = croppedPixels[i + 2];

                    // Remove white background
                    if (r > 230 && g > 230 && b > 230) {
                        croppedPixels[i + 3] = 0; // Transparent
                    }
                }

                return sharp(Buffer.from(croppedPixels), {
                    raw: {
                        width: info.width,
                        height: info.height,
                        channels: 4
                    }
                })
                    .png()
                    .toFile(outputPath);
            });

        console.log('✅ Logo refined successfully (Cropped & Cleaned)!');
        console.log('Output:', outputPath);

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

refineLogo();
