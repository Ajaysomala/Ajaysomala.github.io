import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Security and anti-scraping headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Robots-Tag', 'noai, noimageai, index, follow');
  next();
});

// Serve static assets from root directory
app.use(express.static(__dirname, {
  extensions: ['html', 'pdf', 'png', 'jpg', 'svg', 'json']
}));

// Route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Resume PDF route alias
app.get('/resume', (req, res) => {
  res.sendFile(path.join(__dirname, 'Somala_Ajay_Resume.pdf'));
});

// Fallback to 404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Somala Ajay AI/ML Portfolio running at http://${HOST}:${PORT}`);
});
