const rankColors = {
  astounding: '#e268a8',
  legendary: '#ff8000',
  epic: '#a335ee',
  rare: '#0070ff',
  uncommon: '#1eff00',
  common: '#666',
};

const getRankColor = (value: number, max = 100) =>
  value / max >= 0.99
    ? rankColors.astounding
    : value / max >= 0.95
      ? rankColors.legendary
      : value / max >= 0.75
        ? rankColors.epic
        : value / max >= 0.5
          ? rankColors.rare
          : value / max >= 0.25
            ? rankColors.uncommon
            : rankColors.common;

export { rankColors, getRankColor };
