import cards from '../data/og-cards.json';

export function ogCardForPath(path: string) {
  const normalized = `${path.replace(/\/$/, '')}/`;
  const card = cards.find((card) => card.path === normalized);
  if (!card) throw new Error(`Missing OG card for ${normalized}; add it to src/data/og-cards.json`);
  return card;
}
