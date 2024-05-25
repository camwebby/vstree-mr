import Link from "next/link";

export const appConfig = {
  appName: "vstree",
  logo: (
    <Link
      className="
rounded-full border-2 border-muted-foreground/10 p-2 px-3 text-xs
font-semibold uppercase tracking-widest w-fit
text-foreground duration-500 hover:bg-secondary
"
      href={"/"}
    >
      VSTREE
    </Link>
  ),
  privacyPolicyUrl: "https://vstree.app/terms-conditions.pdf",
  termsAndConditionsUrl: "https://vstree.app/privacy.pdf",
};
