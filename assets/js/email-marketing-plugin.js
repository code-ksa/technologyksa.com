/**
 * Email Marketing Plugin - Technology KSA
 * نظام شامل لإدارة البريد الإلكتروني مع SMTP و IMAP ومنشئ القوالب
 */

// ==========================================
// EMAIL MANAGER CLASS
// ==========================================

class EmailManager {
  constructor() {
    this.emails = this.loadEmails();
    this.templates = this.loadTemplates();
    this.contacts = this.loadContacts();
    this.settings = this.loadSettings();
  }

  loadEmails() {
    const saved = localStorage.getItem('techksa_emails');
    return saved ? JSON.parse(saved) : [];
  }

  loadTemplates() {
    const saved = localStorage.getItem('techksa_email_templates');
    return saved ? JSON.parse(saved) : this.getDefaultTemplates();
  }

  loadContacts() {
    const saved = localStorage.getItem('techksa_email_contacts');
    return saved ? JSON.parse(saved) : [];
  }

  loadSettings() {
    return pluginsManager.getPluginSettings('emailmarketing');
  }

  saveEmails() {
    localStorage.setItem('techksa_emails', JSON.stringify(this.emails));
  }

  saveTemplates() {
    localStorage.setItem('techksa_email_templates', JSON.stringify(this.templates));
  }

  saveContacts() {
    localStorage.setItem('techksa_email_contacts', JSON.stringify(this.contacts));
  }

  saveSettings() {
    pluginsManager.savePluginSettings('emailmarketing', this.settings);
  }

  // ==========================================
  // DEFAULT TEMPLATES
  // ==========================================

  getDefaultTemplates() {
    return [
      {
        id: 'template-welcome',
        name: 'رسالة الترحيب',
        subject: 'مرحباً بك في {{site_name}}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2563eb; text-align: center;">مرحباً بك!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                عزيزي {{customer_name}},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                نشكرك على تواصلك معنا. نحن سعداء بانضمامك إلى {{site_name}}.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{site_url}}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">زيارة الموقع</a>
              </div>
              <p style="font-size: 14px; color: #666; text-align: center;">
                مع أطيب التحيات،<br>
                فريق {{site_name}}
              </p>
            </div>
          </div>
        `,
        variables: ['site_name', 'customer_name', 'site_url'],
        category: 'general'
      },
      {
        id: 'template-reply',
        name: 'رد على استفسار',
        subject: 'رد على استفسارك - {{site_name}}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 8px;">
              <h2 style="color: #2563eb;">رد على استفسارك</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                عزيزي {{customer_name}},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                شكراً لتواصلك معنا. فيما يلي ردنا على استفسارك:
              </p>
              <div style="background: #f9fafb; padding: 20px; border-right: 4px solid #2563eb; margin: 20px 0;">
                {{reply_message}}
              </div>
              <p style="font-size: 14px; color: #666;">
                إذا كان لديك أي استفسار آخر، لا تتردد في التواصل معنا.
              </p>
              <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
                مع أطيب التحيات،<br>
                فريق {{site_name}}
              </p>
            </div>
          </div>
        `,
        variables: ['site_name', 'customer_name', 'reply_message'],
        category: 'support'
      },
      {
        id: 'template-newsletter',
        name: 'نشرة بريدية',
        subject: '{{newsletter_title}} - {{site_name}}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 8px;">
              <img src="{{logo_url}}" alt="Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;">
              <h1 style="color: #2563eb; text-align: center;">{{newsletter_title}}</h1>
              <div style="font-size: 16px; line-height: 1.8; color: #333;">
                {{newsletter_content}}
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                تلقيت هذه الرسالة لأنك مشترك في نشرتنا البريدية.<br>
                <a href="{{unsubscribe_url}}" style="color: #999;">إلغاء الاشتراك</a>
              </p>
            </div>
          </div>
        `,
        variables: ['site_name', 'newsletter_title', 'newsletter_content', 'logo_url', 'unsubscribe_url'],
        category: 'marketing'
      },
      {
        id: 'template-notification',
        name: 'إشعار عام',
        subject: 'إشعار: {{notification_title}}',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 8px;">
              <div style="background: #eff6ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h2 style="color: #2563eb; margin: 0;">📢 {{notification_title}}</h2>
              </div>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                {{notification_message}}
              </p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                مع أطيب التحيات،<br>
                فريق {{site_name}}
              </p>
            </div>
          </div>
        `,
        variables: ['site_name', 'notification_title', 'notification_message'],
        category: 'notification'
      }
    ];
  }

  // ==========================================
  // EMAIL CRUD
  // ==========================================

