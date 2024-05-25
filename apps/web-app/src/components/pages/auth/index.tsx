import { appConfig } from "@/constants/app-config";
import Head from "next/head";
import Link from "next/link";
import UserAuthForm from "../../organisms/user-auth-form";

export default function AuthenticationPage({ providers, error }) {
  return (
    <>
      <Head>
        <title>Login | {appConfig.appName}</title>
      </Head>
      <div className="container relative min-h-screen flex-col items-center justify-center pt-40 md:grid md:pt-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
          <div className="absolute inset-0 " />
          {appConfig.logo}
          <div className="relative z-20 mt-auto"></div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in or register
              </h1>
              <p className="text-sm text-muted-foreground">
                Use one of the authentication providers to access vstree
              </p>
            </div>
            <UserAuthForm providers={providers} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href={appConfig.termsAndConditionsUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={appConfig.privacyPolicyUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              {error && <p className="mt-10 text-rose-400">{error}</p>}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
