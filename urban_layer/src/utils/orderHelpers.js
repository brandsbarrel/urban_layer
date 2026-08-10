export function generateOrderId() {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `UL-${random}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatShortDate(date) {
    return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}`;
}

export function calculateEstimatedDelivery(deliveryMethod, placedAt = new Date()) {
    const [minDays, maxDays] = deliveryMethod === 'express' ? [1, 2] : [4, 6];
    const start = new Date(placedAt.getTime() + minDays * DAY_MS);
    const end = new Date(placedAt.getTime() + maxDays * DAY_MS);
    return `${formatShortDate(start)} - ${formatShortDate(end)}`;
}

export function formatOrderDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}