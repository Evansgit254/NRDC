const fs = require('fs');
const { marked } = require('marked');

// Function to convert markdown file to HTML
function convertToHtml(filename, title) {
    const markdown = fs.readFileSync(`${filename}.md`, 'utf-8');
    const htmlContent = marked.parse(markdown);

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-top: 30px;
            page-break-after: avoid;
        }
        
        h2 {
            color: #34495e;
            border-bottom: 2px solid #95a5a6;
            padding-bottom: 8px;
            margin-top: 25px;
            page-break-after: avoid;
        }
        
        h3 {
            color: #2c3e50;
            margin-top: 20px;
            page-break-after: avoid;
        }
        
        h4 {
            color: #555;
            margin-top: 15px;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
        }
        
        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            page-break-inside: avoid;
        }
        
        pre code {
            background: none;
            color: #ecf0f1;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #3498db;
            padding: 10px 20px;
            margin: 20px 0;
            background: #ecf8ff;
            border-radius: 0 5px 5px 0;
            page-break-inside: avoid;
        }
        
        /* GitHub-style alerts */
        blockquote p:first-child {
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        blockquote:has(p:first-child:contains("TIP")) {
            border-left-color: #27ae60;
            background: #e8f8f5;
        }
        
        blockquote:has(p:first-child:contains("IMPORTANT")) {
            border-left-color: #8e44ad;
            background: #f4ecf7;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #3498db;
            color: white;
            font-weight: bold;
        }
        
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        hr {
            border: none;
            border-top: 2px solid #ecf0f1;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    fs.writeFileSync(`${filename}.html`, fullHtml, 'utf-8');
    console.log(`✅ HTML file created: ${filename}.html`);
}

// Convert all guides
convertToHtml('MCHANGA_SETUP_GUIDE', 'M-Changa Setup Guide');
convertToHtml('BANK_TRANSFER_SETUP_GUIDE', 'Bank Transfer Setup Guide');
convertToHtml('MARKETPLACE_BUSINESS_MODEL', 'NRDC Marketplace Business Model');
convertToHtml('BANK_API_INTEGRATION_REQUIREMENTS', 'Technical Requirements: Automated Bank API');
