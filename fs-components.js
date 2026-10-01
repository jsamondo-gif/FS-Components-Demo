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
                emailTitle: { color: '#ffcc00', fontSize: '13px' },
                label: { color: '#ffcc00', fontWeight: 'bold', fontSize: '11px' },
                input: {
                    backgroundColor: '#000000', borderColor: '#cc0000', borderRadius: '4px',
                    height: '40px', color: '#ffcc00', fontSize: '14px'
                }
            },
            focus: {
                input: { borderColor: '#ffcc00', boxShadow: '0 0 8px #ffcc00', backgroundColor: '#000000' }
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
                    height: '38px', color: '#ffcc00'
                },
                button: {
                    background: '#880000', color: '#ffffff', borderRadius: '4px'
                },
                chip: {
                    background: '#220000', color: '#ffcc00', borderRadius: '12px'
                }
            },
            focus: {
                input: { borderColor: '#ffcc00', boxShadow: '0 0 8px #ffcc00' }
            }
        }
    }
});
couponComponent.mount('#coupon-element');

// 3. APPLE PAY COMPONENT
const applePayComponent = sdk.components.create('fs-apple-pay', {
    variant: 'black',
    style: {
        state: {
            default: {
                button: { height: '46px', borderRadius: '4px' }
            }
        }
    }
});
applePayComponent.mount('#apple-pay-element');

// 4. GOOGLE PAY COMPONENT
const googlePayComponent = sdk.components.create('fs-google-pay', {
    variant: 'dark',
    style: {
        state: {
            default: {
                button: { height: '46px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }
            }
        }
    }
});
googlePayComponent.mount('#google-pay-element');

// 5. CARD COMPONENT
const cardComponent = sdk.components.create('fs-card', {
    labelMode: 'fixed',
    hideCardHeader: true,
    style: {
        state: {
            default: {
                card: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: '0' },
                input: {
                    backgroundColor: '#000000', borderColor: '#cc0000', borderRadius: '4px',
                    height: '42px', padding: '0 10px', color: '#ffcc00', fontSize: '14px'
                },
                label: { color: '#ffcc00', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }
            },
            hover: { card: { backgroundColor: 'transparent' } },
            focus: {
                card: { backgroundColor: 'transparent' },
                input: { borderColor: '#ffcc00', boxShadow: '0 0 8px #ffcc00', backgroundColor: '#000000' }
            },
            error: {
                input: { borderColor: '#ff0000', color: '#ff0000', backgroundColor: '#000000' }
            }
        }
    }
});
cardComponent.mount('#card-element');

// 6. PAY BUTTON COMPONENT
const payButtonComponent = sdk.components.create('fs-pay-button', {
    style: {
        state: {
            default: {
                button: {
                    backgroundColor: '#880000', color: '#ffffff', border: '1px solid #ff0000',
                    borderRadius: '4px', width: '100%', height: '46px',
                    fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer'
                }
            },
            hover: { button: { backgroundColor: '#ff0000', boxShadow: '0 0 15px #ff0000' } }
        }
    }
});
payButtonComponent.mount('#pay-button-element');

// 7. DISCLOSURES COMPONENT
const disclosuresComponent = sdk.components.create('fs-disclosures', {
    style: {
        state: {
            default: {
                container: { color: '#888888', fontFamily: 'Arial', fontSize: '11px' },
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

    const btn = document.getElementById('buyNowBtn');
    btn.innerText = "Summoning...";
    btn.disabled = true;

    try {
        const response = await fetch('/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName })
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
