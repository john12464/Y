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
  budget: z.number().min(1000, 'Please select your budget'),
  hp_field: z.string().max(0).optional(), // honeypot anti-spam
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { budget: 10000 }
  })

  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://hook.eu2.make.com/19fr1x1xt1rxah29g9w8ywaccysejb3z", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitted(true)
        reset()
      } else {
        alert("There was an error submitting the form.")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Network error. Please try again later.")
    }
  }

  if (submitted) {
    return <p className="text-green-600">✅ Thanks! Your message has been sent.</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("name")}
        placeholder="Your Name"
        className="border p-2 w-full"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input
        {...register("email")}
        placeholder="Your Email"
        type="email"
        className="border p-2 w-full"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <textarea
        {...register("message")}
        placeholder="Your Message"
        className="border p-2 w-full"
      />
      {errors.message && <p className="text-red-500">{errors.message.message}</p>}

      <input
        {...register("company")}
        placeholder="Company (optional)"
        className="border p-2 w-full"
      />

      <input
        {...register("website")}
        placeholder="Website (optional)"
        className="border p-2 w-full"
      />

      <input
        {...register("budget", { valueAsNumber: true })}
        type="number"
        placeholder="Budget"
        className="border p-2 w-full"
      />
      {errors.budget && <p className="text-red-500">{errors.budget.message}</p>}

      {/* Hidden honeypot field */}
      <input
        {...register("hp_field")}
        type="text"
        style={{ display: "none" }}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}
