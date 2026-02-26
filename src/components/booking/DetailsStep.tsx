import { useState } from 'react';
import { User, Mail, Phone, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';

interface DetailsStepProps {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onDetailsChange: (data: { customerName?: string; customerEmail?: string; customerPhone?: string }) => void;
  onNext: (bookingId: string) => void;
  onBack: () => void;
  bookingData: {
    date: string;
    time: string;
    serviceType: string;
    servicePrice: number;
    vehicleType: string;
  };
}

export function DetailsStep({
  customerName,
  customerEmail,
  customerPhone,
  onDetailsChange,
  onNext,
  onBack,
  bookingData
}: DetailsStepProps) {
  const [name, setName] = useState(customerName || '');
  const [email, setEmail] = useState(customerEmail || '');
  const [phone, setPhone] = useState(customerPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: submitError } = await supabase
        .from('bookings')
        .insert([
          {
            booking_date: bookingData.date,
            booking_time: bookingData.time,
            service_type: bookingData.serviceType,
            service_price: bookingData.servicePrice,
            vehicle_type: bookingData.vehicleType,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            status: 'confirmed'
          }
        ])
        .select()
        .single();

      if (submitError) throw submitError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/functions/v1/send-booking-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: data.id,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          booking_date: bookingData.date,
          booking_time: bookingData.time,
          service_type: bookingData.serviceType,
          service_price: bookingData.servicePrice,
          vehicle_type: bookingData.vehicleType,
        }),
      });

      onDetailsChange({ customerName: name, customerEmail: email, customerPhone: phone });
      onNext(data.id);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-900">Your Information</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            Your Name
          </label>
          <Input
            type="text"
            placeholder="Alex Jon"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              onDetailsChange({ customerName: e.target.value });
            }}
            className="h-12"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Your Email
          </label>
          <Input
            type="email"
            placeholder="Alex Jon"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              onDetailsChange({ customerEmail: e.target.value });
            }}
            className="h-12"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <Input
            type="tel"
            placeholder="+70 343-521-34"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              onDetailsChange({ customerPhone: e.target.value });
            }}
            className="h-12"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          We'll use your information to confirm your booking and send you a reminder before your appointment
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 text-gray-700 border-gray-300"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!name || !email || !phone || isSubmitting}
          className="flex-1 h-12 bg-[#1E90FF] hover:bg-[#1873CC] text-white"
        >
          {isSubmitting ? 'Processing...' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
