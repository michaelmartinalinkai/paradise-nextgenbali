const fs = require('fs');
const path = require('path');

const dir = 'C:\\\\Users\\\\salva\\\\.gemini\\\\antigravity\\\\scratch\\\\paradise-nextgenbali';

const newPixelCode = `    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1165498168884265');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1165498168884265&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
</head>`;

function getFiles(srcpath, extension) {
    return fs.readdirSync(srcpath).flatMap(file => {
        const fullPath = path.join(srcpath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            return getFiles(fullPath, extension);
        }
        return fullPath.endsWith(extension) ? fullPath : [];
    });
}

function removePixel(content) {
    let startTag = '<!-- Meta Pixel Code -->';
    let endTag = '<!-- End Meta Pixel Code -->';
    while (content.includes(startTag) && content.includes(endTag)) {
        let startIdx = content.indexOf(startTag);
        let endIdx = content.indexOf(endTag) + endTag.length;

        // Find preceding spaces/tabs to remove the indent
        while (startIdx > 0 && (content[startIdx - 1] === ' ' || content[startIdx - 1] === '\\t')) {
            startIdx--;
        }

        // Find trailing newline
        if (content[endIdx] === '\\r') endIdx++;
        if (content[endIdx] === '\\n') endIdx++;

        content = content.substring(0, startIdx) + content.substring(endIdx);
    }
    return content;
}

const htmlFiles = getFiles(dir, '.html');
let updated = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let orig = content;

    // Remove ALL instances of Meta Pixel Code blocks completely using string index.
    content = removePixel(content);

    if (content.includes('</head>')) {
        content = content.replace('</head>', newPixelCode);
        if (content !== orig) {
            fs.writeFileSync(file, content);
            console.log('Fixed pixel in', file);
            updated++;
        }
    } else {
        console.log('Warning: No </head> found in', file);
    }
});

console.log('Total files updated:', updated);
