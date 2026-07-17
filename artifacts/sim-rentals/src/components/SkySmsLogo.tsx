/** Brand logo — uses the actual uploaded brand image */

export function SkySmsLogoMark({ className = "" }: { className?: string }) {
  // Square icon variant: shows the left portion (chevron mark) of the logo image
  return (
    <img
      src="/brand-logo.jpg"
      alt="SKY SMS"
      className={`object-cover object-left rounded-lg ${className}`}
    />
  );
}

export function SkySmsLogo({
  size = "md",
  // textClassName kept for API compatibility but not used (text is part of the image)
  textClassName: _textClassName = "",
}: {
  size?: "xs" | "sm" | "md" | "lg";
  textClassName?: string;
}) {
  const heights: Record<string, string> = {
    xs: "h-5",
    sm: "h-7",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <img
      src="/brand-logo.jpg"
      alt="SKY SMS"
      className={`${heights[size]} w-auto rounded-lg`}
    />
  );
}
