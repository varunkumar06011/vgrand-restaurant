import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const { pathname } = new URL(req.url)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Webhook Handler
  if (pathname.endsWith('/webhook')) {
    const payload = await req.json()
    const event = payload.event

    if (event === 'payment.captured') {
      const order_id = payload.payload.payment.entity.order_id
      const payment_id = payload.payload.payment.entity.id

      // Update reservation status to pending_approval
      const { data, error } = await supabase
        .from('table_reservations')
        .update({ status: 'pending_approval', payment_id })
        .eq('razorpay_order_id', order_id)
        .select()

      if (error) {
        console.error('Error updating reservation:', error)
        return new Response('Error updating reservation', { status: 500 })
      }

      return new Response('ok', { status: 200 })
    }

    return new Response('ok', { status: 200 })
  }

  // Initiate Payment
  if (req.method === 'POST') {
    const { customer_name, customer_phone, num_people, booking_time, items, amount = 100 } = await req.json()

    try {
      // 1. Create Razorpay Order
      const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
      const rpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // in paise
          currency: 'INR',
          receipt: `resv_${Date.now()}`,
        }),
      })

      const rpOrder = await rpResponse.json()

      if (!rpOrder.id) {
        throw new Error('Failed to create Razorpay order')
      }

      // 2. Insert into table_reservations
      const { data, error } = await supabase
        .from('table_reservations')
        .insert({
          customer_name,
          customer_phone,
          num_people,
          booking_time,
          items,
          status: 'pending_payment',
          razorpay_order_id: rpOrder.id,
          amount,
        })
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ 
        order_id: rpOrder.id, 
        reservation_id: data.id,
        amount: amount * 100,
        key_id: RAZORPAY_KEY_ID 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  return new Response('Not found', { status: 404 })
})
