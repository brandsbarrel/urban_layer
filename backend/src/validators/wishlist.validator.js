import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId.");

const addToWishlistSchema = z.object({
  productId: objectIdSchema
});

export {
  addToWishlistSchema
};