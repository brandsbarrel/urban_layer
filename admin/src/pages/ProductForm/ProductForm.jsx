import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loadForExisting,
  resetForNew,
  markSaved,
  discardChanges,
} from "../../redux/slices/productFormSlice";
import ProductFormHeader from "../../components/productForm/ProductFormHeader/ProductFormHeader";
import BasicInfoSection from "../../components/productForm/BasicInfoSection/BasicInfoSection";
import MediaGallerySection from "../../components/productForm/MediaGallerySection/MediaGallerySection";
import VariantsSection from "../../components/productForm/VariantsSection/VariantsSection";
import SEOSection from "../../components/productForm/SEOSection/SEOSection";
import StatusVisibilityPanel from "../../components/productForm/StatusVisibilityPanel/StatusVisibilityPanel";
import PricingInventoryPanel from "../../components/productForm/PricingInventoryPanel/PricingInventoryPanel";
import OrganizationPanel from "../../components/productForm/OrganizationPanel/OrganizationPanel";
import ShippingPanel from "../../components/productForm/ShippingPanel/ShippingPanel";
import StickyActionBar from "../../components/productForm/StickyActionBar/StickyActionBar";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import styles from "./ProductForm.module.css";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingProduct = useSelector((state) =>
    id ? state.products.items.find((p) => p.id === id) : null
  );
  const form = useSelector((state) => state.productForm.form);
  const isDirty = useSelector((state) => state.productForm.isDirty);
  const [discardConfirmOpen, setDiscardConfirmOpen] = React.useState(false);

  useEffect(() => {
    if (id && existingProduct) {
      dispatch(
        loadForExisting({
          id: existingProduct.id,
          name: existingProduct.name,
          sku: existingProduct.sku,
          status: existingProduct.status === "Active" ? "Published" : existingProduct.status,
          basePrice: String(existingProduct.price),
          totalStock: existingProduct.stock,
        })
      );
    } else {
      dispatch(resetForNew());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // "Preview" opens a read-only view without changing product status.
  const handlePreview = () => {
    window.alert(
      "Preview: this opens a read-only customer-facing view without publishing. (Storefront preview integration required.)"
    );
  };

  const handleSaveDraft = () => {
    if (!form.name.trim()) {
      window.alert("Product Name is required to save a draft.");
      return;
    }
    dispatch(markSaved("Draft"));
    navigate("/products");
  };

  const handlePublish = () => {
    if (!form.name.trim() || !form.sku.trim() || !form.basePrice) {
      window.alert(
        "Product Name, SKU, and Base Price are required to publish."
      );
      return;
    }
    dispatch(markSaved("Published"));
    navigate("/products");
  };

  const handleDiscardClick = () => {
    if (isDirty) {
      setDiscardConfirmOpen(true);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className={styles.page}>
      <ProductFormHeader
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <BasicInfoSection />
          <MediaGallerySection />
          <VariantsSection />
          <SEOSection />
        </div>
        <div className={styles.rightColumn}>
          <StatusVisibilityPanel />
          <PricingInventoryPanel />
          <OrganizationPanel />
          <ShippingPanel />
        </div>
      </div>

      <StickyActionBar
        onDiscard={handleDiscardClick}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <ConfirmModal
        open={discardConfirmOpen}
        title="Discard unsaved changes?"
        message="Your unsaved changes to this product will be lost."
        confirmLabel="Discard"
        danger
        onCancel={() => setDiscardConfirmOpen(false)}
        onConfirm={() => {
          dispatch(discardChanges());
          setDiscardConfirmOpen(false);
          navigate("/products");
        }}
      />
    </div>
  );
};

export default ProductForm;