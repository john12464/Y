import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Tell us a bit more about your project'),
  company: z.string().optional(),
  website: z.string().optional(),
  hp_field: z.string().max(0).optional(),
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    if (data.hp_field) return // honeypot
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          company: data.company,
          website: data.website,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to send')
      }
      setSubmitted(true)
      reset()
    } catch (err) {
      alert('There was an issue sending your message. Please try again later.')
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
        
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="input-group">
            <div className="input-icon">👤</div>
            <input 
              className={`input ${errors.name ? 'error' : ''}`} 
              placeholder="Your name" 
              {...register('name')} 
            />
            {errors.name && <div className="error-text">{errors.name.message}</div>}
          </div>
          <div className="input-group">
            <div className="input-icon">📧</div>
            <input 
              className={`input ${errors.email ? 'error' : ''}`} 
              placeholder="Email" 
              {...register('email')} 
            />
            {errors.email && <div className="error-text">{errors.email.message}</div>}
          </div>
        </div>
        
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="input-group">
            <div className="input-icon">🏢</div>
            <input className="input" placeholder="Company (optional)" {...register('company')} />
          </div>
          <div className="input-group">
            <div className="input-icon">🌐</div>
            <input className="input" placeholder="Website (optional)" {...register('website')} />
          </div>
        </div>
        
        <div className="input-group">
          <div className="input-icon">💬</div>
          <textarea 
            rows={6} 
            className={`input ${errors.message ? 'error' : ''}`} 
            placeholder="Tell us about your project, goals, timeline, and any specific requirements..." 
            {...register('message')} 
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
              <>
                📤 Send message
              </>
            )}
          </button>
          <button 
            className="btn" 
            type="reset" 
            onClick={() => reset()}
            style={{ minWidth: '120px' }}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  )
}