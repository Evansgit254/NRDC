const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { chromium } = require('@playwright/test');

async function mdToPdf(mdPath, pdfPath, title) {
    if (!fs.existsSync(mdPath)) {
        console.error(`Error: ${mdPath} does not exist.`);
        return;
    }
    console.log(`Converting ${mdPath} to ${pdfPath}...`);

    const markdown = fs.readFileSync(mdPath, 'utf-8');
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
        h1 { color: #6E8C82; border-bottom: 2px solid #6E8C82; padding-bottom: 10px; }
        h2 { color: #6E8C82; margin-top: 30px; }
        h3 { color: #444; }
        p { margin-bottom: 15px; }
        ul { margin-bottom: 15px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(fullHtml);
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
        printBackground: true
    });

    await browser.close();
    console.log(`✅ Converted ${path.basename(mdPath)} to PDF.`);
}

async function main() {
    const docsDir = path.join(__dirname, '../public/docs');
    const docs = [
        { md: 'strategic-plan-2025.md', pdf: 'strategic-plan-2025.pdf', title: 'Strategic Plan 2025-2030' },
        { md: 'annual-report-2024.md', pdf: 'annual-report-2024.pdf', title: 'Annual Report 2024' },
        { md: 'donation-refund-policy.md', pdf: 'donation-refund-policy.pdf', title: 'Donation Refund Policy' },
        { md: 'donation-utilization-policy.md', pdf: 'donation-utilization-policy.pdf', title: 'Donation Utilization Policy' }
    ];

    for (const doc of docs) {
        await mdToPdf(
            path.join(docsDir, doc.md),
            path.join(docsDir, doc.pdf),
            doc.title
        );
    }
}

main();
