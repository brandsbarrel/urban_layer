import api from "./api";

export const getProducts = async ({
    page = 1,
    perPage = 9,
    search = "",
    category = "",
    phoneModel = "",
    material = "",
    color = "",
    maxPrice = null,
    sortBy = "best-sellers",
}) => {
    try {
        const response = await api.get("/storefront/catalog/products", {
            params: {
                page,
                perPage,
                search,
                category,
                phoneModel,
                maxPrice,
            },
        });

        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
            let items = response.data.data.items;

            if (maxPrice != null) {
                items = items.filter((item) => item.price <= maxPrice);
            }

            // Apply frontend sorting if not handled by API
            items = sortProductList(items, sortBy);

            return {
                ...response.data,
                data: {
                    ...response.data.data,
                    items,
                },
            };
        }
    } catch {
        // Fallback to local catalog when API is offline or fails
    }

    return getLocalProducts({
        page,
        perPage,
        search,
        category,
        phoneModel,
        material,
        color,
        maxPrice,
        sortBy,
    });
};

export const getCategories = async () => {
    try {
        const response = await api.get("/storefront/catalog/categories");
        if (response.data?.data?.items) {
            return response.data.data.items;
        }
    } catch {
        // Fallback
    }

    return [];
};

export const getPhoneModels = async () => {
    try {
        const response = await api.get("/storefront/catalog/phone-models");
        if (response.data?.data?.items) {
            return response.data.data.items;
        }
    } catch {
        // Fallback
    }

    return [];
};

