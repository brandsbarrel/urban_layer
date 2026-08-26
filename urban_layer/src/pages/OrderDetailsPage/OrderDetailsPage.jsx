import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdArrowBack,
  MdShoppingBag,
  MdLocationOn,
  MdPayment,
  MdTimeline,
  MdReceiptLong
} from 'react-icons/md';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import OrderStatusTimeline from '../../components/OrderStatusTimeline/OrderStatusTimeline';
import {
  fetchOrderById,
  selectSelectedOrder,
  selectOrdersLoading,
  selectOrdersError
} from '../../redux/slices/ordersSlice';
import styles from './OrderDetailsPage.module.css';

function OrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectSelectedOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading && !order) {
    return (
      <div className={styles.content}>
        <div className={styles.loading}>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.content}>
        <div className={styles.error}>
          <p className={styles.errorText}>{error || 'Order not found.'}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => dispatch(fetchOrderById(orderId))}
              className={styles.retryButton}
            >
              Retry
            </button>
            <Link to="/account/orders" className={styles.backButtonMuted}>
              <MdArrowBack size={18} /> Back to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusClass = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('delivered')) return styles.statusDelivered;
    if (s.includes('cancel')) return styles.statusCancelled;
    if (s.includes('shipped') || s.includes('transit') || s.includes('pack')) return styles.statusShipped;
    return styles.statusPending;
  };

  const totals = order.totals || {
    subtotal: order.subtotal || order.totalAmount || order.amount || 0,
    shipping: order.shippingAmount || 0,
    tax: order.taxAmount || 0,
    discount: order.discountAmount || 0,
    total: order.totalAmount || order.amount || 0
  };

  const shippingAddr = order.shippingAddress || {};
  const billingAddr = order.billingAddress || shippingAddr;

  return (
    <div className={styles.content}>
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'My Account', path: '/account' },
          { label: 'My Orders', path: '/account/orders' },
          { label: `#${order.id}` }
        ]}
      />

      <div className={styles.headerCard}>
        <div className={styles.titleGroup}>
          <h1 className={styles.orderTitle}>Order #{order.id}</h1>
          <p className={styles.orderMeta}>Placed on {order.placedAt}</p>
        </div>
        <div className={styles.badgeGroup}>
          <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
            {order.displayStatus || order.status}
          </span>
          <span className={styles.paymentBadge}>
            Payment: {order.paymentStatus} ({order.paymentMethod})
          </span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <MdTimeline size={20} /> Order Progress
        </h2>
        <OrderStatusTimeline currentStatus={order.status} confirmedDate={order.placedAt} />
      </div>

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          {/* Order Items */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdShoppingBag size={20} /> Ordered Products ({(order.items || []).length})
            </h2>
            <div className={styles.productsList}>
              {(order.items || []).map((item, idx) => (
                <div key={item.id || idx} className={styles.productRow}>
                  <div className={styles.productThumb}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.productDetails}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    <p className={styles.productMeta}>
                      {item.subtitle || item.variant || item.sku ? `Model / Variant: ${item.subtitle || item.variant || item.sku}` : ''}
                    </p>
                  </div>
                  <div className={styles.productPriceCol}>
                    <p className={styles.productPrice}>₹{(item.price || 0).toLocaleString('en-IN')}</p>
                    <p className={styles.productQty}>Qty: {item.quantity || item.qty || 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <MdTimeline size={20} /> Order Activity & Timeline
              </h2>
              <div className={styles.timeline}>
                {order.timeline.map((entry, idx) => {
                  const displayDate = entry.date || (entry.createdAt || entry.timestamp
                    ? new Date(entry.createdAt || entry.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })
                    : "");
                  return (
                    <div
                      key={entry.id || idx}
                      className={`${styles.timelineItem} ${entry.done ? styles.timelineDone : ''} ${entry.active ? styles.timelineActive : ''}`}
                    >
                      <div className={styles.timelineDot} />
                      <span className={styles.timelineTitle}>{entry.title}</span>
                      <span className={styles.timelineDate}>{displayDate}</span>
                      {entry.note && <p className={styles.timelineNote}>{entry.note}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebarColumn}>
          {/* Price Summary */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdReceiptLong size={20} /> Price Summary
            </h2>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping Fee</span>
                <span>{totals.shipping === 0 ? 'Free' : `₹${totals.shipping.toLocaleString('en-IN')}`}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Estimated Tax</span>
                <span>₹{totals.tax.toLocaleString('en-IN')}</span>
              </div>
              {totals.discount > 0 && (
                <div className={styles.summaryRow} style={{ color: '#10b981' }}>
                  <span>Discount</span>
                  <span>-₹{totals.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className={styles.summaryTotalRow}>
                <span>Total Amount</span>
                <span>₹{totals.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Address */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdLocationOn size={20} /> Delivery Addresses
            </h2>
            <div className={styles.addressBlock}>
              <p><strong>Shipping Address:</strong></p>
              <p>
                {shippingAddr.recipientName || order.shipping?.recipient || 'Customer'}<br />
                {shippingAddr.line1 || order.shipping?.address || ''} {shippingAddr.line2 || ''}<br />
                {shippingAddr.city ? `${shippingAddr.city}, ${shippingAddr.state} ${shippingAddr.postalCode || ''}` : ''}<br />
                {shippingAddr.country || 'India'}
              </p>
              {order.shipping?.trackingNumber && (
                <p style={{ marginTop: '8px', fontStyle: 'italic' }}>
                  Carrier: {order.shipping.carrier} | Tracking #: {order.shipping.trackingNumber}
                </p>
              )}
            </div>

            <div className={styles.addressBlock} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-outline-variant)' }}>
              <p><strong>Billing Address:</strong></p>
              <p>
                {billingAddr.recipientName || 'Same as Shipping'}<br />
                {billingAddr.line1 || ''} {billingAddr.line2 || ''}<br />
                {billingAddr.city ? `${billingAddr.city}, ${billingAddr.state} ${billingAddr.postalCode || ''}` : ''}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdPayment size={20} /> Payment Method
            </h2>
            <p className={styles.addressBlock}>
              <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
