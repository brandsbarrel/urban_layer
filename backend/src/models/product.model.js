import mongoose from "mongoose";
import { PRODUCT_STATUSES, PRODUCT_VISIBILITIES } from "../constants/index.js";

const galleryItemSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const variantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      default: ""
    },
    color: {
      type: String,
      trim: true,
      default: ""
    },
    stock: {
      type: Number,
      default: 0
    }
  },
  {
    _id: false
  }
);

const activitySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true
    },
    meta: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    phoneModel: {
      type: String,
      required: true,
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    brand: {
      type: String,
      trim: true,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      default: []
    },
    collection: {
      type: String,
      trim: true,
      default: ""
    },
    featuredImage: {
      type: String,
      trim: true,
      default: ""
    },
    gallery: {
      type: [galleryItemSchema],
      default: []
    },
    basePrice: {
      type: Number,
      required: true
    },
    salePrice: {
      type: Number,
      default: null
    },
    costPrice: {
      type: Number,
      default: null
    },
    taxRate: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    reservedStock: {
      type: Number,
      default: 0
    },
    trackStock: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: PRODUCT_STATUSES,
      default: "Draft"
    },
    visibility: {
      type: String,
      enum: PRODUCT_VISIBILITIES,
      default: "Public"
    },
    seoTitle: {
      type: String,
      trim: true,
      default: ""
    },
    seoDescription: {
      type: String,
      trim: true,
      default: ""
    },
    seoScore: {
      type: Number,
      default: 0
    },
    weight: {
      type: Number,
      default: null
    },
    length: {
      type: Number,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    packageType: {
      type: String,
      trim: true,
      default: "Box"
    },
    shippingClass: {
      type: String,
      trim: true,
      default: "Standard"
    },
    fragile: {
      type: Boolean,
      default: false
    },
    variants: {
      type: [variantSchema],
      default: []
    },
    unfulfilledOrders: {
      type: Number,
      default: 0
    },
    activity: {
      type: [activitySchema],
      default: []
    },
    archivedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: "text", sku: "text", phoneModel: "text", tags: "text" });

const ProductModel = mongoose.model("Product", productSchema);

export { ProductModel };
