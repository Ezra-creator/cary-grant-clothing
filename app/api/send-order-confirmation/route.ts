import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { order } = await request.json()

    // Send email to customer
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.email,
      subject: `Order Confirmed — Cary Grant Clothing #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f5f0e8; padding: 40px;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #c9a84c; letter-spacing: 4px; margin: 0;">CGC</h1>
            <p style="color: #a09888; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0;">
              CARY GRANT CLOTHING
            </p>
          </div>

          <div style="border-top: 2px solid #c9a84c; padding-top: 32px; text-align: center; margin-bottom: 32px;">
            <h2 style="color: #f5f0e8; font-size: 22px; letter-spacing: 3px;">
              ORDER CONFIRMED ✓
            </h2>
            <p style="color: #a09888;">
              Thank you, ${order.customerName}!
            </p>
            <p style="color: #c9a84c; font-size: 13px; letter-spacing: 2px;">
              ORDER #${order.id.slice(0,8).toUpperCase()}
            </p>
          </div>

          <div style="background: #161616; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a84c; font-size: 11px; letter-spacing: 3px; margin: 0 0 16px;">
              ORDER SUMMARY
            </h3>
            ${order.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #252525;">
                <span style="color: #f5f0e8;">
                  ${item.product.name} x${item.quantity}
                </span>
                <span style="color: #c9a84c; font-weight: bold;">
                  $${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            `).join('')}
            <div style="margin-top: 16px; text-align: right;">
              <p style="color: #a09888; font-size: 12px;">
                Subtotal: $${order.subtotal.toFixed(2)}
              </p>
              <p style="color: #a09888; font-size: 12px;">
                Shipping: ${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}
              </p>
              <p style="color: #a09888; font-size: 12px;">
                HST: $${order.tax.toFixed(2)}
              </p>
              <p style="color: #c9a84c; font-size: 18px; font-weight: bold;">
                Total: $${order.total.toFixed(2)} CAD
              </p>
            </div>
          </div>

          <div style="background: #161616; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a84c; font-size: 11px; letter-spacing: 3px; margin: 0 0 12px;">
              SHIPPING TO
            </h3>
            <p style="color: #f5f0e8; margin: 0;">
              ${order.customerName}
            </p>
            <p style="color: #a09888; margin: 4px 0 0;">
              ${order.address}, ${order.city}, ${order.province} ${order.postalCode}
            </p>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #252525;">
            <p style="color: #a09888; font-size: 12px;">
              Questions? Contact us at cary@carygrantclothing.com
            </p>
            <p style="color: #a09888; font-size: 12px;">
              54 Dunlop Street West, Barrie, ON
            </p>
            <p style="color: #c9a84c; font-size: 11px; letter-spacing: 3px; margin-top: 16px;">
              CARY GRANT CLOTHING — EST. 2002 🇨🇦
            </p>
          </div>
        </div>
      `,
    })

    // Send notification email to store owner
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: 'cary@carygrantclothing.com',
      subject: `NEW ORDER — #${order.id.slice(0, 8).toUpperCase()} — $${order.total.toFixed(2)} CAD`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f5f0e8; padding: 40px;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #c9a84c; letter-spacing: 4px; margin: 0;">CGC</h1>
            <p style="color: #a09888; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0;">
              CARY GRANT CLOTHING — NEW ORDER
            </p>
          </div>

          <div style="border-top: 2px solid #c9a84c; padding-top: 32px; margin-bottom: 32px;">
            <h2 style="color: #f5f0e8; font-size: 22px; letter-spacing: 3px;">
              ORDER #${order.id.slice(0,8).toUpperCase()}
            </h2>
            <p style="color: #c9a84c; font-size: 18px; font-weight: bold;">
              $${order.total.toFixed(2)} CAD
            </p>
            <p style="color: #a09888;">
              Customer: ${order.customerName} (${order.email})
            </p>
            <p style="color: #a09888;">
              Payment Method: ${order.paymentMethod.toUpperCase()}
            </p>
          </div>

          <div style="background: #161616; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a84c; font-size: 11px; letter-spacing: 3px; margin: 0 0 16px;">
              ORDER SUMMARY
            </h3>
            ${order.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #252525;">
                <span style="color: #f5f0e8;">
                  ${item.product.name} x${item.quantity} (${item.size}, ${item.color})
                </span>
                <span style="color: #c9a84c; font-weight: bold;">
                  $${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            `).join('')}
            <div style="margin-top: 16px; text-align: right;">
              <p style="color: #a09888; font-size: 12px;">
                Subtotal: $${order.subtotal.toFixed(2)}
              </p>
              <p style="color: #a09888; font-size: 12px;">
                Shipping: ${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}
              </p>
              <p style="color: #a09888; font-size: 12px;">
                HST: $${order.tax.toFixed(2)}
              </p>
              <p style="color: #c9a84c; font-size: 18px; font-weight: bold;">
                Total: $${order.total.toFixed(2)} CAD
              </p>
            </div>
          </div>

          <div style="background: #161616; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a84c; font-size: 11px; letter-spacing: 3px; margin: 0 0 12px;">
              SHIPPING TO
            </h3>
            <p style="color: #f5f0e8; margin: 0;">
              ${order.customerName}
            </p>
            <p style="color: #a09888; margin: 4px 0 0;">
              ${order.address}, ${order.city}, ${order.province} ${order.postalCode}
            </p>
            <p style="color: #a09888; margin: 4px 0 0;">
              Phone: ${order.phone}
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
