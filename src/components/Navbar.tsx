import { useEffect, useState } from 'react'
import { Menu, Search, UserRound, Heart, ShoppingBag, X } from 'lucide-react'

const links = [['Collection','collection'],['High Jewellery','gallery'],['Our Story','story'],['Craftsmanship','craft']] as const

type Props={onSearch:()=>void;onAccount:()=>void;onWishlist:()=>void;onBag:()=>void;cartCount:number;wishlistCount:number}
export default function Navbar({onSearch,onAccount,onWishlist,onBag,cartCount,wishlistCount}:Props){
 const [scrolled,setScrolled]=useState(false),[open,setOpen]=useState(false)
 useEffect(()=>{const f=()=>setScrolled(scrollY>40);addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[])
 const go=(id:string)=>{setOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
 return <>
 <header className={`nav ${scrolled?'nav-scrolled':''}`}><button className="brand" onClick={()=>scrollTo({top:0,behavior:'smooth'})}>AURELIA</button><nav className="nav-links">{links.map(([label,id])=><button key={id} onClick={()=>go(id)}>{label}</button>)}</nav><div className="nav-actions"><button aria-label="Search" onClick={onSearch}><Search size={17}/></button><button aria-label="Account" onClick={onAccount}><UserRound size={17}/></button><button aria-label="Wishlist" onClick={onWishlist} className="nav-badge-wrap"><Heart size={17}/>{wishlistCount>0&&<i>{wishlistCount}</i>}</button><button aria-label="Shopping bag" onClick={onBag} className="nav-badge-wrap"><ShoppingBag size={17}/>{cartCount>0&&<i>{cartCount}</i>}</button></div><button className="mobile-menu" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu/></button></header>
 {open&&<div className="mobile-overlay"><button className="mobile-close" onClick={()=>setOpen(false)}><X/></button><div className="mobile-brand">AURELIA</div><div className="mobile-links">{links.map(([label,id])=><button key={id} onClick={()=>go(id)}>{label}</button>)}<button onClick={()=>{setOpen(false);onSearch()}}>Search</button><button onClick={()=>{setOpen(false);onAccount()}}>Private Client</button><button onClick={()=>{setOpen(false);onBag()}}>Bag {cartCount>0?`(${cartCount})`:''}</button></div><div className="mobile-tag">JEWELLERY, REIMAGINED.</div></div>}
 </>
}
