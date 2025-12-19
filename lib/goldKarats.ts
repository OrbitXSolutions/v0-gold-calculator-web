export type GoldKarat = {
  value: string;
  label: string;
  purity: string;
  priceMultiplier: number;
};

export const goldKarats: GoldKarat[] = [
  { value: '24k', label: '24K', purity: '99.9%', priceMultiplier: 1.0 },
  { value: '22k', label: '22K', purity: '91.6%', priceMultiplier: 0.916 },
  { value: '21k', label: '21K', purity: '87.5%', priceMultiplier: 0.875 },
  { value: '20k', label: '20K', purity: '83.3%', priceMultiplier: 0.833 },
  { value: '18k', label: '18K', purity: '75.0%', priceMultiplier: 0.75 },
  { value: '14k', label: '14K', purity: '58.3%', priceMultiplier: 0.583 },
];
