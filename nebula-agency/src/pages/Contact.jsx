import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Tell us a bit more about your project'),
  company: z.string().optional(),
  website: z.string().optional(),
  budget: z.number().min(1000, 'Please select your budget'),
  hp_field: z.string().max(0).optional(),
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formToken, setFormToken] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { budget: 10000 }
  })
  const budgetValue = watch('budget', 10000)

  useEffect(() => {
    // Fetch a signed form token from the server
    ;(async () => {
      try {
        const r = await fetch('/api/form-token', { method: 'GET' })
        if (r.ok) {
          const j = await r.json()
          if (j && typeof j.token === 'string') setFormToken(j.token)
        }
      } catch {}
    })()
  }, [])

  const onSubmit = async (data) => {
    if (data.hp_field) return // honeypot
    if (!formToken) {
      alert('Unable to verify form. Please refresh and try again.')
      return
    }
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, form_token: formToken }),
      })
      if (!resp.ok) throw new Error('Failed to send')
      setSubmitted(true)
      reset({ budget: 10000 })
      setFormToken('')
    } catch (e) {
      alert('There was a problem sending your message. Please try again.')
    }
  }

  return (
    <section id="contact" className="section container">
      <div className="badge">Contact</div>
      <h2 className="display">Let's launch something stellar</h2>
      <p className="subtitle">Share your goals and we'll come back with a roadmap.</p>

      {submitted && (
        <div className="card success-message" style={{ padding: 24, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
          <strong style={{ fontSize: '20px', color: '#fff' }}>Message sent successfully!</strong>
          <p style={{ marginTop: '8px', color: 'rgba(255,255,255,0.8)' }}>We'll be in touch within 1–2 business days.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 20, marginTop: 32, maxWidth: 720 }}>
        <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" {...register('hp_field')} />
        <input type="hidden" {...register('form_token')} value={formToken} readOnly />
        
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="input-group">
            <input 
              type="text"
              autoComplete="name"
              className={`input ${errors.name ? 'error' : ''}`} 
              placeholder="Your name" 
              aria-invalid={errors.name ? 'true' : 'false'}
              {...register('name')} 
              style={{ paddingLeft: 16 }}
            />
            {errors.name && <div className="error-text">{errors.name.message}</div>}
          </div>
          <div className="input-group">
            <input 
              type="email"
              autoComplete="email"
              className={`input ${errors.email ? 'error' : ''}`} 
              placeholder="Email" 
              aria-invalid={errors.email ? 'true' : 'false'}
              {...register('email')} 
              style={{ paddingLeft: 16 }}
            />
            {errors.email && <div className="error-text">{errors.email.message}</div>}
          </div>
        </div>
        
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="input-group">
            <input className="input" placeholder="Company (optional)" {...register('company')} style={{ paddingLeft: 16 }} />
          </div>
          <div className="input-group">
            <input className="input" placeholder="Website (optional)" {...register('website')} style={{ paddingLeft: 16 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ color: 'rgba(255,255,255,0.9)' }}>
            Budget: <strong>${new Intl.NumberFormat('en-US').format(budgetValue)}</strong>
          </label>
          <input
            type="range"
            min={1000}
            max={100000}
            step={1000}
            {...register('budget', { valueAsNumber: true })}
          />
          {errors.budget && <div className="error-text">{errors.budget.message}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            <span>$1k</span>
            <span>$50k</span>
            <span>$100k+</span>
          </div>
        </div>
        
        <div className="input-group">
          <textarea 
            rows={6} 
            className={`input ${errors.message ? 'error' : ''}`} 
            placeholder="Tell us about your project, goals, timeline, and any specific requirements..." 
            {...register('message')} 
            style={{ paddingLeft: 16 }}
          />
          {errors.message && <div className="error-text">{errors.message.message}</div>}
        </div>
        
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
          <button 
            className="btn primary" 
            type="submit" 
            disabled={isSubmitting}
            style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              'Send message'
            )}
          </button>
          <button 
            className="btn" 
            type="reset" 
            onClick={() => reset()}
            style={{ minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  )
}