export function formatTND(amount) {
  const fixed = Number(amount || 0).toFixed(3);
  const [integer, decimal] = fixed.split(".");
  const withSpaces = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces},${decimal} TND`;
}

export function formatAmount(amount) {
  return formatTND(amount).replace(" TND", "");
}

export function generateDocNumber(prefix) {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${year}-${random}`;
}

export function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
