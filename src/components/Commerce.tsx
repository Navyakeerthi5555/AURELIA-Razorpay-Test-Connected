import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, LocateFixed, Minus, Plus, Search, ShoppingBag, Trash2, UserRound, X } from 'lucide-react'
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction, type FormEvent } from 'react'
import type { Product } from '../data/products'

type CartItem = { product: Product; quantity: number }
type LocationState = { latitude:number; longitude:number; address?:string }

type CommerceProps = {
  products: Product[]; cart: CartItem[]; setCart: Dispatch<SetStateAction<CartItem[]>>
  wishlist: string[]; toggleWishlist: (id: string) => void
  searchOpen: boolean; setSearchOpen: (v: boolean) => void
  accountOpen: boolean; setAccountOpen: (v: boolean) => void
  cartOpen: boolean; setCartOpen: (v: boolean) => void
}

export function addToCart(cart: CartItem[], product: Product) {
  const found = cart.find(item => item.product.id === product.id)
  if (found) return cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
  return [...cart, { product, quantity: 1 }]
}

function moneyTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => {
    const n = Number(item.product.price.replace(/[^0-9]/g, '')) || 0
    return sum + n * item.quantity
  }, 0)
}
function formatINR(n:number){ return `₹${n.toLocaleString('en-IN')}` }

declare global { interface Window { Razorpay?: any } }

