import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.95] select-none ripple-container",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-600",
        destructive: "bg-red-500 text-white shadow-sm border-red-600",
        outline:
          "border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700",
        secondary: "border bg-emerald-50 text-emerald-700 border-emerald-200",
        ghost:
          "border border-transparent hover:bg-emerald-50 hover:text-emerald-700",
        link: "text-emerald-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 px-3 text-xs",
        lg: "min-h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function spawnRipple(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2.2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const dot = document.createElement("span");
  dot.className = "ripple-wave";
  dot.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;position:absolute;pointer-events:none;`;
  el.appendChild(dot);
  dot.addEventListener("animationend", () => dot.remove(), { once: true });
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          spawnRipple(e);
          onClick?.(e);
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