// Full local mock catalog for rich experience
export const ALL_LOCAL_PRODUCTS = [
    {
        id: "carbon-stealth-01",
        slug: "carbon-stealth-01",
        name: "Carbon Stealth 01",
        compatibility: "Aero-grade Carbon Fiber • iPhone 15 Pro Max",
        price: 2499,
        originalPrice: 3299,
        basePrice: 3299,
        rating: 4.9,
        reviewCount: 94,
        badge: "Best Seller",
        device: ["iphone-15-pro-max"],
        material: "carbon-fiber",
        color: "black",
        category: "carbon-fiber",
        phoneModel: "iPhone 15 Pro Max",
        featuredImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCV4yU6IR-kIo8xgpSx_6b_VXx3LNlDDclu50aQqnHOFJB1CCGU2l4IRt00mhfLL2T_EbF5BKGpJEIcyLQ8EvyyXfqhUHu9TmeX9rU_f_8oe9SPZ75wIL0slOF8imX29waZpoQcJcND9IuFqVUp6fNb35ZkF_OljMbyqeQOC2C7vPBpvZKiYkzmS01jPGNhJcZhtM_c9RmtXX_Mh6ZAitOO3AzUOt0dckE91VDFcIbdAj2cIwGzzChbUlrd3V9uWqJnDSVsnOl2Muw",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCV4yU6IR-kIo8xgpSx_6b_VXx3LNlDDclu50aQqnHOFJB1CCGU2l4IRt00mhfLL2T_EbF5BKGpJEIcyLQ8EvyyXfqhUHu9TmeX9rU_f_8oe9SPZ75wIL0slOF8imX29waZpoQcJcND9IuFqVUp6fNb35ZkF_OljMbyqeQOC2C7vPBpvZKiYkzmS01jPGNhJcZhtM_c9RmtXX_Mh6ZAitOO3AzUOt0dckE91VDFcIbdAj2cIwGzzChbUlrd3V9uWqJnDSVsnOl2Muw",
    },
    {
        id: "heritage-leather",
        slug: "heritage-leather",
        name: "Heritage Leather Case",
        compatibility: "Cognac Full-Grain Italian Leather",
        price: 3999,
        originalPrice: 4999,
        basePrice: 4999,
        rating: 5.0,
        reviewCount: 124,
        badge: "NEW ARRIVAL",
        device: ["samsung-s24-ultra", "iphone-15-pro"],
        material: "italian-leather",
        color: "gold",
        category: "leather",
        phoneModel: "Samsung S24 Ultra",
        featuredImage:
            "https://lh3.googleusercontent.com/aida/AP1WRLvHwFa1iVhVbkK3O_RKJyWNv8dIJMma8U07igJB9lKC9-MMi2NszWyoORmk6WCppfyf7qa3utDKbKZC3XznACvlkkyJ6nVjX3yZBHnWL3C9M81meqkLKHhr611Lj7HUZvc0doNWx7BfrceVEjB_5wXrDWfsFUzAFeagSVUfmeqqcqtPzC3znEBgQfteGIj3aMrmla-yqxy9XtfzZg49kqr1Vhc5rwFeG9ByysQhqr8sfno-JSh2mF1oJA",
        image:
            "https://lh3.googleusercontent.com/aida/AP1WRLvHwFa1iVhVbkK3O_RKJyWNv8dIJMma8U07igJB9lKC9-MMi2NszWyoORmk6WCppfyf7qa3utDKbKZC3XznACvlkkyJ6nVjX3yZBHnWL3C9M81meqkLKHhr611Lj7HUZvc0doNWx7BfrceVEjB_5wXrDWfsFUzAFeagSVUfmeqqcqtPzC3znEBgQfteGIj3aMrmla-yqxy9XtfzZg49kqr1Vhc5rwFeG9ByysQhqr8sfno-JSh2mF1oJA",
    },
    {
        id: "crystal-aura",
        slug: "crystal-aura",
        name: "Crystal Aura MagSafe",
        compatibility: "Anti-Yellowing Polymer • iPhone 15 Pro",
        price: 1799,
        originalPrice: 2299,
        basePrice: 2299,
        rating: 4.8,
        reviewCount: 68,
        badge: "Popular",
        device: ["iphone-15-pro"],
        material: "liquid-silicone",
        color: "silver",
        category: "clear-cases",
        phoneModel: "iPhone 15 Pro",
        featuredImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCYK7Ie8uULdryg9qlxPmBXcXYpp2Z6R_8X0gPPFEt85jmp-Ym-5yzIFt6MAB7tb1d2lWcN-7VraxM9bheZFp8rGc3vO28BwWFzoJmE-yG3KwBpdVX42kkJ-wy_OxCyGiDRmCtw__Kzqs_c7q2Y9Kvarm8k0HsmNVSSGQHOT8P2W0WLAMcACyQwxwVPh9VL4NeP8NxbLVD9-2qHH5vOxcDhSntwvj5e0dZyt0s_Z_qFAI6VAt8b8TUfqVEZbRQYO35pWY_Rfheh4p0",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCYK7Ie8uULdryg9qlxPmBXcXYpp2Z6R_8X0gPPFEt85jmp-Ym-5yzIFt6MAB7tb1d2lWcN-7VraxM9bheZFp8rGc3vO28BwWFzoJmE-yG3KwBpdVX42kkJ-wy_OxCyGiDRmCtw__Kzqs_c7q2Y9Kvarm8k0HsmNVSSGQHOT8P2W0WLAMcACyQwxwVPh9VL4NeP8NxbLVD9-2qHH5vOxcDhSntwvj5e0dZyt0s_Z_qFAI6VAt8b8TUfqVEZbRQYO35pWY_Rfheh4p0",
    },
    {
        id: "magnetic-power-pad",
        slug: "magnetic-power-pad",
        name: "Magnetic Power Pad",
        compatibility: "15W Fast Wireless MagSafe Charger",
        price: 1999,
        originalPrice: 2499,
        basePrice: 2499,
        rating: 4.7,
        reviewCount: 42,
        badge: "Accessory",
        device: ["iphone-15-pro-max", "iphone-15-pro"],
        material: "eco-friendly",
        color: "black",
        category: "magsafe-accessories",
        phoneModel: "MagSafe Compatible",
        featuredImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBf2UlgxAnjSKHm1UFbdneEvYQvewZGlHgy2nY_14XCov3naplWk4UzOq0QEEkHiVF4zmrcfIfdB_bBmBZK_LPh7rFT3g4OeAFVJHfmWpWGR1_IBc83thnMNnAoitMefUFlWzzaGwhHsaOK9jHqFuFG8zgmF-F93-LODgUpfvDj6ojZpcVOI98D7aJshb1i9KViHVRze2MCpGcEBRc7h0XMkEHUZIcPJmZOijjR_kcwpmj_OX1gqk4o1VTqEerskkYvYSwwrJV48Y4",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBf2UlgxAnjSKHm1UFbdneEvYQvewZGlHgy2nY_14XCov3naplWk4UzOq0QEEkHiVF4zmrcfIfdB_bBmBZK_LPh7rFT3g4OeAFVJHfmWpWGR1_IBc83thnMNnAoitMefUFlWzzaGwhHsaOK9jHqFuFG8zgmF-F93-LODgUpfvDj6ojZpcVOI98D7aJshb1i9KViHVRze2MCpGcEBRc7h0XMkEHUZIcPJmZOijjR_kcwpmj_OX1gqk4o1VTqEerskkYvYSwwrJV48Y4",
    },
    {
        id: "leather-card-sleeve",
        slug: "leather-card-sleeve",
        name: "Leather Card Sleeve",
        compatibility: "RFID-Blocking MagSafe Wallet",
        price: 1299,
        originalPrice: 1699,
        basePrice: 1699,
        rating: 4.9,
        reviewCount: 31,
        badge: "Essential",
        device: ["iphone-15-pro-max", "iphone-15-pro"],
        material: "italian-leather",
        color: "beige",
        category: "magsafe-accessories",
        phoneModel: "MagSafe Compatible",
        featuredImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBYC_33uwPUgzl5fltIUHB5zWHz4E2CE3_WWlTYl97k2H8IlHKCBMpXfixop66PxPzmEzWG7KdktVHFqjgBm8OQNDIymWSTHvtiqnoTuAxUe9RCh47ZJQ9yXpija2nwDBgdp-wyPCoU91X_zLN0tAVdICOdl3T0bJnjghlb4KbxgRKFzT4ahC109-hbrDXLBmMDKHNShh5_j0Hn0Jb3UmpZ3GxYX2lMESygDLnQeXTT5c92ohSkJ9bam-U7hR8QO4XqYpzJmnVGj4c",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBYC_33uwPUgzl5fltIUHB5zWHz4E2CE3_WWlTYl97k2H8IlHKCBMpXfixop66PxPzmEzWG7KdktVHFqjgBm8OQNDIymWSTHvtiqnoTuAxUe9RCh47ZJQ9yXpija2nwDBgdp-wyPCoU91X_zLN0tAVdICOdl3T0bJnjghlb4KbxgRKFzT4ahC109-hbrDXLBmMDKHNShh5_j0Hn0Jb3UmpZ3GxYX2lMESygDLnQeXTT5c92ohSkJ9bam-U7hR8QO4XqYpzJmnVGj4c",
    },
    {
        id: "sapphire-guard-pro",
        slug: "sapphire-guard-pro",
        name: "Sapphire Guard Pro",
        compatibility: "9H Hardness Glass Screen Protector",
        price: 899,
        originalPrice: 1199,
        basePrice: 1199,
        rating: 4.8,
        reviewCount: 112,
        badge: null,
        device: ["iphone-15-pro-max", "iphone-15-pro", "samsung-s24-ultra"],
        material: "liquid-silicone",
        color: "silver",
        category: "phone-cases",
        phoneModel: "iPhone 15 Pro",
        featuredImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBQbNBRis1Y63ft6iptlUuMSVtZS8ovDWKoOAeeuYpVJstvtpPOEmNhLrazGEt84ks6CTVs02smWk-s1LrP6bID4YfCEC5mrAySgDjjqJMLMzIoZ5Ipn45yInWPd2zVHujNApQFbxZeRosJCbHWgSE4YkXbjP_WYQvBkRg0YX93W8_JW9zaWoxZxFQufsFtJmn0DJ5l8DyYD_HdPCOWw7XL6t23QtAXmdT64HN6J_cdII5VdcjlgnmldpYo64OXMFtlGUg453CMm-c",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBQbNBRis1Y63ft6iptlUuMSVtZS8ovDWKoOAeeuYpVJstvtpPOEmNhLrazGEt84ks6CTVs02smWk-s1LrP6bID4YfCEC5mrAySgDjjqJMLMzIoZ5Ipn45yInWPd2zVHujNApQFbxZeRosJCbHWgSE4YkXbjP_WYQvBkRg0YX93W8_JW9zaWoxZxFQufsFtJmn0DJ5l8DyYD_HdPCOWw7XL6t23QtAXmdT64HN6J_cdII5VdcjlgnmldpYo64OXMFtlGUg453CMm-c",
    },
];

