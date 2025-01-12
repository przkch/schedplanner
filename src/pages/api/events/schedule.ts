import { Emitter } from "@lib/events/schedule";

import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  let eventsListener;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      controller.enqueue(encoder.encode("Connected to SSE"));

      eventsListener = () => {
        const data = "data: schedule modified\n\n";
        controller.enqueue(encoder.encode(data));
      };

      Emitter.removeListener("scheduleModified", eventsListener);
      Emitter.addListener("scheduleModified", eventsListener);
    },

    cancel() {
      Emitter.removeListener("scheduleModified", eventsListener);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
};
