import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { closeDrawer } from "../../../redux/slices/ordersSlice";
import StatusActionPanel from "../StatusActionPanel/StatusActionPanel";
import TrackingTimeline from "../TrackingTimeline/TrackingTimeline";
import ShippingInfoCard from "../ShippingInfoCard/ShippingInfoCard";
import ItemsSummary from "../ItemsSummary/ItemsSummary";
import MarkShippedModal from "../MarkShippedModal/MarkShippedModal";
import CancelOrderModal from "../CancelOrderModal/CancelOrderModal";
import styles from "./OrderDrawer.module.css";

const OrderDrawer = () => {
  const dispatch = useDispatch();
  const drawerOrderId = useSelector((state) => state.orders.drawerOrderId);
  const order = useSelector((state) =>
    state.orders.items.find((o) => o.id === drawerOrderId)
  );
  const isOpen = Boolean(order);

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={() => dispatch(closeDrawer())}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {order && (
          <>
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>#{order.id}</h2>
                <p className={styles.subtitle}>Order Details & Tracking</p>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => dispatch(closeDrawer())}
              >
                <MdClose />
              </button>
            </div>

            <div className={styles.body}>
              {/* Customer Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "var(--color-surface-container-low)", borderRadius: "8px", border: "1px solid var(--color-outline-variant)" }}>
                <img src={order.customer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} alt={order.customer?.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>{order.customer?.name || "Customer"}</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--color-outline)" }}>{order.customer?.email || "No email"}</p>
                </div>
              </div>

              <StatusActionPanel order={order} />
              <TrackingTimeline timeline={order.timeline} />
              <ShippingInfoCard shipping={order.shipping} />
              <ItemsSummary products={order.products} />

              {/* Totals Summary */}
              <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--color-outline-variant)", background: "#ffffff" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600" }}>Order Totals</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--color-on-surface-variant)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal</span>
                    <span>₹{(order.subtotal || order.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Shipping</span>
                    <span>{(order.shippingAmount || 0) === 0 ? "Free" : `₹${(order.shippingAmount || 0).toLocaleString('en-IN')}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tax</span>
                    <span>₹{(order.taxAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "15px", color: "var(--color-on-surface)", paddingTop: "8px", borderTop: "1px solid var(--color-outline-variant)" }}>
                    <span>Total Amount</span>
                    <span>₹{(order.totalAmount || order.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.footerButton} title="Integration Required">
                Download Invoice
              </button>
              <button className={styles.footerButtonDark} title="Integration Required">
                Print Label
              </button>
            </div>

            <MarkShippedModal orderId={order.id} />
            <CancelOrderModal
              orderId={order.id}
              paymentMethod={order.paymentMethod}
            />
          </>
        )}
      </div>
    </>
  );
};

export default OrderDrawer;