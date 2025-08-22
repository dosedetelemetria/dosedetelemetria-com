import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WaitlistEntryRequest {
  name: string;
  email: string;
  message?: string;
  productId: string;
  productName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, productId, productName }: WaitlistEntryRequest = await req.json();

    console.log(`Received waitlist entry for ${name} (${email}) for product: ${productName}`);

    const emailResponse = await resend.emails.send({
      from: "Dose de Telemetria <contact@dosedetelemetria.com>",
      to: ["contact@dosedetelemetria.com"],
      subject: `New waitlist signup - ${productName}`,
      html: `
        <h1>New waitlist signup</h1>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><strong>Date:</strong> ${new Date().toLocaleString('en-US')}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-waitlist-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);