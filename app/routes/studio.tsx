import type { Route } from "./+types/studio";
import { StudioApp } from "../studio/StudioApp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ShotOnce Web Studio — Single-Capture Multi-Aspect Video Suite" },
    {
      name: "description",
      content:
        "Cap.so studio aesthetics meets ShotOnce single-capture multi-aspect derivations — running 100% client-side in the browser.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function Studio() {
  return <StudioApp />;
}
