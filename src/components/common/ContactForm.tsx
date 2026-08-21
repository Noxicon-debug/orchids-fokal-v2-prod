import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  botField?: string; // Honeypot
}

const ContactForm: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<FormData>();

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    // Build form payload for Netlify
    const formData = new FormData();
    Object.keys(data).map((key) => {
      console.log(data)
      formData.append(key, (data as any)[key]);
    });
    formData.append('form-name', 'contact');

    try {
      await fetch('/', {
        method: 'POST',
        body: formData,
      });

      setShowSuccess(true);
      reset();

      // Optional: auto-hide success message
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      {/* Visible React Hook Form */}
      <form
        name="contact"
        netlify
        data-netlify="false"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don’t fill this out if you're human:
            <input {...register('botField')} name="bot-field" />
          </label>
        </p>

        {showSuccess && (
          <div className="p-4 rounded-lg bg-green-600 text-white text-center shadow-md">
            Message sent successfully! We’ll get back to you soon.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
              name="name"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="Your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              name="email"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-white font-medium mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              className="input"
              placeholder="Your phone number"
              {...register('phone')}
              name="phone"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-white font-medium mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              className="input"
              placeholder="Subject"
              {...register('subject', { required: 'Subject is required' })}
              name="subject"
            />
            {errors.subject && (
              <p className="mt-1 text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-white font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="input"
            placeholder="Your message"
            {...register('message', { required: 'Message is required' })}
            name="message"
          />
          {errors.message && (
            <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-accent w-full md:w-auto"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      {/* Hidden static fallback form for Netlify detection */}
      <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="phone" />
        <input type="text" name="subject" />
        <textarea name="message"></textarea>
      </form>
    </>
  );
};

export default ContactForm;
