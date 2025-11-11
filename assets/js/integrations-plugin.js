/**
 * Integrations Plugin - Technology KSA
 * نظام شامل للتكامل مع منصات التحليل والتتبع
 */

// ==========================================
// INTEGRATIONS MANAGER
// ==========================================

class IntegrationsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.events = [];
    this.initialized = false;
  }

  loadSettings() {
    return pluginsManager.getPluginSettings('integrations');
  }

  saveSettings() {
    pluginsManager.savePluginSettings('integrations', this.settings);
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  init() {
    if (this.initialized) return;

    console.log('🔌 Initializing Integrations...');

    // Initialize all enabled integrations
    if (this.settings.ga_enabled) {
      this.initGoogleAnalytics();
    }

    if (this.settings.meta_enabled) {
      this.initMetaPixel();
    }

    if (this.settings.tiktok_enabled) {
      this.initTikTokPixel();
    }

    if (this.settings.snapchat_enabled) {
      this.initSnapchatPixel();
    }

    if (this.settings.clarity_enabled) {
      this.initMicrosoftClarity();
    }

    if (this.settings.bing_enabled) {
      this.initBingUET();
    }

    if (this.settings.yandex_enabled) {
      this.initYandexMetrica();
    }

    if (this.settings.perfex_enabled) {
      this.initPerfexCRM();
    }

    // Custom scripts
    this.injectCustomScripts();

    this.initialized = true;
    console.log('✅ Integrations initialized');
  }

  // ==========================================
  // GOOGLE ANALYTICS 4 (GA4)
  // ==========================================

  initGoogleAnalytics() {
    if (!this.settings.ga_measurement_id) {
      console.warn('Google Analytics: Measurement ID not set');
      return;
    }

    console.log('📊 Initializing Google Analytics...');

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.settings.ga_measurement_id}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.settings.ga_measurement_id, {
      'send_page_view': this.settings.ga_send_page_view
    });

    console.log('✅ Google Analytics initialized');
  }

  trackGAEvent(eventName, eventParams = {}) {
    if (!this.settings.ga_enabled || typeof gtag === 'undefined') return;

    gtag('event', eventName, eventParams);
    console.log(`📊 GA Event: ${eventName}`, eventParams);
  }

  trackGAPageView(pagePath, pageTitle) {
    if (!this.settings.ga_enabled || typeof gtag === 'undefined') return;

    gtag('config', this.settings.ga_measurement_id, {
      'page_path': pagePath,
      'page_title': pageTitle
    });
    console.log(`📊 GA Page View: ${pagePath}`);
  }

  // ==========================================
  // META PIXEL (FACEBOOK PIXEL)
  // ==========================================

  initMetaPixel() {
    if (!this.settings.meta_pixel_id) {
      console.warn('Meta Pixel: Pixel ID not set');
      return;
    }

    console.log('📘 Initializing Meta Pixel...');

    // Facebook Pixel Code
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', this.settings.meta_pixel_id);

    if (this.settings.meta_track_page_view) {
      fbq('track', 'PageView');
    }

    console.log('✅ Meta Pixel initialized');
  }

  trackMetaEvent(eventName, eventParams = {}) {
    if (!this.settings.meta_enabled || typeof fbq === 'undefined') return;

    fbq('track', eventName, eventParams);
    console.log(`📘 Meta Event: ${eventName}`, eventParams);
  }

  trackMetaCustomEvent(eventName, eventParams = {}) {
    if (!this.settings.meta_enabled || typeof fbq === 'undefined') return;

    fbq('trackCustom', eventName, eventParams);
    console.log(`📘 Meta Custom Event: ${eventName}`, eventParams);
  }

  // ==========================================
  // TIKTOK PIXEL
  // ==========================================

  initTikTokPixel() {
    if (!this.settings.tiktok_pixel_id) {
      console.warn('TikTok Pixel: Pixel ID not set');
      return;
    }

    console.log('🎵 Initializing TikTok Pixel...');

    // TikTok Pixel Code
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

      ttq.load(this.settings.tiktok_pixel_id);
      ttq.page();
    }.call(this, window, document, 'ttq');

    console.log('✅ TikTok Pixel initialized');
  }

  trackTikTokEvent(eventName, eventParams = {}) {
    if (!this.settings.tiktok_enabled || typeof ttq === 'undefined') return;

    ttq.track(eventName, eventParams);
    console.log(`🎵 TikTok Event: ${eventName}`, eventParams);
  }

  // ==========================================
  // SNAPCHAT PIXEL
  // ==========================================

  initSnapchatPixel() {
    if (!this.settings.snapchat_pixel_id) {
      console.warn('Snapchat Pixel: Pixel ID not set');
      return;
    }

    console.log('👻 Initializing Snapchat Pixel...');

    // Snapchat Pixel Code
    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
    a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
    r.src=n;var u=t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r,u);})(window,document,
    'https://sc-static.net/scevent.min.js');

    snaptr('init', this.settings.snapchat_pixel_id, {
      'user_email': '__INSERT_USER_EMAIL__'
    });

    snaptr('track', 'PAGE_VIEW');

    console.log('✅ Snapchat Pixel initialized');
  }

  trackSnapchatEvent(eventName, eventParams = {}) {
    if (!this.settings.snapchat_enabled || typeof snaptr === 'undefined') return;

    snaptr('track', eventName, eventParams);
    console.log(`👻 Snapchat Event: ${eventName}`, eventParams);
  }

  // ==========================================
  // MICROSOFT CLARITY
  // ==========================================

  initMicrosoftClarity() {
    if (!this.settings.clarity_project_id) {
      console.warn('Microsoft Clarity: Project ID not set');
      return;
    }

    console.log('🔍 Initializing Microsoft Clarity...');

    // Microsoft Clarity Code
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", this.settings.clarity_project_id);

    console.log('✅ Microsoft Clarity initialized');
  }

  // ==========================================
  // BING ADS (UET)
  // ==========================================

  initBingUET() {
    if (!this.settings.bing_uet_tag_id) {
      console.warn('Bing UET: Tag ID not set');
      return;
    }

    console.log('🔎 Initializing Bing UET...');

    // Bing UET Code
    (function(w,d,t,r,u) {
      var f,n,i;
      w[u]=w[u]||[],f=function() {
        var o={ti:this.settings.bing_uet_tag_id};
        o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
      },
      n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function() {
        var s=this.readyState;
        s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
      },
      i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
    })(window,document,"script","//bat.bing.com/bat.js","uetq");

    console.log('✅ Bing UET initialized');
  }

  trackBingEvent(eventName, eventParams = {}) {
    if (!this.settings.bing_enabled || typeof uetq === 'undefined') return;

    window.uetq = window.uetq || [];
    window.uetq.push('event', eventName, eventParams);
    console.log(`🔎 Bing Event: ${eventName}`, eventParams);
  }

  // ==========================================
  // YANDEX METRICA
  // ==========================================

  initYandexMetrica() {
    if (!this.settings.yandex_counter_id) {
      console.warn('Yandex Metrica: Counter ID not set');
      return;
    }

    console.log('🇷🇺 Initializing Yandex Metrica...');

    // Yandex Metrica Code
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
      k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(this.settings.yandex_counter_id, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });

    console.log('✅ Yandex Metrica initialized');
  }

  trackYandexEvent(eventName, eventParams = {}) {
    if (!this.settings.yandex_enabled || typeof ym === 'undefined') return;

    ym(this.settings.yandex_counter_id, 'reachGoal', eventName, eventParams);
    console.log(`🇷🇺 Yandex Event: ${eventName}`, eventParams);
  }

  // ==========================================
  // PERFEX CRM INTEGRATION
  // ==========================================

  initPerfexCRM() {
    if (!this.settings.perfex_url || !this.settings.perfex_api_key) {
      console.warn('Perfex CRM: URL or API Key not set');
      return;
    }

    console.log('💼 Initializing Perfex CRM...');

    // Auto-sync contacts from contact forms if enabled
    if (this.settings.perfex_sync_contacts) {
      this.setupPerfexContactSync();
    }

    console.log('✅ Perfex CRM initialized');
  }

  setupPerfexContactSync() {
    // Hook into contact form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.classList.contains('contact-form') || e.target.id === 'contactForm') {
        const formData = new FormData(e.target);
        this.syncContactToPerfex({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message')
        });
      }
    });
  }

  async syncContactToPerfex(contactData) {
    if (!this.settings.perfex_enabled) return;

    try {
      const response = await fetch(`${this.settings.perfex_url}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': this.settings.perfex_api_key
        },
        body: JSON.stringify({
          firstname: contactData.name.split(' ')[0],
          lastname: contactData.name.split(' ').slice(1).join(' '),
          email: contactData.email,
          phonenumber: contactData.phone || '',
          description: contactData.message || ''
        })
      });

      if (response.ok) {
        console.log('💼 Contact synced to Perfex CRM');
        return { success: true };
      } else {
        console.error('Perfex CRM sync failed:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      console.error('Perfex CRM sync error:', error);
      return { success: false, error: error.message };
    }
  }

  async createPerfexLead(leadData) {
    if (!this.settings.perfex_enabled) return;

    try {
      const response = await fetch(`${this.settings.perfex_url}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': this.settings.perfex_api_key
        },
        body: JSON.stringify(leadData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('💼 Lead created in Perfex CRM:', result);
        return { success: true, data: result };
      } else {
        console.error('Perfex lead creation failed:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      console.error('Perfex lead creation error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==========================================
  // CUSTOM SCRIPTS
  // ==========================================

  injectCustomScripts() {
    // Head scripts
    if (this.settings.custom_head_scripts) {
      const headScript = document.createElement('div');
      headScript.innerHTML = this.settings.custom_head_scripts;
      document.head.appendChild(headScript);
      console.log('📝 Custom head scripts injected');
    }

    // Body scripts
    if (this.settings.custom_body_scripts) {
      const bodyScript = document.createElement('div');
      bodyScript.innerHTML = this.settings.custom_body_scripts;
      document.body.insertBefore(bodyScript, document.body.firstChild);
      console.log('📝 Custom body scripts injected');
    }

    // Footer scripts
    if (this.settings.custom_footer_scripts) {
      const footerScript = document.createElement('div');
      footerScript.innerHTML = this.settings.custom_footer_scripts;
      document.body.appendChild(footerScript);
      console.log('📝 Custom footer scripts injected');
    }
  }

  // ==========================================
  // UNIFIED EVENT TRACKING
  // ==========================================

  trackEvent(eventName, eventData = {}) {
    console.log(`🎯 Tracking Event: ${eventName}`, eventData);

    // Track to all enabled platforms
    if (this.settings.ga_enabled) {
      this.trackGAEvent(eventName, eventData);
    }

    if (this.settings.meta_enabled) {
      this.trackMetaEvent(eventName, eventData);
    }

    if (this.settings.tiktok_enabled) {
      this.trackTikTokEvent(eventName, eventData);
    }

    if (this.settings.snapchat_enabled) {
      this.trackSnapchatEvent(eventName, eventData);
    }

    if (this.settings.bing_enabled) {
      this.trackBingEvent(eventName, eventData);
    }

    if (this.settings.yandex_enabled) {
      this.trackYandexEvent(eventName, eventData);
    }

    // Store event
    this.events.push({
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    });
  }

  // ==========================================
  // CONVERSION TRACKING
  // ==========================================

  trackConversion(conversionType, conversionValue = 0, currency = 'SAR') {
    console.log(`💰 Tracking Conversion: ${conversionType} = ${conversionValue} ${currency}`);

    const conversionData = {
      value: conversionValue,
      currency: currency,
      conversion_type: conversionType
    };

    // Google Analytics
    if (this.settings.ga_enabled && typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': this.settings.ga_measurement_id,
        'value': conversionValue,
        'currency': currency
      });
    }

    // Meta Pixel
    if (this.settings.meta_enabled && typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', {
        value: conversionValue,
        currency: currency
      });
    }

    // TikTok
    if (this.settings.tiktok_enabled && typeof ttq !== 'undefined') {
      ttq.track('CompletePayment', {
        value: conversionValue,
        currency: currency
      });
    }

    // Snapchat
    if (this.settings.snapchat_enabled && typeof snaptr !== 'undefined') {
      snaptr('track', 'PURCHASE', {
        price: conversionValue,
        currency: currency
      });
    }

    this.trackEvent('conversion', conversionData);
  }

  // ==========================================
  // COMMON EVENT HELPERS
  // ==========================================

  trackPageView(pagePath, pageTitle) {
    console.log(`📄 Page View: ${pagePath}`);

    if (this.settings.ga_enabled) {
      this.trackGAPageView(pagePath, pageTitle);
    }

    if (this.settings.meta_enabled && typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }

    if (this.settings.tiktok_enabled && typeof ttq !== 'undefined') {
      ttq.page();
    }
  }

  trackAddToCart(product) {
    this.trackEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      currency: 'SAR'
    });
  }

  trackPurchase(orderData) {
    this.trackConversion('purchase', orderData.total, orderData.currency || 'SAR');
  }

  trackSignUp(method = 'email') {
    this.trackEvent('sign_up', { method: method });
  }

  trackLogin(method = 'email') {
    this.trackEvent('login', { method: method });
  }

  trackSearch(searchTerm) {
    this.trackEvent('search', { search_term: searchTerm });
  }

  trackContactForm(formName = 'contact') {
    this.trackEvent('contact_form_submit', { form_name: formName });
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  getEnabledIntegrations() {
    const enabled = [];

    if (this.settings.ga_enabled) enabled.push('Google Analytics');
    if (this.settings.meta_enabled) enabled.push('Meta Pixel');
    if (this.settings.tiktok_enabled) enabled.push('TikTok Pixel');
    if (this.settings.snapchat_enabled) enabled.push('Snapchat Pixel');
    if (this.settings.clarity_enabled) enabled.push('Microsoft Clarity');
    if (this.settings.bing_enabled) enabled.push('Bing Ads');
    if (this.settings.yandex_enabled) enabled.push('Yandex Metrica');
    if (this.settings.perfex_enabled) enabled.push('Perfex CRM');

    return enabled;
  }

  getIntegrationStatus() {
    return {
      google_analytics: this.settings.ga_enabled && !!this.settings.ga_measurement_id,
      meta_pixel: this.settings.meta_enabled && !!this.settings.meta_pixel_id,
      tiktok_pixel: this.settings.tiktok_enabled && !!this.settings.tiktok_pixel_id,
      snapchat_pixel: this.settings.snapchat_enabled && !!this.settings.snapchat_pixel_id,
      clarity: this.settings.clarity_enabled && !!this.settings.clarity_project_id,
      bing_uet: this.settings.bing_enabled && !!this.settings.bing_uet_tag_id,
      yandex: this.settings.yandex_enabled && !!this.settings.yandex_counter_id,
      perfex_crm: this.settings.perfex_enabled && !!this.settings.perfex_url && !!this.settings.perfex_api_key
    };
  }

  getTotalEvents() {
    return this.events.length;
  }

  getRecentEvents(limit = 10) {
    return this.events.slice(-limit).reverse();
  }

  clearEvents() {
    this.events = [];
  }
}

// ==========================================
// PLUGIN INITIALIZATION
// ==========================================

let integrationsManager;

function init_integrations_plugin() {
  console.log('✅ Integrations Plugin Activated');

  // Initialize manager
  integrationsManager = new IntegrationsManager();

  // Add to global scope
  window.integrationsManager = integrationsManager;

  // Initialize all integrations on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      integrationsManager.init();
    });
  } else {
    integrationsManager.init();
  }
}

function cleanup_integrations_plugin() {
  console.log('❌ Integrations Plugin Deactivated');

  // Cleanup
  window.integrationsManager = null;
}
