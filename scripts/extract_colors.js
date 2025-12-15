const sharp = require('sharp');

const imagePath = '/home/evans/.gemini/antigravity/brain/089b0543-d92f-41d3-9986-e6b15dda4eda/uploaded_image_1765126315517.jpg';

async function getColors() {
    try {
        const image = sharp(imagePath);
        const { width, height } = await image.metadata();

        // Logo is usually at the very top. Let's process the top 15% of the image.
        const logoHeight = Math.floor(height * 0.15);
        
        const buffer = await image
            .extract({ left: 0, top: 0, width: width, height: logoHeight })
            .raw()
            .toBuffer();

        const colorCounts = {};

        // Iterate through pixels
        for (let i = 0; i < buffer.length; i += 3) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];

            // Filter out white/grey/black background pixels (very light or very dark or neutral)
            // Neutral check: small difference between R, G, B
            if (isGrayscale(r, g, b)) continue;
            
            // Brightness check: ignore very light pixels (likely background)
            if (r > 230 && g > 230 && b > 230) continue;

            // Quantize colors to group similar shades (round to nearest 10)
            const rQ = Math.round(r / 10) * 10;
            const gQ = Math.round(g / 10) * 10;
            const bQ = Math.round(b / 10) * 10;

            const key = `${rQ},${gQ},${bQ}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Sort by frequency
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Get top 5 non-background colors

        console.log('Top Logo Colors:');
        sortedColors.forEach(([rgb, count]) => {
            const [r, g, b] = rgb.split(',').map(Number);
            console.log(`Hex: ${RGBToHex(r, g, b)} (Count: ${count})`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

function isGrayscale(r, g, b) {
    const threshold = 15;
    return Math.abs(r - g) < threshold && Math.abs(g - b) < threshold;
}

function RGBToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

getColors();
