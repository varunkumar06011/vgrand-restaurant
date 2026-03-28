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
├── Checkout Page (3-step flow)
└── [Global] Cart Bag Drawer + Sticky Bottom Navigation
```

---

### 3.2 Global Elements

#### Sticky Top Navigation
- Logo: Image file — file name: Screenshot 2026-03-28 053614.png, file link: https://miaoda-conversation-file.s3cdn.medo.dev/user-ak8w2f9r7474/conv-ak97oa1kuy2o/20260328/file-ak9wfo88rchs.png — displayed at the top-left of the navigation bar as the restaurant logo
- Brand text (adjacent to logo): V GRAND RESTAURANT (large dominant heading) + Raja of Biryanis (subtitle)
- Nav links: Home | Menu | Function Hall | Contact
- Sticky Order Now CTA button (top-right)
- Cart Bag Icon (top-right, adjacent to Order Now): displays live item count badge; clicking opens the Cart Bag Drawer
- Background: #0F0F0F with gold (#D4AF37) accent on active links

#### Cart Bag Drawer (Global)
- Accessible from any page via the cart bag icon in the top navigation and the Cart tab in the sticky bottom navigation
- Slide-in panel from the right side of the screen
- Displays all currently selected items with:
  - Item image thumbnail
  - Item name
  - Unit price
  - Quantity controls (− / count / +)
  - Line total per item
  - Remove item option
- Order subtotal displayed at the bottom of the item list
- Proceed to Checkout button (primary CTA) at the bottom
- Empty state message: Your cart is empty. Start ordering!
- Live badge count on the cart icon updates in real time as items are added or removed

#### Sticky Bottom Navigation (Mobile Only)
- Five tabs: Home | Menu | Cart | WhatsApp | Call
- Cart tab shows live badge count reflecting items in the Cart Bag Drawer
- WhatsApp tab opens wa.me link
- Call tab triggers click-to-call

#### Sticky WhatsApp Floating Button
- Visible on all pages (desktop + mobile)
- Opens WhatsApp order flow

---

### 3.3 Home Page

#### Hero Section
- Full-width background: biryani/Kumbhakarna visual (WebP, lazy-loaded)
- Lightweight CSS smoke/steam animation overlay
- Headline: Raja of Biryanis in Ongole (bold serif, dominant)
- Subtext: Authentic Andhra flavors. Order directly. No extra charges.
- CTA Buttons (in order):
  1. Order Now — primary (Deep Red #8B0000, gold border)
  2. Order on WhatsApp — secondary (WhatsApp green)
  3. View Location — tertiary (outlined)
- Trust Line: Free delivery within 10km • ₹50 extra charge beyond 10km • Delivered in 30–35 mins
- Social Proof Tag: Top Rated on Zomato in Ongole

#### Featured Biryanis Section
- Section title: Our Bestsellers
- Horizontal scroll card row (mobile) / 3-column grid (desktop)
- Each card: image, name, price, Bestseller badge, Add to Cart button
- Highlight top 4–6 biryani items

#### Why Choose Us Section
- 4 icon + text tiles:
  1. No extra charges vs Zomato (highlight: Save ₹50 vs Zomato)
  2. Authentic Andhra taste
  3. Fast delivery (30–35 mins)
  4. Hygienic cooking
- Background: dark card with gold icon accents

#### Reviews Section
- 5–6 review cards (name, star rating, review text, date)
- Submit a Review & Get a Coupon CTA below
- Review submission opens a simple modal form (name, rating, text)

#### Function Hall Preview Section
- 1–2 warm-toned realistic hall images (WebP)
- Capacity: 100–150 guests
- Short description
- CTA: Book Function Hall → links to Function Hall page

#### Repeat CTA Section
- Full-width dark band
- Headline: Hungry? Order Now and Skip the Queue.
- CTA: Order Now + Order on WhatsApp

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
- Add to Stomach button (primary CTA) — adds item to the Cart Bag Drawer
- Customization option (expandable): spice level selector + add-ons (if applicable)

#### Menu Categories & Items
Biryani (highlighted first, featured section at top):
- Chicken Biryani, Mutton Biryani, Egg Biryani, Veg Biryani, Prawn Biryani, Special Kumbhakarna Biryani (and others as provided by restaurant)

Veg Starters, Non-Veg Starters, Veg Main Course, Non-Veg Main Course, Rice & Noodles, Snacks, Desserts:
- Items populated per restaurant's actual menu data
- Placeholder structure maintained for all categories

*Note: Actual menu item names, prices, descriptions, and images must be provided by the restaurant before launch. The PRD defines the data structure; content is to be filled in.*

---

### 3.5 Cart Bag Drawer

- Accessible globally via the cart bag icon in the top navigation and the Cart tab in the sticky bottom navigation
- Slide-in panel from the right side of the screen
- Displays all currently selected items:
  - Item image thumbnail
  - Item name
  - Unit price
  - Quantity controls (− / count / +)
  - Line total per item
  - Remove item (×) button per item
- Order subtotal displayed at the bottom of the item list
- Proceed to Checkout button (primary CTA) navigates user to the Checkout Page (Step 1)
- Empty state: Your cart is empty. Start ordering!
- Cart bag icon badge updates in real time across all pages

---

### 3.6 Checkout Page (3-Step Flow)

The Checkout Page is a dedicated page with a visible step indicator showing the current step: Cart Review → Delivery Details → Payment.

#### Step 1: Cart Review
- Full cart summary listing all selected items:
  - Item image thumbnail
  - Item name
  - Quantity controls (− / count / +)
  - Line total per item
  - Remove item option
- Order subtotal displayed
- Delivery fee displayed:
  - Free delivery if delivery distance is within 10km
  - ₹50 extra delivery charge if delivery distance exceeds 10km
  - Delivery fee line item updates accordingly and is clearly labeled
- Grand total displayed (subtotal + applicable delivery fee)
- Continue button proceeds to Step 2
- If cart is empty: redirect user to Menu page with prompt

#### Step 2: Delivery Details
- Input fields:
  - Name (text, required)
  - Phone Number (tel, required — 10-digit validation)
  - Delivery Address (textarea, required)
- Distance input or note: a prompt is shown informing the user that deliveries beyond 10km incur an additional ₹50 charge; the delivery fee in Step 1 and Step 3 updates based on the address provided (if distance can be estimated) or defaults to showing both fee tiers with a note
- Basic inline validation on all required fields
- Continue button proceeds to Step 3
- Back button returns to Step 1

#### Step 3: Payment
- Order summary recap (items, subtotal, delivery fee — free or ₹50 extra as applicable, grand total)
- Payment options:
  - COD (Cash on Delivery) — default selected
  - Online Payment (Razorpay / UPI)
- If COD selected:
  - Place Order button submits the order
  - On success: order confirmation screen with order summary and estimated delivery time (30–35 mins)
- If Online Payment selected:
  - Place Order button triggers Razorpay payment gateway
  - On payment success: order confirmation screen with order summary and estimated delivery time
  - On payment failure: error message displayed with Retry Payment option and option to switch to COD
- Back button returns to Step 2

#### Order Confirmation Screen
- Displayed after successful order placement (COD or online payment)
- Shows:
  - Order confirmation message
  - Order summary (items ordered, total amount, delivery fee applied, payment method)
  - Estimated delivery time: 30–35 mins
  - CTA: Order More (returns to Menu page)

---

### 3.7 WhatsApp Order Flow

- Triggered by Order on WhatsApp CTA (hero, sticky nav, bottom nav, floating button)
- If cart has items: auto-generate message from cart contents
  - Format:
    ```
    Hi, I want to order:
    - [Item Name] x[Qty]
    - [Item Name] x[Qty]
    Subtotal: ₹[XXX]
    Delivery: Free / ₹50 extra (beyond 10km)
    Total: ₹[XXX]
    ```
- If cart is empty: open WhatsApp with generic greeting message
- Opens via wa.me/[restaurant WhatsApp number] with pre-filled message (URL-encoded)

---

### 3.8 Function Hall Page

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
- CTA: Check Availability
- On submit: form data stored in backend; confirmation message shown to user; restaurant notified (via email or WhatsApp webhook)

---

### 3.9 Contact Page

- Google Maps embed (restaurant location in Ongole, Andhra Pradesh)
- Address display
- Click-to-call button (phone number)
- WhatsApp contact button
- Business hours (to be provided by restaurant)

---

## 4. Business Rules & Logic

1. **Direct Order Priority:** All primary CTAs direct users to the on-site checkout or WhatsApp flow. No Zomato/Swiggy links are featured.
2. **Cart Persistence:** Cart contents persist across page navigation within the session (session storage). The Cart Bag Drawer reflects the current cart state at all times.
3. **Cart Bag Icon Badge:** The cart icon badge in the top navigation and the Cart tab in the sticky bottom navigation display the live total item count and update in real time.
4. **WhatsApp Message Generation:** If cart is non-empty when WhatsApp CTA is triggered, the message is auto-populated from cart data including the applicable delivery fee. If cart is empty, a default greeting is used.
5. **Razorpay Integration:** Online payment is triggered only when the user selects the online payment option at Step 3. COD requires no payment gateway call.
6. **Checkout Step Progression:** Users must complete each step in sequence (Step 1 → Step 2 → Step 3). Navigation back to a previous step is permitted.
7. **Checkout Cart Validation:** If the cart is empty when the user attempts to access the Checkout Page, they are redirected to the Menu page with a prompt to add items.
8. **Delivery Fee Rule:** Delivery is free for addresses within 10km of the restaurant. An additional ₹50 delivery charge applies for addresses beyond 10km. This fee is clearly displayed in the cart review, order summary, and order confirmation screens.
9. **Function Hall Form Submission:** Guest count must be between 100 and 150. Dates in the past are not selectable.
10. **Review Submission:** Review form collects name, star rating (1–5), and text. Submitted reviews are stored in backend and displayed after moderation (or immediately, per restaurant preference).
11. **Coupon on Review:** Upon successful review submission, a coupon code is displayed to the user.
12. **Menu Filtering:** Filters are combinable and applied client-side in real time. Search is debounced at 300ms.
13. **Urgency & Conversion Tags:** Bestseller, Spicy, New, and Hot badges are applied per item. Save ₹50 vs Zomato callout is displayed in the Why Choose Us section and near CTAs.
14. **Delivery Scope:** Free delivery within 10km; ₹50 extra charge beyond 10km. Delivery time displayed as 30–35 mins.

---

## 5. Exceptions & Edge Cases

| Scenario | Handling |
|---|---|
| Cart is empty at checkout | Redirect user to Menu page with prompt |
| Cart is empty when Cart Bag Drawer is opened | Show empty state: Your cart is empty. Start ordering! |
| Razorpay payment fails | Show error message; offer retry or switch to COD |
| Razorpay payment succeeds | Show order confirmation with summary |
| Function hall form: guest count out of range | Inline validation error: We accommodate 100–150 guests |
| Function hall form: past date selected | Date picker disables past dates |
| Menu search returns no results | Show No items found. Try a different search. |
| WhatsApp link opens on desktop | Opens WhatsApp Web in new tab |
| Image fails to load | Show branded placeholder with item name |
| Phone number invalid at checkout | Inline validation: Please enter a valid 10-digit phone number |
| User navigates away mid-checkout | Cart contents preserved in session storage; user can resume |
| Delivery distance exceeds 10km | ₹50 extra delivery charge applied and clearly shown in cart, order summary, and confirmation |

---

## 6. Acceptance Criteria

1. Home page hero section renders with full-width visual, CSS animation, headline, subtext, 3 CTA buttons, trust line (including ₹50 extra charge note for beyond 10km), and social proof tag.
2. Sticky top navigation is visible and functional on all pages; the uploaded logo image is displayed at the top-left; cart bag icon with live badge count is visible in the top navigation on all pages.
3. Sticky bottom navigation is visible on mobile with Cart tab showing live badge count.
4. Cart Bag Drawer opens on cart icon click from any page, displays all selected items with image, name, quantity controls, line total, and remove option, and shows correct subtotal.
5. Cart Bag Drawer Proceed to Checkout button navigates to the Checkout Page Step 1.
6. Menu page displays all 8 categories with card-based UI; each card shows image, name, price, description, tags, quantity selector, and Add to Stomach button.
7. Real-time search filters menu items within 300ms of input; multi-filter combinations work correctly without page reload.
8. Checkout Page displays a 3-step progress indicator: Cart Review → Delivery Details → Payment.
9. Step 1 (Cart Review) shows full cart summary with editable quantities, subtotal, delivery fee (free within 10km / ₹50 extra beyond 10km), and grand total.
10. Step 2 (Delivery Details) validates Name, Phone Number (10-digit), and Delivery Address as required fields with inline error messages; delivery fee note is displayed.
11. Step 3 (Payment) displays order summary recap including correct delivery fee and payment options (COD default, Razorpay/UPI).
12. COD order placement shows order confirmation screen with order summary (including delivery fee applied) and estimated delivery time.
13. Razorpay payment gateway triggers on online payment selection; success and failure states are handled with appropriate UI feedback including retry and COD fallback options.
14. WhatsApp CTA generates a correctly formatted pre-filled message from cart contents including applicable delivery fee and opens via wa.me link.
15. Function hall booking form validates all required fields, disables past dates, enforces guest count 100–150, and shows confirmation on submission.
16. Google Maps embed loads correctly on the Contact page; click-to-call and WhatsApp buttons are functional.
17. All images use WebP format with lazy loading.
18. Design system is consistently applied: #0F0F0F background, #8B0000 primary, #D4AF37 accents, serif headings, sans-serif body.
19. Website is fully responsive and mobile-first; no layout breakage on screens 320px and above.
20. Review submission form works; coupon code is displayed upon successful submission.
21. ₹50 extra delivery charge is correctly applied, displayed, and included in all order totals whenever the delivery distance exceeds 10km.

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
- Automated distance detection from delivery address (distance-based fee is applied based on user acknowledgment or manual input in this release)