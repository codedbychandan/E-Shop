"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { RatingInput } from "@/components/ui/Rating";
import { useReviewStore } from "@/store/review-store";
import { toast } from "@/store/toast-store";
import { uid } from "@/lib/utils";

interface ReviewModalProps {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}

export function ReviewModal({ productId, productName, open, onClose }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ name?: string; comment?: string }>({});
  const add = useReviewStore((s) => s.add);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (comment.trim().length < 10) errs.comment = "Review should be at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    add({
      id: uid("r-"),
      productId,
      user: name.trim(),
      rating,
      title: title.trim() || "Verified purchase",
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    toast("Thanks! Your review has been published.");
    setName("");
    setTitle("");
    setComment("");
    setRating(5);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Review ${productName}`}>
      <form onSubmit={submit} className="space-y-4 p-6">
        <div>
          <span className="label">Your rating</span>
          <RatingInput value={rating} onChange={setRating} />
        </div>
        <Input
          label="Your name"
          name="reviewer-name"
          placeholder="e.g. Chandan K."
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Review title"
          name="review-title"
          placeholder="Sum it up in a line"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          label="Your review"
          name="review-comment"
          placeholder="What did you like or dislike?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={errors.comment}
        />
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  );
}
