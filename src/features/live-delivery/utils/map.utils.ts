export function buildMapUrl(bbox: string): string {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
}
