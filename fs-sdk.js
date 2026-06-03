// fs-sdk.js
export const sdk = FastSpring.init({
    checkoutUrl: 'https://joestuneztest.test.onfastspring.com/components-order66',

    onSessionLoaded: (data) => {
        console.log('Session loaded successfully:', data);
    },
    
    onOrderCompleted: (data) => {
        console.log('Order completed! Execute Order 66.', data);
        
        // 1. Hide the checkout components
        document.getElementById('checkout-components-wrapper').style.display = 'none';

        // NEW: Hide the "Sith Holocron / Complete your payment" text!
        document.getElementById('checkout-header').style.display = 'none';
        
        // 2. Reveal the Victory Screen (Lightsaber animation!)
        document.getElementById('success-message').style.display = 'block';
        
        // 3. Inject the actual FastSpring Order Reference ID
        if (data && data.id) {
            document.getElementById('order-reference').innerText = 'Reference ID: ' + data.id;
        }

        // 4. IGNITE THE SOUND!
        const saberAudio = document.getElementById('saber-sound');
        if (saberAudio) {
            saberAudio.play().catch(err => console.log("Jedi mind trick blocked the sound.", err));
        }
    },
    
    onPaymentFailed: (error) => {
        console.error('Payment failed:', error);
        alert("Transaction Failed. The Jedi may have intercepted the payment.");
    }
});
