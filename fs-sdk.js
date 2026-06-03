// fs-sdk.js
export const sdk = FastSpring.init({
    // Your exact Order 66 Component Checkout URL
    checkoutUrl: 'https://joestuneztest.test.onfastspring.com/components-order66',

    onSessionLoaded: (data) => {
        console.log('Session loaded successfully:', data);
    },
    onOrderCompleted: (data) => {
        console.log('Order completed! Execute Order 66.', data);
    },
    onPaymentFailed: (error) => {
        console.error('Payment failed:', error);
    }
});