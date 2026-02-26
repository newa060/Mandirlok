"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/actions/reviews";

interface ReviewFormProps {
  orderId: string;
  userId: string;
  poojaId: string;
  templeId: string;
  panditId?: string;
  poojaName: string;
  existingReview?: any;
}

export default function ReviewForm({
  orderId,
  userId,
  poojaId,
  templeId,
  panditId,
  poojaName,
  existingReview,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await submitReview({
        userId,
        orderId,
        poojaId,
        templeId,
        panditId,
        rating,
        comment,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || "Failed to submit review.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && !existingReview) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🙏</div>
        <h3 className="font-display font-semibold text-green-800">Review Submitted!</h3>
        <p className="text-sm text-green-700 mt-1">
          Thank you for sharing your experience. Your feedback helps other devotees.
          It will be visible once approved by our team.
        </p>
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
        <h3 className="font-display font-semibold text-[#1a1209] mb-4">Your Review</h3>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={`${
                star <= existingReview.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-[#6b5b45] italic">"{existingReview.comment}"</p>
        {!existingReview.isApproved && (
          <p className="text-[10px] text-orange-500 mt-3 font-medium bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 inline-block">
            Status: Pending Approval
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
      <h3 className="font-display font-semibold text-[#1a1209] mb-2">Rate Your Experience</h3>
      <p className="text-xs text-[#6b5b45] mb-6">
        How was your {poojaName}? Your feedback means a lot to us.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hover || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Share your thoughts (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about the pooja, the pandit, or the video quality..."
            className="w-full bg-[#fdf6ee] border border-[#f0dcc8] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7f0a]/20 min-h-[100px]"
          />
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-saffron py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
