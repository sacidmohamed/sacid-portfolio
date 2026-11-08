# Sacid Mohamed Abdulle — Portfolio

Responsive personal portfolio built with HTML, CSS, vanilla JavaScript and an Express backend. The five supplied photos are included in `public/assets/`.

## Run locally

1. Install Node.js 18 or newer.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

## Contact form backend

The contact form posts to `POST /api/contact`. Messages are validated and stored in `data/messages.json` on the server. To also receive submissions by email, copy `.env.example` to `.env`, enter your SMTP settings and set `CONTACT_RECEIVER`. For Gmail, use a Google App Password rather than your normal account password.

**Deployment note:** The local JSON message store is suitable for a basic server with persistent disk. On serverless hosting (for example Vercel), use a database or a form service for durable message storage; serverless file storage is temporary. This project is configured as an Express server and can be deployed to a Node host such as Render or Railway.

## Personal details included

- Phone / WhatsApp: +252 907 898 346
- Email: saidmohamedabdulle001@gmail.com
- GitHub project: https://github.com/sacidmohamed/trainig-studio-website
- Project preview: https://training-studio-website.vercel.app

Update the text in `public/index.html` as your experience and project list grow.
