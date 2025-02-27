
import * as React from "react";
import { cn } from "@/lib/utils";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex w-full", className)}
      {...props}
    />
  );
});
InputGroup.displayName = "InputGroup";

const InputLeftElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
        className
      )}
      {...props}
    />
  );
});
InputLeftElement.displayName = "InputLeftElement";

const InputRightElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-y-0 right-0 flex items-center pr-3",
        className
      )}
      {...props}
    />
  );
});
InputRightElement.displayName = "InputRightElement";

export { InputGroup, InputLeftElement, InputRightElement };
