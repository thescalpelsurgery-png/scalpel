export const emailStyles = `
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #1a202c;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    background-color: #f7fafc;
  }
  .wrapper {
    width: 100%;
    table-layout: fixed;
    background-color: #f7fafc;
    padding-bottom: 40px;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    margin-top: 40px;
  }
  .header {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .header h1 {
    color: #ffffff;
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.025em;
  }
  .content {
    padding: 40px 30px;
  }
  .footer {
    padding: 30px;
    text-align: center;
    font-size: 14px;
    color: #718096;
    background-color: #f8fafc;
    border-top: 1px solid #edf2f7;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background-color: #0891b2;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    margin: 24px 0;
    transition: background-color 0.2s;
  }
  .card {
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    border: 1px solid #e2e8f0;
  }
  .card-title {
    font-weight: 700;
    color: #2d3748;
    margin-top: 0;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .accent {
    color: #0891b2;
    font-weight: 600;
  }
  @media only screen and (max-width: 600px) {
    .container {
      margin-top: 0;
      border-radius: 0;
    }
    .content {
      padding: 30px 20px;
    }
  }
`

const renderEmail = (title: string, contentHtml: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Scalpel</h1>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>&copy; 2025 Scalpel. All rights reserved.</p>
        <p>Mastering Advanced Surgical Techniques</p>
        <div style="margin-top: 20px;">
          <a href="#" style="color: #718096; text-decoration: underline; margin: 0 10px;">Unsubscribe</a>
          <a href="#" style="color: #718096; text-decoration: underline; margin: 0 10px;">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`

export const emailTemplates = {
  membershipConfirmation: (name: string) => ({
    subject: "Welcome to Scalpel - Membership Application Received",
    html: renderEmail(
      "Welcome to Scalpel",
      `
      <h2 style="font-size: 24px; margin-bottom: 16px;">Welcome aboard, ${name}!</h2>
      <p>Thank you for applying to join the Scalpel community. We are excited to have you on your journey to surgical excellence.</p>
      
      <div class="card">
        <h3 class="card-title">Application Status: <span style="color: #d97706;">Pending Review</span></h3>
        <p>Our team is currently assessing your information. You can expect a response within <span class="accent">24-48 hours</span>.</p>
      </div>

      <p>In the meantime, feel free to explore our public resources or follow us for the latest updates in surgical education.</p>
      
      <a href="https://scalpel.org/about" class="button">Explore Scalpel</a>
      
      <p>Best regards,<br><strong>The Scalpel Team</strong></p>
      `
    ),
  }),

  eventRegistration: (name: string, eventTitle: string, eventDate: string, eventLocation: string) => ({
    subject: `Registration Confirmed: ${eventTitle}`,
    html: renderEmail(
      "Event Registration",
      `
      <h2 style="font-size: 24px; margin-bottom: 16px;">See you there, ${name}!</h2>
      <p>Your registration for <span class="accent">${eventTitle}</span>.</p>
      
      <div class="card">
        <h3 class="card-title">Event Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #718096; width: 80px;">Date:</td>
            <td style="padding: 8px 0; font-weight: 600;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;">Location:</td>
            <td style="padding: 8px 0; font-weight: 600;">${eventLocation}</td>
          </tr>
        </table>
      </div>

      <p>We'll send you more details, including the full agenda and prep materials, as the event approaches.</p>
      
      <a href="https://scalpel.org/events" class="button">View My Events</a>
      
      <p>Best regards,<br><strong>The Scalpel Team</strong></p>
      `
    ),
  }),

  newsletterWelcome: (email: string) => ({
    subject: "Welcome to the Scalpel Newsletter",
    html: renderEmail(
      "Newsletter Subscription",
      `
      <h2 style="font-size: 24px; margin-bottom: 16px;">You're on the list!</h2>
      <p>Thank you for subscribing to the Scalpel newsletter. You'll now receive the latest surgical insights and event updates directly in your inbox.</p>
      
      <div class="card">
        <h3 class="card-title">What to Expect</h3>
        <ul style="padding-left: 20px; margin: 0; color: #4a5568;">
          <li style="margin-bottom: 8px;">Exclusive surgical case studies</li>
          <li style="margin-bottom: 8px;">Early access to workshop registrations</li>
          <li style="margin-bottom: 8px;">Product updates and member benefits</li>
        </ul>
      </div>

      <p>We're glad to have you with us.</p>
      
      <a href="https://scalpel.org/blog" class="button">Read Latest Blog</a>
      
      <p>Happy learning,<br><strong>The Scalpel Team</strong></p>
      `
    ),
  }),

  adminBroadcast: (subject: string, content: string) => ({
    subject: subject,
    html: renderEmail(
      "Scalpel Update",
      `
      <div style="font-size: 16px; color: #2d3748;">
        ${content.replace(/\n/g, '<br>')}
      </div>
      
      <div style="margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 20px;">
        <p style="font-size: 14px; color: #718096;">
          You are receiving this email because you are a member or subscriber of Scalpel.
        </p>
      </div>
      `
    ),
  }),

  contactRequest: (data: { firstName: string, lastName: string, email: string, phone: string, subject: string, message: string }) => ({
    subject: `New Contact Request: ${data.subject}`,
    html: renderEmail(
      "Contact Inquiry",
      `
      <h2 style="font-size: 24px; margin-bottom: 16px;">New Inquiry from ${data.firstName} ${data.lastName}</h2>
      
      <div class="card">
        <h3 class="card-title">Sender Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #718096; width: 100px;">Full Name:</td>
            <td style="padding: 8px 0; font-weight: 600;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;">Email:</td>
            <td style="padding: 8px 0; font-weight: 600;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #718096;">Phone:</td>
            <td style="padding: 8px 0; font-weight: 600;">${data.phone || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <div class="card">
        <h3 class="card-title">Message</h3>
        <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
      </div>
      `
    ),
  }),
}
