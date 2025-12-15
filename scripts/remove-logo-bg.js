const sharp = require('sharp');
const path = require('path');

async function removeWhiteBackground() {
    const inputPath = path.join(__dirname, '../public/images/nrdc-logo-with-bg.png');
    const outputPath = path.join(__dirname, '../public/images/nrdc-logo-no-bg.png');

    try {
        await sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const pixels = new Uint8ClampedArray(data);
                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];

                    // If pixel is white or very close to white, make it transparent
                    // Adjusted threshold to be more aggressive
                    if (r > 235 && g > 235 && b > 235) {
                        pixels[i + 3] = 0; // Set alpha to 0 (transparent)
                    }
                }

                return sharp(Buffer.from(pixels), {
                    raw: {
                        width: info.width,
                        height: info.height,
                        channels: 4
                    }
                })
                    .png()
                    .toFile(outputPath);
            });

        console.log('✅ Transparent logo created successfully!');
        console.log('Input:', inputPath);
        console.log('Output:', outputPath);
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

removeWhiteBackground();
