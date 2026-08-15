import { motion } from 'framer-motion'

export default function Story() {
  return (
    <section id="story" className="story">
      <div className="story-image"><div className="story-glow"/></div>
      <div className="story-copy">
        <div className="eyebrow">02 — OUR STORY</div>
        <h2>Beyond<br/><em>jewellery.</em></h2>
        <p>AURELIA creates jewellery where architecture, light, and craftsmanship meet. Every silhouette begins as an idea, becomes a study in proportion, and is finished by hand.</p>
        <div className="stats">
          <div><strong>2026</strong><span>Founded</span></div>
          <div><strong>12K+</strong><span>Pieces Crafted</span></div>
          <div><strong>48</strong><span>Master Artisans</span></div>
          <div><strong>18</strong><span>Countries</span></div>
        </div>
      </div>
    </section>
  )
}
