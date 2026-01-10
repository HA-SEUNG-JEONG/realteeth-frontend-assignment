import { cn } from "../lib/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-card", className)}
      {...props}
    />
  );
}

export { Skeleton };
