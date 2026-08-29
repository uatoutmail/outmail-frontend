import ErrorScreen from "@/components/error/ErrorScreen";

// 404. Not an outage, so it gets its own copy rather than the generic
// "we'll be back shortly" — telling someone we're fixing a problem when they
// simply mistyped a URL is worse than saying nothing.
export default function NotFound() {
  return (
    <ErrorScreen
      title="Page not found"
      message="That link doesn't lead anywhere. It may have moved, or the address might have a typo in it."
    />
  );
}
