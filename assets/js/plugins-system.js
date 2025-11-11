/**
 * Plugins System - Technology KSA
 * نظام إدارة الإضافات القابل للتوسع
 */

// ==========================================
// PLUGINS REGISTRY
// ==========================================

const AVAILABLE_PLUGINS = {
  ecommerce: {
    id: 'ecommerce',
    name: 'متجر إلكتروني - eCommerce',
    description: 'نظام متجر إلكتروني كامل مع إدارة المنتجات والطلبات والمخزون مثل WooCommerce',
    version: '1.0.0',
    author: 'Technology KSA',
    icon: 'shopping-cart',
    features: [
      'إدارة المنتجات الكاملة',
      'الفئات والتصنيفات',
      'المتغيرات والخصائص',
      'إدارة المخزون',
      'الأسعار والخصومات',
      'معرض الصور',
      'المراجعات والتقييمات',
      'عربة التسوق',
      'إدارة الطلبات'
    ],
    settings: {
      currency: 'SAR',
      currencyPosition: 'right',
      enableStock: true,
      enableReviews: true,
      productsPerPage: 12,
      enableWishlist: true
    },
    routes: [
      { path: '/shop', template: 'shop' },
      { path: '/product/:slug', template: 'single-product' },
      { path: '/cart', template: 'cart' },
      { path: '/checkout', template: 'checkout' }
    ]
  },

  booking: {
    id: 'booking',
    name: 'نظام الحجوزات - Booking',
    description: 'نظام حجز المواعيد والخدمات مع تقويم متقدم',
    version: '1.0.0',
    author: 'Technology KSA',
    icon: 'calendar-check',
    features: [
      'تقويم تفاعلي',
      'حجز المواعيد',
      'إدارة الخدمات',
      'تأكيد تلقائي',
      'إشعارات البريد',
      'دفع أونلاين'
    ],
    settings: {
      workingHours: '9:00-17:00',
      slotDuration: 30,
      enablePayment: false
    }
  },

  forms: {
    id: 'forms',
    name: 'منشئ النماذج - Form Builder',
    description: 'إنشاء نماذج مخصصة بسهولة مع حفظ البيانات',
    version: '1.0.0',
    author: 'Technology KSA',
    icon: 'wpforms',
    features: [
      'Drag & Drop Form Builder',
      'حقول متعددة',
      'التحقق من البيانات',
      'حفظ الإرسالات',
      'تصدير البيانات',
      'إشعارات البريد'
    ],
    settings: {
      enableCaptcha: true,
      emailNotifications: true
    }
  },

  seo: {
    id: 'seo',
    name: 'تحسين محركات البحث - SEO Pro',
    description: 'أدوات SEO متقدمة لتحسين ظهور موقعك',
    version: '1.0.0',
    author: 'Technology KSA',
    icon: 'search',
    features: [
      'تحليل SEO',
      'Schema Markup',
      'XML Sitemap',
      'Meta Tags Manager',
      'Open Graph',
      'Twitter Cards',
      'تحليل الكلمات المفتاحية'
    ],
    settings: {
      autoGenerateSitemap: true,
      enableSchemaMarkup: true
    }
  },

  emailmarketing: {
    id: 'emailmarketing',
    name: 'التسويق بالبريد الإلكتروني - Email Marketing',
    description: 'نظام شامل لإدارة البريد الإلكتروني مع SMTP و IMAP ومنشئ القوالب الاحترافي',
    version: '1.0.0',
    author: 'Technology KSA',
    icon: 'envelope',
    features: [
      'استقبال الرسائل من Contact Form',
      'اتصال SMTP لإرسال البريد',
      'اتصال IMAP لاستقبال البريد',
      'منشئ قوالب البريد الاحترافي',
      'إدارة صندوق الوارد والصادر',
      'الرد على الرسائل',
      'قوالب جاهزة قابلة للتخصيص',
      'إحصائيات البريد الإلكتروني',
      'مجموعات البريد والتصنيفات'
    ],
    settings: {
      // SMTP Settings
      smtpHost: '',
      smtpPort: 587,
      smtpSecure: true, // TLS
      smtpUser: '',
      smtpPassword: '',
      smtpFromName: 'Technology KSA',
      smtpFromEmail: '',

      // IMAP Settings
      imapHost: '',
      imapPort: 993,
      imapSecure: true, // SSL
      imapUser: '',
      imapPassword: '',

      // General Settings
      enableAutoReply: false,
      autoReplyMessage: '',
      saveContactFormSubmissions: true,
      notifyOnNewEmail: true
    }
  },

  integrations: {
    id: 'integrations',
    name: 'التكاملات والتتبع - Integrations',
    description: 'نظام شامل للتكامل مع منصات التحليل والتتبع (Google Analytics، Meta Pixel، TikTok، Perfex CRM وغيرها)',
    version: '1.0.0',
    author: 'Technology KSA',
    icon: 'plug',
    features: [
      'Google Analytics 4 (GA4)',
      'Meta Pixel (Facebook Pixel)',
      'TikTok Pixel',
      'Snapchat Pixel',
      'Microsoft Clarity',
      'Bing Ads (UET)',
      'Yandex Metrica',
      'Perfex CRM Integration',
      'Custom Scripts & Tags',
      'Event Tracking',
      'Conversion Tracking',
      'إدارة مركزية لجميع التكاملات'
    ],
    settings: {
      // Google Analytics
      ga_enabled: false,
      ga_measurement_id: '', // G-XXXXXXXXXX
      ga_send_page_view: true,

      // Meta Pixel (Facebook)
      meta_enabled: false,
      meta_pixel_id: '',
      meta_track_page_view: true,

      // TikTok Pixel
      tiktok_enabled: false,
      tiktok_pixel_id: '',

      // Snapchat Pixel
      snapchat_enabled: false,
      snapchat_pixel_id: '',

      // Microsoft Clarity
      clarity_enabled: false,
      clarity_project_id: '',

      // Bing Ads (UET)
      bing_enabled: false,
      bing_uet_tag_id: '',

      // Yandex Metrica
      yandex_enabled: false,
      yandex_counter_id: '',

      // Perfex CRM
      perfex_enabled: false,
      perfex_url: '',
      perfex_api_key: '',
      perfex_sync_contacts: true,

      // Custom Scripts
      custom_head_scripts: '',
      custom_body_scripts: '',
      custom_footer_scripts: ''
    }
  }
};

