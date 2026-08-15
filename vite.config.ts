import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'node:crypto'

function razorpayPlugin(): Plugin {
  return {
    name: 'aurelia-razorpay-api',
    configureServer(server) {
      server.middlewares.use('/api/create-order', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode=405; return res.end('Method Not Allowed') }
        let body=''; req.on('data', c => body += c); req.on('end', async () => {
          try {
            const { amount } = JSON.parse(body || '{}')
            const keyId=process.env.RAZORPAY_KEY_ID, keySecret=process.env.RAZORPAY_KEY_SECRET
            if(!keyId || !keySecret) throw new Error('Missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET')
            const auth=Buffer.from(`${keyId}:${keySecret}`).toString('base64')
            const r=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({amount:Number(amount),currency:'INR',receipt:`aurelia_${Date.now()}`})})
            const data=await r.json(); res.statusCode=r.status; res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(data))
          } catch(e:any){ res.statusCode=500; res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({error:e.message})) }
        })
      })
      server.middlewares.use('/api/verify-payment', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode=405; return res.end('Method Not Allowed') }
        let body=''; req.on('data', c => body += c); req.on('end', () => {
          try {
            const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=JSON.parse(body || '{}')
            const secret=process.env.RAZORPAY_KEY_SECRET
            if(!secret) throw new Error('Missing RAZORPAY_KEY_SECRET')
            const expected=crypto.createHmac('sha256',secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex')
            if(expected!==razorpay_signature){res.statusCode=400; return res.end(JSON.stringify({verified:false}))}
            res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({verified:true}))
          } catch(e:any){res.statusCode=500; res.end(JSON.stringify({error:e.message}))}
        })
      })
    }
  }
}

export default defineConfig({ plugins: [react(), razorpayPlugin()] })
