/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import million from "million/compiler";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  transpilePackages: ["vst-ui", "vst-utils"],

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  images: {
    domains: [
      "vst-assets.s3.eu-west-1.amazonaws.com",
      "vst-assets.s3.amazonaws.com",
    ],
  },

  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // the solution
    };

    return config;
  },
};

export default million.next(config, {
  auto: true,
});
