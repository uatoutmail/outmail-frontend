import "@testing-library/jest-dom/vitest";

/**
 * jsdom has no IntersectionObserver, and the motion kit uses it for every
 * scroll reveal. Without this, any test that renders a page section dies with
 * "IntersectionObserver is not defined" — an error about the environment, not
 * about the component under test.
 *
 * The stub reports elements as visible immediately, which is the state a test
 * wants: assertions should not depend on scroll position.
 */
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    this.callback([{ target: element, isIntersecting: true, intersectionRatio: 1 }], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub;
globalThis.IntersectionObserverEntry = globalThis.IntersectionObserverEntry || function () {};
