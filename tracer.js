const { trace, context } = require("@opentelemetry/api");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-base");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
// const {
//   OTLPTraceExporter,
// } = require("@opentelemetry/exporter-trace-otlp-http");
const {
  ExpressInstrumentation,
} = require("opentelemetry-instrumentation-express");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

module.exports = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    }),
  });

  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new ZipkinExporter({
        url: `${process.env.OTEL_API_HOST}/api/v2/spans`,
        serviceName: process.env.OTEL_SERVICE_NAME,
      })
    )
  );
  // provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
  // provider.addSpanProcessor(
  //   new BatchSpanProcessor(
  //     new OTLPTraceExporter({
  //       url: process.env.OTEL_API_HOST,
  //     })
  //   )
  // );

  provider.register();

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation({ includeHttpAttributes: true }),
    ],
    tracerProvider: provider,
  });

  const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME);
  tracer.startSpan("ROOT", {}, context.ROOT_CONTEXT);

  return { tracer };
};
