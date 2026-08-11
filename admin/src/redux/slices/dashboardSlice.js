import { createSlice } from "@reduxjs/toolkit";

// All values below are MOCK DATA standing in for a real analytics/orders/inventory API.
// This slice is the single point that will be wired to real endpoints later.
const revenueSeriesByPeriod = {
  "7D": {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    linePath: "M0,80 Q10,70 20,75 T40,60 T60,65 T80,45 T100,50",
    areaPath:
      "M0,80 Q10,70 20,75 T40,60 T60,65 T80,45 T100,50 L100,100 L0,100 Z",
  },
  "30D": {
    labels: ["W1", "W2", "W3", "W4"],
    linePath: "M0,70 Q20,60 40,68 T70,40 T100,35",
    areaPath: "M0,70 Q20,60 40,68 T70,40 T100,35 L100,100 L0,100 Z",
  },
  "90D": {
    labels: ["M1", "M2", "M3"],
    linePath: "M0,85 Q30,55 55,60 T100,20",
    areaPath: "M0,85 Q30,55 55,60 T100,20 L100,100 L0,100 Z",
  },
};

const salesBarsByPeriod = {
  "7D": {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    values: [40, 65, 55, 85, 45, 95, 70],
  },
  "30D": {
    labels: ["W1", "W2", "W3", "W4"],
    values: [55, 70, 62, 90],
  },
  "90D": {
    labels: ["M1", "M2", "M3"],
    values: [60, 78, 88],
  },
};

