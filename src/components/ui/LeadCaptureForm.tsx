import { useEffect, useId, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Check } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { waitlistCopy as copy } from "../../data/site-copy";
import { site } from "../../data/site.mjs";
import {
  reportWaitlistSuccess,
  reportWaitlistError,
} from "../../lib/waitlist-analytics";

interface Props {
  productId: string;
  productName: string;
}
export default function LeadCaptureForm({ productId, productName }: Props) {
  const id = useId();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setIsHydrated(true), []);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isHydrated || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: dbError } = await supabase.from("waitlist").insert({
        name: formData.name,
        email: formData.email,
        message: formData.message || null,
        product_id: productId,
        product_name: productName,
      });
      if (dbError) throw dbError;
      const { error: notificationError } = await supabase.functions.invoke(
        "send-waitlist-notification",
        {
          body: { ...formData, productId, productName },
        },
      );
      if (notificationError) throw notificationError;
      setIsSubmitted(true);
      reportWaitlistSuccess(productId, productName, formData);
      toast.success(copy.successTitle, { description: copy.successToast });
    } catch (cause: unknown) {
      setError(copy.errorMessage);
      reportWaitlistError(productId, productName, cause);
      toast.error(copy.errorTitle, { description: copy.errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted)
    return (
      <div
        className="rounded-lg bg-bg-surface p-8 border border-border text-center"
        role="status"
      >
        <Check
          className="mx-auto h-8 w-8 text-green-400 mb-4"
          aria-hidden="true"
        />
        <h3 className="text-xl font-semibold mb-2">{copy.successTitle}</h3>
        <p className="text-white/80">
          {copy.successMessage.replace("{product}", productName)}
        </p>
      </div>
    );

  return (
    <div className="rounded-lg bg-bg-surface p-6 sm:p-8 border border-border text-left">
      <h3 className="text-xl font-semibold mb-2">{copy.title}</h3>
      <p className="text-white/80 mb-6">{copy.intro}</p>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="bg-red-900/30 border border-red-500/50 rounded-md p-3 mb-4"
        >
          {error}
        </p>
      )}
      <noscript>
        {copy.noScript} <a href={`mailto:${site.email}`}>{site.email}</a>.
      </noscript>
      <form
        method="post"
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        aria-describedby={error ? `${id}-error` : undefined}
        className="space-y-4"
      >
        <div>
          <Label htmlFor={`${id}-name`} className="mb-1.5">
            {copy.name}
          </Label>
          <Input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            placeholder={copy.namePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`${id}-email`} className="mb-1.5">
            {copy.email}
          </Label>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={copy.emailPlaceholder}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor={`${id}-message`} className="mb-1.5">
            {copy.message}
          </Label>
          <Textarea
            id={`${id}-message`}
            name="message"
            placeholder={copy.messagePlaceholder}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!isHydrated || isSubmitting}
        >
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>
        <p className="text-xs text-text-secondary text-center">
          {copy.consent}
        </p>
      </form>
    </div>
  );
}
