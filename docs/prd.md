# Requirements Document

## 1. Application Overview

- **Application Name:** V Grand Restaurant
- **Description:** A production-ready, high-converting, mobile-first restaurant website for V Grand Restaurant (Raja of Biryanis), located in Ongole, Andhra Pradesh. The site enables direct food ordering, WhatsApp-based ordering, and function hall bookings — reducing dependency on third-party platforms like Zomato and Swiggy.

---

## 2. Target Users & Core Scenarios

### 2.1 Target Users
- Hungry local users seeking quick food ordering
- Families looking for authentic Andhra cuisine
- Repeat customers familiar with the brand
- Event planners seeking function hall bookings

### 2.2 Core Use Scenarios
- A user lands on the homepage, sees the hero CTA, and places a direct order in ≤ 3 steps
- A user browses the menu, filters by category or dietary preference, adds items to cart, and checks out
- A user sends a WhatsApp order with an auto-generated message
- An event planner visits the Function Hall page and submits a booking inquiry form

---

## 3. Page Structure & Core Features

### 3.1 Page Overview

```
V Grand Restaurant Website
├── Home Page
├── Menu Page
├── Function Hall Page
├── Contact Page
└── [Global] Cart Drawer + Sticky Bottom Navigation
```

---

### 3.2 Global Elements

#### Sticky Top Navigation
- Logo: \"V GRAND RESTAURANT\" (large dominant heading) + \"Raja of Biryanis\" (subtitle)
- Nav links: Home | Menu | Function Hall | Contact
- Sticky \"Order Now\" CTA button (top-right)
- Background: #0F0F0F with gold (#D4AF37) accent on active links

#### Sticky Bottom Navigation (Mobile Only)
- Five tabs: Home | Menu | Cart | WhatsApp | Call
- Cart tab shows live badge count
- WhatsApp tab opens wa.me link
- Call tab triggers click-to-call

#### Sticky WhatsApp Floating Button
- Visible on all pages (desktop + mobile)
- Opens WhatsApp order flow

#### Global Cart Drawer
- Slide-in from right
- Triggered by cart icon/badge
- Real-time item list, quantity controls, subtotal
- \"Proceed to Checkout\" CTA at bottom

---

### 3.3 Home Page

#### Hero Section
- Full-width background: biryani/Kumbhakarna visual (WebP, lazy-loaded)
- Lightweight CSS smoke/steam animation overlay
- Headline: \"Raja of Biryanis in Ongole\" (bold serif, dominant)
- Subtext: \"Authentic Andhra flavors. Order directly. No extra charges.\"
- CTA Buttons (in order):
  1. \"Order Now\" — primary (Deep Red #8B0000, gold border)
  2. \"Order on WhatsApp\" — secondary (WhatsApp green)
  3. \"View Location\" — tertiary (outlined)
- Trust Line: \"Free delivery within 10km • Delivered in 30–35 mins\"
- Social Proof Tag: \"Top Rated on Zomato in Ongole\"

#### Featured Biryanis Section
- Section title: \"Our Bestsellers\"
- Horizontal scroll card row (mobile) / 3-column grid (desktop)
- Each card: image, name, price, \"Bestseller\" badge, \"Add to Cart\" button
- Highlight top 4–6 biryani items

