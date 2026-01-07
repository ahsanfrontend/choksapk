import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function processAndBrandedImage(imageUrl: string, brandText: string = 'ear-apk.com'): Promise<string> {
    try {
        // 1. Download image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const inputBuffer = Buffer.from(response.data);

        // 2. Get image metadata
        const metadata = await sharp(inputBuffer).metadata();
        const width = metadata.width || 800;
        const height = metadata.height || 600;

        // 3. Create SVG watermark
        const svgWatermark = `
            <svg width="${width}" height="${height}">
                <style>
                    .brand { 
                        fill: white; 
                        fill-opacity: 0.6; 
                        font-family: 'Inter', sans-serif; 
                        font-weight: 900; 
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .shadow {
                        fill: black;
                        fill-opacity: 0.3;
                    }
                </style>
                <!-- Bottom Right Watermark -->
                <text x="${width - 20}" y="${height - 20}" text-anchor="end" font-size="${Math.max(12, Math.floor(width / 30))}px" class="shadow">${brandText}</text>
                <text x="${width - 22}" y="${height - 22}" text-anchor="end" font-size="${Math.max(12, Math.floor(width / 30))}px" class="brand">${brandText}</text>
                
                <!-- Center Watermark (Optional, subtle) -->
                <text x="50%" y="50%" text-anchor="middle" font-size="${Math.max(20, Math.floor(width / 15))}px" class="brand" fill-opacity="0.1" transform="rotate(-30 ${width / 2} ${height / 2})">${brandText}</text>
            </svg>
        `;

        // 4. Composite
        const brandedBuffer = await sharp(inputBuffer)
            .composite([
                {
                    input: Buffer.from(svgWatermark),
                    top: 0,
                    left: 0,
                }
            ])
            .toFormat('webp')
            .toBuffer();

        // 5. Save to disk
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'branded');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, brandedBuffer);

        return `/uploads/branded/${fileName}`;
    } catch (error) {
        console.error('Image Branding Error:', error);
        return imageUrl; // Fallback to original
    }
}
