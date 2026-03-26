import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "destructive" | "outline" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-success text-success-foreground": variant === "success",
          "bg-destructive text-destructive-foreground": variant === "destructive",
          "border border-border text-foreground": variant === "outline",
          "bg-yellow-500 text-white": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