#### Why Choose Us Section
- 4 icon + text tiles:
  1. No extra charges vs Zomato (highlight: \"Save ₹50 vs Zomato\")
  2. Authentic Andhra taste
  3. Fast delivery (30–35 mins)
  4. Hygienic cooking
- Background: dark card with gold icon accents

#### Reviews Section
- 5–6 review cards (name, star rating, review text, date)
- \"Submit a Review & Get a Coupon\" CTA below
- Review submission opens a simple modal form (name, rating, text)

#### Function Hall Preview Section
- 1–2 warm-toned realistic hall images (WebP)
- Capacity: 100–150 guests
- Short description
- CTA: \"Book Function Hall\" → links to Function Hall page

#### Repeat CTA Section
- Full-width dark band
- Headline: \"Hungry? Order Now and Skip the Queue.\"
- CTA: \"Order Now\" + \"Order on WhatsApp\"

---

### 3.4 Menu Page

#### Search & Filter Bar
- Real-time search input (debounced, 300ms)
- Filter chips: Veg | Non-Veg | Chicken | Mutton | Price: Low→High | Price: High→Low
- Multi-filter support (combinable)
- Instant client-side filtering (no page reload)

#### Category Navigation
- Horizontal sticky tab bar below search:
  Biryani | Veg Starters | Non-Veg Starters | Veg Main Course | Non-Veg Main Course | Rice & Noodles | Snacks | Desserts
- Clicking a tab scrolls to the corresponding section
- Active tab highlighted in gold

#### Menu Item Cards
Each card contains:
- Item image (WebP, lazy-loaded)
- Item name
- Price (₹)
- Short description
- Tags: Bestseller / Spicy / Veg / New (color-coded badges)
- Quantity selector (− / count / +)
- \"Add to Stomach\" button (primary CTA)
- Customization option (expandable): spice level selector + add-ons (if applicable)

#### Menu Categories & Items
Biryani (highlighted first, featured section at top):
- Chicken Biryani, Mutton Biryani, Egg Biryani, Veg Biryani, Prawn Biryani, Special Kumbhakarna Biryani (and others as provided by restaurant)

Veg Starters, Non-Veg Starters, Veg Main Course, Non-Veg Main Course, Rice & Noodles, Snacks, Desserts:
- Items populated per restaurant's actual menu data
- Placeholder structure maintained for all categories

*Note: Actual menu item names, prices, descriptions, and images must be provided by the restaurant before launch. The PRD defines the data structure; content is to be filled in.*

---

### 3.5 Cart & Checkout Flow

#### Cart Drawer
- Slide-in panel (right side)
- Lists all added items with image thumbnail, name, quantity controls, line total
- Order subtotal displayed
- \"Proceed to Checkout\" button
- Empty state: \"Your cart is empty. Start ordering!\"

#### Checkout — Step 1: Cart Review
- Full cart summary
- Edit quantities or remove items
- Subtotal + delivery fee display
- \"Continue\" button

#### Checkout — Step 2: Delivery Details
- Fields: Name, Phone Number, Delivery Address
- Basic validation (required fields, phone format)
- \"Continue\" button

#### Checkout — Step 3: Payment
- Payment options:
  - COD (Cash on Delivery) — default selected
  - Online Payment (Razorpay / UPI)
- If Online Payment selected:
  - Trigger Razorpay payment gateway
  - Handle success: show order confirmation screen
  - Handle failure: show error message with retry option
- \"Place Order\" button
- On success: order confirmation screen with order summary and estimated delivery time

---

### 3.6 WhatsApp Order Flow

- Triggered by \"Order on WhatsApp\" CTA (hero, sticky nav, bottom nav)
- If cart has items: auto-generate message from cart contents
  - Format:
    ```
    Hi, I want to order:
    - [Item Name] x[Qty]
    - [Item Name] x[Qty]
    Total: ₹[XXX]
    ```
- If cart is empty: open WhatsApp with generic greeting message
- Opens via wa.me/[restaurant WhatsApp number] with pre-filled message (URL-encoded)

---

### 3.7 Function Hall Page

#### Hall Gallery
- 3–4 realistic warm-toned hall images (WebP, lazy-loaded)
- Lightbox on click

#### Hall Details
- Capacity: 100–150 guests
- Suitable events: Birthdays, Engagements, Corporate Events, Family Gatherings
- Key amenities list (AC, catering available, parking, etc. — to be confirmed by restaurant)

#### Booking Inquiry Form
- Fields:
  - Name (text, required)
  - Phone Number (tel, required)
  - Event Date (date picker, required)
  - Event Type (dropdown: Birthday / Engagement / Corporate / Other, required)
  - Guest Count (number input, range 100–150, required)
  - Additional Notes (textarea, optional)
- CTA: \"Check Availability\"
- On submit: form data stored in backend; confirmation message shown to user; restaurant notified (via email or WhatsApp webhook)

---

### 3.8 Contact Page

- Google Maps embed (restaurant location in Ongole, Andhra Pradesh)
- Address display
- Click-to-call button (phone number)
- WhatsApp contact button
- Business hours (to be provided by restaurant)

---

## 4. Business Rules & Logic

1. **Direct Order Priority:** All primary CTAs direct users to the on-site checkout or WhatsApp flow. No Zomato/Swiggy links are featured.
2. **Cart Persistence:** Cart contents persist across page navigation within the session (session storage).
3. **WhatsApp Message Generation:** If cart is non-empty when WhatsApp CTA is triggered, the message is auto-populated from cart data. If cart is empty, a default greeting is used.
4. **Razorpay Integration:** Online payment is triggered only when the user selects the online payment option at Step 3. COD requires no payment gateway call.
5. **Function Hall Form Submission:** Guest count must be between 100 and 150. Dates in the past are not selectable.
6. **Review Submission:** Review form collects name, star rating (1–5), and text. Submitted reviews are stored in backend and displayed after moderation (or immediately, per restaurant preference).
7. **Coupon on Review:** Upon successful review submission, a coupon code is displayed to the user.
8. **Menu Filtering:** Filters are combinable and applied client-side in real time. Search is debounced at 300ms.
9. **Urgency & Conversion Tags:** \"Bestseller\", \"Spicy\", \"New\", and \"Hot\" badges are applied per item. \"Save ₹50 vs Zomato\" callout is displayed in the Why Choose Us section and near CTAs.
10. **Delivery Scope:** Free delivery within 10km. Delivery time displayed as 30–35 mins.

---

## 5. Exceptions & Edge Cases

| Scenario | Handling |
|---|---|
| Cart is empty at checkout | Redirect user to Menu page with prompt |
| Razorpay payment fails | Show error message; offer retry or switch to COD |
| Razorpay payment succeeds | Show order confirmation with summary |
| Function hall form: guest count out of range | Inline validation error: \"We accommodate 100–150 guests\" |
| Function hall form: past date selected | Date picker disables past dates |
| Menu search returns no results | Show \"No items found. Try a different search.\" |
| WhatsApp link opens on desktop | Opens WhatsApp Web in new tab |
| Image fails to load | Show branded placeholder with item name |
| Phone number invalid at checkout | Inline validation: \"Please enter a valid 10-digit phone number\" |

---

## 6. Acceptance Criteria

1. Home page hero section renders with full-width visual, CSS animation, headline, subtext, 3 CTA buttons, trust line, and social proof tag.
2. Sticky top navigation is visible and functional on all pages; sticky bottom navigation is visible on mobile.
3. Menu page displays all 8 categories with card-based UI; each card shows image, name, price, description, tags, quantity selector, and \"Add to Stomach\" button.
4. Real-time search filters menu items within 300ms of input; multi-filter combinations work correctly without page reload.
5. Cart drawer opens on cart icon click, reflects real-time item additions/removals, and shows correct subtotal.
6. Checkout completes in exactly 3 steps: Cart Review → Delivery Details → Payment.
7. COD order placement shows confirmation screen with order summary.
8. Razorpay payment gateway triggers on online payment selection; success and failure states are handled with appropriate UI feedback.
9. WhatsApp CTA generates a correctly formatted pre-filled message from cart contents and opens via wa.me link.
10. Function hall booking form validates all required fields, disables past dates, enforces guest count 100–150, and shows confirmation on submission.
11. Google Maps embed loads correctly on the Contact page; click-to-call and WhatsApp buttons are functional.
12. All images use WebP format with lazy loading.
13. Design system is consistently applied: #0F0F0F background, #8B0000 primary, #D4AF37 accents, serif headings, sans-serif body.
14. Website is fully responsive and mobile-first; no layout breakage on screens 320px and above.
15. Review submission form works; coupon code is displayed upon successful submission.

---

## 7. Out of Scope (This Release)

- User authentication / login / account system
- Order tracking / live delivery status
- Loyalty points or rewards program
- Admin dashboard for menu management
- Multi-language support
- Push notifications
- Native mobile app (iOS/Android)
- Automated coupon code generation system (coupon code displayed as static value for now)
- Third-party delivery integrations (Zomato, Swiggy APIs)
- Actual menu item images (to be provided by restaurant before launch)
- Actual business hours, amenities list, and WhatsApp number (to be provided by restaurant)