export const FREE_SHIPPING_THRESHOLD = 15000;
export const STANDARD_SHIPPING_FEE = 250;
export const EXPRESS_SHIPPING_FEE = 499;
export const TAX_RATE = 0.18; // 18% GST

export const PROMO_CODES = {
  WELCOME10: { label: 'WELCOME10', percentage: 0.1 },
};

export function calculateCartTotals(items, promoCode, shippingOverride) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const promo = promoCode ? PROMO_CODES[promoCode.toUpperCase()] : null;
  const discount = promo ? Math.round(subtotal * promo.percentage) : 0;

  const defaultShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const shipping = shippingOverride !== undefined ? shippingOverride : defaultShipping;

  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + shipping + tax;

  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    subtotal,
    discount,
    promoLabel: promo?.label,
    shipping,
    tax,
    total,
    shippingProgress,
    amountToFreeShipping,
    isFreeShipping: shipping === 0,
  };
}