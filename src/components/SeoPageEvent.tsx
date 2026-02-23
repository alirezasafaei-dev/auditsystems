"use client";

import { useEffect } from "react";
import { SeoEventName, trackSeoEvent } from "../lib/analytics";

export default function SeoPageEvent({ event, params }: { event: SeoEventName; params: Record<string, string> }) {
  const serialized = JSON.stringify(params);

  useEffect(() => {
    trackSeoEvent(event, JSON.parse(serialized) as Record<string, string>);
  }, [event, serialized]);

  return null;
}