// ==========================================
// PLUGINS MANAGER CLASS
// ==========================================

class PluginsManager {
  constructor() {
    this.plugins = this.loadPlugins();
    this.activePlugins = this.loadActivePlugins();
  }

  loadPlugins() {
    return AVAILABLE_PLUGINS;
  }

  loadActivePlugins() {
    const saved = localStorage.getItem('techksa_active_plugins');
    return saved ? JSON.parse(saved) : [];
  }

  saveActivePlugins() {
    localStorage.setItem('techksa_active_plugins', JSON.stringify(this.activePlugins));
  }

  isActive(pluginId) {
    return this.activePlugins.includes(pluginId);
  }

  activate(pluginId) {
    if (!this.activePlugins.includes(pluginId)) {
      this.activePlugins.push(pluginId);
      this.saveActivePlugins();

      // Initialize plugin if it has init function
      if (window[`init_${pluginId}_plugin`]) {
        window[`init_${pluginId}_plugin`]();
      }

      return true;
    }
    return false;
  }

  deactivate(pluginId) {
    const index = this.activePlugins.indexOf(pluginId);
    if (index > -1) {
      this.activePlugins.splice(index, 1);
      this.saveActivePlugins();

      // Cleanup plugin if it has cleanup function
      if (window[`cleanup_${pluginId}_plugin`]) {
        window[`cleanup_${pluginId}_plugin`]();
      }

      return true;
    }
    return false;
  }

  getPlugin(pluginId) {
    return this.plugins[pluginId] || null;
  }

  getActivePlugins() {
    return this.activePlugins.map(id => this.plugins[id]).filter(Boolean);
  }

  getPluginSettings(pluginId) {
    const saved = localStorage.getItem(`techksa_plugin_${pluginId}_settings`);
    if (saved) {
      return JSON.parse(saved);
    }
    return this.plugins[pluginId]?.settings || {};
  }

  savePluginSettings(pluginId, settings) {
    localStorage.setItem(`techksa_plugin_${pluginId}_settings`, JSON.stringify(settings));
  }

  renderPluginsList() {
    const container = document.getElementById('pluginsList');
    if (!container) return;

    container.innerHTML = Object.values(this.plugins).map(plugin => {
      const isActive = this.isActive(plugin.id);

      return `
        <div class="plugin-card ${isActive ? 'active' : ''}">
          <div class="plugin-header">
            <div class="plugin-icon">
              <i class="fas fa-${plugin.icon}"></i>
            </div>
            <div class="plugin-info">
              <h3>${plugin.name}</h3>
              <p>${plugin.description}</p>
              <div class="plugin-meta">
                <span><i class="fas fa-user"></i> ${plugin.author}</span>
                <span><i class="fas fa-code-branch"></i> v${plugin.version}</span>
              </div>
            </div>
          </div>

          <div class="plugin-features">
            <h4>المميزات:</h4>
            <ul>
              ${plugin.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
          </div>

          <div class="plugin-actions">
            ${isActive ? `
              <button class="btn btn-danger" onclick="pluginsManager.togglePlugin('${plugin.id}', false)">
                <i class="fas fa-times"></i> تعطيل
              </button>
              <button class="btn btn-secondary" onclick="openPluginSettings('${plugin.id}')">
                <i class="fas fa-cog"></i> إعدادات
              </button>
            ` : `
              <button class="btn btn-primary" onclick="pluginsManager.togglePlugin('${plugin.id}', true)">
                <i class="fas fa-check"></i> تفعيل
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  togglePlugin(pluginId, activate) {
    if (activate) {
      if (this.activate(pluginId)) {
        showToast(`تم تفعيل ${this.plugins[pluginId].name}`, 'success');
        this.renderPluginsList();

        // Refresh admin menu to show plugin items
        if (typeof updateAdminMenu === 'function') {
          updateAdminMenu();
        }
      }
    } else {
      if (confirm('هل أنت متأكد من تعطيل هذه الإضافة؟')) {
        if (this.deactivate(pluginId)) {
          showToast(`تم تعطيل ${this.plugins[pluginId].name}`, 'success');
          this.renderPluginsList();

          // Refresh admin menu
          if (typeof updateAdminMenu === 'function') {
            updateAdminMenu();
          }
        }
      }
    }
  }
}

// Initialize global plugins manager
let pluginsManager;

function initPluginsManager() {
  pluginsManager = new PluginsManager();
  pluginsManager.renderPluginsList();
}

function openPluginSettings(pluginId) {
  const plugin = pluginsManager.getPlugin(pluginId);
  if (!plugin) return;

  // Open settings modal (will be implemented in admin.js)
  if (typeof showPluginSettingsModal === 'function') {
    showPluginSettingsModal(pluginId);
  }
}
