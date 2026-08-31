import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  message: string;
  botField?: string; // Honeypot
}

const BookingForm: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<BookingFormData>();

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: BookingFormData) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, (data as any)[key]);
    });
    formData.append('form-name', 'booking');

    try {
      await fetch('/', {
        method: 'POST',
        body: formData,
      });
      console.log(formData)
      setShowSuccess(true);
      reset();

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
       {/* Hidden static fallback form for Netlify */}
       <form name="booking" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="phone" />
        <input type="date" name="date" />
        <input type="number" name="guests" />
        <textarea name="message"></textarea>
      </form>

      {/* Visible Booking Form */}
      <form
        name="booking"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value="booking" />
        <p className="hidden">
          <label>
            Don’t fill this out if you're human:
            <input {...register('botField')} name="bot-field" />
          </label>
        </p>

        {showSuccess && (
          <div className="p-4 rounded-lg bg-green-600 text-white text-center shadow-md">
            Booking request sent successfully! We’ll confirm shortly.
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
            <label htmlFor="date" className="block text-white font-medium mb-2">
              Date
            </label>
            <input
              id="date"
              type="date"
              className="input"
              {...register('date', { required: 'Date is required' })}
              name="date"
            />
            {errors.date && (
              <p className="mt-1 text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="block text-white font-medium mb-2">
            Number of Guests
          </label>
          <input
            id="guests"
            type="number"
            min={1}
            className="input"
            placeholder="How many people?"
            {...register('guests', { required: 'Number of guests is required' })}
            name="guests"
          />
          {errors.guests && (
            <p className="mt-1 text-red-500 text-sm">{errors.guests.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-white font-medium mb-2">
            Special Requests
          </label>
          <textarea
            id="message"
            rows={5}
            className="input"
            placeholder="Anything else we should know?"
            {...register('message')}
            name="message"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-accent w-full md:w-auto"
          >
            {isSubmitting ? 'Sending...' : 'Book Now'}
          </button>
        </div>
      </form>

    </>
  );
};

export default BookingForm;
