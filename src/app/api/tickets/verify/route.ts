import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purchaseId, tickets } = body;

    if (!purchaseId || !tickets || !Array.isArray(tickets)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get purchase details
    const purchase = await db.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        ticketTier: true,
        event: true
      }
    });

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Generate ticket HTML
    const ticketHtml = tickets.map((ticket: any, index: number) => `
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 20px;">
          <h2 style="color: white; margin: 0; font-size: 20px; font-weight: bold;">${purchase.event.name}</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${purchase.ticketTier.name} Ticket</p>
        </div>
        <div style="padding: 20px;">
          <div style="text-align: center; margin: 20px 0;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qrCode)}" alt="QR Code" style="width: 150px; height: 150px; border-radius: 8px;" />
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="color: rgba(255,255,255,0.7); margin: 0 0 5px 0; font-size: 12px;">Ticket Number</p>
            <p style="color: white; margin: 0; font-size: 18px; font-weight: bold; font-family: monospace;">${ticket.ticketNumber}</p>
          </div>
          ${ticket.attendeeName ? `
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
            <p style="color: rgba(255,255,255,0.7); margin: 0 0 5px 0; font-size: 12px;">Attendee</p>
            <p style="color: white; margin: 0; font-size: 16px;">${ticket.attendeeName}</p>
          </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Nightflix Tickets</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎬 Nightflix</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Your Tickets Are Ready!</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; margin-bottom: 15px;">
                  <svg style="width: 32px; height: 32px; color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px;">Payment Successful!</h2>
                <p style="color: #64748b; margin: 0; font-size: 16px;">Thank you for purchasing tickets to Nightflix. Your tickets are attached below.</p>
              </div>

              <!-- Ticket Count Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold;">
                  ${tickets.length} Ticket${tickets.length > 1 ? 's' : ''} Purchased
                </span>
              </div>

              <!-- Tickets -->
              ${ticketHtml}

              <!-- Instructions -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-top: 30px;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📋 How to Use Your Tickets</h3>
                <ol style="color: #64748b; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8;">
                  <li style="margin-bottom: 10px;">Save this email or take screenshots of your tickets</li>
                  <li style="margin-bottom: 10px;">Present the QR code on your ticket at the venue entrance</li>
                  <li style="margin-bottom: 10px;">Your ticket will be scanned for verification</li>
                  <li style="margin-bottom: 0;">Each ticket can only be used once</li>
                </ol>
              </div>

              <!-- Important Notice -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 25px; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Important:</strong> Please keep your tickets secure. Do not share your QR code with anyone.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #1e293b; color: white; padding: 30px 20px; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Nightflix</p>
              <p style="margin: 0; opacity: 0.7; font-size: 14px;">The Ultimate Movie Night Experience</p>
              <p style="margin: 20px 0 0 0; opacity: 0.5; font-size: 12px;">
                © ${new Date().getFullYear()} Nightflix. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const emailData = {
      from: 'Nightflix <tickets@buynightflix.ng>',
      to: purchase.email,
      subject: `Your Nightflix Tickets (${tickets.length} Ticket${tickets.length > 1 ? 's' : ''})`,
      html: emailHtml
    };

    await resend.emails.send(emailData);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