  addEmail(emailData) {
    const email = {
      id: 'email-' + Date.now(),
      from: emailData.from || '',
      to: emailData.to || '',
      subject: emailData.subject || '',
      body: emailData.body || '',
      templateId: emailData.templateId || null,
      status: emailData.status || 'draft', // draft, sent, failed, received
      type: emailData.type || 'outgoing', // outgoing, incoming
      dateCreated: new Date().toISOString(),
      dateSent: emailData.dateSent || null,
      read: emailData.read || false,
      starred: emailData.starred || false,
      folder: emailData.folder || 'inbox', // inbox, sent, draft, trash
      tags: emailData.tags || [],
      attachments: emailData.attachments || []
    };

    this.emails.push(email);
    this.saveEmails();
    return email;
  }

  updateEmail(id, emailData) {
    const index = this.emails.findIndex(e => e.id === id);
    if (index !== -1) {
      this.emails[index] = {
        ...this.emails[index],
        ...emailData,
        dateModified: new Date().toISOString()
      };
      this.saveEmails();
      return this.emails[index];
    }
    return null;
  }

  deleteEmail(id) {
    this.emails = this.emails.filter(e => e.id !== id);
    this.saveEmails();
  }

  getEmail(id) {
    return this.emails.find(e => e.id === id);
  }

  markAsRead(id) {
    const email = this.getEmail(id);
    if (email) {
      email.read = true;
      this.saveEmails();
    }
  }

  toggleStar(id) {
    const email = this.getEmail(id);
    if (email) {
      email.starred = !email.starred;
      this.saveEmails();
    }
  }

  moveToFolder(id, folder) {
    const email = this.getEmail(id);
    if (email) {
      email.folder = folder;
      this.saveEmails();
    }
  }

  // ==========================================
  // TEMPLATES CRUD
  // ==========================================

  addTemplate(templateData) {
    const template = {
      id: 'template-' + Date.now(),
      name: templateData.name,
      subject: templateData.subject,
      body: templateData.body,
      variables: templateData.variables || [],
      category: templateData.category || 'custom',
      dateCreated: new Date().toISOString()
    };

    this.templates.push(template);
    this.saveTemplates();
    return template;
  }

