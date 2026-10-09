# Workforce Co. — Static Website

A plain HTML/CSS/JS website. No build step, no server, no database — open the
files directly or drop them on any static host.

## File structure

```
index.html      Home
about.html       About
contact.html     Contact Us  (EmailJS form)
quote.html       Request a Quote  (EmailJS form, for businesses)
work.html        Want to Work  (embeds a Google Form, for job applicants)
css/style.css    All styling — organized top to bottom, see the numbered
                  sections in comments at the top of the file
js/main.js       Nav behavior, scroll animations, EmailJS form handling
```

Every page is a normal, complete HTML file — open any one of them directly in
a browser and it works. Nothing is generated or built.

## 1. Set up EmailJS (for Contact Us and Request a Quote)

These two forms send email without needing a backend server, using EmailJS's
free tier.

1. Go to **emailjs.com** and create a free account.
2. **Add an Email Service**: Email Services → Add New Service → connect your
   Gmail (or other provider). Note the **Service ID** it gives you.
3. **Create two templates**: Email Templates → Create New Template.
   - One for the Contact form. Use variables like `{{from_name}}`,
     `{{from_email}}`, `{{phone}}`, `{{message}}` in the template body —
     these match the `name="..."` attributes on the inputs in `contact.html`.
   - One for the Quote form. Use `{{company_name}}`, `{{contact_person}}`,
     `{{phone}}`, `{{from_email}}`, `{{work_type}}`, `{{worker_count}}`,
     `{{timeline}}`, `{{message}}` — matching `quote.html`.
   - Note each template's **Template ID**.
4. **Get your Public Key**: Account → API Keys.
5. Open `js/main.js` and fill in the four placeholders near the top:

```js
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_CONTACT = "YOUR_CONTACT_TEMPLATE_ID";
const EMAILJS_TEMPLATE_QUOTE = "YOUR_QUOTE_TEMPLATE_ID";
```

That's it — both forms will start sending real email. EmailJS's free tier
covers 200 emails/month, which is enough to start.

## 2. Set up Google Forms (for Want to Work)

1. Go to **forms.google.com** and build your job application form — name,
   phone, city, skill, experience, etc.
2. Click **Send** (top right) → click the **`<>`** embed icon → copy the
   `src="..."` URL from the code it gives you.
3. Open `work.html` and replace `YOUR_GOOGLE_FORM_EMBED_URL` (in the
   `<iframe src="...">`) with that URL.
4. Also replace `YOUR_GOOGLE_FORM_URL` (in the "Open it in a new tab" link
   just below the form) with your form's normal shareable link — this is the
   fallback for anyone whose browser blocks the embedded iframe.
5. In Google Forms, go to **Responses → the green Sheets icon** to have every
   submission land automatically in a spreadsheet you can review.

## Running it locally

You can just double-click any `.html` file to open it in a browser. If you'd
rather run a local server (some browsers restrict certain features when
opening files directly):

```bash
# Python (usually pre-installed on Mac/Linux)
python3 -m http.server 8000

# or, if you have Node.js
npx serve .
```

Then visit `http://localhost:8000`.

## Deploying it live

Any static host works. The two easiest, free options:

- **Netlify**: go to app.netlify.com/drop and drag the whole folder in.
  You get a live URL immediately.
- **Vercel**: run `npx vercel` from inside this folder and follow the
  prompts, or drag the folder into vercel.com's dashboard.

Once live, point your domain's DNS at whichever host you choose — both give
you clear instructions for this in their dashboard after the first deploy.

## Customizing

- **Colors/fonts**: all defined once, at the top of `css/style.css` under
  `:root { ... }` — change a value there and it updates everywhere.
- **Text content**: edit directly in the relevant `.html` file — everything
  is plain, readable markup with no templating.
- **Animations**: search `css/style.css` for section "8. Animations" — the
  `.reveal` class fades content in as you scroll to it; `.hero-in` classes
  animate elements in once when a page loads.
