import { Logger, createLogger, format, transports } from "winston";

const __CONFIG__ = {
  env: process.env.VERCEL_ENV || "development",
  appName: process.env.APP_NAME || "vst-utils",
  projectId: process.env.HIGHLIGHT_PROJ || "qe911n4g",
} as const;

const highlightTransport = (appName: string, projectId: string) =>
  new transports.Http({
    host: "pub.highlight.run",
    path: "/v1/logs/json",
    ssl: true,
    headers: {
      "x-highlight-project": projectId,
      "x-highlight-service": appName,
    },
  });

export const transportEnvMap = (appName: string, projectId: string) => ({
  production: [highlightTransport(appName, projectId)],
  preview: [new transports.Console(), highlightTransport(appName, projectId)],
  development: [new transports.Console()],
});

export const logger = () =>
  createLogger({
    level: "info",
    format: format.combine(format.json(), format.timestamp()),
    defaultMeta: { service: __CONFIG__.appName },
    transports: [new transports.Console()],
  }) as Logger;
