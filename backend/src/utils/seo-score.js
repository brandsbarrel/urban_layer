const computeSeoScore = ({ title = "", description = "", image = "", slug = "", name = "" }) => {
  let score = 0;

  if (title && title.length <= 65) {
    score += 30;
  }

  if (description && description.length <= 160) {
    score += 30;
  }

  if (image) {
    score += 20;
  }

  const normalizedName = name.toLowerCase().replace(/\s+/g, "-");
  if (slug && normalizedName && slug.includes(normalizedName.slice(0, Math.min(normalizedName.length, 12)))) {
    score += 20;
  }

  return Math.min(score, 100);
};

export { computeSeoScore };
