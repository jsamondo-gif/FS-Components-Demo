// fs-components.js
import { sdk } from './fs-sdk.js';

// Global Web Audio Context for 100% reliable playback
let audioCtx = null;
let audioBuffer = null;

async function loadAudioEngine() {
    try {
        const audioEl = document.getElementById('jet-sound');
        if (!audioEl) return;
        const response = await fetch(audioEl.src);
        const arrayBuffer = await response.arrayBuffer();
        const TempCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioBuffer = await TempCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.log("Audio engine preload note:", e);
    }
}
loadAudioEngine();

function playJetSoundNow() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        if (audioBuffer) {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start(0);
        } else {
            const jetAudio = document.getElementById('jet-sound');
            if (jetAudio) {
                jetAudio.currentTime = 0;
                jetAudio.play();
            }
        }
    } catch (err) {
        console.log("Playback error:", err);
    }
}

// 1. EMAIL COMPONENT (COMPACT)
const emailComponent = sdk.components.create('fs-email', {
    fields: { email: 'auto' },
    labelMode: 'fixed',
    hideEmailHeader: false,
    style: {
        state: {
            default: {
                email: { backgroundColor: 'transparent' },
                emailTitle: { color: '#00e5ff', fontSize: '11px', fontFamily: '"Share Tech Mono", monospace' },
                label: { color: '#ff9900', fontWeight: 'bold', fontSize: '10px', fontFamily: '"Share Tech Mono", monospace' },
                input: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: '#00e5ff', borderRadius: '2px',
                    height: '34px', color: '#ffffff', fontSize: '13px', fontFamily: '"Share Tech Mono", monospace'
                }
            },
            focus: {
                input: { borderColor: '#ffffff', boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)' }
            }
        }
    }
});
emailComponent.mount('#email-element');

// 2. COUPON COMPONENT (COMPACT)
const couponComponent = sdk.components.create('fs-coupon', {
    style: {
        state: {
            default: {
                input: {
                    background: 'rgba(0, 0, 0, 0.5)', borderColor: '#00e5ff', borderRadius: '2px',
                    height: '32px', color: '#ffffff', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px'
                },
                button: {
                    background: '#1a365d', color: '#00e5ff', borderRadius: '2px', fontFamily: '"Share Tech Mono", monospace', height: '32px'
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

// 3. APPLE PAY COMPONENT (COMPACT)
const applePayComponent = sdk.components.create('fs-apple-pay', {
    variant: 'white', 
    style: {
        state: {
            default: {
                button: { height: '38px', borderRadius: '2px' }
            }
        }
    }
});
applePayComponent.mount('#apple-pay-element');

// 4. CARD COMPONENT (COMPACT)
const cardComponent = sdk.components.create('fs-card', {
    labelMode: 'fixed',
    hideCardHeader: true,
    style: {
        state: {
            default: {
                card: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: '0' },
                input: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: '#00e5ff', borderRadius: '2px',
                    height: '34px', padding: '0 8px', color: '#ffffff', fontSize: '13px', fontFamily: '"Share Tech Mono", monospace'
                },
                label: { color: '#ff9900', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', fontFamily: '"Share Tech Mono", monospace' }
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

// 5. PAY BUTTON COMPONENT (COMPACT)
const payButtonComponent = sdk.components.create('fs-pay-button', {
    style: {
        state: {
            default: {
                button: {
                    backgroundColor: '#ff9900', color: '#000000', border: 'none',
                    borderRadius: '2px', width: '100%', height: '38px',
                    fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', letterSpacing: '1px'
                }
            },
            hover: { button: { backgroundColor: '#ffcc00', boxShadow: '0 0 15px rgba(255, 153, 0, 0.6)' } }
        }
    }
});
payButtonComponent.mount('#pay-button-element');

// 6. DISCLOSURES COMPONENT (COMPACT)
const disclosuresComponent = sdk.components.create('fs-disclosures', {
    style: {
        state: {
            default: {
                container: { color: '#b0c4de', fontFamily: '"Share Tech Mono", monospace', fontSize: '10px' },
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

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
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

                playJetSoundNow();
            };

            sdk.checkout(sessionData.id, {
                onSuccess: () => {
                    btn.innerText = "[ UPLINK ACTIVE ]";
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