export default function Commerce({ products, cart, setCart, wishlist, toggleWishlist, searchOpen, setSearchOpen, accountOpen, setAccountOpen, cartOpen, setCartOpen }: CommerceProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [checkout, setCheckout] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginMode, setLoginMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [zoom, setZoom] = useState(false)
  const [location, setLocation] = useState<LocationState | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const [paying, setPaying] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')

  useEffect(() => {
    const handler = (e: Event) => { const p = (e as CustomEvent<Product>).detail; if (p) { setSelected(p); setImageIndex(0); document.body.style.overflow = 'hidden' } }
    document.addEventListener('aurelia:open-product', handler)
    return () => document.removeEventListener('aurelia:open-product', handler)
  }, [])
  useEffect(() => {
    const script=document.createElement('script'); script.src='https://checkout.razorpay.com/v1/checkout.js'; script.async=true; document.body.appendChild(script)
    return () => { script.remove() }
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products.slice(0, 8)
    return products.filter(p => `${p.name} ${p.category} ${p.description} ${p.material}`.toLowerCase().includes(q)).slice(0, 8)
  }, [query, products])
  const total = moneyTotal(cart)
  const openProduct = (p: Product) => { setSelected(p); setImageIndex(0); setCartOpen(false); document.body.style.overflow = 'hidden' }
  const closeProduct = () => { setSelected(null); setZoom(false); document.body.style.overflow = '' }
  const productImages = selected ? [selected.image, ...(selected.gallery ?? [])] : []
  const completeLogin = (e: FormEvent) => { e.preventDefault(); setLoggedIn(true) }

  const useLocation = () => {
    if (!navigator.geolocation) { setLocationMessage('Location is not supported by this browser.'); return }
    setLocationLoading(true); setLocationMessage('Requesting your location…')
    navigator.geolocation.getCurrentPosition(async pos => {
      const loc={latitude:pos.coords.latitude,longitude:pos.coords.longitude}
      setLocation(loc)
      try {
        const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${loc.latitude}&lon=${loc.longitude}`)
        if(r.ok){ const d=await r.json(); setLocation({...loc,address:d.display_name}) }
        setLocationMessage('Location detected and added to your delivery details.')
      } catch { setLocationMessage('Location detected. Address lookup is unavailable, but coordinates were captured.') }
      setLocationLoading(false)
    }, err => { setLocationLoading(false); setLocationMessage(err.code===1?'Please allow location access in your browser.':'Unable to detect your location. Please enter the address manually.') }, {enableHighAccuracy:true,timeout:10000,maximumAge:60000})
  }

  const payWithRazorpay = async () => {
    setPaymentMessage('')
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!key) { setPaymentMessage('Razorpay is not configured yet. Add VITE_RAZORPAY_KEY_ID and connect the server-side order endpoint before accepting live payments.'); return }
    if (!window.Razorpay) { setPaymentMessage('Payment checkout is still loading. Please try again.'); return }
    setPaying(true)
    try {
      const response=await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:total,cart:cart.map(x=>({id:x.product.id,quantity:x.quantity}))})})
      if(!response.ok) throw new Error('Order creation failed')
      const order=await response.json()
      const rzp=new window.Razorpay({key,amount:order.amount,currency:'INR',name:'AURELIA',description:'AURELIA Jewellery',order_id:order.id,prefill:{email},theme:{color:'#d4af6a'},handler:async (response:any)=>{
        const verify=await fetch('/api/verify-payment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(response)})
        if(!verify.ok) throw new Error('Verification failed')
        setOrdered(true); setCart([]); setPaying(false)
      },modal:{ondismiss:()=>setPaying(false)}})
      rzp.open()
    } catch (e) { setPaying(false); setPaymentMessage('Payment could not be started. Make sure the AURELIA payment server and Razorpay keys are configured.') }
  }

  return <>
    <AnimatePresence>{searchOpen && <motion.div className="commerce-layer search-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <button className="layer-close" onClick={() => setSearchOpen(false)}><X/></button><div className="search-panel"><div className="eyebrow">PRIVATE SEARCH</div><div className="search-input-wrap"><Search size={22}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search rings, necklaces, sets..." /></div><div className="search-results">{results.map(p => <button key={p.id} className="search-result" onClick={() => openProduct(p)}><img src={p.image} alt=""/><span><small>{p.category}</small><strong>{p.name}</strong><em>{p.price}</em></span><ArrowLeft size={16}/></button>)}{query && !results.length && <p className="empty-note">No pieces found. Try another search.</p>}</div></div>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>{accountOpen && <motion.div className="commerce-layer account-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button className="layer-close" onClick={() => setAccountOpen(false)}><X/></button><motion.div className="account-panel" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}}><div className="eyebrow">AURELIA PRIVATE CLIENT</div>{loggedIn ? <div className="account-welcome"><UserRound size={32}/><h2>Welcome back.</h2><p>Your private client space is ready for future appointments, saved pieces and orders.</p><button className="button button-solid" onClick={() => setAccountOpen(false)}>CONTINUE EXPLORING</button></div> : <form onSubmit={completeLogin}><h2>{loginMode === 'login' ? 'Enter your private world.' : 'Begin your AURELIA journey.'}</h2><p className="form-note">Save your favourites and move effortlessly from discovery to consultation.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label><button className="button button-solid full" type="submit">{loginMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</button><button className="text-switch" type="button" onClick={() => setLoginMode(loginMode === 'login' ? 'register' : 'login')}>{loginMode === 'login' ? 'New to AURELIA? Create an account' : 'Already a client? Sign in'}</button></form>}</motion.div></motion.div>}</AnimatePresence>

    <AnimatePresence>{cartOpen && <motion.div className="cart-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setCartOpen(false)}><motion.aside className="cart-drawer" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><div className="eyebrow">YOUR BAG</div><h3>{cart.reduce((a,b)=>a+b.quantity,0)} PIECE{cart.reduce((a,b)=>a+b.quantity,0)===1?'':'S'}</h3></div><button onClick={()=>setCartOpen(false)}><X/></button></div><div className="cart-items">{cart.length ? cart.map(item => <div className="cart-item" key={item.product.id}><img src={item.product.image} alt={item.product.name}/><div><small>{item.product.category}</small><h4>{item.product.name}</h4><strong>{item.product.price}</strong><div className="qty"><button onClick={()=>setCart(c=>c.map(x=>x.product.id===item.product.id?{...x,quantity:Math.max(1,x.quantity-1)}:x))}><Minus size={13}/></button><span>{item.quantity}</span><button onClick={()=>setCart(c=>c.map(x=>x.product.id===item.product.id?{...x,quantity:x.quantity+1}:x))}><Plus size={13}/></button></div></div><button className="remove" onClick={()=>setCart(c=>c.filter(x=>x.product.id!==item.product.id))}><Trash2 size={15}/></button></div>) : <div className="cart-empty"><ShoppingBag size={28}/><h3>Your bag is quiet.</h3><p>Discover a piece that belongs with you.</p></div>}</div>{cart.length > 0 && <div className="drawer-bottom"><div><span>CURATED TOTAL</span><strong>{formatINR(total)}</strong></div><button className="button button-solid full" onClick={()=>setCheckout(true)}>PROCEED TO CHECKOUT</button></div>}</motion.aside></motion.div>}</AnimatePresence>

    <AnimatePresence>{selected && <motion.div className="commerce-layer product-detail-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button className="detail-back" onClick={closeProduct}><ArrowLeft size={16}/> BACK TO COLLECTION</button><button className="layer-close" onClick={closeProduct}><X/></button><div className="detail-shell"><div className="detail-media"><motion.div className={`detail-image ${zoom ? 'zoomed':''}`} onClick={()=>setZoom(z=>!z)}><AnimatePresence mode="wait"><motion.img key={productImages[imageIndex]} src={productImages[imageIndex]} alt={selected.name} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.45}}/></AnimatePresence></motion.div><div className="detail-controls"><button onClick={()=>setImageIndex(i=>(i-1+productImages.length)%productImages.length)}><ChevronLeft/></button><span>{imageIndex+1} / {productImages.length}</span><button onClick={()=>setImageIndex(i=>(i+1)%productImages.length)}><ChevronRight/></button><button className="zoom-label" onClick={()=>setZoom(z=>!z)}>{zoom?'RESET':'ZOOM / DETAIL'}</button></div></div><div className="detail-copy"><div className="eyebrow">{selected.category} · AURELIA</div><h1>{selected.name}</h1><p className="detail-description">{selected.description}</p><div className="detail-specs"><div><small>MATERIAL</small><strong>{selected.material}</strong></div><div><small>STONE / DETAIL</small><strong>{selected.carat}</strong></div><div><small>AVAILABILITY</small><strong>READY TO ORDER</strong></div></div><div className="detail-price">{selected.price}</div><div className="detail-actions"><button className="button button-solid" onClick={()=>{setCart(c=>addToCart(c,selected));setCartOpen(true)}}>ADD TO BAG</button><button className={`button button-ghost ${wishlist.includes(selected.id)?'wish-active':''}`} onClick={()=>toggleWishlist(selected.id)}>{wishlist.includes(selected.id)?'SAVED TO WISHLIST':'SAVE TO WISHLIST'}</button></div><p className="detail-note">Prices shown are AURELIA catalogue prices for this prototype and should be confirmed against your final inventory and tax/shipping policy before launch.</p><div className="detail-related"><div className="eyebrow">YOU MAY ALSO ADMIRE</div><div className="related-row">{products.filter(p=>p.category===selected.category && p.id!==selected.id).slice(0,3).map(p=><button key={p.id} onClick={()=>openProduct(p)}><img src={p.image} alt={p.name}/><span>{p.name}</span></button>)}</div></div></div></div></motion.div>}</AnimatePresence>

    <AnimatePresence>{checkout && <motion.div className="commerce-layer checkout-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button className="detail-back" onClick={()=>setCheckout(false)}><ArrowLeft size={16}/> BACK TO BAG</button><button className="layer-close" onClick={()=>setCheckout(false)}><X/></button><div className="checkout-shell">{ordered ? <div className="order-success"><div className="success-mark"><Check/></div><div className="eyebrow">PAYMENT CONFIRMED</div><h1>Your piece is now<br/><em>on its way to you.</em></h1><p>Your payment was verified successfully. AURELIA will contact you with delivery updates.</p><button className="button button-solid" onClick={()=>{setOrdered(false);setCheckout(false);setCartOpen(false)}}>RETURN TO AURELIA</button></div> : <><div className="checkout-form"><div className="eyebrow">SECURE CHECKOUT</div><h1>Complete your<br/><em>order.</em></h1><form onSubmit={e=>e.preventDefault()}><div className="form-grid"><label>First name<input required/></label><label>Last name<input required/></label><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Phone<input required/></label></div><label>Delivery address<input required defaultValue={location?.address || ''}/></label><div className="location-box"><button type="button" className="location-button" onClick={useLocation} disabled={locationLoading}><LocateFixed size={16}/>{locationLoading?'DETECTING LOCATION':'USE MY LOCATION'}</button>{location && <small>Coordinates captured: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</small>}{locationMessage && <span>{locationMessage}</span>}</div><div className="form-grid"><label>City<input required/></label><label>Postal code<input required/></label></div><label>Country<select defaultValue="India"><option>India</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option></select></label><button className="button button-solid full" type="button" onClick={payWithRazorpay} disabled={paying}>{paying?'OPENING SECURE PAYMENT…':`PAY ${formatINR(total)} SECURELY`}</button>{paymentMessage && <p className="payment-message">{paymentMessage}</p>}<small className="secure-note">Secure checkout powered by Razorpay. UPI, cards, netbanking and other methods depend on your Razorpay account configuration.</small></form></div><div className="checkout-summary"><div className="eyebrow">ORDER SUMMARY</div>{cart.map(item=><div className="summary-item" key={item.product.id}><img src={item.product.image}/><span>{item.product.name}<small>{item.quantity} × {item.product.price}</small></span></div>)}<div className="summary-total"><span>TOTAL</span><strong>{formatINR(total)}</strong></div><p>Prices are shown in INR. Taxes and delivery charges can be added to the final checkout once your store policy is configured.</p></div></>}</div></motion.div>}</AnimatePresence>
  </>
}