const initialState = {
  kpis: [
    {
      id: "revenue",
      icon: "payments",
      label: "Total Revenue",
      value: "$124,592.00",
      change: "+24.5%",
      trend: "up",
      sparkline: [50, 66, 33, 75, 100],
    },
    {
      id: "orders",
      icon: "local_shipping",
      label: "Total Orders",
      value: "1,842",
      change: "+8.2%",
      trend: "up",
      sparkline: [75, 50, 66, 75, 50],
    },
    {
      id: "customers",
      icon: "person_add",
      label: "Total Customers",
      value: "42,910",
      change: "-1.4%",
      trend: "flat",
      sparkline: [50, 33, 66, 66, 50],
    },
    {
      id: "conversion",
      icon: "trending_up",
      label: "Conversion Rate",
      value: "3.42%",
      change: "+3.1%",
      trend: "up",
      sparkline: [25, 50, 75, 50, 100],
    },
  ],
  revenueChartPeriod: "7D",
  salesChartPeriod: "7D",
  revenueSeriesByPeriod,
  salesBarsByPeriod,
  storePerformance: {
    healthLabel: "Store Performance",
    healthValue: "94.2% Health",
    metrics: [
      { id: "uptime", label: "Server Uptime", value: "99.9%", percent: 99.9 },
      {
        id: "inventory-capacity",
        label: "Inventory Capacity",
        value: "78.4%",
        percent: 78.4,
      },
    ],
  },
  ordersOverview: [
    { id: "pending", label: "Pending", count: 42, accent: "warning" },
    { id: "confirmed", label: "Confirmed", count: 128, accent: "info" },
    { id: "shipped", label: "Shipped", count: 312, accent: "primary" },
    { id: "delivered", label: "Delivered", count: 1360, accent: "success" },
  ],
  ordersAvatars: [
    {
      id: 1,
      alt: "Close-up of an elegant, modern watch on a wrist",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWVFPKbGPY8L35fqKMTjJcQdu_1lISsr3Tp7ccBKq9tMl5hNndBzRes5CkGSUH72--a4s3L8CjS8epMoA1B8KFCmC976YpMYRybYqU7744L6GoUW-wulEW8VRjojCsXmjnkwhuYoXCcz61tmzcQoI0gO1Vl7jNZOtG8JB-7ICzFvw8MUgvIGqJB6GI9Py8wbQEX4Uc8kyBQrlQ7Qk8mATpeg39CedQNbkWKE0diykd0vJwe9zle8U5D9IXtkaAlP2ubjq5jqrERuM",
    },
    {
      id: 2,
      alt: "Macro photography of a luxurious black and gold textile",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9uEcjLWtZA3Asz_idIjr83BCg7HxQ0y35xEh8NhZNNtPs6b15V7CXTIIWBDqJskVFu8t5UzJobfmuHZAfdfTnAWCoOG_sZHPzu0qyVTzr0qPMSsA9nXoU-ctoZT9pPVgahq381VykYrhpu43tcMJtJOql9KUxRuC4XpS-1Gs5h3SOpqWWG9fCohXc5_2EW1GztJvt7mVtknF9LafPOMZZPWI2g1aHOV2nKzz77ezABgaFtCzeLvBUSEmJIkxWrdhrSmCrqGRQmtU",
    },
  ],
  ordersAvatarOverflowCount: 12,
  inventoryStatus: [
    {
      id: "in-stock",
      label: "In Stock",
      sub: "1,240 SKUs Healthy",
      percent: "85%",
      tone: "success",
      icon: "inventory",
    },
    {
      id: "low-stock",
      label: "Low Stock",
      sub: "12 SKUs need restock",
      percent: "8%",
      tone: "warning",
      icon: "warning",
    },
    {
      id: "out-of-stock",
      label: "Out of Stock",
      sub: "5 SKUs critical",
      percent: "7%",
      tone: "error",
      icon: "error",
    },
  ],
  bestSellingProducts: [
    {
      id: "onyx-belt",
      name: "Onyx Leather Belt",
      category: "Accessories",
      price: "$120.00",
      unitsSold: 842,
      revenue: "$101,040.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC73tXM-hBAA8NAWOp5pqCrAmTvoqs7gSpx8KqdKjwkF_ALf-3P_QIPAQusS9zyVkkzpq-oY-cO-Hk8ZmR0I2W1_sRtrpojaaI215ft0mh3kOMsoFwV15EQ7Mgj3StEKYDfrrv7q2-S8x8CLIkjqXkUnyEwR_23Ya0YNLh2zZXRvW86m9r4ZBzout_gnbHB4-zZZKMBve1I8vToBIbWctwqaphU2dbgJujI4k4IOAGw_wsQPHhElVqoyWqpMxhDZKqKC40Uq9cyQSU",
    },
    {
      id: "linen-shirt",
      name: "Linen Blend Shirt",
      category: "Apparel",
      price: "$85.00",
      unitsSold: 612,
      revenue: "$52,020.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_IkMs3W_t4Udw9If0B8fj2K1j6NcABP_Y_fn72U5dj0fTsuz7460kLURnmYJOajiTXDfUHSA7hfjPNVPxL09dEPWFLxSabJrU-vNUjq6_mFMoFU6-GSCpA86z3OuGdJGdADYq6cQqrwBLRNWgkivh9FU7tUhpcxe9AvvNesVWJK9JyFYtzpArdyYpXqNzoepVTBK1lA-g0rssqcch3fiSOh8bs0GiP9juMceim6t3J9EHVDb4H1Tu0TPHg_496iFya4pPFJMC6vc",
    },
    {
      id: "suede-loafers",
      name: "Suede Loafers",
      category: "Footwear",
      price: "$210.00",
      unitsSold: 205,
      revenue: "$43,050.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxQ2UdT2qMicoH3jDrnYBmS9w4ZnlElJmWUdlRVdM64wYwQHIMLjhKcSFdy6ia3IfFSVtr5mXsSBAIt6lvWPi7VdlaEc693kfuQSA27_Iejp_NrYWLtgrQl2XO1Pil9dbSvjccZW4Fa_MqJsrBXAJBNwxKNWKUNJ4cBQn3-rZaYyteLLn84WDQqVseWp-t-lYmsBg3lC5R9vY9IQcoBho-5kHb-sH4FNUf8P4M0A2vnxq1bg2ZQ8twMj1DPxwHJgNZR5UQ6ovN2ug",
    },
    {
      id: "gold-aviators",
      name: "Gold Aviators",
      category: "Accessories",
      price: "$155.00",
      unitsSold: 188,
      revenue: "$29,140.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCr75V6mS2ijUMQL5CyncNI8By8yhdtT-6ITbv2IxChXmVIAFsKPA6PA-Sfh35CORDiupnKthy7C0Ew2KvvQKo-enBDtiDGJW1FRQf27XjEbeauX6wQhLdrtz-knXhUPepBZLpFSOseZjuoQrH11V6DBcJUOPdkQtsF8mdDPCQ97VRn6pLTw4v-RQFD7l7ZXKLK0fbJZ1-950FxxDpo7HShCFUiEZCqrvly9Jk9oLBZ7IUQ1z3zySGAL-FEjP5mhVQXTwrqe4jEvXA",
    },
  ],
  recentActivity: [
    {
      id: 1,
      icon: "shopping_bag",
      tone: "primary",
      title: "New Order #8291",
      description: "From James Morrison",
      time: "2 mins ago",
      titleTone: "default",
    },
    {
      id: 2,
      icon: "priority_high",
      tone: "error",
      title: "Low Stock Alert",
      description: "'Onyx Belt' (L) is below 5 units.",
      time: "15 mins ago",
      titleTone: "error",
    },
    {
      id: 3,
      icon: "person",
      tone: "tertiary",
      title: "New Customer",
      description: "Sofia Valdes joined",
      time: "1 hour ago",
      titleTone: "default",
    },
    {
      id: 4,
      icon: "edit",
      tone: "outline",
      title: "Catalog Updated",
      description: "Admin updated 'Winter' prices",
      time: "3 hours ago",
      titleTone: "default",
    },
  ],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setRevenueChartPeriod(state, action) {
      state.revenueChartPeriod = action.payload;
    },
    setSalesChartPeriod(state, action) {
      state.salesChartPeriod = action.payload;
    },
  },
});

export const { setRevenueChartPeriod, setSalesChartPeriod } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;