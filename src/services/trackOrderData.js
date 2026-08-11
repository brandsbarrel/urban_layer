const HERITAGE_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUioYmzaigZxv8-tvLshkTlSpJ0l2tFp_NkQ_92jfEd1W_RJie4h9aNQ9KicIwvIaaJPcUHHHZW-MvFa1FQTIwheZivfiWedStOo3p5LNV7TzG8dAFkLX-8wyJiwF44vAjp-YBsc_hhfKdkbTPtX3JJexmYe4kmJ97lRm3Lq6vUX75NfID1OO3Q9sGeesO7kcmxioW3R3C6aLh1Pk6wlmdyUET__5UcAQGwIjDUYd87P_K-FmRZjeXSocllvsr9CFplUMTCjQCNZo';

// Ek demo order — jaise site mein cart/wishlist bhi demo data ke saath pre-populated hain
export const demoTrackingResult = {
    orderId: 'UL-84291',
    status: 'SHIPPED',
    estimatedDelivery: 'Oct 24 - Oct 26',
    steps: [
        { key: 'confirmed', label: 'Order Confirmed', timestamp: 'Oct 18, 09:20 AM', status: 'completed' },
        { key: 'preparing', label: 'Preparing Order', timestamp: 'Oct 19, 02:45 PM', status: 'completed' },
        { key: 'shipped', label: 'Shipped', timestamp: 'In Transit - NY Distribution', status: 'current' },
        { key: 'out_for_delivery', label: 'Out for Delivery', timestamp: 'Estimated: Oct 24', status: 'pending' },
        { key: 'delivered', label: 'Delivered', timestamp: null, status: 'pending' },
    ],
    courier: 'Express Courier Int.',
    service: 'White Glove Delivery',
    destination: 'Alexander Sterling, NY',
    isLive: true,
    checkpoint: 'Queens Logistics Hub, NY',
    items: [
        {
            id: 'heritage-leather-demo',
            name: 'Heritage Leather Case',
            quantity: 1,
            image: HERITAGE_IMAGE,
        },
        {
            id: 'carbon-stealth-demo',
            name: 'Carbon Stealth II',
            quantity: 1,
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCmvBeFd5BdnlN7AaCzzdgwEFv-yIqjdYO6UalfSWgXal-FdQAvNxliBC2v3zjYNpj9MCidAcmIOvYXnA6OYISRmS26_nV9JhkRiBUI7HYcswG1QnOrNFHxmbCZnH7Z2pRqYKa0w40Gg6So36DllwxD_gVn-ST2nIFQ3FVxepXnu9LjweftEfd-JsgXFMg0DnRKFck-O6gEcGYzJcERVNgqmwDf1yS_598L23UlIBnGZnvVSK3M9VLYjojjOnxw3KE3fmgALR3uDhI',
        },
    ],
};

export const mapImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA7d8hC8Z7tndFDFR-t62CE5cDIqdSSdmldSMXkZuSWeoIWHQ8_g8v2CSFslmDq50XSsTxBbuVJpItjI4JXdrp2Tw2Zm2qIhbdNRsaMo53Ol8e4lEmIt1wZLLj4JkCVhZ9bCwqECyNMp5nZ7eYdTBP2spK_DZI-Z7gJkpEzuGxj9VANyMfRqVAvpchQk0dtxcyMUU3LIYn4AoBks2USii1xOV_WcuhhtTXIiS4lA3ZMTryoQK0PQwCZ55vSkv8P_RoJwiK3F5Qfhpc';

export const whileYouWaitProducts = [
    {
        id: 'glass-shield-pro',
        category: 'Accessory',
        name: 'Glass Shield Pro',
        price: 3799,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBfetIxqi4GUK0Bw1fIQ--CjDKBV_f0iM_8S2RTijKrkoS7OeBFr6npoCh-UCNwOhcGuuBiLZzWcl_O8YumXk2Wa0uO7i8A8kTb3MzSwy95zsXvxePphiEYJ4d80UIhuuLBpkL7d2bFdcLUnUlKNdmTRG0dEWVL0UCS4WdT6wwW_z8bNgnrlhvOhqhTgIi2gyo1stzQARtCsjGX9C_RTKni-6jv6f02aGfuS4Ott6wtS0che4IZcfkSTwtG_Bgxqfj1XUlgE_H27QE',
    },
    {
        id: 'signature-wallet',
        category: 'Leather Goods',
        name: 'Signature Wallet',
        price: 9499,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDCyjW7xnbbsFsq-F87J5L080vdYAK5plL9dxX7Ps94hJqSmKueaGeQMtJqOeeSSbArCzHk_lVIpjU-nwDtsdKGt_6eYhcmeJSaBpUK39lsKpSV54p2MWhRiwYY_Bm54MculTAXBR5kTVpmhmVKyrYzqscytEFVjSGxb5wdwUrI4A2sv8jCz2Kkqiu7bhIM9tF45rWcRYIUw0dRoMZ13xpB9AjgbdMmkmOyrNsjFWKXoPYQxzIVCptwyyxgfscLC0i8DG3eoaD0ruY',
    },
    {
        id: 'care-kit-elite',
        category: 'Maintenance',
        name: 'Care Kit Elite',
        price: 2699,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBReI1mvx-JXc8M8g3NatBxxx_nksdnM0RB4fLWRtBmLq-BOOLVikHzZr7LvnyUxJ1HY-Syy7mpzlvLToiah2pMzZkqgStnx1ATHm2rRpmXQiXQVUZ_8wSRBM_eKfI5OM0W6LcNavTOJbekkicDR-ANl2wLaHIqAIf3jvzXM2NFLMGdtuC7to3jqLBhfXr7wKWJ554ickdePxEfQFXd64RWrseXV-xLbTJ13qTOMzln-z-6AIeA9lnXslX05r6PzXvNYBJh39hQyxA',
    },
    {
        id: 'titan-braided-cable',
        category: 'Tech',
        name: 'Titan Braided Cable',
        price: 4999,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCLabePX9cXiYKs9DmuoZ4acXKrB_iQfsctHtkVRzmrlFGJaUhjT8YwPrOR8cJj2hZUvOQPreHtv_-k_W4SF-bc4rLDKgIwJrQFlx7OwQrrZSKLvo_j7RILr8RiteGJcICjqVu4dgLsMe_E4P8kg7Pt_RNXC_awDt4JhwRyyLgCxTou09FsWDtOn59IxmNZdq0Vx0aGCWWqXmd4z6fm33pR2p4HCS1jzEwplEy-f2sRY8ozgH8eZeKNO0ewPCK2_XvoxxiDeU9LHyk',
    },
];