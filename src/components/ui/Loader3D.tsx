import { cn } from "@/lib/utils";

interface Loader3DProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loader3D = ({ className, size = "md" }: Loader3DProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
    </div>
  );
};

export { Loader3D };
