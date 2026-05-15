import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d6d5f779be0eab14b058105ce62f8549@o4511121533894656.ingest.us.sentry.io/4511121535205376",
  tracesSampleRate: 0.1,
  integrations: [Sentry.browserTracingIntegration()],
  debug: false,
});
