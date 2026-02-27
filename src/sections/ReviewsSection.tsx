import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Review {
  id: string;
  customer_name: string;
  service_type: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="text-gray-500">Loading reviews...</div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div ref={titleRef} className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => {
            const ReviewCard = () => {
              const { ref, isVisible } = useScrollAnimation();
              return (
                <Card
                  key={review.id}
                  ref={ref}
                  className={`bg-gray-50 border-none shadow-lg transition-all duration-700 hover:scale-105 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 sm:p-8">
                    <Quote className={`w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-3 sm:mb-4 transition-all duration-500 ${isVisible ? 'opacity-50 rotate-0' : 'opacity-0 -rotate-12'}`} />

                    <div className="flex gap-1 mb-3 sm:mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                          style={{ transitionDelay: `${(index * 100) + (i * 50)}ms` }}
                        />
                      ))}
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {review.customer_name}
                        </p>
                        <p className="text-sm text-gray-500">{getTimeAgo(review.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            };
            return <ReviewCard key={review.id} />;
          })}
        </div>
      </div>
    </section>
  );
};
