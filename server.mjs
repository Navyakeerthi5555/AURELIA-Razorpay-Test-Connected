import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

app.use(express.json())

function getRazorpay() {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET === 'REPLACE_ME'
  ) {
    throw new Error(
      'Razorpay server credentials are not configured.'
    )
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

app.post('/api/create-order', async (req, res) => {
  try {
    const amount = Math.round(Number(req.body?.amount || 0))

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const razorpay = getRazorpay()

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `aurelia_${Date.now()}`,
      notes: {
        source: 'AURELIA website'
      }
    })

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: err.message || 'Unable to create order'
    })
  }
})

app.post('/api/verify-payment', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body || {}

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: 'Missing payment fields'
      })
    }

    const expected = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest('hex')

    if (
      !crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(razorpay_signature)
      )
    ) {
      return res.status(400).json({
        error: 'Invalid payment signature'
      })
    }

    res.json({ verified: true })
  } catch (err) {
    console.error(err)

    res.status(400).json({
      error: 'Payment verification failed'
    })
  }
})

/* Serve the production Vite build */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.join(__dirname, 'dist')

app.use(express.static(distPath))

/* React/Vite SPA fallback */

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})
const port = Number(process.env.PORT || 10000)

app.listen(port, '0.0.0.0', () => {
  console.log(`AURELIA running on port ${port}`)
})