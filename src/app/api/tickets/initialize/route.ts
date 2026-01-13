import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

// Ticket tier prices
const TICKET_PRICES: Record<string, number> = {
  REGULAR: 5000,
  VIP: 30000,
  GANG_OF_5: 20000,
}

// Ticket tier quantities
const TICKET_QUANTITIES: Record<string, number> = {
  REGULAR: 1,
  VIP: 1,
  GANG_OF_5: 5,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, tier, amount } = body

    // Validate required fields
    if (!name || !email || !phone || !tier || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate tier
    if (!['REGULAR', 'VIP', 'GANG_OF_5'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid ticket tier' },
        { status: 400 }
      )
    }

    // Validate amount
    const expectedAmount = TICKET_PRICES[tier]
    if (amount !== expectedAmount) {
      return NextResponse.json(
        { error: 'Invalid amount for selected tier' },
        { status: 400 }
      )
    }

    // Generate unique ticket code and reference
    const ticketCode = `NF-${tier.substring(0, 3)}-${uuidv4().substring(0, 8).toUpperCase()}`
    const paymentRef = uuidv4()
    const qrCode = ticketCode // Use ticket code as QR code value

    // Create ticket record in database
    const ticket = await db.ticket.create({
      data: {
        ticketCode,
        qrCode,
        tier,
        quantity: TICKET_QUANTITIES[tier],
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
        amount,
        paymentRef,
        paymentStatus: 'PENDING',
        verificationStatus: 'NOT_VERIFIED',
      },
    })

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
        reference: paymentRef,
        metadata: {
          ticketId: ticket.id,
          ticketCode,
          tier,
          name,
          phone,
          custom_fields: [
            {
              display_name: 'Ticket Code',
              variable_name: 'ticket_code',
              value: ticketCode,
            },
          ],
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success`,
      }),
    })

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json()
      console.error('Paystack error:', errorData)
      
      // Delete the ticket record if payment initialization fails
      await db.ticket.delete({
        where: { id: ticket.id },
      })
      
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 500 }
      )
    }

    const paystackData = await paystackResponse.json()

    return NextResponse.json({
      success: true,
      reference: paymentRef,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
