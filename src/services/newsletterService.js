// Mock service — is function ki body baad mein real API call se replace hogi
export function subscribeToNewsletter(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, email });
        }, 800);
    });
}