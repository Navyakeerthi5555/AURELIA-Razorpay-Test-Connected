export type Product = {
  id: string
  name: string
  category: 'Necklaces' | 'Sets' | 'Rings' | 'Earrings' | 'High Jewellery'
  price: string
  description: string
  material: string
  carat: string
  accent: string
  image: string
  gallery?: string[]
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 'roseline-set',
    name: 'Roseline Étoile',
    category: 'Sets',
    price: '₹1,48,500',
    description: 'A luminous floral suite with a soft rose-toned finish, designed to move from ceremony to evening.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'rose',
    image: '/jewels/2.jpeg',
    gallery: ['/jewels/10.jpeg', '/jewels/11.jpeg', '/jewels/1.jpeg'],
    featured: true
  },
  {
    id: 'emerald-garden',
    name: 'Emerald Garden',
    category: 'High Jewellery',
    price: '₹2,18,000',
    description: 'Deep green stones arranged in a botanical cascade with a distinctly regal silhouette.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'green',
    image: '/jewels/7.jpeg',
    gallery: ['/jewels/12.jpeg', '/jewels/8.jpeg'],
    featured: true
  },
  {
    id: 'violet-bloom',
    name: 'Violet Bloom',
    category: 'Sets',
    price: '₹1,32,500',
    description: 'A sculptural violet necklace and earring pairing with soft floral rhythm and luminous highlights.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'violet',
    image: '/jewels/d.jpeg',
    gallery: ['/jewels/r.jpeg'],
    featured: true
  },
  {
    id: 'maharani-heirloom',
    name: 'Maharani Heirloom',
    category: 'High Jewellery',
    price: '₹2,75,000',
    description: 'An ornate layered suite inspired by traditional grandeur, composed for the most ceremonial moments.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'gold',
    image: '/jewels/3.jpeg',
    gallery: ['/jewels/a.jpeg', '/jewels/v.jpeg'],
    featured: true
  },
  {
    id: 'celestial-blue',
    name: 'Celestial Blue',
    category: 'Rings',
    price: '₹68,500',
    description: 'A cool blue centre stone framed by a delicate halo and sculpted side stones.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'blue',
    image: '/jewels/13.jpeg',
    gallery: ['/jewels/c.jpeg']
  },
  {
    id: 'aurum-halo',
    name: 'Aurum Halo',
    category: 'Rings',
    price: '₹54,900',
    description: 'A warm gold band with a refined pavé centre, balancing classic proportion with modern polish.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'gold',
    image: '/jewels/14.jpeg',
    gallery: ['/jewels/b.jpeg']
  },
  {
    id: 'florence-pendant',
    name: 'Florence Pendant',
    category: 'Necklaces',
    price: '₹42,500',
    description: 'A fine chain carrying a small floral pendant, made for understated everyday luminosity.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'blush',
    image: '/jewels/4.jpeg',
    gallery: ['/jewels/k.jpeg', '/jewels/m.jpeg']
  },
  {
    id: 'lumiere-floral',
    name: 'Lumière Floral',
    category: 'Sets',
    price: '₹1,18,000',
    description: 'A delicate floral necklace and earring set captured in soft light, with a romantic evening character.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'rose',
    image: '/jewels/g.jpeg',
    gallery: ['/jewels/s.jpeg', '/jewels/x.jpeg']
  },
  {
    id: 'solstice-pendant',
    name: 'Solstice Pendant',
    category: 'Necklaces',
    price: '₹36,500',
    description: 'A minimal drop pendant suspended from a fine chain for a quiet, polished signature.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'gold',
    image: '/jewels/o.jpeg',
    gallery: ['/jewels/p.jpeg', '/jewels/n.jpeg']
  },
  {
    id: 'aurora-duet',
    name: 'Aurora Duet',
    category: 'Sets',
    price: '₹92,000',
    description: 'A fine necklace and matching earrings defined by delicate sparkle and graceful proportion.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'champagne',
    image: '/jewels/h.jpeg',
    gallery: ['/jewels/i.jpeg', '/jewels/q.jpeg']
  },
  {
    id: 'ruby-serenade',
    name: 'Ruby Serenade',
    category: 'Earrings',
    price: '₹48,500',
    description: 'Elegant drop earrings with rich pink-red stones and a poised evening silhouette.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'ruby',
    image: '/jewels/r.jpeg',
    gallery: ['/jewels/u.jpeg']
  },
  {
    id: 'gardenia-stud',
    name: 'Gardenia Studs',
    category: 'Earrings',
    price: '₹29,500',
    description: 'Petite floral earrings with a clean, luminous profile designed to layer effortlessly.',
    material: 'DETAILS ON REQUEST',
    carat: 'CURATED PIECE',
    accent: 'rose',
    image: '/jewels/6.jpeg',
    gallery: ['/jewels/j.jpeg', '/jewels/l.jpeg']
  }
]
