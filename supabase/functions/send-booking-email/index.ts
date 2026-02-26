import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingData {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  service_type: string;
  service_price: number;
  vehicle_type: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const bookingData: BookingData = await req.json();

    const {
      booking_id,
      customer_name,
      customer_email,
      booking_date,
      booking_time,
      service_type,
      service_price,
      vehicle_type,
    } = bookingData;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #1E90FF;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
            }
            .booking-details {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            .price {
              font-size: 24px;
              font-weight: bold;
              color: #1E90FF;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
              <p>Thank you for choosing Faithful Auto Care</p>
            </div>
            <div class="content">
              <p>Dear ${customer_name},</p>
              <p>Your car wash appointment has been successfully booked. Here are your booking details:</p>

              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">${booking_id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${service_type}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Vehicle Type:</span>
                  <span class="detail-value">${vehicle_type}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${new Date(booking_date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${booking_time}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Total Price:</span>
                  <span class="price">£${service_price}</span>
                </div>
              </div>

              <p><strong>What to expect:</strong></p>
              <ul>
                <li>Please arrive 5 minutes before your scheduled time</li>
                <li>Our professional team will take care of your vehicle</li>
                <li>Average service duration is 30-45 minutes</li>
                <li>Payment can be made after the service</li>
              </ul>

              <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>

              <p><strong>Contact Information:</strong><br>
              Phone: +44 7700 900000<br>
              Email: info@faithfulautocare.com</p>

              <p>We look forward to serving you!</p>

              <p>Best regards,<br>
              <strong>Faithful Auto Care Team</strong><br>
              Professional Shine, Exceptional Care</p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Faithful Auto Care <onboarding@resend.dev>",
        to: [customer_email],
        subject: `Booking Confirmation - ${service_type} - ${new Date(booking_date).toLocaleDateString()}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const responseData = await res.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking confirmation email sent successfully",
        emailId: responseData.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
