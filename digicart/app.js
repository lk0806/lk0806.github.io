// DigiCart India / Mahor Studio - E-Commerce Engine
document.addEventListener('DOMContentLoaded', () => {
  // Product State
  const state = {
    shape: 'heart', // 'heart' or 'round'
    ledState: false, // false = mirror off, true = led photo glowing
    paymentMode: 'prepaid', // 'prepaid' or 'cod'
    prices: {
      heart: {
        current: 599,
        original: 1499,
        prepaidDiscount: 50,
        codAdvance: 99
      },
      round: {
        current: 549,
        original: 1399,
        prepaidDiscount: 50,
        codAdvance: 99
      }
    },
    uploadedPhotoUrl: null,
    merchantPhone: '918279361573',
    merchantUpi: '8279361573@ybl',
    merchantName: 'MAHOR ENTERPRISES'
  };

  // DOM Elements
  const stage = document.getElementById('mirrorStage');
  const baseImg = document.getElementById('baseMirrorImg');
  const photoOverlay = document.getElementById('photoOverlay');
  const toggleBtn = document.getElementById('toggleLedBtn');
  const simStatus = document.getElementById('simStatus');
  const simText = document.getElementById('simText');
  const redBtn = document.getElementById('redPowerIndicator');

  // Price & Text DOM
  const curPriceEl = document.getElementById('currentPrice');
  const origPriceEl = document.getElementById('originalPrice');
  const discountTagEl = document.getElementById('discountTag');
  const mobileCurPriceEl = document.getElementById('mobileCurPrice');
  const mobileOrigPriceEl = document.getElementById('mobileOrigPrice');
  const productTitleEl = document.getElementById('productTitle');

  // Variant Cards & Payment Modes
  const variantCards = document.querySelectorAll('.variant-card');
  const modeCards = document.querySelectorAll('.mode-card');
  const modalModeBtns = document.querySelectorAll('.modal-mode-btn');
  const prepaidCardPrice = document.getElementById('prepaidCardPrice');
  const prepaidCardDesc = document.getElementById('prepaidCardDesc');
  const codCardPrice = document.getElementById('codCardPrice');
  const codCardDesc = document.getElementById('codCardDesc');

  // Photo Uploaders & Stencil Export
  const photoInputs = [document.getElementById('photoInput1'), document.getElementById('photoInput2')];
  const photoStatusText = document.getElementById('photoStatusText');
  const exportStencilBtn = document.getElementById('exportStencilBtn');

  // Checkout Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-checkout-modal');
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');

  // Form Fields
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const custAddress = document.getElementById('custAddress');
  const custCity = document.getElementById('custCity');
  const custPincode = document.getElementById('custPincode');

  // Modal Summary Elements
  const modalProductLabel = document.getElementById('modalProductLabel');
  const modalAmountLabel = document.getElementById('modalAmountLabel');
  const modalPayNote = document.getElementById('modalPayNote');
  const qrImage = document.getElementById('modalQrImg');

  // Default images for Heart & Round
  const assets = {
    heart: {
      unlit: 'assets/mirror/magic_mirror_heart.jpg',
      lit: 'assets/mirror/magic_mirror_red_led_heart.jpg',
      defaultPhoto: 'assets/mirror/magic_mirror_lifestyle_desk.jpg',
      thumbs: [
        'assets/mirror/magic_mirror_heart.jpg',
        'assets/mirror/media_1792780671100_ea398149.jpg',
        'assets/mirror/media_1792780671457_ba0a8f32.jpg',
        'assets/mirror/magic_mirror_lifestyle_dressing.jpg'
      ]
    },
    round: {
      unlit: 'assets/mirror/magic_mirror_round.jpg',
      lit: 'assets/mirror/mb10_3_round.jpg',
      defaultPhoto: 'assets/mirror/magic_mirror_lifestyle_dressing.jpg',
      thumbs: [
        'assets/mirror/magic_mirror_round.jpg',
        'assets/mirror/mb10_3_round.jpg',
        'assets/mirror/rotating_mb17_1_round.jpg',
        'assets/mirror/magic_mirror_angle_studio.jpg'
      ]
    }
  };

  // 1. Toggle LED Switch Function
  function toggleLED(forceState = null) {
    if (forceState !== null) {
      state.ledState = forceState;
    } else {
      state.ledState = !state.ledState;
    }

    if (state.ledState) {
      stage.classList.add('led-on');
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '<span>💡</span> Turn OFF Lamp';
      simStatus.classList.add('active');
      simText.textContent = 'Glowing Photo Lamp (Night Mode)';
      if (!state.uploadedPhotoUrl && state.shape === 'heart') {
        baseImg.src = assets.heart.lit;
      }
    } else {
      stage.classList.remove('led-on');
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '<span>💡</span> Turn ON Lamp';
      simStatus.classList.remove('active');
      simText.textContent = 'High-Definition Mirror (Day Mode)';
      baseImg.src = state.shape === 'heart' ? assets.heart.unlit : assets.round.unlit;
    }
  }

  // Event Listeners for Switch
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleLED());
  }
  if (redBtn) {
    redBtn.addEventListener('click', () => toggleLED());
  }

  // 2. Shape Switcher & Pricing Engine
  function getCheckoutDetails() {
    const cfg = state.prices[state.shape];
    if (state.paymentMode === 'prepaid') {
      const payAmount = cfg.current - cfg.prepaidDiscount;
      return {
        modeTitle: 'Full Prepaid (Instant ₹50 Discount)',
        amount: payAmount,
        balance: 0,
        note: `Instant ₹50 Flat Off applied! You pay ₹${payAmount} now. Free express delivery to your doorstep!`
      };
    } else {
      const advance = cfg.codAdvance;
      const balance = cfg.current - advance;
      return {
        modeTitle: 'Cash on Delivery (Anti-RTO ₹99 Token Advance)',
        amount: advance,
        balance: balance,
        note: `Pay ₹${advance} Advance Token now to confirm customization & dispatch. Pay remaining balance ₹${balance} in cash upon delivery!`
      };
    }
  }

  function updatePricingUI() {
    const cfg = state.prices[state.shape];
    const discountPercent = Math.round(((cfg.original - cfg.current) / cfg.original) * 100);

    // Update main display prices
    if (curPriceEl) curPriceEl.textContent = `₹${cfg.current}`;
    if (origPriceEl) origPriceEl.textContent = `₹${cfg.original}`;
    if (discountTagEl) discountTagEl.textContent = `${discountPercent}% OFF`;
    if (mobileCurPriceEl) mobileCurPriceEl.textContent = `₹${cfg.current}`;
    if (mobileOrigPriceEl) mobileOrigPriceEl.textContent = `₹${cfg.original}`;

    // Update Prepaid & COD Card Labels dynamically
    if (prepaidCardPrice) {
      prepaidCardPrice.textContent = `₹${cfg.current - cfg.prepaidDiscount}`;
    }
    if (prepaidCardDesc) {
      prepaidCardDesc.textContent = `Instant ₹${cfg.prepaidDiscount} Flat Off • Priority Express Dispatch`;
    }
    if (codCardPrice) {
      codCardPrice.textContent = `₹${cfg.codAdvance} Now`;
    }
    if (codCardDesc) {
      codCardDesc.textContent = `₹${cfg.codAdvance} Advance Token to verify order • ₹${cfg.current - cfg.codAdvance} at doorstep`;
    }

    // Sync active state on mode cards and modal buttons
    modeCards.forEach(card => {
      card.classList.toggle('active', card.dataset.mode === state.paymentMode);
    });
    modalModeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === state.paymentMode);
    });

    // If modal elements exist, refresh them dynamically
    const details = getCheckoutDetails();
    const shapeLabel = state.shape === 'heart' ? 'Heart Shape' : 'Round Shape';
    if (modalProductLabel) {
      modalProductLabel.textContent = `${shapeLabel} Magic Mirror (${state.paymentMode === 'prepaid' ? 'Prepaid Offer' : 'COD Advance'})`;
    }
    if (modalAmountLabel) {
      modalAmountLabel.textContent = `₹${details.amount}`;
    }
    if (modalPayNote) {
      modalPayNote.textContent = details.note;
    }

    // Dynamic UPI Intent QR generation
    if (qrImage) {
      const upiUri = `upi://pay?pa=${state.merchantUpi}&pn=${encodeURIComponent(state.merchantName)}&am=${details.amount}&cu=INR&tn=${encodeURIComponent('Magic Mirror Order ' + shapeLabel)}`;
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
      qrImage.src = qrApi;
    }
  }

  function setPaymentMode(mode) {
    if (mode !== 'prepaid' && mode !== 'cod') return;
    state.paymentMode = mode;
    updatePricingUI();
  }

  function updateShape(shape) {
    state.shape = shape;

    // Update variant cards UI
    variantCards.forEach(card => {
      if (card.dataset.shape === shape) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update Title & Frame
    if (shape === 'heart') {
      stage.classList.remove('round-active');
      baseImg.src = assets.heart.unlit;
      if (!state.uploadedPhotoUrl) {
        photoOverlay.src = assets.heart.defaultPhoto;
      }
      productTitleEl.textContent = 'Personalized Heart-Shape LED Magic Mirror Photo Frame';
    } else {
      stage.classList.add('round-active');
      baseImg.src = assets.round.unlit;
      if (!state.uploadedPhotoUrl) {
        photoOverlay.src = assets.round.defaultPhoto;
      }
      productTitleEl.textContent = 'Personalized Round-Shape LED Magic Mirror Photo Frame';
    }

    // Refresh dynamic prices & thumbnails
    updatePricingUI();
    renderThumbnails(shape);
  }

  variantCards.forEach(card => {
    card.addEventListener('click', () => {
      updateShape(card.dataset.shape);
    });
  });

  // 3. Render Thumbnails
  function renderThumbnails(shape) {
    const thumbContainer = document.getElementById('thumbGallery');
    if (!thumbContainer) return;
    thumbContainer.innerHTML = '';

    assets[shape].thumbs.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      item.innerHTML = `<img src="${src}" alt="Thumb ${idx + 1}" />`;
      item.addEventListener('click', () => {
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        baseImg.src = src;
      });
      thumbContainer.appendChild(item);
    });
  }

  // 4. Handle Photo Upload Simulator & Aspect-Ratio Auto-Fitting
  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const dataUrl = evt.target.result;
      const img = new Image();
      img.onload = function() {
        const nw = img.naturalWidth || img.width;
        const nh = img.naturalHeight || img.height;
        const aspectRatio = nw / nh;

        // Auto-centering & cover scaling geometry:
        // In portrait photos (aspectRatio < 0.95), focus faces at upper 35%
        // In landscape photos (aspectRatio > 1.05), focus center 50%
        let orientation = 'Square';
        if (aspectRatio < 0.95) {
          orientation = 'Portrait';
          photoOverlay.style.objectPosition = 'center 35%';
        } else if (aspectRatio > 1.05) {
          orientation = 'Landscape';
          photoOverlay.style.objectPosition = 'center center';
        } else {
          photoOverlay.style.objectPosition = 'center center';
        }

        state.uploadedPhotoUrl = dataUrl;
        state.uploadedPhotoMetrics = {
          naturalWidth: nw,
          naturalHeight: nh,
          aspectRatio: aspectRatio,
          orientation: orientation
        };

        photoOverlay.src = dataUrl;
        toggleLED(true); // Automatically switch ON to show reveal!

        if (photoStatusText) {
          photoStatusText.innerHTML = `<strong>✅ Auto-Fitted (${orientation}):</strong> ${file.name.substring(0, 16)}... (${nw}×${nh}px, Cover Centered)`;
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  photoInputs.forEach(input => {
    if (input) {
      input.addEventListener('change', handlePhotoUpload);
    }
  });

  // 5. Payment Mode Switchers (Main Page & Modal)
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      setPaymentMode(card.dataset.mode);
    });
  });

  modalModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setPaymentMode(btn.dataset.mode);
    });
  });

  // 6. HTML5 Canvas Master Composite Rendering Engine (High-Resolution Stencil Export)
  function renderComposite(shape = state.shape, userImgSrc = null, options = {}) {
    return new Promise((resolve, reject) => {
      const width = options.width || 1200;
      const height = options.height || 1200;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // Source image to render
      const imgSrc = userImgSrc || state.uploadedPhotoUrl || assets[shape].defaultPhoto;
      const photo = new Image();
      photo.crossOrigin = 'anonymous';

      photo.onload = () => {
        // 1. Draw solid dark background / studio backing
        ctx.fillStyle = '#0a0b10';
        ctx.fillRect(0, 0, width, height);

        // Subtle ambient radial glow behind mirror
        const bgGlow = ctx.createRadialGradient(width / 2, height / 2, width * 0.1, width / 2, height / 2, width * 0.6);
        bgGlow.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
        bgGlow.addColorStop(1, 'rgba(10, 11, 16, 0.95)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Define clipping aperture region
        // Heart: ox = width * 0.16, oy = height * 0.13, w = width * 0.68, h = height * 0.60
        // Round: ox = width * 0.16, oy = height * 0.16, w = width * 0.68, h = height * 0.68
        const ox = width * 0.16;
        const oy = shape === 'heart' ? height * 0.13 : height * 0.16;
        const w = width * 0.68;
        const h = shape === 'heart' ? height * 0.60 : height * 0.68;

        // 3. Construct Path2D matching SVG cubic Bezier clipPath
        const path = new Path2D();
        if (shape === 'heart') {
          // Normalized Bezier Path:
          // M 0.5, 0.85 
          // C 0.15, 0.55 0.05, 0.35 0.05, 0.22 
          // A 0.225, 0.225 0 0, 1 0.5, 0.22 
          // A 0.225, 0.225 0 0, 1 0.95, 0.22 
          // C 0.95, 0.35 0.85, 0.55 0.5, 0.85 Z
          path.moveTo(ox + 0.5 * w, oy + 0.85 * h);
          path.bezierCurveTo(ox + 0.15 * w, oy + 0.55 * h, ox + 0.05 * w, oy + 0.35 * h, ox + 0.05 * w, oy + 0.22 * h);
          path.arc(ox + 0.275 * w, oy + 0.22 * h, 0.225 * w, Math.PI, 0, false);
          path.arc(ox + 0.725 * w, oy + 0.22 * h, 0.225 * w, Math.PI, 0, false);
          path.bezierCurveTo(ox + 0.95 * w, oy + 0.35 * h, ox + 0.85 * w, oy + 0.55 * h, ox + 0.5 * w, oy + 0.85 * h);
          path.closePath();
        } else {
          // Round aperture: circle cx=0.5, cy=0.5, r=0.48
          const cx = ox + 0.5 * w;
          const cy = oy + 0.5 * h;
          const r = 0.48 * Math.min(w, h);
          path.arc(cx, cy, r, 0, 2 * Math.PI);
          path.closePath();
        }

        // 4. Calculate Cover Scaling and Centering for photo
        const pw = photo.naturalWidth || photo.width;
        const ph = photo.naturalHeight || photo.height;
        const pRatio = pw / ph;
        const boxRatio = w / h;
        let drawW, drawH, drawX, drawY;

        if (pRatio > boxRatio) {
          drawH = h;
          drawW = h * pRatio;
          drawX = ox + (w - drawW) / 2;
          drawY = oy;
        } else {
          drawW = w;
          drawH = w / pRatio;
          drawX = ox;
          const focalOffset = ph > pw ? 0.35 : 0.5;
          drawY = oy + (h - drawH) * focalOffset;
        }

        // Draw clipped photo
        ctx.save();
        ctx.clip(path);
        ctx.drawImage(photo, drawX, drawY, drawW, drawH);

        // Warm 3000K LED Radial Glow overlay
        const glowRadius = Math.max(w, h) * 0.65;
        const ledGlow = ctx.createRadialGradient(ox + w / 2, oy + h / 2, glowRadius * 0.2, ox + w / 2, oy + h / 2, glowRadius);
        ledGlow.addColorStop(0, 'rgba(255, 235, 170, 0.40)');
        ledGlow.addColorStop(0.6, 'rgba(251, 191, 36, 0.20)');
        ledGlow.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
        ctx.fillStyle = ledGlow;
        ctx.fill(path);

        // Specular glass reflection highlight
        const glassGrad = ctx.createLinearGradient(ox, oy, ox + w * 0.7, oy + h * 0.7);
        glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        glassGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.10)');
        glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
        ctx.fillStyle = glassGrad;
        ctx.fill(path);

        ctx.restore();

        // Elegant gold aperture border
        ctx.save();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
        ctx.lineWidth = 4;
        ctx.stroke(path);
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png');
        const result = {
          canvas,
          dataUrl,
          shape,
          width,
          height
        };

        if (typeof options.callback === 'function') {
          options.callback(result);
        }
        resolve(result);
      };

      photo.onerror = (err) => {
        reject(err || new Error('Failed to load image for composite'));
      };

      photo.src = imgSrc;
    });
  }

  // Expose globally for headless verification & production export
  window.renderComposite = renderComposite;

  // Stencil Export Click Handler
  if (exportStencilBtn) {
    exportStencilBtn.addEventListener('click', async () => {
      try {
        exportStencilBtn.textContent = '⏳ Rendering...';
        const { dataUrl } = await renderComposite(state.shape);
        const link = document.createElement('a');
        link.download = `DigiCart_MagicMirror_Stencil_${state.shape}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        exportStencilBtn.textContent = '✅ Stencil Saved';
        setTimeout(() => {
          exportStencilBtn.textContent = '📥 Export Stencil';
        }, 2500);
      } catch (err) {
        console.error('Export stencil failed:', err);
        exportStencilBtn.textContent = '❌ Retry';
      }
    });
  }

  // 7. Open & Close Modal
  function openModal() {
    updatePricingUI();
    checkoutModal.classList.add('active');
  }

  function closeModal() {
    checkoutModal.classList.remove('active');
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeModal();
    });
  }

  // 8. Direct WhatsApp Order Payload (Zero-Manual Entry & CSC Inbound Triage)
  function buildWhatsAppPayload() {
    const shapeLabel = state.shape === 'heart' ? 'Heart Shape' : 'Round Shape';
    const cfg = state.prices[state.shape];
    const details = getCheckoutDetails();
    const serviceCode = state.shape === 'heart' ? 'FRAME-HEART' : 'FRAME-ROUND';

    // Zero-manual entry fallbacks
    const name = custName && custName.value && custName.value.trim() ? custName.value.trim() : 'Guest Customer';
    const phone = custPhone && custPhone.value && custPhone.value.trim() ? custPhone.value.trim() : 'Provided on chat';
    const address = custAddress && custAddress.value && custAddress.value.trim() ? custAddress.value.trim() : 'Provided on chat';
    const city = custCity && custCity.value && custCity.value.trim() ? custCity.value.trim() : '';
    const pincode = custPincode && custPincode.value && custPincode.value.trim() ? custPincode.value.trim() : '';

    let fullAddress = address;
    if (city || pincode) {
      fullAddress += (city ? ', ' + city : '') + (pincode ? ' - ' + pincode : '');
    }

    const paymentLine = state.paymentMode === 'cod'
      ? `*Selected Payment:* Cash on Delivery (Anti-RTO Shield)\n*Advance Token Payable Now:* ₹${details.amount}\n*Balance at Doorstep:* ₹${details.balance} (Cash on Delivery)`
      : `*Selected Payment:* Full Prepaid UPI (Instant ₹50 Discount Applied)\n*Amount Payable Now:* ₹${details.amount}`;

    const text = 
`✨ *NEW ORDER: LED MAGIC MIRROR* ✨
--------------------------------
*Service Tag:* [${serviceCode}]
*Product:* Personalized ${shapeLabel} Magic Mirror
*Total MRP:* ₹${cfg.original}
*Offer Price:* ₹${cfg.current}
${paymentLine}

*Customer Details:*
• Name: ${name}
• Mobile: ${phone}
• Delivery Address: ${fullAddress}
• Customized Photo: ${state.uploadedPhotoUrl ? 'Attached / Ready to send here' : 'Sending photo right now in chat'}

*Power Specification:* Dual (USB Cable Included + 3x AA Battery Slot)
*Packaging:* Luxury Free Gift Box Included
--------------------------------
नमस्ते जी! 🙏 Please confirm my order and share UPI verification details!`;

    return encodeURIComponent(text);
  }

  if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const payload = buildWhatsAppPayload();
      window.open(`https://wa.me/${state.merchantPhone}?text=${payload}`, '_blank');
    });
  }

  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const payload = buildWhatsAppPayload();
      window.open(`https://wa.me/${state.merchantPhone}?text=${payload}`, '_blank');
      closeModal();
    });
  }

  // Initialize
  updateShape('heart');
});
