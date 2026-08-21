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

const STATUS_STEP_ORDER = ['confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered'];

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function formatDateTime(date) {
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function buildTrackingFromOrder(order) {
    const placed = new Date(order.placedAt);
    const currentIndex = STATUS_STEP_ORDER.indexOf(
        order.status === 'shipped' ? 'shipped' : order.status === 'delivered' ? 'delivered' : 'preparing'
    );

    const steps = [
        {
            key: 'confirmed',
            label: 'Order Confirmed',
            timestamp: formatDateTime(placed),
            status: currentIndex >= 0 ? 'completed' : 'pending',
        },
        {
            key: 'preparing',
            label: 'Preparing Order',
            timestamp: formatDateTime(addDays(placed, 1)),
            status: currentIndex >= 1 ? 'completed' : currentIndex === 0 ? 'current' : 'pending',
        },
        {
            key: 'shipped',
            label: 'Shipped',
            timestamp: order.status === 'shipped' || order.status === 'delivered' ? 'In Transit' : null,
            status: currentIndex >= 2 ? 'completed' : currentIndex === 1 ? 'current' : 'pending',
        },
        {
            key: 'out_for_delivery',
            label: 'Out for Delivery',
            timestamp: `Estimated: ${order.estimatedDelivery}`,
            status: currentIndex >= 3 ? 'completed' : currentIndex === 2 ? 'current' : 'pending',
        },
        {
            key: 'delivered',
            label: 'Delivered',
            timestamp: order.status === 'delivered' ? formatDateTime(new Date(order.deliveredAt || placed)) : null,
            status: order.status === 'delivered' ? 'completed' : 'pending',
        },
    ];

    return {
        orderId: order.id,
        status: order.status === 'shipped' ? 'SHIPPED' : order.status === 'delivered' ? 'DELIVERED' : 'PROCESSING',
        estimatedDelivery: order.estimatedDelivery,
        steps,
        courier: 'Standard Courier Partner',
        service: order.deliveryMethod === 'express' ? 'Express Courier' : 'Standard Shipping',
        destination: order.shippingAddress?.fullName
            ? `${order.shippingAddress.fullName}, ${order.shippingAddress.city || ''}`
            : 'Your saved address',
        isLive: order.status === 'shipped',
        checkpoint: order.status === 'shipped' ? 'En route to your location' : 'Awaiting courier update',
        items: order.items,
    };
}

const ORDER_DETAIL_STATUS_LABELS = {
    processing: 'Processing',
    shipped: 'In Transit',
    delivered: 'Delivered',
};

export function getOrderStatusLabel(status) {
    return ORDER_DETAIL_STATUS_LABELS[status] || status;
}

// Order ID se deterministic tracking number generate karta hai —
// har baar same order ke liye same number aayega, random nahi.
export function generateTrackingNumber(orderId) {
    const digits = orderId.replace(/\D/g, '') || '00000';
    const checksum = digits
        .split('')
        .reduce((sum, d) => sum + Number(d), 0)
        .toString()
        .padStart(3, '0')
        .slice(-3);
    return `UL-TRK-${digits.slice(-4).padStart(4, '0')}-${checksum}`;
}

function formatFullDate(date) {
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 6-step delivery progress — future-first order (Order Details page design ke mutabik):
// Delivered -> Out for Delivery -> Shipped -> Packed -> Payment Received -> Order Confirmed
export function buildOrderProgressSteps(order) {
    const placed = new Date(order.placedAt);
    const packedDate = addDays(placed, 1);
    const shippedDate = order.shippedAt ? new Date(order.shippedAt) : addDays(placed, 2);
    const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt) : null;

    const isShipped = order.status === 'shipped' || order.status === 'delivered';
    const isDelivered = order.status === 'delivered';

    return [
        {
            key: 'delivered',
            label: 'Delivered',
            dateLabel: isDelivered ? formatFullDate(deliveredDate) : `Estimated: ${order.estimatedDelivery}`,
            status: isDelivered ? 'completed' : 'pending',
        },
        {
            key: 'out_for_delivery',
            label: 'Out for Delivery',
            dateLabel: isDelivered ? 'Completed' : isShipped ? 'In Progress' : 'Pending',
            status: isDelivered ? 'completed' : 'pending',
        },
        {
            key: 'shipped',
            label: 'Shipped',
            dateLabel: formatFullDate(shippedDate),
            status: isDelivered ? 'completed' : isShipped ? 'current' : 'pending',
        },
        {
            key: 'packed',
            label: 'Packed',
            dateLabel: formatFullDate(packedDate),
            status: isShipped ? 'completed' : 'current',
        },
        {
            key: 'payment',
            label: 'Payment Received',
            dateLabel: formatFullDate(placed),
            status: 'completed',
        },
        {
            key: 'confirmed',
            label: 'Order Confirmed',
            dateLabel: formatFullDate(placed),
            status: 'completed',
        },
    ];
}