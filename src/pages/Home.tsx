import { motion } from 'framer-motion'
import type { Dispatch, SetStateAction } from 'react'
import RingScene from '../components/RingScene'
import Collection from '../components/Collection'
import Story from '../components/Story'
import Craftsmanship from '../components/Craftsmanship'
import Footer from '../components/Footer'
import type { Product } from '../data/products'

type CartItem={product:Product;quantity:number}
type Props={onOpenProduct:(p:Product)=>void;cart:CartItem[];setCart:Dispatch<SetStateAction<CartItem[]>>;wishlist:string[];toggleWishlist:(id:string)=>void}
export default function Home({onOpenProduct,cart,setCart,wishlist,toggleWishlist}:Props){return <main>
 <section className="hero"><div className="hero-copy"><motion.div className="eyebrow" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.4}}>THE ART OF ETERNAL BEAUTY</motion.div><motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.55,duration:1}}>JEWELLERY,<br/><em>REIMAGINED.</em></motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}>Sculpted by light.<br/>Crafted for eternity.</motion.p><motion.div className="hero-actions" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:1.05}}><button className="button button-solid" onClick={()=>document.getElementById('collection')?.scrollIntoView({behavior:'smooth'})}>Explore Collection</button><button className="button button-ghost" onClick={()=>document.getElementById('craft')?.scrollIntoView({behavior:'smooth'})}>Discover the Craft</button></motion.div></div><div className="hero-object"><RingScene/><div className="hero-caption">AURELIA · SIGNATURE OBJECT</div></div><div className="scroll-cue"><span/>SCROLL TO EXPLORE</div></section>
 <section className="manifesto"><div className="eyebrow">AURELIA</div><h2>Quiet luxury.<br/><em>Unforgettable light.</em></h2></section>
 <Collection onOpenProduct={onOpenProduct} cart={cart} setCart={setCart} wishlist={wishlist} toggleWishlist={toggleWishlist}/>
 <Story/><Craftsmanship/>
 <section id="gallery" className="gallery"><div className="eyebrow">04 — THE AURELIA GALLERY</div><h2>Pieces chosen<br/><em>to be remembered.</em></h2><div className="gallery-stage image-gallery-stage"><img className="gallery-image gallery-image-one" src="/jewels/3.jpeg" alt="AURELIA jewellery"/><img className="gallery-image gallery-image-two" src="/jewels/7.jpeg" alt="AURELIA jewellery"/><img className="gallery-image gallery-image-three" src="/jewels/d.jpeg" alt="AURELIA jewellery"/><div className="gallery-copy"><span>THE EDIT</span><strong>Rare impressions.<br/><em>Only from your collection.</em></strong></div></div></section>
 <Footer/>
 </main>}
