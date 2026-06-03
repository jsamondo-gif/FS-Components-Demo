// fs-components.js
import { sdk } from './fs-sdk.js';

// 1. Mount the Card Component (Darth Maul Skin)
const cardComponent = sdk.components.create('fs-card', {
    style: {
        state: {
            default: {
                card: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: '0' },
                input: {
                    backgroundColor: '#000000', borderColor: '#cc0000', borderRadius: '4px',
                    height: '48px', padding: '0 10px', color: '#ffcc00', fontSize: '16px'
                },
                // Updated to light grey so it pops against the black background!
                label: { color: '#aaaaaa', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' } 
            },
            focus: { input: { borderColor: '#ffcc00', boxShadow: '0 0 8px #ffcc00' } },
            error: { input: { borderColor: '#ff0000' } }
        }
    }
});
cardComponent.mount('#card-element');

// 2. Mount the Pay Button Component
const payButtonComponent = sdk.components.create('fs-pay-button', {
    style: {
        state: {
            default: {
                button: {
                    backgroundColor: '#cc0000', color: '#000000', border: 'none',
                    borderRadius: '4px', width: '100%', height: '50px',
                    fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer'
                }
            },
            hover: { button: { backgroundColor: '#ffcc00', boxShadow: '0 0 15px #ffcc00' } },
            // Darkened the disabled state so it fits the theme better
            disabled: { button: { backgroundColor: '#330000', color: '#666666', cursor: 'not-allowed' } } 
        }
    }
});
payButtonComponent.mount('#pay-button-element');

// 3. Mount Disclosures Component
const disclosuresComponent = sdk.components.create('fs-disclosures', {
    style: {
        state: {
            default: {
                // Changed text to light grey to stand out on the black background
                container: { color: '#aaaaaa', fontFamily: 'Arial', fontSize: '12px' }, 
                link: { color: '#cc0000', fontWeight: 'bold' }
            }
        }
    }
});
disclosuresComponent.mount('#disclosures-container');


// 4. THE TRIGGER: Fetch Session ID from Node and feed it to the Components
document.getElementById('buyNowBtn').addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    const btn = document.getElementById('buyNowBtn');
    btn.innerText = "Summoning...";
    btn.disabled = true;
    
    try {
        // Call your Node.js backend to get the Session ID
        const response = await fetch('/create-session', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email })
        });
        
        const sessionData = await response.json();
        console.log("Backend generated Session ID:", sessionData.id);

        if (sessionData && sessionData.id) {
            // STEP 6 FROM THE GUIDE: Feed the Session ID to the Components!
            sdk.checkout(sessionData.id, {
                onSuccess: () => {
                    console.log('SDK accepted the Session ID. Components are now visible!');
                    btn.innerText = "Session Active";
                },
                onError: (err) => {
                    console.error('SDK rejected the Session ID:', err);
                    btn.innerText = "Initialize Session";
                    btn.disabled = false;
                }
            });
        }
    } catch (error) {
        console.error("Backend fetch failed:", error);
        btn.innerText = "Initialize Session";
        btn.disabled = false;
    }
});
