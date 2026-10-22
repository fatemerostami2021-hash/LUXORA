import { notFound } from "next/navigation";

// Any unknown address under /en or /fa shows the styled 404 page (with header and footer) instead of Next's default.
export default function CatchAll() {
  notFound();
}
