import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdArrowBack, MdLocalShipping, MdCheck, MdLocationOn, MdTimeline, MdReceiptLong, MdInfo, MdSchedule, MdInventory, MdEmail, MdPhone, MdArrowRight, MdRefreshCw, MdShield, MdUndo } from 'react-icons/md';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { fetchOrderById, fetchOrderTracking, selectSelectedOrder, selectSelectedOrderTracking, selectOrdersLoading, selectOrdersError, selectTrackingLoading, selectTrackingError } from '../../redux/slices/ordersSlice';
import styles from './TrackOrderPage.module.css';

function TrackOrderPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectSelectedOrder);
  const tracking = useSelector(selectSelectedOrderTracking);
  const loading = useSelector(selectOrdersLoading);
  const trackingLoading = useSelector(selectTrackingLoading);
  const error = useSelector(selectOrdersError);
  const trackingError = useSelector(selectTrackingError);
  const [activeTab, setActiveTab] = useState('forward'); // 'forward' or 'return'

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
      dispatch(fetchOrderTracking(orderId));
    }
  }, [dispatch, orderId]);

  if (loading && !order) {
    return (
      <div className={styles.content}>
        <div className={styles.loading}>
          <MdLocalShipping size={32} className={styles.loadingIcon} />
          <p>Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.content}>
        <div className={styles.error}>
          <MdInfo size={48} className={styles.errorIcon} />
          <p className={styles.errorText}>{error || 'Order not found.'}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}> 
            <button
              onClick={() => dispatch(fetchOrderById(orderId))}
              className={styles.retryButton}
            >
              <MdArrowBack size={18} /> Retry
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
    if (s.includes('shipped') || s.includes('transit') || s.includes('pack') || s.includes('out for')) return styles.statusShipped;
    if (s.includes('process')) return styles.statusProcessing;
    return styles.statusPending;
  };

  // Define the order lifecycle steps
  const ORDER_STEPS = [
    { key: 'ordered', label: 'Order Placed', icon: MdCheck, description: 'Your order has been placed and is being processed.' },
    { key: 'confirmed', label: 'Confirmed', icon: MdCheck, description: 'Order confirmed and payment verified.' },
    { key: 'processing', label: 'Processing', icon: MdLocalShipping, description: 'Your items are being prepared for shipment.' },
    { key: 'packed', label: 'Packed', icon: MdLocalShipping, description: 'Order packed and ready for pickup by carrier.' },
    { key: 'shipped', label: 'Shipped', icon: MdLocalShipping, description: 'Order handed over to carrier and on the way.' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MdLocalShipping, description: 'Order is out for delivery today.' },
    { key: 'delivered', label: 'Delivered', icon: MdCheck, description: 'Order has been delivered successfully.' },
  ];

  // Map backend status to step keys
  const statusToStepKey = {
    'pending': 'ordered',
    'confirmed': 'confirmed',
    'processing': 'processing',
    'packed': 'packed',
    'shipped': 'shipped',
    'out_for_delivery': 'out_for_delivery',
    'out for delivery': 'out_for_delivery',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'returned': 'delivered',
    'return_initiated': 'shipped',
    'rto_initiated': 'shipped',
    'rto_delivered': 'delivered',
    'exception': 'shipped'
  };

  // Get current step key from order/shipping status
  const shipping = order.shipping || {};
  const currentStatus = shipping.currentStatus || order.status || 'pending';
  const currentStepKey = statusToStepKey[currentStatus.toLowerCase()] || 'ordered';
  const currentStepIndex = ORDER_STEPS.findIndex(step => step.key === currentStepKey);

  // Check if tracking number exists
  const hasTracking = shipping.trackingNumber && shipping.trackingNumber !== 'Not yet assigned';

  // Backend timeline entries (if any)
  const timelineEntries = order.timeline || [];

  // Use Shiprocket tracking events from API response
  const forwardEvents = (tracking?.trackingEvents || []).sort((a, b) => 
    new Date(a.occurredAt) - new Date(b.occurredAt)
  );
  const returnEvents = (tracking?.returnShipment?.trackingEvents || []).sort((a, b) => 
    new Date(a.occurredAt) - new Date(b.occurredAt)
  );
  const returnShipment = tracking?.returnShipment;

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Render tracking events timeline
  const renderTrackingEvents = (events, isReturn = false) => {
    if (!events || events.length === 0) return null;
    
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <MdTimeline size={20} /> {isReturn ? 'Return Shipment Tracking' : 'Shipment Tracking Events'}
        </h2>
        <div className={styles.trackingEventsTimeline}>
          {events.map((event, index) => (
            <div key={event.eventKey || index} className={`${styles.trackingEvent} ${isReturn ? styles.returnEvent : ''}`}>
              <div className={styles.trackingEventDot} />
              <div className={styles.trackingEventLine} />
              <div className={styles.trackingEventContent}>
                <div className={styles.trackingEventHeader}>
                  <span className={styles.trackingEventStatus}>{event.statusLabel || event.status}</span>
                  <span className={styles.trackingEventDate}>{formatDate(event.occurredAt)}</span>
                </div>
                {event.activity && (
                  <p className={styles.trackingEventActivity}>{event.activity}</p>
                )}
                {event.location && (
                  <p className={styles.trackingEventLocation}>
                    <MdLocationOn size={14} /> {event.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'My Account', href: '/account' },
        { label: 'My Orders', href: '/account/orders' },
        { label: `Order #${order.orderNumber || order.id}`, href: `/account/orders/${order.id}` },
        { label: 'Tracking', active: true }
      ]} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Track Order <span className={styles.orderNumber}>#{order.orderNumber || order.id}</span></h1>
            <span className={styles.badge} style={{ backgroundColor: `var(--${getStatusClass(currentStatus)}-bg, ${getStatusClass(currentStatus)})` }}>
              {currentStatus}
            </span>
          </div>
          <div className={styles.headerRight}>
            <Link to="/account/orders" className={styles.backButton}>
              <MdArrowBack size={18} /> Back to Orders
            </Link>
          </div>
        </div>

        {/* Tracking Tabs for Forward/Return */}
        {(hasTracking || returnShipment?.awb) && (
          <div className={styles.trackingTabs}>
            <button 
              className={`${styles.trackingTab} ${activeTab === 'forward' ? styles.active : ''}`}
              onClick={() => setActiveTab('forward')}
            >
              <MdLocalShipping size={18} /> Forward Shipment
            </button>
            {returnShipment?.awb && (
              <button 
                className={`${styles.trackingTab} ${activeTab === 'return' ? styles.active : ''}`}
                onClick={() => setActiveTab('return')}
              >
                <MdUndo size={18} /> Return Shipment
              </button>
            )}
          </div>
        )}

        <div className={styles.layout}>
        {/* Main Column - Timeline & Tracking */}
        <div className={styles.mainColumn}>
          {/* Order Progress Timeline */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdTimeline size={20} /> Order Progress
            </h2>
            <div className={styles.timelineWrapper}>
              <div className={styles.timelineLine} />
              {ORDER_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = isCompleted ? MdCheck : step.icon;
                // Find matching timeline entry for this step
                const timelineEntry = timelineEntries.find(entry => 
                  entry.status?.toLowerCase() === step.key ||
                  entry.title?.toLowerCase().includes(step.key.replace('_', ' '))
                );

                return (
                  <div key={step.key} className={styles.timelineStep}>
                    <div
                      className={
                        isCompleted
                          ? `${styles.timelineCircle} ${styles.timelineCircleCompleted}`
                          : isCurrent
                          ? `${styles.timelineCircle} ${styles.timelineCircleCurrent}`
                          : styles.timelineCircle
                      }
                    >
                      <Icon size={20} />
                    </div>
                    <div className={styles.timelineContent}>
                      <span
                        className={
                          isCompleted || isCurrent
                            ? `${styles.timelineLabel} ${styles.timelineLabelActive}`
                            : styles.timelineLabel
                        }
                      >
                        {step.label}
                      </span>
                      <p className={styles.timelineDescription}>{step.description}</p>
                      {timelineEntry && (
                        <span className={styles.timelineDate}>
                          {timelineEntry.date || (timelineEntry.createdAt || timelineEntry.timestamp ? new Date(timelineEntry.createdAt || timelineEntry.timestamp).toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : "")}
                        </span>
                      )}
                      {step.key === 'confirmed' && order.placedAt && (
                        <span className={styles.timelineDate}>{order.placedAt}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking Details */}
          {hasTracking && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <MdLocalShipping size={20} /> Shipment Tracking
              </h2>
              <div className={styles.trackingInfo}>
                <div className={styles.trackingRow}>
                  <span className={styles.trackingLabel}>Tracking Number</span>
                  <span className={styles.trackingValue}>{shipping.trackingNumber}</span>
                </div>
                {shipping.carrier && (
                  <div className={styles.trackingRow}>
                    <span className={styles.trackingLabel}>Carrier</span>
                    <span className={styles.trackingValue}>{shipping.carrier}</span>
                  </div>
                )}
                {shipping.estimatedDelivery && (
                  <div className={styles.trackingRow}>
                    <span className={styles.trackingLabel}>Estimated Delivery</span>
                    <span className={styles.trackingValue}>
                      <MdSchedule size={16} /> {shipping.estimatedDelivery}
                    </span>
                  </div>
                )}
                {shipping.trackingUrl && (
                  <a
                    href={shipping.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.trackingLink}
                  >
                    <MdLocalShipping size={18} /> Track on Carrier Website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Backend Timeline Entries */}
          {timelineEntries.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <MdTimeline size={20} /> Status History
              </h2>
              <div className={styles.historyList}>
                {timelineEntries.map((entry, index) => (
                  <div key={entry.id || index} className={styles.historyItem}>
                    <div className={styles.historyIcon}>
                      <MdCheck size={18} />
                    </div>
                    <div className={styles.historyContent}>
                      <p className={styles.historyTitle}>{entry.title || entry.status}</p>
                      <p className={styles.historyDate}>
                        {entry.date || (entry.createdAt || entry.timestamp ? new Date(entry.createdAt || entry.timestamp).toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : "")}
                      </p>
                      {entry.note && <p className={styles.historyNote}>{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <MdInventory size={20} /> Order Items
              </h2>
              <div className={styles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id || item.productId} className={styles.itemRow}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                    )}
                    <div className={styles.itemDetails}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        {item.variant && <span className={styles.variant}>{item.variant}</span>}
                        <span>Qty: {item.quantity || item.qty || 1}</span>
                      </p>
                    </div>
                    <p className={styles.itemPrice}>
                      â‚¹{(item.price * (item.quantity || item.qty || 1)).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Shipping & Order Summary */}
        <div className={styles.sidebarColumn}>
          {/* Shipping Address */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdLocationOn size={20} /> Shipping Address
            </h2>
            <p className={styles.addressBlock}>
              {shipping.recipient || order.shippingAddress?.recipientName || 'Customer'}<br />
              {shipping.address || order.shippingAddress?.line1 || ''} {order.shippingAddress?.line2 || ''}<br />
              {order.shippingAddress?.city ? `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode || ''}` : ''}<br />
              {order.shippingAddress?.country || 'India'}
            </p>
          </div>

          {/* Contact Info */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdEmail size={20} /> Contact Information
            </h2>
            <p className={styles.addressBlock}>
              <MdEmail size={16} /> {order.email || order.userEmail || 'Not provided'}<br />
              <MdPhone size={16} /> {order.phone || order.userPhone || 'Not provided'}
            </p>
          </div>

          {/* Price Summary */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MdReceiptLong size={20} /> Price Summary
            </h2>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>â‚¹{(order.subtotal || order.totals?.subtotal || order.totalAmount || order.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping Fee</span>
                <span>{(order.shippingAmount || order.totals?.shipping || 0) === 0 ? 'Free' : `â‚¹${(order.shippingAmount || order.totals?.shipping || 0).toLocaleString('en-IN')}`}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Estimated Tax</span>
                <span>â‚¹{(order.taxAmount || order.totals?.tax || 0).toLocaleString('en-IN')}</span>
              </div>
              {(order.discountAmount || order.totals?.discount || 0) > 0 && (
                <div className={styles.summaryRow} style={{ color: '#10b981' }}> 
                  <span>Discount</span>
                  <span>-â‚¹{(order.discountAmount || order.totals?.discount || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className={styles.summaryTotalRow}>
                <span>Total Amount</span>
                <span>â‚¹{(order.totalAmount || order.totals?.total || order.amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsCard}>
            <Link to={`/account/orders/${order.id}`} className={styles.detailsButton}>
              <MdInfo size={18} /> View Full Details
            </Link>
            <Link to="/" className={styles.continueShoppingButton}>
              <MdArrowBack size={18} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* No Tracking Info */}
      {!hasTracking && !returnShipment?.awb && (
        <div className={styles.noTrackingCard}>
          <MdInfo size={48} className={styles.infoIcon} />
          <div className={styles.noTrackingInfo}>
            <p>Tracking not yet available</p>
            <p className={styles.subText}>
              Tracking information will be added once your order ships. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrderPage;
