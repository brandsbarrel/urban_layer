// Razorpay utility for handling checkout - supports both embedded (modal) and redirect (standard) modes

let razorpayLoadPromise = null;

// Get Razorpay key from environment
export const getRazorpayKey = () => {
    return import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_key';
};

export const loadRazorpayScript = () => {
    if (razorpayLoadPromise) {
        return razorpayLoadPromise;
    }

    razorpayLoadPromise = new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.Razorpay));
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay script')));
            return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        document.body.appendChild(script);
    });

    return razorpayLoadPromise;
};

// Embedded/Modal Checkout (current implementation)
export const openRazorpayCheckout = async (options) => {
    const Razorpay = await loadRazorpayScript();
    
    return new Promise((resolve, reject) => {
        const rzp = new Razorpay({
            ...options,
            handler: (response) => {
                resolve(response);
            },
            modal: {
                ondismiss: () => {
                    reject(new Error('Payment cancelled by user'));
                },
                escape: true,
                backdropclose: false,
            },
        });
        
        rzp.open();
    });
};

// Standard/Redirect Checkout - redirects user to Razorpay hosted payment page
export const redirectToRazorpayCheckout = (options) => {
    const keyId = getRazorpayKey();
    const orderId = options.order_id;
    
    if (!orderId) {
        throw new Error('Order ID is required for redirect checkout');
    }

    // Build the redirect URL for Razorpay Standard Checkout
    // Format: https://api.razorpay.com/v1/checkout/embedded/{order_id}?key_id=...&prefill[email]=...&prefill[contact]=...&prefill[name]=...&theme[color]=...
    const baseUrl = 'https://api.razorpay.com/v1/checkout/embedded/';
    
    const params = new URLSearchParams();
    params.append('key_id', keyId);
    
    if (options.prefill?.name) params.append('prefill[name]', options.prefill.name);
    if (options.prefill?.email) params.append('prefill[email]', options.prefill.email);
    if (options.prefill?.contact) params.append('prefill[contact]', options.prefill.contact);
    
    if (options.theme?.color) params.append('theme[color]', options.theme.color);
    
    // Add callback URL for redirect back to your site after payment
    // This should match your configured callback URL in Razorpay dashboard
    if (options.callback_url) {
        params.append('callback_url', options.callback_url);
    }
    
    // Add redirect parameter to return to your site
    if (options.redirect_url) {
        params.append('redirect_url', options.redirect_url);
    }

    const redirectUrl = `${baseUrl}${orderId}?${params.toString()}`;
    
    // Redirect the user to Razorpay's hosted payment page
    window.location.href = redirectUrl;
};