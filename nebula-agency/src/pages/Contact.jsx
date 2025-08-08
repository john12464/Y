import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Tell us a bit more about your project')
})

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 800))
    alert('Thanks! We\'ll be in touch soon.')
    reset()
  }

  return (
    <section id="contact" className="section container">
      <div className="badge">Contact</div>
      <h2 className="display">Let’s launch something stellar</h2>
      <p className="subtitle">Share your goals and we’ll come back with a roadmap.</p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 14, marginTop: 22, maxWidth: 720 }}>
        <div>
          <input className={`input ${errors.name ? 'error' : ''}`} placeholder="Your name" {...register('name')} />
          {errors.name && <div className="error-text">{errors.name.message}</div>}
        </div>
        <div>
          <input className={`input ${errors.email ? 'error' : ''}`} placeholder="Email" {...register('email')} />
          {errors.email && <div className="error-text">{errors.email.message}</div>}
        </div>
        <div>
          <textarea rows={6} className={`input ${errors.message ? 'error' : ''}`} placeholder="Tell us about your project" {...register('message')} />
          {errors.message && <div className="error-text">{errors.message.message}</div>}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}</button>
          <button className="btn" type="reset" onClick={() => reset()}>Reset</button>
        </div>
      </form>
    </section>
  )
}