// src/lib/actions.ts
import { action } from "@solidjs/router";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendProjectBrief = action(async (formData: FormData) => {
  "use server";
  
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const contact = formData.get("contact") as string;
  const description = formData.get("description") as string;

  try {
    const { data, error } = await resend.emails.send({
      from: "Brandflare CRM <onboarding@resend.dev>",
      to: ["projects@brandflarewoodworks.com"],
      subject: `🏗️ New Brief: ${location} | ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; background-color: #ffffff; color: #000000; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; border: 2px solid #000000;">
                    <tr>
                      <td width="12" style="background-color: #000000;"></td>
                      
                      <td style="padding: 40px;">
                        <div style="margin-bottom: 40px;">
                          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase;">
                            Brandflare<span style="color: #f59e0b;">.</span>
                          </h1>
                          <p style="margin: 4px 0 0 0; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #64748b;">
                            Woodworks & Construction
                          </p>
                        </div>

                        <h2 style="font-size: 32px; font-weight: 900; line-height: 1; margin-bottom: 24px; letter-spacing: -0.02em;">
                          NEW PROJECT<br/>INQUIRY
                        </h2>

                        <div style="border-top: 1px solid #e2e8f0; margin-bottom: 32px;"></div>

                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 20px;">
                              <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em;">Client Name</p>
                              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600;">${name}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 20px;">
                              <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em;">Site Location</p>
                              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600;">${location}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 20px;">
                              <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em;">Contact Method</p>
                              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600;">${contact}</p>
                            </td>
                          </tr>
                        </table>

                        <div style="background-color: #f8fafc; padding: 24px; margin-top: 10px;">
                          <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 8px;">Brief Description</p>
                          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
                            ${description}
                          </p>
                        </div>

                        <div style="margin-top: 40px;">
                          <a href="mailto:${contact}" style="background-color: #000000; color: #ffffff; padding: 20px 40px; text-decoration: none; display: inline-block; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em;">
                            Respond to Inquiry
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin-top: 30px; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">
                    Confidential Lead • Brandflare Woodworks Kenya • ${new Date().getFullYear()}
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err) {
    console.error("Resend Error:", err);
    return { success: false, error: "System error: Failed to dispatch brief." };
  }
}, "send-brief");



export const sendContactInquiry = action(async (formData: FormData) => {
  "use server";
  
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const type = formData.get("type") as string;
  const location = formData.get("location") as string;
  const message = formData.get("message") as string;

  try {
    const { error } = await resend.emails.send({
      from: "Brandflare CRM <onboarding@resend.dev>",
      to: ["projects@brandflarewoodworks.com"],
      subject: `🏗️ ${type.toUpperCase()}: ${location} | ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e5e7eb;">
          <div style="background-color: #0f172a; padding: 20px; color: #f59e0b; font-weight: 900; letter-spacing: 0.2em;">
            BRANDFLARE INQUIRY
          </div>
          <div style="padding: 40px;">
            <h2 style="text-transform: uppercase; font-size: 20px;">${type} Request</h2>
            <hr/>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Location:</strong> ${location}</p>
            <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <p style="font-size: 12px; color: #64748b; text-transform: uppercase;">Message</p>
              <p>${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to dispatch inquiry." };
  }
}, "contact-inquiry");