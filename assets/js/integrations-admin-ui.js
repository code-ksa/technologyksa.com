/**
 * Integrations Admin UI - Technology KSA
 * واجهة إدارة التكاملات في Admin Panel
 */

// ==========================================
// INTEGRATIONS SETTINGS
// ==========================================

function openIntegrationsSettings() {
  const modal = document.getElementById('integrationsSettingsModal');
  if (!modal) return;

  loadIntegrationsSettings();
  modal.classList.add('active');
}

function closeIntegrationsSettings() {
  document.getElementById('integrationsSettingsModal').classList.remove('active');
}

function loadIntegrationsSettings() {
  const settings = integrationsManager.settings;

  // Google Analytics
  document.getElementById('gaEnabled').checked = settings.ga_enabled;
  document.getElementById('gaMeasurementId').value = settings.ga_measurement_id || '';
  document.getElementById('gaSendPageView').checked = settings.ga_send_page_view !== false;

  // Meta Pixel
  document.getElementById('metaEnabled').checked = settings.meta_enabled;
  document.getElementById('metaPixelId').value = settings.meta_pixel_id || '';
  document.getElementById('metaTrackPageView').checked = settings.meta_track_page_view !== false;

  // TikTok Pixel
  document.getElementById('tiktokEnabled').checked = settings.tiktok_enabled;
  document.getElementById('tiktokPixelId').value = settings.tiktok_pixel_id || '';

  // Snapchat Pixel
  document.getElementById('snapchatEnabled').checked = settings.snapchat_enabled;
  document.getElementById('snapchatPixelId').value = settings.snapchat_pixel_id || '';

  // Microsoft Clarity
  document.getElementById('clarityEnabled').checked = settings.clarity_enabled;
  document.getElementById('clarityProjectId').value = settings.clarity_project_id || '';

  // Bing UET
  document.getElementById('bingEnabled').checked = settings.bing_enabled;
  document.getElementById('bingUetTagId').value = settings.bing_uet_tag_id || '';

  // Yandex Metrica
  document.getElementById('yandexEnabled').checked = settings.yandex_enabled;
  document.getElementById('yandexCounterId').value = settings.yandex_counter_id || '';

  // Perfex CRM
  document.getElementById('perfexEnabled').checked = settings.perfex_enabled;
  document.getElementById('perfexUrl').value = settings.perfex_url || '';
  document.getElementById('perfexApiKey').value = settings.perfex_api_key || '';
  document.getElementById('perfexSyncContacts').checked = settings.perfex_sync_contacts !== false;

  // Custom Scripts
  document.getElementById('customHeadScripts').value = settings.custom_head_scripts || '';
  document.getElementById('customBodyScripts').value = settings.custom_body_scripts || '';
  document.getElementById('customFooterScripts').value = settings.custom_footer_scripts || '';
}

function saveIntegrationsSettings() {
  const settings = {
    // Google Analytics
    ga_enabled: document.getElementById('gaEnabled').checked,
    ga_measurement_id: document.getElementById('gaMeasurementId').value,
    ga_send_page_view: document.getElementById('gaSendPageView').checked,

    // Meta Pixel
    meta_enabled: document.getElementById('metaEnabled').checked,
    meta_pixel_id: document.getElementById('metaPixelId').value,
    meta_track_page_view: document.getElementById('metaTrackPageView').checked,

    // TikTok Pixel
    tiktok_enabled: document.getElementById('tiktokEnabled').checked,
    tiktok_pixel_id: document.getElementById('tiktokPixelId').value,

    // Snapchat Pixel
    snapchat_enabled: document.getElementById('snapchatEnabled').checked,
    snapchat_pixel_id: document.getElementById('snapchatPixelId').value,

    // Microsoft Clarity
    clarity_enabled: document.getElementById('clarityEnabled').checked,
    clarity_project_id: document.getElementById('clarityProjectId').value,

    // Bing UET
    bing_enabled: document.getElementById('bingEnabled').checked,
    bing_uet_tag_id: document.getElementById('bingUetTagId').value,

    // Yandex Metrica
    yandex_enabled: document.getElementById('yandexEnabled').checked,
    yandex_counter_id: document.getElementById('yandexCounterId').value,

    // Perfex CRM
    perfex_enabled: document.getElementById('perfexEnabled').checked,
    perfex_url: document.getElementById('perfexUrl').value,
    perfex_api_key: document.getElementById('perfexApiKey').value,
    perfex_sync_contacts: document.getElementById('perfexSyncContacts').checked,

    // Custom Scripts
    custom_head_scripts: document.getElementById('customHeadScripts').value,
    custom_body_scripts: document.getElementById('customBodyScripts').value,
    custom_footer_scripts: document.getElementById('customFooterScripts').value
  };

  integrationsManager.updateSettings(settings);
  showToast('تم حفظ إعدادات التكاملات بنجاح!', 'success');
  closeIntegrationsSettings();

  // Reinitialize if needed
  if (confirm('هل تريد إعادة تهيئة التكاملات الآن؟\n(يتطلب إعادة تحميل الصفحة)')) {
    location.reload();
  }

  // Update dashboard
  updateIntegrationsDashboard();
}

// ==========================================
// INTEGRATIONS DASHBOARD
// ==========================================