  updateTemplate(id, templateData) {
    const index = this.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.templates[index] = {
        ...this.templates[index],
        ...templateData,
        dateModified: new Date().toISOString()
      };
      this.saveTemplates();
      return this.templates[index];
    }
    return null;
  }

  deleteTemplate(id) {
    this.templates = this.templates.filter(t => t.id !== id);
    this.saveTemplates();
  }

  getTemplate(id) {
    return this.templates.find(t => t.id === id);
  }

  // ==========================================
  // CONTACTS CRUD
  // ==========================================

  addContact(contactData) {
    const contact = {
      id: 'contact-' + Date.now(),
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      company: contactData.company || '',
      tags: contactData.tags || [],
      dateAdded: new Date().toISOString(),
      lastEmailDate: null,
      emailCount: 0
    };

    this.contacts.push(contact);
    this.saveContacts();
    return contact;
  }

  updateContact(id, contactData) {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contacts[index] = {
        ...this.contacts[index],
        ...contactData
      };
      this.saveContacts();
      return this.contacts[index];
    }
    return null;
  }

  deleteContact(id) {
    this.contacts = this.contacts.filter(c => c.id !== id);
    this.saveContacts();
  }

  getContactByEmail(email) {
    return this.contacts.find(c => c.email === email);
  }

  // ==========================================
  // SEND EMAIL (Frontend Simulation)
  // ==========================================

  async sendEmail(emailData) {
    try {
      // In real implementation, this would call backend API
      // that connects to SMTP server

      // Simulate API call
      await this.simulateSmtpSend(emailData);

      // Save to sent emails
      const email = this.addEmail({
        ...emailData,
        status: 'sent',
        type: 'outgoing',
        folder: 'sent',
        dateSent: new Date().toISOString()
      });

      // Update contact
      this.updateContactEmailCount(emailData.to);

      return { success: true, email: email };
    } catch (error) {
      console.error('Send email error:', error);
      return { success: false, error: error.message };
    }
  }

  simulateSmtpSend(emailData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if SMTP is configured
        if (!this.settings.smtpHost || !this.settings.smtpUser) {
          reject(new Error('يجب تكوين إعدادات SMTP أولاً'));
          return;
        }

        console.log('📧 Simulating SMTP send:', {
          host: this.settings.smtpHost,
          port: this.settings.smtpPort,
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject
        });

        resolve();
      }, 1000);
    });
  }

  // ==========================================
  // RECEIVE EMAIL (Frontend Simulation)
  // ==========================================

  async fetchEmails() {
    try {
      // In real implementation, this would call backend API
      // that connects to IMAP server

      await this.simulateImapFetch();

      return { success: true, count: 0 };
    } catch (error) {
      console.error('Fetch emails error:', error);
      return { success: false, error: error.message };
    }
  }

  simulateImapFetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if IMAP is configured
        if (!this.settings.imapHost || !this.settings.imapUser) {
          reject(new Error('يجب تكوين إعدادات IMAP أولاً'));
          return;
        }

        console.log('📥 Simulating IMAP fetch:', {
          host: this.settings.imapHost,
          port: this.settings.imapPort,
          user: this.settings.imapUser
        });

        resolve();
      }, 1000);
    });
  }

  // ==========================================
  // CONTACT FORM INTEGRATION
  // ==========================================

  handleContactFormSubmission(formData) {
    // Create email from contact form
    const email = this.addEmail({
      from: formData.email,
      to: this.settings.smtpFromEmail,
      subject: formData.subject || 'رسالة من نموذج الاتصال',
      body: this.formatContactFormEmail(formData),
      status: 'received',
      type: 'incoming',
      folder: 'inbox',
      read: false,
      tags: ['contact-form']
    });

    // Add to contacts if new
    if (!this.getContactByEmail(formData.email)) {
      this.addContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        tags: ['contact-form']
      });
    }

    // Auto-reply if enabled
    if (this.settings.enableAutoReply && this.settings.autoReplyMessage) {
      this.sendAutoReply(formData.email, formData.name);
    }

    return email;
  }

  formatContactFormEmail(formData) {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            رسالة جديدة من نموذج الاتصال
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>الاسم:</strong> ${formData.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
            ${formData.phone ? `<p><strong>الهاتف:</strong> ${formData.phone}</p>` : ''}
            ${formData.subject ? `<p><strong>الموضوع:</strong> ${formData.subject}</p>` : ''}
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 5px;">
            <p><strong>الرسالة:</strong></p>
            <p style="line-height: 1.6;">${formData.message}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            تم الإرسال بتاريخ: ${new Date().toLocaleString('ar-SA')}
          </p>
        </div>
      </div>
    `;
  }

  sendAutoReply(toEmail, customerName) {
    const template = this.getTemplate('template-welcome');
    if (!template) return;

    const body = this.replaceVariables(template.body, {
      site_name: 'Technology KSA',
      customer_name: customerName,
      site_url: window.location.origin
    });

    this.sendEmail({
      from: this.settings.smtpFromEmail,
      to: toEmail,
      subject: 'شكراً لتواصلك معنا',
      body: body,
      templateId: template.id
    });
  }

  // ==========================================
  // TEMPLATE VARIABLES
  // ==========================================

  replaceVariables(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  updateContactEmailCount(email) {
    const contact = this.getContactByEmail(email);
    if (contact) {
      contact.emailCount++;
      contact.lastEmailDate = new Date().toISOString();
      this.saveContacts();
    }
  }

  getEmailsByFolder(folder) {
    return this.emails.filter(e => e.folder === folder);
  }

  getUnreadCount() {
    return this.emails.filter(e => !e.read && e.type === 'incoming').length;
  }

  searchEmails(query) {
    const lowerQuery = query.toLowerCase();
    return this.emails.filter(e =>
      e.subject.toLowerCase().includes(lowerQuery) ||
      e.from.toLowerCase().includes(lowerQuery) ||
      e.to.toLowerCase().includes(lowerQuery) ||
      e.body.toLowerCase().includes(lowerQuery)
    );
  }

  getEmailStats() {
    return {
      total: this.emails.length,
      sent: this.emails.filter(e => e.status === 'sent').length,
      received: this.emails.filter(e => e.type === 'incoming').length,
      unread: this.getUnreadCount(),
      starred: this.emails.filter(e => e.starred).length
    };
  }

  // ==========================================
  // ADMIN UI RENDERING
  // ==========================================

  renderEmailsList(folder = 'inbox') {
    const container = document.getElementById('emailsList');
    if (!container) return;

    const emails = this.getEmailsByFolder(folder);

    if (emails.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox" style="font-size: 4rem; color: var(--text-secondary);"></i>
          <h3>لا توجد رسائل</h3>
          <p>صندوق ${this.getFolderName(folder)} فارغ</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="data-table emails-table">
        <thead>
          <tr>
            <th width="30"><input type="checkbox" onchange="emailManager.toggleSelectAll(this)"></th>
            <th width="30"></th>
            <th>${folder === 'sent' ? 'إلى' : 'من'}</th>
            <th>الموضوع</th>
            <th width="150">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          ${emails.map(email => `
            <tr class="email-row ${!email.read ? 'unread' : ''}" onclick="emailManager.openEmailModal('${email.id}')">
              <td onclick="event.stopPropagation()">
                <input type="checkbox" class="email-checkbox" value="${email.id}">
              </td>
              <td onclick="event.stopPropagation()">
                <i class="fas fa-star ${email.starred ? 'starred' : ''}"
                   onclick="emailManager.toggleStar('${email.id}'); emailManager.renderEmailsList('${folder}');"
                   style="cursor: pointer; color: ${email.starred ? '#fbbf24' : '#d1d5db'};"></i>
              </td>
              <td>
                <strong>${folder === 'sent' ? email.to : email.from}</strong>
              </td>
              <td>
                ${!email.read ? '<strong>' : ''}
                ${email.subject || '(بدون موضوع)'}
                ${!email.read ? '</strong>' : ''}
                ${email.tags.length > 0 ? `<br><small style="color: var(--text-secondary);">${email.tags.map(t => `<span class="badge badge-info">${t}</span>`).join(' ')}</small>` : ''}
              </td>
              <td>
                <small>${this.formatDate(email.dateCreated)}</small>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  getFolderName(folder) {
    const names = {
      inbox: 'الوارد',
      sent: 'المرسل',
      draft: 'المسودات',
      trash: 'المحذوفات'
    };
    return names[folder] || folder;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'منذ قليل';
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (hours < 48) return 'أمس';

    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  renderTemplatesList() {
    const container = document.getElementById('templatesList');
    if (!container) return;

    container.innerHTML = this.templates.map(template => `
      <div class="template-card">
        <div class="template-header">
          <h4>${template.name}</h4>
          <span class="badge badge-info">${template.category}</span>
        </div>
        <p class="template-subject">${template.subject}</p>
        <div class="template-actions">
          <button class="btn btn-sm btn-primary" onclick="emailManager.useTemplate('${template.id}')">
            <i class="fas fa-paper-plane"></i> استخدام
          </button>
          <button class="btn btn-sm btn-secondary" onclick="emailManager.editTemplate('${template.id}')">
            <i class="fas fa-edit"></i> تعديل
          </button>
          ${template.category === 'custom' ? `
            <button class="btn btn-sm btn-danger" onclick="if(confirm('حذف القالب؟')) { emailManager.deleteTemplate('${template.id}'); emailManager.renderTemplatesList(); }">
              <i class="fas fa-trash"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  renderContactsList() {
    const container = document.getElementById('contactsList');
    if (!container) return;

    if (this.contacts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-address-book" style="font-size: 4rem; color: var(--text-secondary);"></i>
          <h3>لا توجد جهات اتصال</h3>
          <p>ابدأ بإضافة جهات اتصال</p>
          <button class="btn btn-primary" onclick="emailManager.openContactModal()">
            <i class="fas fa-plus"></i> إضافة جهة اتصال
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الهاتف</th>
            <th>عدد الرسائل</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${this.contacts.map(contact => `
            <tr>
              <td><strong>${contact.name}</strong></td>
              <td>${contact.email}</td>
              <td>${contact.phone || '-'}</td>
              <td>${contact.emailCount}</td>
              <td>
                <div class="btn-group">
                  <button class="btn-icon" onclick="emailManager.composeToContact('${contact.id}')" title="إرسال بريد">
                    <i class="fas fa-envelope"></i>
                  </button>
                  <button class="btn-icon" onclick="emailManager.editContact('${contact.id}')" title="تعديل">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon" onclick="if(confirm('حذف جهة الاتصال؟')) { emailManager.deleteContact('${contact.id}'); emailManager.renderContactsList(); }" title="حذف">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  openEmailModal(emailId) {
    // Will be implemented in email-admin-ui.js
    if (typeof openEmailViewModal === 'function') {
      openEmailViewModal(emailId);
    }
  }

  useTemplate(templateId) {
    // Will be implemented in email-admin-ui.js
    if (typeof openComposeModalWithTemplate === 'function') {
      openComposeModalWithTemplate(templateId);
    }
  }

  editTemplate(templateId) {
    // Will be implemented in email-admin-ui.js
    if (typeof openTemplateEditorModal === 'function') {
      openTemplateEditorModal(templateId);
    }
  }

  openContactModal(contactId = null) {
    // Will be implemented in email-admin-ui.js
    if (typeof openContactFormModal === 'function') {
      openContactFormModal(contactId);
    }
  }

  composeToContact(contactId) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact && typeof openComposeModal === 'function') {
      openComposeModal(contact.email);
    }
  }

  editContact(contactId) {
    this.openContactModal(contactId);
  }
}

// ==========================================
// EMAIL TEMPLATE BUILDER
// ==========================================

class EmailTemplateBuilder {
  constructor() {
    this.currentTemplate = null;
    this.blocks = [];
  }

  // Template blocks
  getAvailableBlocks() {
    return [
      {
        type: 'header',
        name: 'رأس الصفحة',
        icon: 'heading',
        html: '<h1 style="color: #2563eb; text-align: center;">عنوان الرسالة</h1>'
      },
      {
        type: 'paragraph',
        name: 'فقرة نصية',
        icon: 'paragraph',
        html: '<p style="font-size: 16px; line-height: 1.6; color: #333;">أدخل النص هنا...</p>'
      },
      {
        type: 'button',
        name: 'زر',
        icon: 'square',
        html: '<div style="text-align: center; margin: 20px 0;"><a href="#" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">اضغط هنا</a></div>'
      },
      {
        type: 'image',
        name: 'صورة',
        icon: 'image',
        html: '<div style="text-align: center; margin: 20px 0;"><img src="https://via.placeholder.com/600x300" style="max-width: 100%; height: auto; border-radius: 8px;"></div>'
      },
      {
        type: 'divider',
        name: 'فاصل',
        icon: 'minus',
        html: '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">'
      },
      {
        type: 'spacer',
        name: 'مسافة',
        icon: 'arrows-alt-v',
        html: '<div style="height: 30px;"></div>'
      }
    ];
  }

  addBlock(blockType) {
    const blockDef = this.getAvailableBlocks().find(b => b.type === blockType);
    if (!blockDef) return;

    const block = {
      id: 'block-' + Date.now(),
      type: blockType,
      html: blockDef.html
    };

    this.blocks.push(block);
    this.renderPreview();
  }

  removeBlock(blockId) {
    this.blocks = this.blocks.filter(b => b.id !== blockId);
    this.renderPreview();
  }

  updateBlock(blockId, html) {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.html = html;
      this.renderPreview();
    }
  }

  renderPreview() {
    const container = document.getElementById('templatePreview');
    if (!container) return;

    const html = this.generateFullHTML();
    container.innerHTML = html;
  }

  generateFullHTML() {
    const blocksHTML = this.blocks.map(b => b.html).join('\n');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          ${blocksHTML}
        </div>
      </div>
    `;
  }

  saveTemplate(name, subject, category) {
    const html = this.generateFullHTML();

    if (this.currentTemplate) {
      // Update existing
      emailManager.updateTemplate(this.currentTemplate.id, {
        name: name,
        subject: subject,
        body: html,
        category: category
      });
    } else {
      // Create new
      emailManager.addTemplate({
        name: name,
        subject: subject,
        body: html,
        category: category,
        variables: this.extractVariables(html)
      });
    }

    this.reset();
  }

  loadTemplate(templateId) {
    const template = emailManager.getTemplate(templateId);
    if (!template) return;

    this.currentTemplate = template;
    // Parse HTML to blocks (simplified)
    this.blocks = [
      {
        id: 'block-' + Date.now(),
        type: 'custom',
        html: template.body
      }
    ];
    this.renderPreview();
  }

  extractVariables(html) {
    const regex = /{{(.*?)}}/g;
    const matches = [...html.matchAll(regex)];
    return [...new Set(matches.map(m => m[1]))];
  }

  reset() {
    this.currentTemplate = null;
    this.blocks = [];
  }
}

// ==========================================
// PLUGIN INITIALIZATION
// ==========================================

let emailManager;
let templateBuilder;

function init_emailmarketing_plugin() {
  console.log('✅ Email Marketing Plugin Activated');

  // Initialize managers
  emailManager = new EmailManager();
  templateBuilder = new EmailTemplateBuilder();

  // Add to global scope
  window.emailManager = emailManager;
  window.templateBuilder = templateBuilder;

  // Hook into contact forms
  hookContactForms();
}

function cleanup_emailmarketing_plugin() {
  console.log('❌ Email Marketing Plugin Deactivated');

  // Cleanup
  window.emailManager = null;
  window.templateBuilder = null;
}

// ==========================================
// CONTACT FORM INTEGRATION
// ==========================================

function hookContactForms() {
  // Listen for contact form submissions
  document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('contact-form') || e.target.id === 'contactForm') {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      // Handle submission
      emailManager.handleContactFormSubmission(data);

      // Show success message
      if (typeof showToast === 'function') {
        showToast('تم إرسال رسالتك بنجاح!', 'success');
      }

      // Reset form
      e.target.reset();
    }
  });
}
