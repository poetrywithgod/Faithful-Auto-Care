import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ReviewsSection = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely fantastic service! My car has never looked better. The team was professional, friendly, and the attention to detail was impressive. Highly recommend!",
      date: "2 weeks ago",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment:
        "Best car wash in town! They went above and beyond with my detailing service. The interior looks brand new and the exterior has an amazing shine. Worth every penny.",
      date: "1 month ago",
    },
    {
      name: "Emma Thompson",
      rating: 5,
      comment:
        "I've been coming here for over a year and they never disappoint. Consistent quality, reasonable prices, and eco-friendly products. This is my go-to place for car care.",
      date: "3 weeks ago",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-gray-50 border-none shadow-lg">
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-blue-600 mb-4 opacity-50" />

                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{review.comment}"
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
