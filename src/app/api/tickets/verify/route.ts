import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import nodemailer from 'nodemailer'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

// Email configuration (created on demand to avoid errors on startup)
function getEmailTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('SMTP not configured, emails will not be sent')
    return null
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

// Function to send ticket email
async function sendTicketEmail(ticket: any) {
  const transporter = getEmailTransporter()
  if (!transporter) {
    console.log('Skipping email - SMTP not configured')
    return
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Nightflix" <noreply@nightflix.com>',
      to: ticket.buyerEmail,
      subject: `Your Nightflix Ticket - ${ticket.tier.replace('_', ' ')}`,
      html: `
        <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Your Nightflix Ticket</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #0f172a;
                  color: #ffffff;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #1e293b;
                  border-radius: 12px;
                  overflow: hidden;
                }
                .header {
                  background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%);
                  padding: 30px;
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                }
                .content {
                  padding: 30px;
                }
                .ticket-card {
                  background-color: #0f172a;
                  border-radius: 8px;
                  padding: 20px;
                  margin-bottom: 20px;
                }
                .ticket-title {
                  font-size: 20px;
                  color: #f43f5e;
                  margin-bottom: 15px;
                }
                .detail-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 8px 0;
                  border-bottom: 1px solid #334155;
                }
                .detail-label {
                  color: #94a3b8;
                }
                .detail-value {
                  color: #ffffff;
                  font-weight: 600;
                }
                .ticket-code {
                  background-color: #0f172a;
                  border: 2px dashed #f43f5e;
                  border-radius: 8px;
                  padding: 15px;
                  text-align: center;
                  margin: 20px 0;
                }
                .ticket-code h3 {
                  margin: 0 0 10px 0;
                  color: #94a3b8;
                  font-size: 12px;
                }
                .ticket-code p {
                  margin: 0;
                  font-size: 24px;
                  font-weight: bold;
                  color: #f43f5e;
                  font-family: monospace;
                }
                .footer {
                  background-color: #0f172a;
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #94a3b8;
                }
                .cta-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%);
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                  margin-top: 15px;
                }
                .badge {
                  display: inline-block;
                  background-color: #f43f5e;
                  color: white;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Your Nightflix Ticket!</h1>
                </div>
                <div class="content">
                  <p style="color: #94a3b8; margin-bottom: 20px;">
                    Thank you for purchasing your Nightflix ticket! Below are your ticket details.
                  </p>
                  
                  <div class="ticket-card">
                    <h2 class="ticket-title">${ticket.tier.replace('_', ' ')} Ticket</h2>
                    <span class="badge">${ticket.tier.replace('_', ' ')}</span>
                    
                    <div style="margin-top: 20px;">
                      <div class="detail-row">
                        <span class="detail-label">Attendee Name</span>
                        <span class="detail-value">${ticket.buyerName}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${ticket.buyerEmail}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${ticket.buyerPhone}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Quantity</span>
                        <span class="detail-value">${ticket.quantity} ticket(s)</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Amount Paid</span>
                        <span class="detail-value">₦${ticket.amount.toLocaleString()}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Payment Status</span>
                        <span class="detail-value" style="color: #22c55e;">${ticket.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div class="ticket-code">
                    <h3>TICKET CODE (Show at venue)</h3>
                    <p>${ticket.ticketCode}</p>
                  </div>

                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>Important:</strong> Please show this ticket with your ticket code at the venue entrance for verification. 
                      You can also show this email on your phone.
                    </p>
                  </div>

                  <p style="color: #94a3b8; margin-bottom: 15px;">
                    Need help? Contact us at support@nightflix.com
                  </p>

                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?reference=${ticket.paymentRef}" class="cta-button">
                    View Your Ticket Online
                  </a>
                </div>
                <div class="footer">
                  <p>Payment Reference: ${ticket.paymentRef}</p>
                  <p style="margin-top: 10px;">© 2025 Nightflix. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Ticket email sent successfully to:', ticket.buyerEmail)
  } catch (emailError) {
    console.error('Failed to send ticket email:', emailError)
    // Don't throw - this is non-critical
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference parameter is required' },
        { status: 400 }
      )
    }

    console.log('Verifying payment with reference:', reference)

    // First, try to find the ticket in database
    const ticket = await db.ticket.findUnique({
      where: { paymentRef: reference },
    })

    if (!ticket) {
      console.log('Ticket not found for reference:', reference)
      return NextResponse.json(
        { error: 'Ticket not found. Please complete your purchase.' },
        { status: 404 }
      )
    }

    console.log('Found ticket:', ticket.id, 'Status:', ticket.paymentStatus)

    // If ticket is already completed, just return it
    if (ticket.paymentStatus === 'COMPLETED') {
      console.log('Ticket already completed, returning existing ticket')
      return NextResponse.json({
        success: true,
        ticket,
      })
    }

    // Verify payment with Paystack (only if secret key is configured)
    let paystackVerified = false
    if (PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY !== 'sk_test_your_secret_key') {
      try {
        console.log('Verifying with Paystack...')
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        })

        if (paystackResponse.ok) {
          const paystackData = await paystackResponse.json()
          console.log('Paystack response status:', paystackData.data?.status)
          
          if (paystackData.data?.status === 'success') {
            paystackVerified = true
            console.log('Payment verified with Paystack')
          } else {
            console.log('Payment status from Paystack:', paystackData.data?.status)
          }
        } else {
          console.log('Paystack verification request failed:', paystackResponse.status)
        }
      } catch (paystackError) {
        console.error('Paystack verification error:', paystackError)
        // Continue anyway - we'll mark as completed if we can
      }
    } else {
      console.log('Paystack not configured or using default key - skipping Paystack verification')
      // For development/testing, we'll mark the ticket as completed
      paystackVerified = true
    }

    // Update ticket status if verified or in development mode
    if (paystackVerified || !PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'sk_test_your_secret_key') {
      console.log('Updating ticket status to COMPLETED')
      
      const updatedTicket = await db.ticket.update({
        where: { id: ticket.id },
        data: {
          paymentStatus: 'COMPLETED',
        },
      })

      // Send ticket email (non-blocking)
      await sendTicketEmail(updatedTicket)

      return NextResponse.json({
        success: true,
        ticket: updatedTicket,
        emailSent: !!getEmailTransporter(),
      })
    }

    // Payment not verified with Paystack
    return NextResponse.json(
      { 
        error: 'Payment verification failed. Please ensure payment was completed successfully.',
        status: 'pending'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again or contact support.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
