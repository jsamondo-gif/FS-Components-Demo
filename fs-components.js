// fs-components.js
import { sdk } from './fs-sdk.js';

// 1. EMAIL COMPONENT
const emailComponent = sdk.components.create('fs-email', {
    fields: { email: 'auto' },
    labelMode: 'fixed',
    hideEmailHeader: false,
    style: {
        state: {
            default: {
                email: { backgroundColor: 'transparent' },
                emailTitle: { color: '#ffcc00', fontSize: '14px' },
                label: { color: '#ffcc00', fontWeight: 'bold', fontSize: '12px' },
                input: {
                    backgroundColor: '#000000', borderColor: '#cc0000', borderRadius: '4px',
                    height: '48px', color: '#ffcc00', fontSize: '16px'
                }
            },
            focus: {
                input: { borderColor: '#ffcc00', boxShadow: '0 0 10px #ffcc00', backgroundColor: '#000000' }
            }
        }
    }
});
emailComponent.mount('#email-element');

// 2. COUPON COMPONENT
const couponComponent = sdk.components.create('fs-coupon', {
    style: {
        state: {
            default: {
                input: {
                    background: '#000000', borderColor: '#cc0000', borderRadius: '4px',
                    height: '44px', color: '#ffcc00'
                },
                button: {
                    background: '#880000', color: '#ffffff', borderRadius: '4px'
                },
                chip: {
                    background: '#220000', color: '#ffcc00', borderRadius: '12px'
                }
            },
            focus: {
                input: { borderColor: '#ffcc00', boxShadow: '0 0 10px #ffcc00' }
            }
        }
    }
});
couponComponent.mount('#coupon-element');

// 3. CARD COMPONENT
const cardComponent = sdk.components.create('fs-card', {
    labelMode: 'fixed',
    hideCardHeader: true,
    style: {
        state: {
            default: {
                card: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: '0' },
                input: {
                    backgroundColor: '#000000', borderColor: '#cc0000', borderRadius: '4px',
                    height: '48px', padding: '0 10px', 
                    color: '#ffcc00', 
                    fontSize: '16px'
                },
                label: { color: '#ffcc00', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' } 
            },
            hover: { card: { backgroundColor: 'transparent' } },
            focus: { 
                card: { backgroundColor: 'transparent' },
                input: { borderColor: '#ffcc00', boxShadow: '0 0 10px #ffcc00', backgroundColor: '#000000' } 
            },
            error: { 
                input: { borderColor: '#ff0000', color: '#ff0000', backgroundColor: '#000000' } 
            }
        }
    }
});
cardComponent.mount('#card-element');

// 4. PAY BUTTON COMPONENT
const payButtonComponent = sdk.components.create('fs-pay-button', {
    style: {
        state: {
            default: {
                button: {
                    backgroundColor: '#880000', color: '#ffffff', border: '1px solid #ff0000',
                    borderRadius: '4px', width: '100%', height: '50px',
                    fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', 
                    cursor: 'pointer', transition: 'all 0.2s ease-in-out'
                }
            },
            hover: { button: { backgroundColor: '#ff0000', boxShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 40px #ff0000' } },
            focus: { button: { backgroundColor: '#ff0000', boxShadow: '0 0 15px #ffffff, 0 0 30px #ff0000' } },
            disabled: { button: { backgroundColor: '#220000', color: '#555555', cursor: 'not-allowed', border: 'none' } } 
        }
    }
});
payButtonComponent.mount('#pay-button-element');

// 5. DISCLOSURES COMPONENT
const disclosuresComponent = sdk.components.create('fs-disclosures', {
    style: {
        state: {
            default: {
                container: { color: '#888888', fontFamily: 'Arial', fontSize: '12px' }, 
                link: { color: '#ffcc00', fontWeight: 'bold', textDecoration: 'none' }
            },
            hover: { link: { color: '#ffffff' } }
        }
    }
});
disclosuresComponent.mount('#disclosures-element');

// SESSION TRIGGER
document.getElementById('buyNowBtn').addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    const btn = document.getElementById('buyNowBtn');
    btn.innerText = "Summoning...";
    btn.disabled = true;
    
    try {
        const response = await fetch('/create-session', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email })
        });
        
        const sessionData = await response.json();
        console.log("Backend generated Session ID:", sessionData.id);

        if (sessionData && sessionData.id) {
            sdk.checkout(sessionData.id, {
                onSuccess: () => {
                    console.log('SDK accepted the Session ID. Components are now visible!');
                    btn.innerText = "Session Active";

                    document.getElementById('dormant-message').style.display = 'none';
                    document.getElementById('checkout-components-wrapper').style.display = 'block';
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