function sortProductList(products, sortBy) {
    const list = [...products];
    if (sortBy === "price-low") {
        return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
        return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "newest") {
        return list.sort((a, b) => (b.badge === "NEW ARRIVAL" ? 1 : -1));
    }
    // Default best-sellers
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

function getLocalProducts({
    page = 1,
    perPage = 9,
    search = "",
    category = "",
    phoneModel = "",
    material = "",
    color = "",
    maxPrice = null,
    sortBy = "best-sellers",
}) {
    let filtered = [...ALL_LOCAL_PRODUCTS];

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.compatibility && p.compatibility.toLowerCase().includes(q))
        );
    }

    if (category) {
        filtered = filtered.filter(
            (p) =>
                p.category === category ||
                (p.slug && p.slug.includes(category))
        );
    }

    if (phoneModel) {
        const pmLower = phoneModel.toLowerCase();
        const pmSlug = pmLower.replace(/\s+/g, "-");
        filtered = filtered.filter(
            (p) =>
                p.phoneModel === phoneModel ||
                p.phoneModelId === phoneModel ||
                (p.device && (p.device.includes(phoneModel) || p.device.includes(pmSlug))) ||
                (p.compatibility && p.compatibility.toLowerCase().includes(pmLower))
        );
    }

    if (material) {
        filtered = filtered.filter((p) => p.material === material);
    }

    if (color) {
        filtered = filtered.filter((p) => p.color === color);
    }

    if (maxPrice) {
        filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    filtered = sortProductList(filtered, sortBy);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const startIndex = (page - 1) * perPage;
    const items = filtered.slice(startIndex, startIndex + perPage);

    return {
        data: { items },
        meta: {
            page,
            perPage,
            totalItems,
            totalPages,
        },
    };
}

export const shopByDeviceCategories = ["iPhone 15 Pro Max", "iPhone 15 Pro", "Samsung S24 Ultra"];
export const curatedCollections = [];
export const bestSellerProducts = ALL_LOCAL_PRODUCTS.slice(0, 3);
export const recommendationProducts = ALL_LOCAL_PRODUCTS.slice(3, 6);
export const featuredCollections = [];
export const limitedEditionProducts = ALL_LOCAL_PRODUCTS.filter((p) => p.badge === "NEW ARRIVAL" || p.badge === "Limited Edition");
export const whyChooseFeatures = [];
export const lifestyleGallery = [];
export const instagramPosts = [];
export const benefits = [];
export const materials = [];
export const collections = [];
export const shopProducts = ALL_LOCAL_PRODUCTS;
export const priceFilterRange = { min: 499, max: 4999 };
export const colors = [];
export const devices = [];