import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ""
    },
    ctaText: {
      type: String,
      trim: true,
      default: ""
    },
    ctaLink: {
      type: String,
      trim: true,
      default: ""
    },
    backgroundImage: {
      type: String,
      trim: true,
      default: ""
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

heroSlideSchema.index({ order: 1 });
heroSlideSchema.index({ isActive: 1 });

const HeroSlideModel = mongoose.model("HeroSlide", heroSlideSchema);

export { HeroSlideModel };
