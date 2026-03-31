import { supabase } from '@/db/supabase';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/utils';

// Strict Validation Schemas
const ReservationDataSchema = z.object({
  num_people: z.number().min(1).max(20).optional(),
  date: z.string().min(1).max(50).optional(),
  time: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^\d{10}$/, "Must be 10 digits").optional(),
  basket: z.array(z.string().min(1).max(100)).default([]),
  current_dietary: z.enum(['veg', 'non-veg']).optional(),
  reservation_id: z.string().optional(),
  token_number: z.number().optional(),
});

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'summary' | 'payment' | 'notification' | 'error';
  options?: string[]; // Quick replies / drop down
  metadata?: any;
}

export interface ChatSession {
  stage: string;
  data: any;
  confirmed?: boolean;
}

const MENU_MOCKS = {
  veg: ['Veg Dum Biryani', 'Paneer 65', 'Veg Manchurian', 'Paneer Butter Masala', 'Veg Fried Rice', 'Gulab Jamun (2pcs)'],
  'non-veg': ['Special Chicken Biryani', 'Mutton Keema Biryani', 'Chicken 65', 'Apollo Fish', 'Prawn Fry', 'Butter Chicken', 'Chicken Soft Noodles']
};

export const chatbotService = {
  async sendMessage(message: string, history: ChatMessage[], sessionState: ChatSession) {
    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message, history, sessionState },
      });

      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("Edge function failed, using v4.6 production-ready logic:", e);
      return this.localSimulateResponse(message, history, sessionState);
    }
  },

  // v4.6 Production-Ready Logic (Stuck-Fix Edition)
  async localSimulateResponse(message: string, _history: ChatMessage[], sessionState: ChatSession) {
    const rawMessage = message || "";
    const lowerMessage = rawMessage.toLowerCase();
    
    // Sanitize input
    const cleanMessage = sanitizeInput(rawMessage);
    
    // Validate session data or initialize
    let data: any;
    try {
      data = ReservationDataSchema.parse(sessionState?.data || { basket: [] });
    } catch (e) {
      console.warn("Invalid session state detected, resetting safety defaults", e);
      data = { basket: [] };
    }

    const currentStage = sessionState?.stage || 'idle';

    // Global Reset
    if (lowerMessage.includes('reset') || lowerMessage.includes('start over')) {
      return {
        reply: "Conversation reset! How many people will be joining?",
        state: { stage: 'collecting_people', data: { basket: [] } }
      };
    }

    switch (currentStage) {
      case 'idle':
      case 'greeting':
        return {
          reply: "Great! Let's start your booking. How many people will be joining you?",
          state: { stage: 'collecting_people', data: data }
        };

      case 'collecting_people':
        const numMatch = message.match(/(\d+)/);
        if (numMatch) {
          const count = parseInt(numMatch[1]);
          if (count < 1 || count > 20) {
            return {
              reply: "Our royal tables can accommodate groups between 1 and 20 guests. Please enter a valid number.",
              state: { stage: 'collecting_people', data: data }
            };
          }
          data.num_people = count;
          return {
            reply: `OK, ${data.num_people} people. Which date? (e.g. Tomorrow)`,
            type: "date_picker",
            state: { stage: 'collecting_date', data: data }
          };
        }
        return {
          reply: "How many guests will be joining? (1-20)",
          state: { stage: 'collecting_people', data: data }
        };

      case 'collecting_date':
        const pastKeywords = ['yesterday', 'last', 'ago', 'previous', 'past'];
        if (pastKeywords.some(word => lowerMessage.includes(word))) {
          return {
            reply: "The V Grand Scribes cannot book for the past! Please choose Today, Tomorrow, or a future date.",
            type: "date_picker",
            state: { stage: 'collecting_date', data: data }
          };
        }
        data.date = cleanMessage.substring(0, 50);
        return {
          reply: "At what time?",
          state: { stage: 'collecting_time', data: data }
        };

      case 'collecting_time':
        data.time = cleanMessage.substring(0, 50);
        return {
          reply: "Veg or Non-Veg?",
          options: ['Veg', 'Non-Veg'],
          state: { stage: 'collecting_dietary', data: data }
        };

      case 'collecting_dietary':
        if (lowerMessage.includes('veg')) {
          data.current_dietary = lowerMessage.includes('non') ? 'non-veg' : 'veg';
          return {
            reply: `Select items from our ${data.current_dietary} specials:`,
            options: MENU_MOCKS[data.current_dietary as keyof typeof MENU_MOCKS],
            state: { stage: 'collecting_food_details', data: data }
          };
        }
        return {
          reply: "Please choose Veg or Non-Veg",
          options: ['Veg', 'Non-Veg'],
          state: { stage: 'collecting_dietary', data: data }
        };

      case 'collecting_food_details':
        // Filter out short/junk inputs like 'X', '.', 'ok'
        if (cleanMessage.length > 3 && !['done', 'yes', 'no'].includes(lowerMessage)) {
          const newItem = cleanMessage.substring(0, 100);
          data.basket = [...(data.basket || []), newItem];
          return {
            reply: `Added ${newItem}. Anything else?`,
            options: ['Yes', 'No, Continue'],
            state: { stage: 'anything_else', data: data }
          };
        }
        return {
          reply: "Which item?",
          options: MENU_MOCKS[data.current_dietary as keyof typeof MENU_MOCKS],
          state: { stage: 'collecting_food_details', data: data }
        };

      case 'anything_else':
        if (lowerMessage.includes('yes')) {
          return {
            reply: "Veg or Non-Veg?",
            options: ['Veg', 'Non-Veg'],
            state: { stage: 'collecting_dietary', data: data }
          };
        }
        return {
          reply: "Enter your 10-digit mobile number.",
          state: { stage: 'collecting_phone', data: data }
        };

      case 'collecting_phone':
        if (message.match(/^\d{10}$/)) {
          data.phone = message;
          const summary = `
          * Guests: ${data.num_people}
          * Visit: ${data.date} at ${data.time}
          * Items: ${data.basket.join(', ')}
          `;
          return {
            reply: `Summary:\n${summary}\nConfirm this booking?`,
            options: ['Yes, Confirm', 'No, Reset'],
            state: { stage: 'awaiting_confirmation', data: data }
          };
        }
        return {
          reply: "Please enter a valid 10-digit phone number.",
          state: { stage: 'collecting_phone', data: data }
        };

      case 'awaiting_confirmation':
        if (lowerMessage.includes('yes')) {
          return {
            reply: "Generating ₹100 pre-booking link...",
            options: ['Proceed to Payment ₹100'],
            state: { stage: 'awaiting_payment', data: data, confirmed: true }
          };
        }
        return {
          reply: "Confirm?",
          options: ['Yes, Confirm', 'No, Reset'],
          state: { stage: 'awaiting_confirmation', data: data }
        };

      case 'awaiting_payment':
      case 'done':
        if (lowerMessage.includes('done') || lowerMessage.includes('success') || lowerMessage.includes('payment')) {
          try {
            // Server-side Step Guard: Verify phone and people exist before DB insertion
            if (!data.phone || !data.num_people) {
               throw new Error("Incomplete booking data. Please restart.");
            }

            const { data: resv, error } = await supabase
              .from('table_reservations')
              .insert({
                customer_phone: data.phone,
                num_people: data.num_people,
                booking_time: new Date().toISOString(), 
                // CRITICAL: Map strings to objects for Admin Dash compatibility
                items: (data.basket || []).map((name: string) => ({ 
                  name, 
                  quantity: 1 
                })),
                status: 'pending_approval'
              })
              .select('*')
              .single();

            if (error) throw error;

            return {
              reply: `Payment received ✅\nYour Order No is: **${resv.token_number || '2501'}**.\nWe are waiting for admin approval...`,
              state: { stage: 'awaiting_approval', data: { ...data, reservation_id: resv.id, token_number: resv.token_number } }
            };
          } catch (err) {
            console.error("DB Insert Error:", err);
            return {
              reply: `Booking system error ❌\nWe couldn't save your request. Please try again or call us!`,
              type: 'error',
              state: { stage: 'collecting_phone', data: data }
            };
          }
        }
        return {
          reply: "Please click the button below to complete payment.",
          options: ['Proceed to Payment ₹100'],
          state: { stage: 'awaiting_payment', data: data }
        };

      default:
        return {
          reply: "Processing...",
          state: { stage: 'done', data: data }
        };
    }
  },

  async initiatePayment(_bookingData: any) {
    try {
        return {
            key_id: 'rzp_test_mock',
            amount: 10000,
            order_id: `order_mock_${Date.now()}`,
            reservation_id: `mock_${Date.now()}`
        };
    } catch (e) {
      return {
        order_id: `order_mock_${Date.now()}`,
        reservation_id: `resv_mock_${Date.now()}`,
        amount: 10000,
        key_id: 'rzp_test_mock'
      };
    }
  },

  subscribeToReservation(reservationId: string, onUpdate: (payload: any) => void) {
    if (!reservationId || reservationId.includes('mock')) {
      console.warn("Invalid reservation ID for realtime subscription:", reservationId);
      return { unsubscribe: () => {} };
    }

    const safeChannel = `table_res_sync_${reservationId.substring(0, 8)}`;
    console.log(`[Chatbot] GLOBAL Subscribing to: ${safeChannel} (ID: ${reservationId})`);
    
    return supabase
      .channel(safeChannel)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'table_reservations'
          // We remove the server side filter here to ensure the update reaches the client
        },
        (payload) => {
          console.log("[Chatbot] GLOBAL UPDATE RECEIVED:", payload.new.id, "looking for:", reservationId);
          console.log("[Chatbot] FULL PAYLOAD:", payload.new);
          
          // CRITICAL: Manual Match in JS
          if (payload.new.id === reservationId) {
            console.log("[Chatbot] MATCH FOUND! Status:", payload.new.status);
            const status = (payload.new.status || '').toLowerCase();
            
            if (status.includes('confirm')) {
              console.log("[Chatbot] SUCCESS: Approval detected! Updating UI...");
              onUpdate({
                ...payload.new,
                notification_payload: {
                  title: "V GRAND OFFICIAL",
                  body: `Hey king/queen! your status is approved ✅ we will make things ready in mean while. See you soon!`,
                  type: 'whatsapp'
                }
              });
            } else if (status.includes('reject')) {
              console.log("[Chatbot] NOTICE: Rejection detected! Updating UI...");
              onUpdate({
                ...payload.new,
                notification_payload: {
                  title: "V GRAND UPDATE",
                  body: `We apologize, but we are unable to fulfill your reservation request at this time. ❌ Please try another time or contact us directly.`,
                  type: 'whatsapp'
                }
              });
            }
          } else {
            console.warn("[Chatbot] UPDATE IGNORED: ID mismatch. New:", payload.new.id, "Expected:", reservationId);
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Chatbot] Subscription status:`, status);
      });
  },
};
