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
              <StatusActionPanel order={order} />
              <TrackingTimeline timeline={order.timeline} />
              <ShippingInfoCard shipping={order.shipping} />
              <ItemsSummary products={order.products} />
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