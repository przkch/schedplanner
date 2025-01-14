import { Emitter } from "@lib/events/schedule";
import type { scheduleModifiedEvent } from "@lib/events/schedule";

import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  let eventsListener;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      eventsListener = (data: scheduleModifiedEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
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
