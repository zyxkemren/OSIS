export function hexToColor(hex = "#2b2d31") {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  return parseInt(hex, 16);
}
