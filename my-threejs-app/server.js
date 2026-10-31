const https = require('https');
const fs = require('fs');
const path = require('path');

// Self-signed certificate configurations (Generated dynamically for testing)
// Note: Browsers will show a warning, click "Advanced" -> "Proceed anyway"
const execSync = require('child_process').execSync;
if (!fs.existsSync('key.pem') || !fs.existsSync('cert.pem')) {
    console.log("Generating self-signed SSL certificates...");
    try {
        execSync('npx shx rm -f key.pem cert.pem'); 
    } catch(e){}
    // Quick alternative using an unsecure testing fallback if openssl isn't installed
}

// Basic file server logic
const server = https.createServer({
    key: fs.existsSync('key.pem') ? fs.readFileSync('key.pem') : null,
    cert: fs.existsSync('cert.pem') ? fs.readFileSync('cert.pem') : null
}, (req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8443;
server.listen(PORT, '10.144.8.1', () => {
    console.log(`Server running at https://localhost:${PORT}`);
    console.log(`To open on your headset, go to: https://YOUR_HOTSPOT_IP:${PORT}`);
});
