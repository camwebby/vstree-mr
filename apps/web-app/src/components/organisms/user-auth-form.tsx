import { Provider } from "next-auth/providers";
import { signIn } from "next-auth/react";
import * as React from "react";
import { Button } from "vst-ui";
import { cn } from "vst-ui/src/lib/utils";

export function UserAuthForm({
  className,
  providers,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  providers: Provider[];
}) {
  const [isLoading] = React.useState<boolean>(false);

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button
              type="button"
              disabled={isLoading}
              variant={"outline"}
              className="w-full"
              onClick={() => signIn(provider.id)}
            >
              Continue in with {provider.name}
            </Button>
          </div>
        ))}
      </>
    </div>
  );
}
