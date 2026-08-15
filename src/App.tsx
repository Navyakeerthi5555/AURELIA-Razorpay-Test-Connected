import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Commerce from './components/Commerce'
import { products, type Product } from './data/products'

type CartItem = { product: Product; quantity: number }

export default function App() {
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('aurelia-cart') || '[]')
      if (!Array.isArray(saved)) return []
      // Always hydrate saved cart items from the current catalogue. This prevents
      // stale localStorage data (including old "PRICE ON REQUEST" products)
      // from overriding the current AURELIA prices.
      return saved.flatMap((item: any) => {
        const current = products.find(p => p.id === item?.product?.id || p.id === item?.id)
        if (!current) return []
        const quantity = Math.max(1, Number(item?.quantity) || 1)
        return [{ product: current, quantity }]
      })
    } catch { return [] }
  })
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('aurelia-wishlist') || '[]') } catch { return [] }
  })
  useEffect(() => { localStorage.setItem('aurelia-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('aurelia-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const toggleWishlist = (id: string) => setWishlist(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])

  return <>
    <AnimatePresence mode="wait">{loading && <Loader key="loader" onDone={() => setLoading(false)} />}</AnimatePresence>
    <motion.div initial={{opacity:0}} animate={{opacity:loading?0:1}} transition={{duration:.9,ease:[0.16,1,0.3,1]}}>
      <Navbar onSearch={()=>setSearchOpen(true)} onAccount={()=>setAccountOpen(true)} onWishlist={()=>document.getElementById('collection')?.scrollIntoView({behavior:'smooth'})} onBag={()=>setCartOpen(true)} cartCount={cart.reduce((a,b)=>a+b.quantity,0)} wishlistCount={wishlist.length}/>
      <Home onOpenProduct={(p:Product)=>{setSearchOpen(false); window.scrollTo({top:0,behavior:'smooth'}); setTimeout(()=>document.dispatchEvent(new CustomEvent('aurelia:open-product',{detail:p})),20)}} cart={cart} setCart={setCart} wishlist={wishlist} toggleWishlist={toggleWishlist}/>
      <Commerce products={products} cart={cart} setCart={setCart} wishlist={wishlist} toggleWishlist={toggleWishlist} searchOpen={searchOpen} setSearchOpen={setSearchOpen} accountOpen={accountOpen} setAccountOpen={setAccountOpen} cartOpen={cartOpen} setCartOpen={setCartOpen}/>
    </motion.div>
  </>
}
