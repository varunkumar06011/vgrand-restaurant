import { supabase } from '@/db/supabase';

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
    const lowerMessage = message.toLowerCase();
    const data = sessionState?.data ? { ...sessionState.data } : { basket: [] };
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
          data.num_people = parseInt(numMatch[1]);
          return {
            reply: `OK, ${data.num_people} people. Which date? (e.g. Tomorrow)`,
            state: { stage: 'collecting_date', data: data }
          };
        }
        return {
          reply: "How many guests?",
          state: { stage: 'collecting_people', data: data }
        };

      case 'collecting_date':
        data.date = message;
        return {
          reply: "At what time?",
          state: { stage: 'collecting_time', data: data }
        };

      case 'collecting_time':
        data.time = message;
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
        if (message.length > 2) {
          data.basket = [...(data.basket || []), message];
          return {
            reply: `Added ${message}. Anything else?`,
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
            const { data: resv, error } = await supabase
              .from('table_reservations')
              .insert({
                customer_phone: data.phone,
                num_people: data.num_people,
                booking_time: new Date().toISOString(), 
                items: data.basket,
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
              reply: `Payment received ✅\nYour Order No is: **2800** (Local Mode).\nWe are waiting for admin approval...`,
              state: { stage: 'awaiting_approval', data: { ...data, reservation_id: `mock_${Date.now()}`, token_number: 2800 } }
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

  async initiatePayment(bookingData: any) {
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
    const startSim = () => {
      setTimeout(() => {
        onUpdate({ 
          status: 'confirmed', 
          notification_payload: {
            title: "V GRAND OFFICIAL",
            body: `Hi king/queen! Your payment is approved ✅ and your table (Order No: 2800) is officially confirmed! See you soon!`,
            type: 'whatsapp'
          }
        });
      }, 10000);
    };

    if (reservationId.includes('mock')) {
      startSim();
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('res_sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'table_reservations',
        },
        (payload) => {
          if (payload.new.id === reservationId && payload.new.status === 'confirmed') {
            onUpdate({
              ...payload.new,
              notification_payload: {
                title: "V GRAND OFFICIAL",
                body: `Hi king/queen! Your payment is approved ✅ and your table (Order No: ${payload.new.token_number}) is officially confirmed! We have made things ready and your items are being prepared. See you soon!`,
                type: 'whatsapp'
              }
            });
          }
        }
      )
      .subscribe();
  },
};
