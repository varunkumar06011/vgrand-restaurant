import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@19.1.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const successUrlPath = '/payment-success?session_id={CHECKOUT_SESSION_ID}';
const cancelUrlPath = '/menu';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CheckoutRequest {
  items: OrderItem[];
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  currency?: string;
  payment_method_types?: string[];
}

function ok(data: any): Response {
  return new Response(
    JSON.stringify({ code: "SUCCESS", message: "Success", data }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function fail(msg: string, code = 400): Response {
  return new Response(
    JSON.stringify({ code: "FAIL", message: msg }),
    {
      status: code,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function validateCheckoutRequest(request: CheckoutRequest): void {
  if (!request.items?.length) {
    throw new Error("Cart is empty");
  }
  if (!request.customer_name?.trim()) {
    throw new Error("Customer name is required");
  }
  if (!request.customer_phone?.trim()) {
    throw new Error("Customer phone is required");
  }
  if (!request.delivery_address?.trim()) {
    throw new Error("Delivery address is required");
  }
  for (const item of request.items) {
    if (!item.name || item.price <= 0 || item.quantity <= 0) {
      throw new Error("Invalid item information");
    }
  }
}

function processOrderItems(items: OrderItem[]) {
  const formattedItems = items.map(item => ({
    id: item.id,
    name: item.name.trim(),
    price: Math.round(item.price * 100),
    quantity: item.quantity,
    image_url: item.image_url?.trim() || "",
  }));
  const totalAmount = formattedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { formattedItems, totalAmount };
}

async function createCheckoutSession(
  stripe: Stripe,
  request: CheckoutRequest,
  origin: string
) {
  const { formattedItems, totalAmount } = processOrderItems(request.items);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: request.customer_name.trim(),
      customer_phone: request.customer_phone.trim(),
      customer_email: request.customer_email?.trim() || null,
      delivery_address: request.delivery_address.trim(),
      items: formattedItems,
      total_amount: totalAmount / 100,
      currency: (request.currency || 'inr').toLowerCase(),
      payment_method: 'online',
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);

  const session = await stripe.checkout.sessions.create({
    line_items: request.items.map(item => ({
      price_data: {
        currency: (request.currency || 'inr').toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${origin}${successUrlPath}`,
    cancel_url: `${origin}${cancelUrlPath}`,
    payment_method_types: request.payment_method_types || ['card'],
    customer_email: request.customer_email || undefined,
    metadata: {
      order_id: order.id,
      customer_phone: request.customer_phone,
    },
  });

  await supabase
    .from("orders")
    .update({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq("id", order.id);

  return { order, session };
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const request = await req.json();
    validateCheckoutRequest(request);

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "";
    const { order, session } = await createCheckoutSession(
      stripe,
      request,
      origin
    );

    return ok({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return fail(error instanceof Error ? error.message : "Payment processing failed", 500);
  }
});
