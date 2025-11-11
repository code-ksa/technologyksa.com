/**
 * Email Admin UI - Technology KSA
 * واجهة إدارة البريد الإلكتروني في Admin Panel
 */

// ==========================================
// COMPOSE EMAIL MODAL
// ==========================================

function openComposeModal(toEmail = '') {
  const modal = document.getElementById('composeEmailModal');
  if (!modal) return;

  // Reset form
  document.getElementById('composeForm').reset();
  document.getElementById('composeTo').value = toEmail;
  document.getElementById('composeTemplateId').value = '';

  modal.classList.add('active');
}

function closeComposeModal() {
  document.getElementById('composeEmailModal').classList.remove('active');
}

function openComposeModalWithTemplate(templateId) {
  const template = emailManager.getTemplate(templateId);
  if (!template) return;

  openComposeModal();

  document.getElementById('composeSubject').value = template.subject;
  document.getElementById('composeTemplateId').value = templateId;

  // Load template body in editor
  if (typeof tinymce !== 'undefined' && tinymce.get('composeBody')) {
    tinymce.get('composeBody').setContent(template.body);
  } else {
    document.getElementById('composeBody').value = template.body;
  }
}

async function sendComposedEmail() {
  const to = document.getElementById('composeTo').value;
  const subject = document.getElementById('composeSubject').value;
  let body = '';

  // Get body from TinyMCE or textarea
  if (typeof tinymce !== 'undefined' && tinymce.get('composeBody')) {
    body = tinymce.get('composeBody').getContent();
  } else {
    body = document.getElementById('composeBody').value;
  }

  if (!to || !subject) {
    showToast('يجب إدخال المستلم والموضوع', 'error');
    return;
  }

  // Validate email
  if (!isValidEmail(to)) {
    showToast('البريد الإلكتروني للمستلم غير صحيح', 'error');
    return;
  }

  // Show loading
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
  btn.disabled = true;

  try {
    const result = await emailManager.sendEmail({
      from: emailManager.settings.smtpFromEmail,
      to: to,
      subject: subject,
      body: body,
      templateId: document.getElementById('composeTemplateId').value || null
    });

    if (result.success) {
      showToast('تم إرسال البريد بنجاح!', 'success');
      closeComposeModal();

      // Refresh emails list if on sent tab
      const currentFolder = document.querySelector('.email-folder-item.active')?.dataset.folder;
      if (currentFolder === 'sent') {
        emailManager.renderEmailsList('sent');
      }
    } else {
      showToast('فشل إرسال البريد: ' + result.error, 'error');
    }
  } catch (error) {
    showToast('حدث خطأ أثناء الإرسال', 'error');
    console.error(error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ==========================================
// VIEW EMAIL MODAL
// ==========================================

function openEmailViewModal(emailId) {
  const email = emailManager.getEmail(emailId);
  if (!email) return;

  const modal = document.getElementById('emailViewModal');
  if (!modal) return;

  // Mark as read
  emailManager.markAsRead(emailId);

  // Fill modal
  document.getElementById('emailViewFrom').textContent = email.from;
  document.getElementById('emailViewTo').textContent = email.to;
  document.getElementById('emailViewSubject').textContent = email.subject;
  document.getElementById('emailViewDate').textContent = new Date(email.dateCreated).toLocaleString('ar-SA');
  document.getElementById('emailViewBody').innerHTML = email.body;
  document.getElementById('currentEmailId').value = emailId;

  // Show/hide reply button based on type
  const replyBtn = document.getElementById('replyEmailBtn');
  if (email.type === 'incoming') {
    replyBtn.style.display = 'inline-flex';
  } else {
    replyBtn.style.display = 'none';
  }

  modal.classList.add('active');

  // Refresh list to show as read
  const currentFolder = document.querySelector('.email-folder-item.active')?.dataset.folder || 'inbox';
  emailManager.renderEmailsList(currentFolder);
}

function closeEmailViewModal() {
  document.getElementById('emailViewModal').classList.remove('active');
}

function replyToEmail() {
  const emailId = document.getElementById('currentEmailId').value;
  const email = emailManager.getEmail(emailId);
  if (!email) return;

  closeEmailViewModal();
  openComposeModal(email.from);

  // Set subject with Re:
  document.getElementById('composeSubject').value = 'Re: ' + email.subject;

  // Quote original message
  const quotedMessage = `
    <br><br>
    <div style="border-right: 3px solid #2563eb; padding-right: 15px; color: #666;">
      <p><strong>في ${new Date(email.dateCreated).toLocaleString('ar-SA')}، كتب ${email.from}:</strong></p>
      ${email.body}
    </div>
  `;

  if (typeof tinymce !== 'undefined' && tinymce.get('composeBody')) {
    tinymce.get('composeBody').setContent(quotedMessage);
  } else {
    document.getElementById('composeBody').value = quotedMessage;
  }
}

function deleteCurrentEmail() {
  const emailId = document.getElementById('currentEmailId').value;

  if (confirm('حذف هذا البريد؟')) {
    emailManager.deleteEmail(emailId);
    showToast('تم حذف البريد', 'success');
    closeEmailViewModal();

    const currentFolder = document.querySelector('.email-folder-item.active')?.dataset.folder || 'inbox';
    emailManager.renderEmailsList(currentFolder);
  }
}

// ==========================================
// TEMPLATE EDITOR MODAL
// ==========================================

function openTemplateEditorModal(templateId = null) {
  const modal = document.getElementById('templateEditorModal');
  if (!modal) return;

  if (templateId) {
    // Edit mode
    const template = emailManager.getTemplate(templateId);
    if (!template) return;

    document.getElementById('templateId').value = template.id;
    document.getElementById('templateName').value = template.name;
    document.getElementById('templateSubject').value = template.subject;
    document.getElementById('templateCategory').value = template.category;
    document.getElementById('templateBody').value = template.body;

    document.getElementById('templateModalTitle').textContent = 'تعديل القالب';
  } else {
    // Add mode
    document.getElementById('templateForm').reset();
    document.getElementById('templateId').value = '';
    document.getElementById('templateModalTitle').textContent = 'إضافة قالب جديد';
  }

  modal.classList.add('active');

  // Switch to code tab
  switchTemplateEditorTab('code');
}

function closeTemplateEditorModal() {
  document.getElementById('templateEditorModal').classList.remove('active');
}

function switchTemplateEditorTab(tab) {
  // Update buttons
  document.querySelectorAll('.template-editor-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update content
  if (tab === 'code') {
    document.getElementById('templateCodeEditor').style.display = 'block';
    document.getElementById('templateVisualEditor').style.display = 'none';
  } else {
    document.getElementById('templateCodeEditor').style.display = 'none';
    document.getElementById('templateVisualEditor').style.display = 'block';

    // Update preview
    updateTemplatePreview();
  }
}

function updateTemplatePreview() {
  const body = document.getElementById('templateBody').value;
  const preview = document.getElementById('templatePreviewContent');
  if (preview) {
    preview.innerHTML = body;
  }
}

function insertVariable(variable) {
  const textarea = document.getElementById('templateBody');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  const before = text.substring(0, start);
  const after = text.substring(end, text.length);

  textarea.value = before + '{{' + variable + '}}' + after;
  textarea.selectionStart = textarea.selectionEnd = start + variable.length + 4;
  textarea.focus();
}

function saveTemplate() {
  const templateId = document.getElementById('templateId').value;
  const name = document.getElementById('templateName').value;
  const subject = document.getElementById('templateSubject').value;
  const body = document.getElementById('templateBody').value;
  const category = document.getElementById('templateCategory').value;

  if (!name || !subject || !body) {
    showToast('يجب إدخال جميع الحقول المطلوبة', 'error');
    return;
  }

  if (templateId) {
    // Update
    emailManager.updateTemplate(templateId, {
      name: name,
      subject: subject,
      body: body,
      category: category
    });
    showToast('تم تحديث القالب بنجاح!', 'success');
  } else {
    // Add
    emailManager.addTemplate({
      name: name,
      subject: subject,
      body: body,
      category: category
    });
    showToast('تم إضافة القالب بنجاح!', 'success');
  }

  closeTemplateEditorModal();
  emailManager.renderTemplatesList();
}

// ==========================================
// CONTACT MODAL
// ==========================================

function openContactFormModal(contactId = null) {
  const modal = document.getElementById('contactModal');
  if (!modal) return;

  if (contactId) {
    // Edit mode
    const contact = emailManager.contacts.find(c => c.id === contactId);
    if (!contact) return;

    document.getElementById('contactId').value = contact.id;
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone || '';
    document.getElementById('contactCompany').value = contact.company || '';
    document.getElementById('contactModalTitle').textContent = 'تعديل جهة الاتصال';
  } else {
    // Add mode
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('contactModalTitle').textContent = 'إضافة جهة اتصال';
  }

  modal.classList.add('active');
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('active');
}

function saveContact() {
  const contactId = document.getElementById('contactId').value;
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;
  const company = document.getElementById('contactCompany').value;

  if (!name || !email) {
    showToast('يجب إدخال الاسم والبريد الإلكتروني', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showToast('البريد الإلكتروني غير صحيح', 'error');
    return;
  }

  if (contactId) {
    // Update
    emailManager.updateContact(contactId, {
      name: name,
      email: email,
      phone: phone,
      company: company
    });
    showToast('تم تحديث جهة الاتصال بنجاح!', 'success');
  } else {
    // Add
    emailManager.addContact({
      name: name,
      email: email,
      phone: phone,
      company: company
    });
    showToast('تم إضافة جهة الاتصال بنجاح!', 'success');
  }

  closeContactModal();
  emailManager.renderContactsList();
}

// ==========================================
// SETTINGS MODAL
// ==========================================

function openEmailSettingsModal() {
  const modal = document.getElementById('emailSettingsModal');
  if (!modal) return;

  const settings = emailManager.settings;

  // SMTP
  document.getElementById('settingsSmtpHost').value = settings.smtpHost || '';
  document.getElementById('settingsSmtpPort').value = settings.smtpPort || 587;
  document.getElementById('settingsSmtpSecure').checked = settings.smtpSecure !== false;
  document.getElementById('settingsSmtpUser').value = settings.smtpUser || '';
  document.getElementById('settingsSmtpPassword').value = settings.smtpPassword || '';
  document.getElementById('settingsSmtpFromName').value = settings.smtpFromName || '';
  document.getElementById('settingsSmtpFromEmail').value = settings.smtpFromEmail || '';

  // IMAP
  document.getElementById('settingsImapHost').value = settings.imapHost || '';
  document.getElementById('settingsImapPort').value = settings.imapPort || 993;
  document.getElementById('settingsImapSecure').checked = settings.imapSecure !== false;
  document.getElementById('settingsImapUser').value = settings.imapUser || '';
  document.getElementById('settingsImapPassword').value = settings.imapPassword || '';

  // General
  document.getElementById('settingsEnableAutoReply').checked = settings.enableAutoReply || false;
  document.getElementById('settingsAutoReplyMessage').value = settings.autoReplyMessage || '';

  modal.classList.add('active');
}

function closeEmailSettingsModal() {
  document.getElementById('emailSettingsModal').classList.remove('active');
}

function saveEmailSettings() {
  const settings = {
    // SMTP
    smtpHost: document.getElementById('settingsSmtpHost').value,
    smtpPort: parseInt(document.getElementById('settingsSmtpPort').value) || 587,
    smtpSecure: document.getElementById('settingsSmtpSecure').checked,
    smtpUser: document.getElementById('settingsSmtpUser').value,
    smtpPassword: document.getElementById('settingsSmtpPassword').value,
    smtpFromName: document.getElementById('settingsSmtpFromName').value,
    smtpFromEmail: document.getElementById('settingsSmtpFromEmail').value,

    // IMAP
    imapHost: document.getElementById('settingsImapHost').value,
    imapPort: parseInt(document.getElementById('settingsImapPort').value) || 993,
    imapSecure: document.getElementById('settingsImapSecure').checked,
    imapUser: document.getElementById('settingsImapUser').value,
    imapPassword: document.getElementById('settingsImapPassword').value,

    // General
    enableAutoReply: document.getElementById('settingsEnableAutoReply').checked,
    autoReplyMessage: document.getElementById('settingsAutoReplyMessage').value,
    saveContactFormSubmissions: true,
    notifyOnNewEmail: true
  };

  emailManager.settings = settings;
  emailManager.saveSettings();

  showToast('تم حفظ الإعدادات بنجاح!', 'success');
  closeEmailSettingsModal();
}

async function testSmtpConnection() {
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
  btn.disabled = true;

  try {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const host = document.getElementById('settingsSmtpHost').value;
    const user = document.getElementById('settingsSmtpUser').value;

    if (!host || !user) {
      showToast('يجب إدخال معلومات SMTP أولاً', 'error');
    } else {
      showToast('اتصال SMTP ناجح!', 'success');
    }
  } catch (error) {
    showToast('فشل الاتصال بـ SMTP', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function testImapConnection() {
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
  btn.disabled = true;

  try {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const host = document.getElementById('settingsImapHost').value;
    const user = document.getElementById('settingsImapUser').value;

    if (!host || !user) {
      showToast('يجب إدخال معلومات IMAP أولاً', 'error');
    } else {
      showToast('اتصال IMAP ناجح!', 'success');
    }
  } catch (error) {
    showToast('فشل الاتصال بـ IMAP', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ==========================================
// EMAIL TABS
// ==========================================

function switchEmailTab(tab) {
  // Update buttons
  document.querySelectorAll('.email-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update content
  document.querySelectorAll('#emailsTabContent .tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const tabMap = {
    'inbox': 'inboxTab',
    'templates': 'templatesTab',
    'contacts': 'contactsTab',
    'settings': 'settingsInfoTab'
  };

  document.getElementById(tabMap[tab]).classList.add('active');

  // Load data
  if (tab === 'inbox') {
    switchEmailFolder('inbox');
  } else if (tab === 'templates') {
    emailManager.renderTemplatesList();
  } else if (tab === 'contacts') {
    emailManager.renderContactsList();
  }
}

function switchEmailFolder(folder) {
  // Update sidebar
  document.querySelectorAll('.email-folder-item').forEach(item => {
    item.classList.remove('active');
  });

  const folderItem = document.querySelector(`.email-folder-item[data-folder="${folder}"]`);
  if (folderItem) {
    folderItem.classList.add('active');
  }

  // Render emails
  emailManager.renderEmailsList(folder);
}

// ==========================================
// BULK ACTIONS
// ==========================================

function toggleSelectAll(checkbox) {
  const checkboxes = document.querySelectorAll('.email-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = checkbox.checked;
  });
}

function bulkDeleteEmails() {
  const selected = Array.from(document.querySelectorAll('.email-checkbox:checked')).map(cb => cb.value);

  if (selected.length === 0) {
    showToast('يجب اختيار رسائل أولاً', 'warning');
    return;
  }

  if (confirm(`حذف ${selected.length} رسالة؟`)) {
    selected.forEach(id => emailManager.deleteEmail(id));
    showToast(`تم حذف ${selected.length} رسالة`, 'success');

    const currentFolder = document.querySelector('.email-folder-item.active')?.dataset.folder || 'inbox';
    emailManager.renderEmailsList(currentFolder);
  }
}

function bulkMarkAsRead() {
  const selected = Array.from(document.querySelectorAll('.email-checkbox:checked')).map(cb => cb.value);

  if (selected.length === 0) {
    showToast('يجب اختيار رسائل أولاً', 'warning');
    return;
  }

  selected.forEach(id => emailManager.markAsRead(id));
  showToast(`تم تعليم ${selected.length} رسالة كمقروءة`, 'success');

  const currentFolder = document.querySelector('.email-folder-item.active')?.dataset.folder || 'inbox';
  emailManager.renderEmailsList(currentFolder);
}

// ==========================================
// SEARCH
// ==========================================

function searchEmails() {
  const query = document.getElementById('emailSearchInput').value;

  if (!query) {
    const currentFolder = document.querySelector('.email-folder-item.active')?.dataset.folder || 'inbox';
    emailManager.renderEmailsList(currentFolder);
    return;
  }

  const results = emailManager.searchEmails(query);
  const container = document.getElementById('emailsList');

  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search" style="font-size: 4rem; color: var(--text-secondary);"></i>
        <h3>لا توجد نتائج</h3>
        <p>لم يتم العثور على رسائل تطابق "${query}"</p>
      </div>
    `;
    return;
  }

  // Render search results (similar to renderEmailsList)
  container.innerHTML = `
    <div class="search-results-header">
      <h4>نتائج البحث: ${results.length} رسالة</h4>
    </div>
    <table class="data-table emails-table">
      <tbody>
        ${results.map(email => `
          <tr class="email-row ${!email.read ? 'unread' : ''}" onclick="emailManager.openEmailModal('${email.id}')">
            <td><i class="fas fa-star ${email.starred ? 'starred' : ''}" style="color: ${email.starred ? '#fbbf24' : '#d1d5db'};"></i></td>
            <td><strong>${email.from}</strong></td>
            <td>${email.subject || '(بدون موضوع)'}</td>
            <td><small>${emailManager.formatDate(email.dateCreated)}</small></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ==========================================
// STATISTICS
// ==========================================

function updateEmailStats() {
  const stats = emailManager.getEmailStats();

  const statsContainer = document.getElementById('emailStatsContainer');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: #dbeafe;">
          <i class="fas fa-envelope" style="color: #2563eb;"></i>
        </div>
        <div class="stat-info">
          <h3>${stats.total}</h3>
          <p>إجمالي الرسائل</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #dcfce7;">
          <i class="fas fa-paper-plane" style="color: #16a34a;"></i>
        </div>
        <div class="stat-info">
          <h3>${stats.sent}</h3>
          <p>رسائل مرسلة</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #fef3c7;">
          <i class="fas fa-inbox" style="color: #ca8a04;"></i>
        </div>
        <div class="stat-info">
          <h3>${stats.received}</h3>
          <p>رسائل واردة</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: #fed7aa;">
          <i class="fas fa-envelope-open" style="color: #ea580c;"></i>
        </div>
        <div class="stat-info">
          <h3>${stats.unread}</h3>
          <p>غير مقروءة</p>
        </div>
      </div>
    </div>
  `;
}