function updateIntegrationsDashboard() {
  const status = integrationsManager.getIntegrationStatus();
  const enabled = integrationsManager.getEnabledIntegrations();

  // Update status cards
  updateStatusCard('gaStatus', status.google_analytics, 'Google Analytics');
  updateStatusCard('metaStatus', status.meta_pixel, 'Meta Pixel');
  updateStatusCard('tiktokStatus', status.tiktok_pixel, 'TikTok Pixel');
  updateStatusCard('snapchatStatus', status.snapchat_pixel, 'Snapchat Pixel');
  updateStatusCard('clarityStatus', status.clarity, 'Microsoft Clarity');
  updateStatusCard('bingStatus', status.bing_uet, 'Bing Ads');
  updateStatusCard('yandexStatus', status.yandex, 'Yandex Metrica');
  updateStatusCard('perfexStatus', status.perfex_crm, 'Perfex CRM');

  // Update enabled count
  const enabledCountEl = document.getElementById('enabledIntegrationsCount');
  if (enabledCountEl) {
    enabledCountEl.textContent = enabled.length;
  }

  // Update events count
  const eventsCountEl = document.getElementById('totalEventsCount');
  if (eventsCountEl) {
    eventsCountEl.textContent = integrationsManager.getTotalEvents();
  }
}

function updateStatusCard(elementId, isActive, name) {
  const card = document.getElementById(elementId);
  if (!card) return;

  if (isActive) {
    card.innerHTML = `
      <div class="status-indicator status-active"></div>
      <span>${name}</span>
      <span class="badge badge-success">نشط</span>
    `;
  } else {
    card.innerHTML = `
      <div class="status-indicator status-inactive"></div>
      <span>${name}</span>
      <span class="badge badge-secondary">غير نشط</span>
    `;
  }
}

// ==========================================
// EVENT TESTING
// ==========================================

function testEventTracking() {
  const eventName = document.getElementById('testEventName').value;
  const eventValue = document.getElementById('testEventValue').value;

  if (!eventName) {
    showToast('يجب إدخال اسم الحدث', 'error');
    return;
  }

  const eventData = {};
  if (eventValue) {
    eventData.value = parseFloat(eventValue);
  }

  integrationsManager.trackEvent(eventName, eventData);
  showToast(`تم إرسال الحدث: ${eventName}`, 'success');

  // Update recent events
  updateRecentEvents();
}

function testPageView() {
  integrationsManager.trackPageView('/test-page', 'Test Page');
  showToast('تم إرسال Page View', 'success');
  updateRecentEvents();
}

function testConversion() {
  integrationsManager.trackConversion('purchase', 100, 'SAR');
  showToast('تم إرسال Conversion', 'success');
  updateRecentEvents();
}

function updateRecentEvents() {
  const container = document.getElementById('recentEventsList');
  if (!container) return;

  const events = integrationsManager.getRecentEvents(10);

  if (events.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">لا توجد أحداث بعد</p>';
    return;
  }

  container.innerHTML = events.map(event => `
    <div class="event-item">
      <div class="event-name">${event.name}</div>
      <div class="event-time">${new Date(event.timestamp).toLocaleString('ar-SA')}</div>
      ${Object.keys(event.data).length > 0 ? `
        <div class="event-data">${JSON.stringify(event.data)}</div>
      ` : ''}
    </div>
  `).join('');
}

function clearAllEvents() {
  if (confirm('حذف جميع الأحداث المسجلة؟')) {
    integrationsManager.clearEvents();
    showToast('تم مسح جميع الأحداث', 'success');
    updateRecentEvents();
    updateIntegrationsDashboard();
  }
}

// ==========================================
// PERFEX CRM ACTIONS
// ==========================================

async function testPerfexConnection() {
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
  btn.disabled = true;

  try {
    const settings = integrationsManager.settings;

    if (!settings.perfex_url || !settings.perfex_api_key) {
      showToast('يجب تعبئة رابط Perfex و API Key أولاً', 'error');
      return;
    }

    // Test API connection
    const response = await fetch(`${settings.perfex_url}/api/contacts`, {
      method: 'GET',
      headers: {
        'authtoken': settings.perfex_api_key
      }
    });

    if (response.ok) {
      showToast('اتصال Perfex CRM ناجح!', 'success');
    } else {
      showToast('فشل الاتصال بـ Perfex CRM', 'error');
    }
  } catch (error) {
    showToast('حدث خطأ في الاتصال', 'error');
    console.error(error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function syncTestContact() {
  const result = await integrationsManager.syncContactToPerfex({
    name: 'Test Contact',
    email: 'test@example.com',
    phone: '+966500000000',
    message: 'This is a test contact from Technology KSA'
  });

  if (result.success) {
    showToast('تم إنشاء جهة اتصال تجريبية في Perfex CRM', 'success');
  } else {
    showToast('فشل إنشاء جهة الاتصال: ' + result.error, 'error');
  }
}

// ==========================================
// TABS SWITCHING
// ==========================================

function switchIntegrationTab(tab) {
  // Update buttons
  document.querySelectorAll('.integrations-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update content
  document.querySelectorAll('#integrationsTabContent .tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const tabMap = {
    'dashboard': 'dashboardTab',
    'analytics': 'analyticsTab',
    'social': 'socialTab',
    'crm': 'crmTab',
    'custom': 'customTab',
    'events': 'eventsTab'
  };

  document.getElementById(tabMap[tab]).classList.add('active');

  // Load tab-specific data
  if (tab === 'dashboard') {
    updateIntegrationsDashboard();
  } else if (tab === 'events') {
    updateRecentEvents();
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize dashboard when view is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if integrations manager is available
  if (typeof integrationsManager !== 'undefined') {
    updateIntegrationsDashboard();
    updateRecentEvents();
  }
});

// Auto-update dashboard every 30 seconds
setInterval(() => {
  if (typeof integrationsManager !== 'undefined' && document.getElementById('integrationsView')) {
    updateIntegrationsDashboard();
  }
}, 30000);
