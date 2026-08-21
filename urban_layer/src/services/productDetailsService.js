import api from "./api";

export async function fetchProductDetailsAsync(productId) {
    try {
        const response = await api.get(`/storefront/catalog/products/${productId}`);
        if (response.data && response.data.data) {
            const apiItem = response.data.data;

            const images = (apiItem.images && apiItem.images.length > 0)
                ? apiItem.images
                : (apiItem.featuredImage ? [apiItem.featuredImage] : []);

            const thumbnails = images.map((src, idx) => ({
                src,
                alt: `${apiItem.name} view ${idx + 1}`
            }));

            const primaryCategory = apiItem.categories && apiItem.categories.length > 0
                ? apiItem.categories[0]
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

            const price = Number(apiItem.price || apiItem.salePrice || apiItem.basePrice || 0);
            const originalPrice = (apiItem.salePrice != null && apiItem.basePrice > apiItem.salePrice)
                ? Number(apiItem.basePrice)
                : null;

            return {
                id: apiItem.id,
                _id: apiItem.id,
                name: apiItem.name,
                slug: apiItem.slug,
                sku: apiItem.sku || "",
                phoneModel: apiItem.phoneModel || null,
                description: apiItem.description || "",
                categories: apiItem.categories || [],
                collection: apiItem.collection || "",
                tags: apiItem.tags || [],
                price,
                originalPrice,
                basePrice: apiItem.basePrice ? Number(apiItem.basePrice) : null,
                salePrice: apiItem.salePrice ? Number(apiItem.salePrice) : null,
                stock: apiItem.stock ?? 0,
                inStock: (apiItem.stock ?? 0) > 0,
                weight: apiItem.weight || null,
                dimensions: apiItem.dimensions || null,
                packageType: apiItem.packageType || "",
                shippingClass: apiItem.shippingClass || "",
                fragile: Boolean(apiItem.fragile),
                heroImage: apiItem.featuredImage || images[0] || "",
                thumbnails,
                images,
                breadcrumb,
                bentoFeatures: apiItem.bentoFeatures || [],
                editorialHighlights: apiItem.editorialHighlights || [],
                lifestyleBanner: apiItem.lifestyleBanner || null,
                bundle: apiItem.bundle || null,
                reviews: apiItem.reviews || [],
            };
        }
    } catch (error) {
        console.error(`Failed to fetch product details for ${productId}:`, error);
    }

    return null;
}