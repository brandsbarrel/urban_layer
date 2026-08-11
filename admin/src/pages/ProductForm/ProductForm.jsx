import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loadForExisting,
  resetForNew,
  markSaved,
  discardChanges,
} from "../../redux/slices/productFormSlice";
import { fetchCategories } from "../../redux/slices/categoriesSlice";
import { apiRequest } from "../../lib/api";
import ProductFormHeader from "../../components/productForm/ProductFormHeader/ProductFormHeader";
import BasicInfoSection from "../../components/productForm/BasicInfoSection/BasicInfoSection";
import MediaGallerySection from "../../components/productForm/MediaGallerySection/MediaGallerySection";
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
  const form = useSelector((state) => state.productForm.form);
  const isDirty = useSelector((state) => state.productForm.isDirty);
  const [discardConfirmOpen, setDiscardConfirmOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [loadingProduct, setLoadingProduct] = React.useState(Boolean(id));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      dispatch(resetForNew());
      setLoadingProduct(false);
      return undefined;
    }

    const loadProduct = async () => {
      setLoadingProduct(true);
      try {
        const response = await apiRequest(`/admin/products/${id}`);
        const productForm = response.data.form;

        if (cancelled) {
          return;
        }

        const galleryImages = productForm.galleryImages || [];

        dispatch(
          loadForExisting({
            ...productForm,
            categories: productForm.categoryIds || [],
            galleryImages,
            costPrice: productForm.costPrice || "",
            taxRate: productForm.taxRate || "",
            packageType: productForm.packageType || "Box",
            shippingClass: productForm.shippingClass || "Standard",
            fragile: Boolean(productForm.fragile),
          })
        );
      } catch (error) {
        if (!cancelled) {
          window.alert(error.message || "Unable to load product.");
          navigate("/products");
        }
      } finally {
        if (!cancelled) {
          setLoadingProduct(false);
        }
      }
    };

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [dispatch, id, navigate]);

  // "Preview" opens a read-only view without changing product status.
  const handlePreview = () => {
    window.alert(
      "Preview: this opens a read-only customer-facing view without publishing. (Storefront preview integration required.)"
    );
  };

  const buildPayload = (status) => ({
    name: form.name.trim(),
    sku: form.sku.trim().toUpperCase(),
    phoneModel: form.phoneModel,
    description: form.description.trim(),
    featuredImage: form.featuredImage.trim(),
    gallery: form.galleryImages
      .map((url, index) => ({ url: url.trim(), order: index, isFeatured: false }))
      .filter((image) => image.url),
    categories: form.categories,
    collection: form.collection,
    tags: form.tags,
    basePrice: Number(form.basePrice || 0),
    salePrice: form.salePrice === "" ? null : Number(form.salePrice),
    costPrice: form.costPrice === "" ? null : Number(form.costPrice),
    taxRate: form.taxRate === "" ? 0 : Number(form.taxRate),
    stock: Number(form.totalStock || 0),
    trackStock: form.trackStock,
    weight: form.weight === "" ? null : Number(form.weight),
    length: form.length === "" ? null : Number(form.length),
    width: form.width === "" ? null : Number(form.width),
    height: form.height === "" ? null : Number(form.height),
    packageType: form.packageType,
    shippingClass: form.shippingClass,
    fragile: form.fragile,
    status,
    visibility: form.visibility,
  });

  const saveProduct = async (status) => {
    if (!form.name.trim()) {
      window.alert("Product Name is required.");
      return false;
    }
    if (!form.phoneModel) {
      window.alert("Phone Model is required.");
      return false;
    }
    if (form.categories.length === 0) {
      window.alert("Select at least one case style from Categories.");
      return false;
    }
    if (!form.sku.trim() || !form.basePrice) {
      window.alert(
        "SKU and Base Price are required."
      );
      return false;
    }
    if (status === "Published" && !form.featuredImage.trim()) {
      window.alert("Featured Image is required before publishing.");
      return false;
    }
    if (
      status === "Published" &&
      (!form.weight || !form.length || !form.width || !form.height)
    ) {
      window.alert("Weight and package dimensions are required before publishing.");
      return false;
    }

    setSaving(true);
    try {
      const payload = buildPayload(status);
      if (id) {
        await apiRequest(`/admin/products/${id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      dispatch(markSaved(status));
      navigate("/products");
      return true;
    } catch (error) {
      window.alert(error.message || "Unable to save product.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    void saveProduct("Draft");
  };

  const handlePublish = () => {
    void saveProduct("Published");
  };

  const handleDiscardClick = () => {
    if (isDirty) {
      setDiscardConfirmOpen(true);
    } else {
      navigate("/products");
    }
  };

  if (loadingProduct) {
    return <div className={styles.loading}>Loading product...</div>;
  }

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
        saving={saving}
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
