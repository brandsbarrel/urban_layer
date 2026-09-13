import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdClose, MdContentCopy } from "react-icons/md";
import { closeDrawer } from "../../../redux/slices/paymentsSlice";
import styles from "./PaymentDrawer.module.css";

const PaymentDrawer = () => {
  const dispatch = useDispatch();
  const drawerPaymentId = useSelector((state) => state.payments.drawerPaymentId);
  const payment = useSelector((state) =>
    state.payments.items.find((p) => p.id === drawerPaymentId)
  );
  const isOpen = Boolean(payment);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`} onClick={() => dispatch(closeDrawer())} />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Payment <span className={styles.paymentId}>#{payment.paymentGatewayPaymentId ? `pay_${payment.paymentGatewayPaymentId.slice(-8)}` : payment.id.slice(-8)}</span>
            </h2>
            <p className={styles.subtitle}>Order: #{payment.orderNumber}</p>
          </div>
          <button className={styles.closeButton} onClick={() => dispatch(closeDrawer())}>
            <MdClose />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.statusRow}>
            <span className={`${styles.statusBadge} ${styles[getStatusToneClass(payment.paymentStatus)]}`}>
              {payment.paymentStatus}
            </span>
            <span className={styles.gatewayLabel}>Gateway: {payment.paymentGateway || "Razorpay"}</span>
          </div>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Customer</h4>
            <div className={styles.customerCard}>
              <img src={payment.customer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} alt={payment.customer.name} className={styles.customerAvatar} />
              <div>
                <p className={styles.customerName}>{payment.customer.name}</p>
                <p className={styles.customerEmail}>{payment.customer.email}</p>
                <p className={styles.customerPhone}>{payment.customer.phone}</p>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Payment Details</h4>
            <div className={styles.detailsGrid}>
              <DetailItem label="Payment Method" value={payment.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"} method={payment.paymentMethod} />
              <DetailItem label="Purpose" value={payment.purpose} />
              <DetailCopyItem label="Gateway Order ID" value={payment.paymentGatewayOrderId} copyLabel="Gateway Order ID" />
              <DetailCopyItem label="Gateway Payment ID" value={payment.paymentGatewayPaymentId} copyLabel="Gateway Payment ID" />
              <DetailCopyItem label="Gateway Signature" value={payment.paymentGatewaySignature} copyLabel="Gateway Signature" />
              <DetailItem label="Created At" value={formatDate(payment.createdAt)} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.footerButton} onClick={() => dispatch(closeDrawer())}>Close</button>
        </div>
      </div>
    </>
  );
};

function getStatusToneClass(status) {
  const tones = { Paid: "toneGreen", Collected: "toneGreen", Settled: "toneGreen", Pending: "toneAmber", "Refund Processing": "toneAmber", Failed: "toneRed", "Collection Failed": "toneRed", "Settlement Failed": "toneRed", Refunded: "toneGreen", "Partially Refunded": "toneBlue" };
  return tones[status] || "toneAmber";
}

function getMethodClass(method) { return method === "COD" ? "methodCod" : "methodOnline"; }

const DetailItem = ({ label, value, method }) => (
  <div className={styles.detailItem}>
    <span className={styles.detailLabel}>{label}</span>
    <span className={`${styles.detailValue} ${method ? `${styles.methodBadge} ${styles[getMethodClass(method)]}` : ""}`}>{value}</span>
  </div>
);

const DetailCopyItem = ({ label, value, copyLabel }) => (
  <div className={styles.detailItem}>
    <span className={styles.detailLabel}>{label}</span>
    <div className={styles.copyRow}>
      <span className={styles.detailValueMonospace}>{value || "—"}</span>
      {value && <button className={styles.copyButton} onClick={() => copyToClipboard(value, copyLabel)}><MdContentCopy size={14} /></button>}
    </div>
  </div>
);

export default PaymentDrawer;