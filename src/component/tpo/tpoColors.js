// Static Tailwind color classes keyed by name.
//
// Tailwind v4 generates utilities by scanning source for COMPLETE class strings.
// Interpolated names like `bg-${color}-50` are never emitted (no safelist), so
// KPI icons/legends built that way render colorless. Always look up full class
// names here instead of composing them at runtime.
export const tpoColorMap = {
  purple: {
    bg50: "bg-purple-50",
    bg100: "bg-purple-100",
    text600: "text-purple-600",
    text700: "text-purple-700",
    border100: "border-purple-100",
  },
  blue: {
    bg50: "bg-blue-50",
    bg100: "bg-blue-100",
    text600: "text-blue-600",
    text700: "text-blue-700",
    border100: "border-blue-100",
  },
  green: {
    bg50: "bg-green-50",
    bg100: "bg-green-100",
    text600: "text-green-600",
    text700: "text-green-700",
    border100: "border-green-100",
  },
  orange: {
    bg50: "bg-orange-50",
    bg100: "bg-orange-100",
    text600: "text-orange-600",
    text700: "text-orange-700",
    border100: "border-orange-100",
  },
  yellow: {
    bg50: "bg-yellow-50",
    bg100: "bg-yellow-100",
    text600: "text-yellow-600",
    text700: "text-yellow-700",
    border100: "border-yellow-100",
  },
  teal: {
    bg50: "bg-teal-50",
    bg100: "bg-teal-100",
    text600: "text-teal-600",
    text700: "text-teal-700",
    border100: "border-teal-100",
  },
  indigo: {
    bg50: "bg-indigo-50",
    bg100: "bg-indigo-100",
    text600: "text-indigo-600",
    text700: "text-indigo-700",
    border100: "border-indigo-100",
  },
  pink: {
    bg50: "bg-pink-50",
    bg100: "bg-pink-100",
    text600: "text-pink-600",
    text700: "text-pink-700",
    border100: "border-pink-100",
  },
  red: {
    bg50: "bg-red-50",
    bg100: "bg-red-100",
    text600: "text-red-600",
    text700: "text-red-700",
    border100: "border-red-100",
  },
  gray: {
    bg50: "bg-gray-50",
    bg100: "bg-gray-100",
    text600: "text-gray-600",
    text700: "text-gray-700",
    border100: "border-gray-100",
  },
};

// Safe accessor — falls back to gray for unknown color names.
export const tpoColor = (name) => tpoColorMap[name] || tpoColorMap.gray;
