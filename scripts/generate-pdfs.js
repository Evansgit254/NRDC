const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { chromium } = require('@playwright/test');

async function mdToPdf(mdPath, pdfPath, title) {
    console.log(`Converting ${mdPath} to ${pdfPath}...`);

    // Read Markdown
    const markdown = fs.readFileSync(mdPath, 'utf-8');

    // Convert to HTML
    const htmlContent = await marked.parse(markdown);

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        h1 { color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 10px; }
        h2 { color: #2E8B57; margin-top: 30px; }
        h3 { color: #444; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 4px solid #2E8B57; padding-left: 20px; font-style: italic; color: #555; background: #f9f9f9; margin: 20px 0; padding-top: 10px; padding-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    // Launch browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set content and wait for it to load
    await page.setContent(fullHtml);

    // Generate PDF
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
        printBackground: true
    });

    await browser.close();
    console.log(`✅ Converted ${path.basename(mdPath)} to PDF.`);
}

const artifactsDir = '/home/evans/.gemini/antigravity/brain/5a5f4403-af98-4a6b-a754-969875ac6f14';

async function main() {
    try {
        await mdToPdf(
            path.join(artifactsDir, 'technical_spec_sheet.md'),
            path.join(artifactsDir, 'Technical_Spec_Sheet_NRDC.pdf'),
            'Technical Specification: NRDC'
        );
        await mdToPdf(
            path.join(artifactsDir, 'meeting_prep_brief.md'),
            path.join(artifactsDir, 'Meeting_Prep_Brief_NRDC.pdf'),
            'Meeting Preparation Guide: NRDC'
        );
        await mdToPdf(
            path.join(artifactsDir, 'draft_bank_response.md'),
            path.join(artifactsDir, 'Draft_Bank_Response_NRDC.pdf'),
            'Draft Bank Response: NRDC'
        );
        await mdToPdf(
            path.join(artifactsDir, 'technical_implementation_brief.md'),
            path.join(artifactsDir, 'Technical_Implementation_Proof_NRDC.pdf'),
            'Technical Implementation Proof: NRDC'
        );
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

main();
