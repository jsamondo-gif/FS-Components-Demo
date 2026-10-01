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
                emailTitle: { color: '#00e5ff', fontSize: '13px', fontFamily: '"Share Tech Mono", monospace' },
                label: { color: '#ff9900', fontWeight: 'bold', fontSize: '11px', fontFamily: '"Share Tech Mono", monospace' },
                input: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: '#00e5ff', borderRadius: '2px',
                    height: '40px', color: '#ffffff', fontSize: '14px', fontFamily: '"Share Tech Mono", monospace'
                }
            },
            focus: {
                input: { borderColor: '#ffffff', boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)' }
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
                    background: 'rgba(0, 0, 0, 0.5)', borderColor: '#00e5ff', borderRadius: '2px',
                    height: '38px', color: '#ffffff', fontFamily: '"Share Tech Mono", monospace'
                },
                button: {
                    background: '#1a365d', color: '#00e5ff', borderRadius: '2px', fontFamily: '"Share Tech Mono", monospace'
                },
                chip: {
                    background: '#0a1128', color: '#ff9900', border: '1px solid #ff9900', borderRadius: '2px'
                }
            },
            focus: {
                input: { borderColor: '#ffffff', boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)' }
            }
        }
    }
});
couponComponent.mount('#coupon-element');

// 3. APPLE PAY COMPONENT 
const applePayComponent = sdk.components.create('fs-apple-pay', {
    variant: 'white', 
    style: {
        state: {
            default: {
                button: { height: '46px', borderRadius: '2px' }
            }
        }
    }
});
applePayComponent.mount('#apple-pay-element');

// 4. CARD COMPONENT
const cardComponent = sdk.components.create('fs-card', {
    labelMode: 'fixed',
    hideCardHeader: true,
    style: {
        state: {
            default: {
                card: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: '0' },
                input: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: '#00e5ff', borderRadius: '2px',
                    height: '42px', padding: '0 10px', color: '#ffffff', fontSize: '14px', fontFamily: '"Share Tech Mono", monospace'
                },
                label: { color: '#ff9900', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', fontFamily: '"Share Tech Mono", monospace' }
            },
            hover: { card: { backgroundColor: 'transparent' } },
            focus: {
                card: { backgroundColor: 'transparent' },
                input: { borderColor: '#ffffff', boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)' }
            },
            error: {
                input: { borderColor: '#ff0000', color: '#ff0000', backgroundColor: 'rgba(50, 0, 0, 0.5)' }
            }
        }
    }
});
cardComponent.mount('#card-element');

// 5. PAY BUTTON COMPONENT
const payButtonComponent = sdk.components.create('fs-pay-button', {
    style: {
        state: {
            default: {
                button: {
                    backgroundColor: '#ff9900', color: '#000000', border: 'none',
                    borderRadius: '2px', width: '100%', height: '46px',
                    fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', letterSpacing: '1px'
                }
            },
            hover: { button: { backgroundColor: '#ffcc00', boxShadow: '0 0 15px rgba(255, 153, 0, 0.6)' } }
        }
    }
});
payButtonComponent.mount('#pay-button-element');

// 6. DISCLOSURES COMPONENT
const disclosuresComponent = sdk.components.create('fs-disclosures', {
    style: {
        state: {
            default: {
                container: { color: '#b0c4de', fontFamily: '"Share Tech Mono", monospace', fontSize: '11px' },
                link: { color: '#00e5ff', fontWeight: 'bold', textDecoration: 'none' }
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
    btn.innerText = "ESTABLISHING UPLINK...";
    btn.disabled = true;

    // 1. PROPERLY UNLOCK/PRIME THE AUDIO ENGINE ON FIRST USER CLICK
    const jetAudio = document.getElementById('jet-sound');
    if (jetAudio) {
        jetAudio.volume = 1.0;
        const playPromise = jetAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                jetAudio.pause();
                jetAudio.currentTime = 0;
            }).catch(error => {
                console.log("Audio unlock failed on initial click:", error);
            });
        }
    }

    try {
        const response = await fetch('/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName })
        });

        const sessionData = await response.json();
        
        if (sessionData && sessionData.id) {
            
            const handleOrderComplete = (orderData) => {
                document.getElementById('checkout-components-wrapper').style.display = 'none';
                document.getElementById('checkout-header').style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
                
                if (orderData && orderData.id) {
                    document.getElementById('order-reference').innerText = `Uplink Ref: ${orderData.id}`;
                }

                // 2. PLAY THE JET SOUND ON COMPLETION
                if (jetAudio) {
                    jetAudio.currentTime = 0;
                    jetAudio.play().catch(err => console.log("Audio play error on completion:", err));
                }
            };

            sdk.checkout(sessionData.id, {
                onSuccess: () => {
                    btn.innerText = "UPLINK SECURED";
                    document.getElementById('dormant-message').style.display = 'none';
                    document.getElementById('checkout-components-wrapper').style.display = 'block';
                },
                onError: (err) => {
                    console.error('SDK rejected the Session ID:', err);
                    btn.innerText = "Initialize Uplink";
                    btn.disabled = false;
                },
                onOrderCompleted: handleOrderComplete,
                onComplete: handleOrderComplete
            });
        }
    } catch (error) {
        console.error("Backend fetch failed:", error);
        btn.innerText = "Initialize Uplink";
        btn.disabled = false;
    }
});
