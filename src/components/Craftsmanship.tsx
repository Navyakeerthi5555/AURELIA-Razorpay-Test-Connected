import { motion } from 'framer-motion'

const steps = ['DESIGN', 'SCULPT', 'SET', 'POLISH', 'PERFECT']

export default function Craftsmanship() {
  return (
    <section id="craft" className="craft">
      <div className="craft-title">
        <div className="eyebrow">03 — THE CRAFT</div>
        <h2>Crafted by hand.<br/><em>Perfected by time.</em></h2>
      </div>
      <div className="craft-steps">
        {steps.map((s, i) => (
          <motion.div
            className="craft-step"
            key={s}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: i * 0.08 }}
          >
            <span>0{i + 1}</span>
            <strong>{s}</strong>
            <i/>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
