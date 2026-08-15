# AURELIA — Luxury 3D Jewellery

A cinematic React + TypeScript foundation for the AURELIA luxury jewellery showroom.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Current foundation

- Cinematic loading experience
- Sticky luxury navigation
- Responsive mobile navigation
- Interactive procedural Three.js ring
- Physical-style diamond material
- Studio environment lighting
- Mouse-responsive 3D presentation
- Editorial collection grid
- Story/statistics section
- Craftsmanship timeline
- Gallery atmosphere
- Responsive layouts
- Reduced-motion support

## Next production upgrades

1. Replace procedural jewellery with optimized `.glb/.gltf` models.
2. Add product routes and individual 3D product pages.
3. Add GSAP/ScrollTrigger cinematic timelines.
4. Add Lenis smooth scrolling.
5. Add material switching and product controls.
6. Add search, wishlist, cart and checkout state.
7. Connect Supabase/Firebase.
8. Add real product/reference imagery under `public/references/`.

## AURELIA Collection Update
The collection now uses the supplied jewellery imagery from `public/jewels`, with curated categories, filters, wishlist interactions, image galleries and animated product-detail transitions.

## Prices

Every supplied jewellery piece now has an indicative INR catalogue price. These are presentation prices for the prototype and should be replaced with your real inventory/tax/shipping policy before launch.

## Online payments — Razorpay

The checkout is wired for Razorpay Standard Checkout, with a server-side order endpoint and signature verification. Razorpay requires an order to be created server-side before opening Checkout, and payment verification should happen server-side. See the official docs: https://razorpay.com/docs/developer-tools/integrations/standard-checkout/

1. Create a Razorpay account and generate Test Mode API keys.
2. Copy `.env.example` to `.env`.
3. Put the same Key ID in `VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`.
4. Put the Secret in `RAZORPAY_KEY_SECRET` only.
5. Run `npm install` and `npm run dev`.
6. Test payments in Razorpay Test Mode first. Switch to live keys only after completing your business/KYC/go-live setup.

UPI should use the current UPI Intent/QR flows; Razorpay notes that UPI Collect is deprecated for many web use cases from 28 February 2026.

## Location

Checkout includes a `USE MY LOCATION` button using the browser Geolocation API. The browser will ask the customer for permission. The site then attempts a reverse-geocoding lookup to prefill a readable address. Location is optional; customers can always enter their address manually.

## Razorpay test payments

This version includes a server-side Razorpay order creation and payment-signature verification flow. The supplied Test Key ID is prefilled. Before running payments, open `.env` and replace `PASTE_YOUR_SECRET_HERE` with your Razorpay **Test Key Secret**. Never put the secret in frontend code or commit it to Git.

Run with:

```bash
npm install
npm run dev
```

Then visit http://localhost:5173. Use Razorpay Test Mode payment methods while testing.
