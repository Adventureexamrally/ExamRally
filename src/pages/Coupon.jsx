import React, { useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { UserContext } from '../context/UserProvider';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const CoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9"/></svg>
);
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
const Coupon = ({ data, setshowmodel }) => {
  const { isSignedIn } = useUser();
  const { user, refreshUser, utcNow } = useContext(UserContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode]         = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice]         = useState(data?.discountedAmount || data?.amount || 0);
  const [message, setMessage]               = useState({ text: '', type: '' });
  const [isProcessing, setIsProcessing]     = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);
  const [useCoins, setUseCoins]             = useState(false);
  const [settings, setSettings]             = useState(null);

  useEffect(() => {
    Api.get('/referral/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const loadRazorpayScript = () =>
    new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const applyCoupon = async () => {
    if (!couponCode.trim()) { setMessage({ text: 'Please enter a coupon code.', type: 'error' }); return; }
    try {
      setIsProcessing(true);
      setMessage({ text: '', type: '' });
      const res = await Api.post('/coupons/validate', {
        couponCode: couponCode.trim().toUpperCase(),
        currentDate: utcNow?.toISOString() || new Date().toISOString(),
      });
      if (res.data.valid) {
        const base = Number(data.discountedAmount) || Number(data.amount) || 0;
        const disc = (base * res.data.discountPercent) / 100;
        setDiscountPercent(res.data.discountPercent);
        setFinalPrice(Math.round(Math.max(0, base - disc)));
        setMessage({ text: `Coupon applied — ${res.data.discountPercent}% discount`, type: 'success' });
      } else {
        throw new Error(res.data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message || 'Coupon validation failed.', type: 'error' });
      resetCoupon();
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCoupon = () => {
    setDiscountPercent(0);
    setFinalPrice(data.discountedAmount || data?.amount || 0);
    setCouponCode('');
  };

  const calculateFinalPrice = () => {
    let base = Number(data.discountedAmount) || Number(data.amount) || 0;
    if (discountPercent > 0) base = Math.max(0, base - (base * discountPercent) / 100);
    let coinDiscount = 0;
    if (useCoins && user?.coins > 0 && settings?.maxCoinPaymentPercentage) {
      coinDiscount = Math.min(user.coins, base * (settings.maxCoinPaymentPercentage / 100));
    }
    return { finalPrice: Math.round(base - coinDiscount), coinDiscount: Math.round(coinDiscount) };
  };

  const { finalPrice: displayFinalPrice, coinDiscount: displayCoinDiscount } = calculateFinalPrice();

  useEffect(() => {
    setFinalPrice(calculateFinalPrice().finalPrice);
  }, [useCoins, discountPercent, user?.coins, settings, data]);

  const calcDiscount = () => {
    if (!data?.amount || !data?.discountedAmount) return 0;
    return Math.round((1 - data.discountedAmount / data.amount) * 100);
  };

  const handlePayment = async () => {
    if (!isSignedIn) { navigate('/sign-in'); return; }
    if (!user?._id) { toast.error('Session expired. Please sign in again.'); return; }
    try {
      setIsProcessing(true);
      let priceBeforeCoins = Number(data.discountedAmount) || Number(data.amount) || 0;
      if (discountPercent > 0) priceBeforeCoins = Math.round(priceBeforeCoins - (priceBeforeCoins * discountPercent) / 100);

      const orderRes = await Api.post('/orders/orders', {
        amount: Math.round(priceBeforeCoins * 100),
        currency: 'INR',
        receipt:  user?.email || `course-${data._id || Date.now()}`,
        payment_capture: 1,
        userId: user._id,
        courseId: data._id,
        courseName: data?.name || data?.title || data?.Title || data?.categorys || 'Course',
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        coupon: discountPercent > 0 ? couponCode : null,
        useCoins,
        coinsToUse: displayCoinDiscount,
        notes: { userId: user._id, email: user?.email, phoneNumber: user?.phoneNumber, courseId: data._id, courseName: data?.name || data?.title || data?.Title, couponCode: discountPercent > 0 ? couponCode : null, expiryDays: data.expiryDays },
      });

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Payment gateway failed to load');

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(finalPrice * 100),
        currency: 'INR',
        name: 'Exam Rally',
        description: `Purchase: ${data?.name || data?.title || data?.Title || 'Course'}`,
        image: 'https://examrally.in/favicon.svg',
        order_id: orderRes.data?.order_id,
        handler: async (response) => {
          try {
            await Api.post('/orders/verify-payment', {
              userId: user._id, courseId: data._id,
              courseName: data?.name || data?.title || data?.Title,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              coupon: discountPercent > 0 ? couponCode : null,
              amount: displayFinalPrice, expiryDays: data.expiryDays,
            });
            await refreshUser();
            toast.success('Payment successful. Access granted.');
            setTimeout(() => setshowmodel(false), 2000);
          } catch { toast.error('Payment verification failed. Please contact support.'); }
        },
        prefill: { name: user?.fullName || '', email: user?.email || '', contact: user?.phoneNumber || '' },
        theme: { color: '#1a3a5c' },
      });
      rzp.on('payment.failed', async (response) => {
        toast.error('Payment failed. Please try again.');
        try {
          await Api.post('/orders/payment-failed', {
            userId: user._id, courseId: data._id,
            orderId: response.error.metadata?.order_id,
            paymentId: response.error.metadata?.payment_id,
            reason: response.error.description || 'Payment failed',
            amount: finalPrice,
          });
        } catch { /* silent */ }
      });
      rzp.open();
    } catch (error) {
      toast.error(error.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const productName = data?.name || data?.title || data?.Title || data?.categorys || 'Course Package';
  const discountTag = calcDiscount();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(10,20,40,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          style={{
            background: '#fff',
            borderRadius: 16,
            width: '100%',
            maxWidth: 460,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
            border: '1px solid #dde3ec',
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2340 100%)',
            padding: '20px 24px 18px',
            position: 'relative',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setshowmodel(false)}
              disabled={isProcessing}
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 30, height: 30, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            ><CloseIcon /></button>

            {/* Secure badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
              <div style={{ color: '#7dd3fc', display: 'flex' }}><ShieldIcon /></div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: '#7dd3fc', textTransform: 'uppercase' }}>
                Secure Checkout
              </span>
            </div>

            <h2 style={{
              margin: 0, color: '#fff', fontSize: 15, fontWeight: 700,
              lineHeight: 1.4, paddingRight: 32,
            }}>
              {productName}
            </h2>

            {/* Price row in header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              {data?.discountedAmount ? (
                <>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                    ₹{Number(data.discountedAmount).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                    ₹{Number(data.amount).toLocaleString()}
                  </span>
                  {discountTag > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                      background: '#22c55e', color: '#fff',
                      padding: '2px 7px', borderRadius: 4,
                    }}>{discountTag}% OFF</span>
                  )}
                </>
              ) : (
                <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
                  ₹{Number(data?.amount || 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>

            {/* ── Coupon Section ── */}
            <div style={{ marginBottom: 16, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <button
                onClick={() => setShowCouponSection(!showCouponSection)}
                disabled={isProcessing}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 16px', background: showCouponSection ? '#f8fafc' : '#fff',
                  border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: '#eff6ff', border: '1px solid #bfdbfe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#2563eb',
                  }}><TagIcon /></div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>Apply Coupon Code</span>
                </div>
                <ChevronIcon open={showCouponSection} />
              </button>

              <AnimatePresence>
                {showCouponSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 14px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          disabled={isProcessing}
                          style={{
                            flex: 1, padding: '10px 14px',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: 8, fontSize: 13, fontWeight: 700,
                            fontFamily: 'monospace',
                            color: '#1e293b', outline: 'none',
                            letterSpacing: 1.5,
                            transition: 'border-color 0.15s',
                          }}
                          onFocus={e => e.target.style.borderColor = '#2563eb'}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={isProcessing || !couponCode.trim()}
                          style={{
                            padding: '10px 18px',
                            background: '#1a3a5c', color: '#fff',
                            border: 'none', borderRadius: 8,
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            whiteSpace: 'nowrap', transition: 'background 0.15s',
                            opacity: (!couponCode.trim()) ? 0.5 : 1,
                          }}
                        >
                          {isProcessing ? '···' : 'Apply'}
                        </button>
                      </div>

                      {message.text && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            marginTop: 8,
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: 12, fontWeight: 600,
                            color: message.type === 'success' ? '#15803d' : '#dc2626',
                          }}
                        >
                          {message.type === 'success' && <span style={{ color: '#16a34a' }}><CheckIcon /></span>}
                          {message.text}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Referral Coins ── */}
            {user?.coins > 0 && settings?.maxCoinPaymentPercentage && (
              <div style={{
                marginBottom: 16, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 16px', background: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: '#fefce8', border: '1px solid #fde68a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#d97706',
                    }}><CoinIcon /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>
                        Referral Coins
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                        Balance: <strong style={{ color: '#d97706' }}>{user.coins} coins</strong>
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => !isProcessing && setUseCoins(!useCoins)}
                    disabled={isProcessing}
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: useCoins ? '#1a3a5c' : '#e2e8f0',
                      border: 'none', cursor: 'pointer', padding: 3,
                      display: 'flex', alignItems: 'center',
                      transition: 'background 0.2s', position: 'relative',
                    }}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        marginLeft: useCoins ? 20 : 0,
                      }}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {useCoins && displayCoinDiscount > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        margin: '0 16px 12px', padding: '9px 12px',
                        background: '#f0fdf4', borderRadius: 7,
                        border: '1px solid #bbf7d0',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        fontSize: 12, fontWeight: 700, color: '#15803d',
                      }}>
                        <span>Coin discount applied</span>
                        <span>−₹{displayCoinDiscount}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!useCoins && (
                  <p style={{
                    margin: '0 16px 12px', fontSize: 11, color: '#94a3b8', fontWeight: 500,
                  }}>
                    Save up to ₹{Math.round((Number(data.discountedAmount) || Number(data.amount) || 0) * (settings.maxCoinPaymentPercentage / 100))} using your coins
                  </p>
                )}
              </div>
            )}

            {/* ── Order Summary ── */}
            <div style={{
              border: '1px solid #e2e8f0', borderRadius: 10,
              overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{
                padding: '10px 16px', background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Order Summary
                </span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                {[
                  { label: 'Base Price', value: `₹${(Number(data?.amount) || 0).toLocaleString()}` },
                  data?.discountedAmount && data?.discountedAmount !== data?.amount && {
                    label: 'Package Discount', value: `-₹${(Number(data.amount) - Number(data.discountedAmount)).toLocaleString()}`, accent: '#15803d'
                  },
                  discountPercent > 0 && {
                    label: `Coupon (${discountPercent}%)`, value: `-₹${Math.round((Number(data.discountedAmount) || Number(data.amount) || 0) * discountPercent / 100).toLocaleString()}`, accent: '#15803d'
                  },
                  useCoins && displayCoinDiscount > 0 && {
                    label: 'Coin Discount', value: `-₹${displayCoinDiscount.toLocaleString()}`, accent: '#d97706'
                  },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, color: row.accent || '#475569',
                    fontWeight: row.accent ? 600 : 400,
                    marginBottom: 6,
                  }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.accent || '#1e293b', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: 8, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Total Payable</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                    ₹{displayFinalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer / Pay Button ── */}
          <div style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            flexShrink: 0,
          }}>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: isProcessing ? '#334155' : '#1a3a5c',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'background 0.2s',
                letterSpacing: 0.2,
              }}
            >
              {isProcessing ? (
                <><SpinnerIcon />Processing Payment…</>
              ) : (
                <>Pay ₹{displayFinalPrice.toLocaleString()} Securely</>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              <span style={{ color: '#94a3b8', display: 'flex' }}><ShieldIcon /></span>
              <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5 }}>
                256-bit TLS Encryption · PCI-DSS Compliant
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Coupon;