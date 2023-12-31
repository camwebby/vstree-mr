import * as React from "react";
import { cn } from "vst-ui/src/lib/utils";
import { Button } from "vst-ui";
import { Input } from "vst-ui";
import { Label } from "vst-ui";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Provider } from "next-auth/providers";

export function UserAuthForm({
  className,
  providers,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  providers: Provider[];
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}

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
