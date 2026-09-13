import publicApi, { logPublicApiResult } from "./publicApi";
import { normalizeProduct } from "./productsService";

export async function fetchProductDetailsAsync(productId) {
    try {
        let apiItem = null;

        try {
            const response = await publicApi.get(`/products/${productId}`);
            logPublicApiResult("Product Details", `/api/products/${productId}`, response.data);
            apiItem = response.data?.data || response.data?.item || response.data;
        } catch {
            const response = await publicApi.get("/products", {
                params: { search: productId, page: 1, perPage: 50 },
            });
            logPublicApiResult("Product Details fallback", `/api/products?search=${productId}`, response.data);
            const items = response.data?.data?.items || response.data?.items || response.data?.data || [];
            apiItem = (Array.isArray(items) ? items : []).find((item) => (
                item.id === productId ||
                item._id === productId ||
                item.slug === productId ||
                item.sku === productId
            ));
        }

        if (apiItem) {
            const normalized = normalizeProduct(apiItem);

            const images = normalized.images?.length
                ? normalized.images
                : (normalized.featuredImage ? [normalized.featuredImage] : []);

            const thumbnails = images.map((src, idx) => ({
                src,
                alt: `${normalized.name} view ${idx + 1}`
            }));

            const primaryCategory = normalized.categories && normalized.categories.length > 0
                ? normalized.categories[0]
                : null;

            const breadcrumb = [
                { label: "Home", path: "/" },
                { label: "Shop", path: "/shop" }
            ];

            if (primaryCategory) {
                breadcrumb.push({
                    label: primaryCategory.name,
                    path: `/shop?category=${primaryCategory.slug || primaryCategory.id}`
                });
            }

            breadcrumb.push({ label: apiItem.name });

            return {
                ...normalized,
                sku: normalized.sku || "",
                description: normalized.description || "",
                tags: normalized.tags || [],
                stock: normalized.stock ?? 0,
                weight: normalized.weight || null,
                dimensions: normalized.dimensions || null,
                packageType: normalized.packageType || "",
                shippingClass: normalized.shippingClass || "",
                fragile: Boolean(normalized.fragile),
                heroImage: normalized.featuredImage || images[0] || "",
                thumbnails,
                images,
                breadcrumb,
                bentoFeatures: normalized.bentoFeatures || [],
                editorialHighlights: normalized.editorialHighlights || [],
                lifestyleBanner: normalized.lifestyleBanner || null,
                bundle: normalized.bundle || null,
                reviews: normalized.reviews || [],
            };
        }
    } catch (error) {
        console.error(`Failed to fetch product details for ${productId}:`, error);
    }

    return null;
}
