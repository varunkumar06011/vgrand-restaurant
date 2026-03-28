// Delivery fee calculation based on distance
export interface DeliveryFeeResult {
  fee: number;
  distance: number | null;
  message: string;
}

// Keywords that indicate locations beyond 10km from Ongole center
const FAR_LOCATION_KEYWORDS = [
  // Distance indicators
  'far', 'outside', 'outskirts', 'beyond', 'highway', 'bypass', 'nh', 'national highway',
  
  // Nearby towns/villages (examples - restaurant should update this list)
  'chirala', 'kandukur', 'markapur', 'addanki', 'santhanuthalapadu', 'tangutur',
  'podili', 'giddalur', 'kanigiri', 'darsi', 'bestavaripeta', 'singarayakonda',
  
  // Distance mentions
  '10km', '11km', '12km', '13km', '14km', '15km', '20km', '25km', '30km',
  'kilometers', 'kilometres', 'kms',
];

// Calculate delivery fee based on address
// In a real implementation, this would use Google Maps Distance Matrix API
// For now, we'll provide estimation based on keywords and patterns
export function calculateDeliveryFee(address: string, orderTotal: number): DeliveryFeeResult {
  const addressLower = address.toLowerCase().trim();
  
  // Check if address indicates far location (>10km)
  const isFarLocation = FAR_LOCATION_KEYWORDS.some(keyword => 
    addressLower.includes(keyword.toLowerCase())
  );
  
  // Check for explicit distance mentions in the address
  const distanceMatch = addressLower.match(/(\d+)\s*(km|kilometer|kilometre)/);
  const mentionedDistance = distanceMatch ? parseInt(distanceMatch[1]) : null;
  
  // Determine if location is beyond 10km
  const isBeyond10km = isFarLocation || (mentionedDistance !== null && mentionedDistance > 10);
  
  // Calculate delivery fee
  if (isBeyond10km) {
    // Beyond 10km: ₹50 extra charge regardless of order total
    return {
      fee: 50,
      distance: mentionedDistance,
      message: '📍 Delivery location is beyond 10km - ₹50 delivery charge applies'
    };
  }
  
  // Within 10km: Free delivery for orders ₹300+, otherwise ₹30
  if (orderTotal >= 300) {
    return {
      fee: 0,
      distance: mentionedDistance,
      message: '✅ Free delivery within 10km (Order ₹300+)'
    };
  }
  
  return {
    fee: 30,
    distance: mentionedDistance,
    message: `📦 ₹30 delivery fee (Add ₹${300 - orderTotal} more for free delivery within 10km)`
  };
}

// Helper to get delivery fee display text
export function getDeliveryFeeText(fee: number, orderTotal: number): string {
  if (fee === 0) {
    return 'FREE';
  }
  return `₹${fee}`;
}

// Helper to get delivery fee info message
export function getDeliveryFeeInfo(address: string, orderTotal: number): string {
  const result = calculateDeliveryFee(address, orderTotal);
  return result.message;
}
