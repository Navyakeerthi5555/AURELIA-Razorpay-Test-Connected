import { motion } from 'framer-motion'

export default function Loader({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={() => setTimeout(onDone, 500)}
    >
      <motion.div
        className="loader-brand"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        AURELIA
      </motion.div>
      <motion.div
        className="loader-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="loader-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        THE ART OF ETERNAL BEAUTY
      </motion.div>
    </motion.div>
  )
}
