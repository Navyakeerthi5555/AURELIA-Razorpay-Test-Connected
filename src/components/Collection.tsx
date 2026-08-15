import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { products, type Product } from '../data/products'
import { addToCart } from './Commerce'

type Filter = 'All' | Product['category']
const filters: Filter[] = ['All', 'Necklaces', 'Sets', 'Rings', 'Earrings', 'High Jewellery']

type Props = {
  onOpenProduct: (p: Product) => void
  cart: {product: Product; quantity:number}[]
  setCart: Dispatch<SetStateAction<{product: Product; quantity:number}[]>>
  wishlist: string[]
  toggleWishlist: (id:string)=>void
}

export default function Collection({ onOpenProduct, cart, setCart, wishlist, toggleWishlist }: Props) {
  const [filter, setFilter] = useState<Filter>('All')
  const visible = useMemo(() => filter === 'All' ? products : products.filter(p => p.category === filter), [filter])
  return <section id="collection" className="section collection">
    <div className="section-head">
      <div className="eyebrow">01 — THE COLLECTION</div>
      <h2>Designed to become<br/><em>part of your story.</em></h2>
      <p>The AURELIA edit is built entirely from the jewellery you provided — arranged by form, occasion and visual character.</p>
    </div>
    <div className="collection-filter" aria-label="Jewellery categories">{filters.map(item=><button key={item} className={filter===item?'filter-active':''} onClick={()=>setFilter(item)}>{item}</button>)}</div>
    <motion.div layout className="product-grid"><AnimatePresence mode="popLayout">{visible.map((p,i)=><motion.article layout key={p.id} className={`product-card accent-${p.accent}`} initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.97}} transition={{duration:.55,delay:Math.min(i*.03,.18)}}>
      <div className="product-visual image-product">
        <motion.img src={p.image} alt={p.name} loading={i<4?'eager':'lazy'} whileHover={{scale:1.05}} transition={{duration:.8}} onClick={()=>onOpenProduct(p)}/>
        <div className="product-overlay"/>
        <div className="product-topline"><span>{p.category}</span><button className={`icon-button ${wishlist.includes(p.id)?'liked':''}`} onClick={()=>toggleWishlist(p.id)}><Heart size={17} fill={wishlist.includes(p.id)?'currentColor':'none'}/></button></div>
        <div className="product-card-actions"><button className="view-pill" onClick={()=>onOpenProduct(p)}>VIEW PIECE</button><button className="bag-pill" onClick={()=>setCart(c=>addToCart(c,p))}><ShoppingBag size={14}/> ADD TO BAG</button></div>
        {p.featured && <span className="featured-tag">SIGNATURE</span>}
      </div>
      <button className="product-meta product-meta-button" onClick={()=>onOpenProduct(p)}><div><div className="product-category">{p.material} · {p.carat}</div><h3>{p.name}</h3></div><div className="product-price">{p.price}</div></button>
    </motion.article>)}</AnimatePresence></motion.div>
  </section>
}
