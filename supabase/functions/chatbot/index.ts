import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history, sessionState } = await req.json()
    const lowerMessage = message.toLowerCase()

    // 1. GREETING
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return new Response(
        JSON.stringify({
          reply: "Hi king/queen 👑 How can I assist you today?",
          state: { ...sessionState, stage: 'greeting' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. BOOKING INTENT (SIMPLE PARSING FOR NOW, CAN BE REPLACED WITH OPENAI)
    // Extract: number_of_people, time, food items
    let stage = sessionState?.stage || 'idle'
    let extractedData = sessionState?.data || {}

    // Extracting people
    const peopleMatch = message.match(/(\d+)\s*(people|person|guests|for)/)
    if (peopleMatch) extractedData.num_people = parseInt(peopleMatch[1])

    // Extracting time
    const timeMatch = message.match(/(\d+):?(\d+)?\s*(am|pm|at)?/)
    if (timeMatch && (message.includes('pm') || message.includes('am') || message.includes('at'))) {
      extractedData.time = timeMatch[0]
    }

    // Extracting food items (simplified - list of common items)
    const commonItems = ['biryani', 'coke', 'veg starters', 'non veg starters', 'main course']
    const foundItems = commonItems.filter(item => lowerMessage.includes(item))
    if (foundItems.length > 0) {
      extractedData.items = [...(extractedData.items || []), ...foundItems]
    }

    // FOLLOW-UP LOGIC
    if (!extractedData.num_people) {
      return new Response(
        JSON.stringify({
          reply: "Great! How many people will be joining you?",
          state: { stage: 'collecting_people', data: extractedData }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!extractedData.time) {
      return new Response(
        JSON.stringify({
          reply: `Table for ${extractedData.num_people}. At what time would you like to book?`,
          state: { stage: 'collecting_time', data: extractedData }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!extractedData.phone) {
      // 3. COLLECT MOBILE NUMBER
      if (message.match(/^\d{10}$/)) {
        extractedData.phone = message
      } else {
        return new Response(
          JSON.stringify({
            reply: "Please provide your 10-digit mobile number to continue booking.",
            state: { stage: 'collecting_phone', data: extractedData }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // 4. SHOW ORDER SUMMARY
    if (!sessionState?.confirmed) {
      const summary = `
      * Table for ${extractedData.num_people} at ${extractedData.time}
      * Phone: ${extractedData.phone}
      * Items: ${extractedData.items?.join(', ') || 'No pre-orders'}
      `
      return new Response(
        JSON.stringify({
          reply: `Here is your booking summary:\n${summary}\nShould I proceed to payment?`,
          state: { stage: 'awaiting_confirmation', data: extractedData }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If confirmed, the frontend will call the payment function.
    return new Response(
      JSON.stringify({
        reply: "Processing your request...",
        state: { stage: 'processing', data: extractedData }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
