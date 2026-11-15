// next/font/google only works through Next's own build-time loader (webpack/
// SWC rewrite the import into real font-loading code); under plain Vite/
// Vitest the real package just throws ("Fraunces is not a function"). This
// stub stands in for it everywhere a test renders a component that imports a
// font — aliased in vitest.config.js, not a per-file vi.mock, so a new font
// added anywhere in the app doesn't need its own test setup.
function fontStub() {
  return {
    className: "font-stub",
    variable: "--font-stub-var",
    style: { fontFamily: "font-stub" },
  };
}

export const Geist = fontStub;
export const Geist_Mono = fontStub;
export const Syne = fontStub;
export const Fraunces = fontStub;
