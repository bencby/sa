# Google Ads Conversion Tracking Setup
## 3 Conversion Points for Sigma Audley

### Overview
The website now tracks 3 distinct conversion points in the checkout funnel:
1. **Add Payment Info** - When user clicks "Continue to Payment" after entering shipping info
2. **Begin Checkout** - When user selects a payment method (PayPal/IBAN/Crypto)
3. **Purchase** - When user confirms "I've sent payment"

---

## Tracking Point 1: Add Payment Info
**When it fires:** After user fills shipping information and clicks "Continue to Payment"  
**URL Pattern:** `sigmaaudley.net/?continue_to_payment=true`  
**Google Ads Event:** `add_payment_info`  
**What it tracks:** Users who completed shipping info and are proceeding to payment selection

### Google Ads Campaign Setup:
- **Goal Type:** Add payment info
- **URL:** `sigmaaudley.net/?continue_to_payment=true`
- **Count:** One per session
- **Value:** Optional (cart value is tracked)

---

## Tracking Point 2: Begin Checkout  
**When it fires:** When user selects a payment method (PayPal, IBAN, or Crypto)  
**URL Pattern:** `sigmaaudley.net/?checkout=started&method=[payment_method]`  
**Google Ads Event:** `begin_checkout`  
**What it tracks:** Serious buyers who have chosen how they want to pay

### Google Ads Campaign Setup:
- **Goal Type:** Begin checkout
- **URL:** `sigmaaudley.net/?checkout=started`
- **Count:** One per session
- **Value:** Optional (cart value is tracked)

---

## Tracking Point 3: Purchase
**When it fires:** When user confirms "I've sent payment"  
**URL Pattern:** `sigmaaudley.net/?purchase=completed&order=[ID]`  
**Google Ads Event:** `purchase`  
**What it tracks:** Completed purchases with order ID

### Google Ads Campaign Setup:
- **Goal Type:** Purchase
- **URL:** `sigmaaudley.net/?purchase=completed`
- **Count:** Every conversion
- **Value:** Use transaction-specific value from gtag event

---

## Implementation Details

### What You Need to Replace:
In the index.html file, replace these placeholders with your actual Google Ads IDs:

1. **Line 14770:** Replace `AW-XXXXXXXXX` with your Google Ads ID for Add Payment Info
2. **Line 14783:** Replace `AW-XXXXXXXXX` with your Google Ads ID for Begin Checkout  
3. **Line 14794:** Replace `AW-XXXXXXXXX/XXXXXXXXX` with your Purchase conversion label

### User Flow:
1. User adds items to cart
2. Clicks "Proceed to Checkout" (no tracking)
3. Fills shipping information
4. Clicks "Continue to Payment" → **TRACKING POINT 1**
5. Selects payment method → **TRACKING POINT 2**
6. Reviews order and payment instructions
7. Clicks "I've sent payment" → **TRACKING POINT 3**
8. Sees thank you page with order details

### Features:
- ✅ No disruption to checkout flow
- ✅ URL parameters auto-cleanup after tracking
- ✅ Works with browser back/forward buttons
- ✅ Tracks cart value at each stage
- ✅ Tracks payment method selection
- ✅ Original thank you page preserved
- ✅ Mobile responsive
- ✅ No external redirects

### Testing:
1. Add items to cart
2. Go through checkout process
3. Watch URL change at each tracking point:
   - `?continue_to_payment=true` after shipping
   - `?checkout=started&method=[type]` after payment selection
   - `?purchase=completed&order=[id]` after confirmation
4. URL cleans itself automatically after tracking

---

## Notes:
- Only real buyers who progress through checkout are tracked
- Window shoppers who just browse are not tracked
- Each tracking point captures progressively more committed buyers
- This creates a proper conversion funnel for optimization