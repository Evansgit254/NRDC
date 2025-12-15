const sharp = require('sharp');
const path = require('path');

async function removeWhiteBackground() {
    const inputPath = path.join(__dirname, 'public/images/nrdc-logo.png');
    const outputPath = path.join(__dirname, 'public/images/nrdc-logo-transparent.png');

    try {
        await sharp(inputPath)
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .negate({ alpha: false })
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .negate({ alpha: false })
            .removeAlpha()
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
                    if (r > 240 && g > 240 && b > 240) {
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
        console.log('Output:', outputPath);
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

removeWhiteBackground();
