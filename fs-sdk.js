// fs-sdk.js
export const sdk = FastSpring.init({
    // Your exact Order 66 Component Checkout URL
    checkoutUrl: 'https://joestuneztest.test.onfastspring.com/components-order66',

    onSessionLoaded: (data) => {
        console.log('Session loaded successfully:', data);
    },
    
    onOrderCompleted: (data) => {
        console.log('Order completed! Execute Order 66.', data);
        
        // 1. Hide the checkout components (Card, Zip, Button)
        document.getElementById('checkout-components-wrapper').style.display = 'none';
        
        // 2. Reveal the Victory Screen (This triggers the Lightsaber animation!)
        document.getElementById('success-message').style.display = 'block';
        
        // 3. Inject the actual FastSpring Order Reference ID onto the screen
        if (data && data.id) {
            document.getElementById('order-reference').innerText = 'Reference ID: ' + data.id;
        }
    },
    
    onPaymentFailed: (error) => {
        console.error('Payment failed:', error);
        alert("Transaction Failed. The Jedi may have intercepted the payment.");
    }
});
