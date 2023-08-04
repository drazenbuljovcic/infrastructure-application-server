require("dotenv").config();

// you have to use the tracer before importing express!!
require("./tracer")();

const { context } = require("@opentelemetry/api");

const express = require("express");
var morgan = require("morgan");

console.log({ OTEL_API_HOST: process.env.OTEL_API_HOST });

const app = express();

app.use(morgan("dev"));

const permissions = {
  consumers: [{ identifier: "My-Living-Room", permissions: "ALL" }],
};

app.get("/", async (req, res) => {
  const activeSpanContext = context.active();
  // const activeSpan = trace.getSpan(activeSpanContext);

  // if (activeSpan) {
  //   console.log("Active Span Name:", activeSpan.name);
  //   console.log("Active Trace ID:", activeSpan.spanContext().traceId);
  //   console.log("Active Span ID:", activeSpan.spanContext().spanId);
  // }

  req.activeSpanContext = activeSpanContext;
  console.log("REDIRECTING", { activeSpanContext });
  return res.redirect(302, "/distributed-information-node");
});

app.get("/distributed-information-node", async (req, res) => {
  const { sleep } = req.query;

  // const activeSpanContext = req.activeSpanContext;
  // const activeSpan = trace.getSpan(activeSpanContext);

  // console.log("Active Span Name:", activeSpan.name);
  // console.log("Active Trace ID:", activeSpan.spanContext().traceId);
  // console.log("Active Span ID:", activeSpan.spanContext().spanId);

  console.log({ permissions });
  if (sleep) {
    await new Promise((resolve) => setTimeout(resolve, sleep));
  }
  return res.json(permissions);
});

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
