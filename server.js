require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

app.use(express.static(PUBLIC_DIR));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Fariimo badan ayaa la diray. Fadlan isku day mar dambe.'
  }
});

function clean(value, max = 1200) {
  return String(value || '')
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, max);
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  const name = clean(req.body.name, 80);
  const email = clean(req.body.email, 160);
  const subject = clean(req.body.subject, 120);
  const message = clean(req.body.message, 3000);

  if (req.body.website) {
    return res.json({ success: true, message: 'Mahadsanid!' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Fadlan buuxi magaca, email-ka iyo fariinta.'
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email sax ah geli.'
    });
  }

  if (!process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS) {
    return res.status(503).json({
      success: false,
      message: 'Contact service-ku weli lama habayn.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || 'true') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER ||
          'saidmohamedabdulle001@gmail.com',
      replyTo: email,
      subject: `Portfolio: ${subject || 'Fariin cusub'}`,
      text: `Magac: ${name}\nEmail: ${email}\n\n${message}`
    });

    return res.status(201).json({
      success: true,
      message: 'Fariintaada waa la helay. Mahadsanid!'
    });

  } catch (error) {
    console.error('Contact form error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Fariinta lama diri karin hadda.'
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio running on port ${PORT}`);
});
