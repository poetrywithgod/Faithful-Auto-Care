import { useState } from 'react';
import { Sparkles, Droplet, Gem } from 'lucide-react';
import { Button } from '../ui/button';

interface ServiceStepProps {
  selectedService?: string;
  selectedVehicle?: string;
  onServiceSelect: (serviceType: string, servicePrice: number) => void;
  onVehicleSelect: (vehicleType: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const services = [
  {
    name: 'Basic Wash',
    price: 10,
    icon: Droplet,
    description: 'Exterior Wash & Rinse',
    color: 'border-gray-300 bg-white hover:border-[#1E90FF]'
  },
  {
    name: 'Standard Wash',
    price: 15,
    icon: Sparkles,
    description: 'Full exterior & cabin restore.',
    color: 'border-[#1E90FF] bg-[#1E90FF] text-white'
  },
  {
    name: 'Premium Wash',
    price: 25,
    icon: Gem,
    description: 'Full car wash with interior, exterior, and ultimate shine',
    color: 'border-gray-300 bg-white hover:border-[#1E90FF]'
  }
];

const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van'];

export function ServiceStep({
  selectedService,
  selectedVehicle,
  onServiceSelect,
  onVehicleSelect,
  onNext,
  onBack
}: ServiceStepProps) {
  const [localSelectedService, setLocalSelectedService] = useState(selectedService || '');
  const [localSelectedVehicle, setLocalSelectedVehicle] = useState(selectedVehicle || '');

  const handleServiceClick = (name: string, price: number) => {
    setLocalSelectedService(name);
    onServiceSelect(name, price);
  };

  const handleVehicleClick = (type: string) => {
    setLocalSelectedVehicle(type);
    onVehicleSelect(type);
  };

  const handleNext = () => {
    if (localSelectedService && localSelectedVehicle) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-900">Choose Your Service</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = localSelectedService === service.name;
          const isStandard = service.name === 'Standard Wash';

          return (
            <button
              key={service.name}
              onClick={() => handleServiceClick(service.name, service.price)}
              className={`
                p-6 rounded-xl border-2 transition-all text-left
                ${isSelected && !isStandard ? 'border-[#1E90FF] bg-blue-50 shadow-md' : ''}
                ${isStandard ? 'border-[#1E90FF] bg-[#1E90FF] text-white shadow-lg' : 'border-gray-300 bg-white hover:border-[#1E90FF] hover:shadow-md'}
              `}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <Icon className={`w-10 h-10 ${isStandard ? 'text-white' : 'text-[#1E90FF]'}`} />
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className={`text-lg font-bold ${isStandard ? 'text-white' : 'text-gray-900'}`}>
                      £ {service.price}
                    </span>
                  </div>
                  <h4 className={`font-semibold ${isStandard ? 'text-white' : 'text-gray-900'}`}>
                    {service.name}
                  </h4>
                  <p className={`text-sm ${isStandard ? 'text-blue-100' : 'text-gray-600'}`}>
                    {service.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Vehicle Type</h4>
          <select
            value={localSelectedVehicle}
            onChange={(e) => handleVehicleClick(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1E90FF] bg-white text-gray-900"
          >
            <option value="">Type</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {vehicleTypes.map((type) => {
            const isSelected = localSelectedVehicle === type;

            return (
              <button
                key={type}
                onClick={() => handleVehicleClick(type)}
                className={`
                  p-4 rounded-lg border-2 text-center font-medium transition-all
                  ${isSelected ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' : 'border-gray-300 bg-white hover:border-[#1E90FF] text-gray-900'}
                `}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 text-gray-700 border-gray-300"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!localSelectedService || !localSelectedVehicle}
          className="flex-1 h-12 bg-[#1E90FF] hover:bg-[#1873CC] text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
