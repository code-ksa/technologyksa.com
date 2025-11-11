/**
 * Components Data - Technology KSA
 * يحتوي على تعريفات جميع أنواع العناصر (38 نوع)
 */

const COMPONENT_TYPES = {
  // ==========================================
  // ORIGINAL COMPONENTS (8)
  // ==========================================

  hero: {
    name: 'Hero Section',
    icon: 'image',
    category: 'sections',
    description: 'قسم رئيسي مع صورة خلفية وعنوان',
    fields: ['title', 'subtitle', 'buttonText', 'buttonLink', 'backgroundImage', 'backgroundColor', 'overlay'],
    defaultContent: {
      title: 'عنوان رئيسي',
      subtitle: 'نص فرعي يوضح المحتوى',
      buttonText: 'ابدأ الآن',
      buttonLink: '#',
      backgroundColor: 'linear-gradient(135deg, #0C4A2F 0%, #10B981 100%)',
      overlay: '0.5'
    }
  },

  cta: {
    name: 'Call to Action',
    icon: 'bullhorn',
    category: 'sections',
    description: 'دعوة لاتخاذ إجراء مع زر',
    fields: ['title', 'description', 'buttonText', 'buttonLink', 'backgroundColor', 'buttonStyle'],
    defaultContent: {
      title: 'هل أنت جاهز لبدء مشروعك؟',
      description: 'تواصل معنا اليوم واحصل على استشارة مجانية',
      buttonText: 'احجز استشارة',
      buttonLink: '#contact',
      backgroundColor: '#10B981',
      buttonStyle: 'primary'
    }
  },

  features: {
    name: 'Features Grid',
    icon: 'th',
    category: 'sections',
    description: 'عرض الميزات في شبكة',
    fields: ['title', 'subtitle', 'items', 'columns'],
    hasItems: true,
    itemFields: ['icon', 'title', 'description'],
    defaultContent: {
      title: 'لماذا نحن الأفضل',
      subtitle: 'نقدم حلول تقنية متكاملة',
      columns: '3',
      items: []
    }
  },

  testimonials: {
    name: 'Testimonials',
    icon: 'comments',
    category: 'sections',
    description: 'آراء وتقييمات العملاء',
    fields: ['title', 'subtitle', 'items'],
    hasItems: true,
    itemFields: ['name', 'position', 'company', 'image', 'rating', 'text'],
    defaultContent: {
      title: 'ماذا يقول عملاؤنا',
      subtitle: 'آراء حقيقية من عملاء سعداء',
      items: []
    }
  },

  stats: {
    name: 'Statistics',
    icon: 'chart-bar',
    category: 'sections',
    description: 'عرض إحصائيات وأرقام',
    fields: ['title', 'subtitle', 'items', 'backgroundColor'],
    hasItems: true,
    itemFields: ['icon', 'number', 'suffix', 'label'],
    defaultContent: {
      title: 'إنجازاتنا بالأرقام',
      subtitle: '',
      backgroundColor: '#0C4A2F',
      items: []
    }
  },

  contact: {
    name: 'Contact Form',
    icon: 'envelope',
    category: 'sections',
    description: 'نموذج اتصال',
    fields: ['title', 'subtitle', 'showPhone', 'showEmail', 'showMessage', 'buttonText'],
    defaultContent: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا للإجابة على استفساراتك',
      showPhone: true,
      showEmail: true,
      showMessage: true,
      buttonText: 'إرسال'
    }
  },

  team: {
    name: 'Team Members',
    icon: 'users',
    category: 'sections',
    description: 'عرض أعضاء الفريق',
    fields: ['title', 'subtitle', 'items'],
    hasItems: true,
    itemFields: ['name', 'position', 'image', 'bio', 'social'],
    defaultContent: {
      title: 'فريق العمل',
      subtitle: 'تعرف على خبرائنا',
      items: []
    }
  },

  pricing: {
    name: 'Pricing Table',
    icon: 'tags',
    category: 'sections',
    description: 'جداول الأسعار',
    fields: ['title', 'subtitle', 'items'],
    hasItems: true,
    itemFields: ['name', 'price', 'period', 'features', 'buttonText', 'buttonLink', 'featured'],
    defaultContent: {
      title: 'خطط الأسعار',
      subtitle: 'اختر الخطة المناسبة لك',
      items: []
    }
  },

  // ==========================================
  // SECTION TYPES (15)
  // ==========================================

  about: {
    name: 'About Section',
    icon: 'info-circle',
    category: 'sections',
    description: 'قسم عن الشركة',
    fields: ['title', 'subtitle', 'content', 'image', 'imagePosition', 'points'],
    hasItems: true,
    itemFields: ['icon', 'text'],
    defaultContent: {
      title: 'من نحن',
      subtitle: 'قصة شركتنا',
      content: 'نحن شركة رائدة في مجال التكنولوجيا...',
      imagePosition: 'right',
      points: []
    }
  },

  services: {
    name: 'Services Grid',
    icon: 'briefcase',
    category: 'sections',
    description: 'شبكة عرض الخدمات',
    fields: ['title', 'subtitle', 'items', 'columns', 'cardStyle'],
    hasItems: true,
    itemFields: ['icon', 'title', 'description', 'link'],
    defaultContent: {
      title: 'خدماتنا',
      subtitle: 'نقدم حلول تقنية شاملة',
      columns: '3',
      cardStyle: 'hover',
      items: []
    }
  },

  portfolio: {
    name: 'Portfolio Grid',
    icon: 'folder-open',
    category: 'sections',
    description: 'معرض الأعمال',
    fields: ['title', 'subtitle', 'items', 'columns', 'filter'],
    hasItems: true,
    itemFields: ['title', 'category', 'image', 'link', 'description'],
    defaultContent: {
      title: 'أعمالنا',
      subtitle: 'مشاريع نفخر بها',
      columns: '3',
      filter: true,
      items: []
    }
  },

  blog: {
    name: 'Blog Grid',
    icon: 'blog',
    category: 'sections',
    description: 'شبكة المقالات',
    fields: ['title', 'subtitle', 'columns', 'limit', 'showExcerpt', 'showDate', 'showAuthor'],
    defaultContent: {
      title: 'آخر المقالات',
      subtitle: 'تابع جديد مدونتنا',
      columns: '3',
      limit: '6',
      showExcerpt: true,
      showDate: true,
      showAuthor: true
    }
  },

  faq: {
    name: 'FAQ - Accordion',
    icon: 'question-circle',
    category: 'sections',
    description: 'الأسئلة الشائعة',
    fields: ['title', 'subtitle', 'items'],
    hasItems: true,
    itemFields: ['question', 'answer'],
    defaultContent: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إجابات على أكثر الأسئلة شيوعاً',
      items: []
    }
  },

  timeline: {
    name: 'Timeline',
    icon: 'stream',
    category: 'sections',
    description: 'خط زمني للأحداث',
    fields: ['title', 'subtitle', 'items', 'direction'],
    hasItems: true,
    itemFields: ['year', 'title', 'description', 'icon'],
    defaultContent: {
      title: 'رحلتنا',
      subtitle: 'تاريخنا عبر السنين',
      direction: 'vertical',
      items: []
    }
  },

  counter: {
    name: 'Animated Counter',
    icon: 'tachometer-alt',
    category: 'sections',
    description: 'عدادات متحركة',
    fields: ['title', 'subtitle', 'items', 'backgroundColor'],
    hasItems: true,
    itemFields: ['icon', 'number', 'suffix', 'label', 'duration'],
    defaultContent: {
      title: '',
      subtitle: '',
      backgroundColor: 'transparent',
      items: []
    }
  },

  video: {
    name: 'Video Section',
    icon: 'play-circle',
    category: 'sections',
    description: 'قسم فيديو',
    fields: ['title', 'subtitle', 'videoUrl', 'videoType', 'thumbnail', 'autoplay'],
    defaultContent: {
      title: 'شاهد الفيديو',
      subtitle: '',
      videoType: 'youtube',
      autoplay: false
    }
  },

  gallery: {
    name: 'Image Gallery',
    icon: 'images',
    category: 'sections',
    description: 'معرض صور',
    fields: ['title', 'subtitle', 'items', 'columns', 'lightbox'],
    hasItems: true,
    itemFields: ['image', 'title', 'description'],
    defaultContent: {
      title: 'معرض الصور',
      subtitle: '',
      columns: '4',
      lightbox: true,
      items: []
    }
  },

  map: {
    name: 'Map Section',
    icon: 'map-marker-alt',
    category: 'sections',
    description: 'خريطة الموقع',
    fields: ['title', 'subtitle', 'latitude', 'longitude', 'zoom', 'markerTitle'],
    defaultContent: {
      title: 'موقعنا',
      subtitle: 'زر مكتبنا',
      latitude: '24.7136',
      longitude: '46.6753',
      zoom: '15',
      markerTitle: 'Technology KSA'
    }
  },

  newsletter: {
    name: 'Newsletter Signup',
    icon: 'paper-plane',
    category: 'sections',
    description: 'اشتراك في النشرة البريدية',
    fields: ['title', 'subtitle', 'placeholder', 'buttonText', 'backgroundColor'],
    defaultContent: {
      title: 'اشترك في نشرتنا البريدية',
      subtitle: 'احصل على آخر الأخبار والعروض',
      placeholder: 'أدخل بريدك الإلكتروني',
      buttonText: 'اشترك الآن',
      backgroundColor: '#10B981'
    }
  },

  brands: {
    name: 'Brands/Partners',
    icon: 'handshake',
    category: 'sections',
    description: 'شعارات الشركاء',
    fields: ['title', 'subtitle', 'items', 'grayscale'],
    hasItems: true,
    itemFields: ['name', 'logo', 'link'],
    defaultContent: {
      title: 'شركاؤنا',
      subtitle: 'نفخر بالعمل مع',
      grayscale: true,
      items: []
    }
  },

  process: {
    name: 'Process Steps',
    icon: 'tasks',
    category: 'sections',
    description: 'خطوات العمل',
    fields: ['title', 'subtitle', 'items', 'layout'],
    hasItems: true,
    itemFields: ['number', 'title', 'description', 'icon'],
    defaultContent: {
      title: 'كيف نعمل',
      subtitle: 'عمليتنا في 4 خطوات بسيطة',
      layout: 'horizontal',
      items: []
    }
  },

  comparison: {
    name: 'Comparison Table',
    icon: 'balance-scale',
    category: 'sections',
    description: 'جدول مقارنة',
    fields: ['title', 'subtitle', 'columns', 'rows'],
    hasItems: true,
    itemFields: ['feature', 'values'],
    defaultContent: {
      title: 'قارن الخطط',
      subtitle: '',
      columns: ['الأساسية', 'المتقدمة', 'الاحترافية'],
      rows: []
    }
  },

  accordion: {
    name: 'Content Accordion',
    icon: 'list-alt',
    category: 'sections',
    description: 'محتوى قابل للطي',
    fields: ['title', 'subtitle', 'items', 'multiOpen'],
    hasItems: true,
    itemFields: ['title', 'content', 'icon'],
    defaultContent: {
      title: '',
      subtitle: '',
      multiOpen: false,
      items: []
    }
  },

  // ==========================================
  // CONTENT TYPES (15)
  // ==========================================

  textblock: {
    name: 'Text Block',
    icon: 'align-left',
    category: 'content',
    description: 'كتلة نص',
    fields: ['content', 'alignment', 'fontSize', 'textColor'],
    defaultContent: {
      content: '<p>أدخل نصك هنا...</p>',
      alignment: 'right',
      fontSize: '16px',
      textColor: '#333'
    }
  },

  image: {
    name: 'Image',
    icon: 'file-image',
    category: 'content',
    description: 'صورة',
    fields: ['imageUrl', 'alt', 'alignment', 'width', 'link', 'caption'],
    defaultContent: {
      imageUrl: '',
      alt: '',
      alignment: 'center',
      width: '100%',
      link: '',
      caption: ''
    }
  },

  iconbox: {
    name: 'Icon Box',
    icon: 'cube',
    category: 'content',
    description: 'صندوق مع أيقونة',
    fields: ['icon', 'title', 'description', 'iconColor', 'link'],
    defaultContent: {
      icon: 'fa-star',
      title: 'عنوان',
      description: 'وصف قصير',
      iconColor: '#10B981',
      link: ''
    }
  },

  alert: {
    name: 'Alert Box',
    icon: 'exclamation-triangle',
    category: 'content',
    description: 'مربع تنبيه',
    fields: ['content', 'type', 'dismissible', 'icon'],
    defaultContent: {
      content: 'هذا تنبيه مهم!',
      type: 'info',
      dismissible: true,
      icon: 'fa-info-circle'
    }
  },

  quote: {
    name: 'Quote Block',
    icon: 'quote-right',
    category: 'content',
    description: 'اقتباس',
    fields: ['quote', 'author', 'position', 'style'],
    defaultContent: {
      quote: 'النجاح ليس مفتاحاً للسعادة. السعادة هي مفتاح النجاح.',
      author: 'ألبرت شفايتسر',
      position: '',
      style: 'bordered'
    }
  },

  divider: {
    name: 'Divider',
    icon: 'minus',
    category: 'content',
    description: 'خط فاصل',
    fields: ['style', 'width', 'color', 'thickness', 'marginTop', 'marginBottom'],
    defaultContent: {
      style: 'solid',
      width: '100%',
      color: '#e0e0e0',
      thickness: '1px',
      marginTop: '20px',
      marginBottom: '20px'
    }
  },

  spacer: {
    name: 'Spacer',
    icon: 'arrows-alt-v',
    category: 'content',
    description: 'مساحة فارغة',
    fields: ['height', 'mobileHeight'],
    defaultContent: {
      height: '50px',
      mobileHeight: '30px'
    }
  },

  buttons: {
    name: 'Button Group',
    icon: 'th-large',
    category: 'content',
    description: 'مجموعة أزرار',
    fields: ['items', 'alignment', 'size'],
    hasItems: true,
    itemFields: ['text', 'link', 'style', 'icon'],
    defaultContent: {
      alignment: 'center',
      size: 'medium',
      items: []
    }
  },

  social: {
    name: 'Social Share',
    icon: 'share-alt',
    category: 'content',
    description: 'أزرار مشاركة اجتماعية',
    fields: ['title', 'networks', 'style', 'size'],
    defaultContent: {
      title: 'شارك:',
      networks: ['facebook', 'twitter', 'linkedin', 'whatsapp'],
      style: 'icons',
      size: 'medium'
    }
  },

  progress: {
    name: 'Progress Bar',
    icon: 'tasks',
    category: 'content',
    description: 'شريط تقدم',
    fields: ['items'],
    hasItems: true,
    itemFields: ['label', 'percentage', 'color'],
    defaultContent: {
      items: []
    }
  },

  tabs: {
    name: 'Tabs',
    icon: 'folder',
    category: 'content',
    description: 'تبويبات',
    fields: ['items', 'style'],
    hasItems: true,
    itemFields: ['title', 'icon', 'content'],
    defaultContent: {
      style: 'horizontal',
      items: []
    }
  },

  cards: {
    name: 'Cards Grid',
    icon: 'id-card',
    category: 'content',
    description: 'شبكة بطاقات',
    fields: ['items', 'columns', 'cardStyle'],
    hasItems: true,
    itemFields: ['image', 'title', 'description', 'link', 'buttonText'],
    defaultContent: {
      columns: '3',
      cardStyle: 'shadow',
      items: []
    }
  },

  list: {
    name: 'Styled List',
    icon: 'list-ul',
    category: 'content',
    description: 'قائمة منسقة',
    fields: ['items', 'style', 'iconColor'],
    hasItems: true,
    itemFields: ['text', 'icon'],
    defaultContent: {
      style: 'check',
      iconColor: '#10B981',
      items: []
    }
  },

  table: {
    name: 'Data Table',
    icon: 'table',
    category: 'content',
    description: 'جدول بيانات',
    fields: ['headers', 'rows', 'striped', 'bordered'],
    defaultContent: {
      headers: ['العمود 1', 'العمود 2', 'العمود 3'],
      rows: [],
      striped: true,
      bordered: true
    }
  },

  code: {
    name: 'Code Block',
    icon: 'code',
    category: 'content',
    description: 'كتلة كود',
    fields: ['code', 'language', 'theme', 'lineNumbers'],
    defaultContent: {
      code: '// اكتب الكود هنا',
      language: 'javascript',
      theme: 'dark',
      lineNumbers: true
    }
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getComponentsByCategory(category) {
  return Object.entries(COMPONENT_TYPES)
    .filter(([key, value]) => value.category === category)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
}

function getAllComponentTypes() {
  return Object.keys(COMPONENT_TYPES);
}

function getComponentInfo(type) {
  return COMPONENT_TYPES[type] || null;
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.COMPONENT_TYPES = COMPONENT_TYPES;
  window.getComponentsByCategory = getComponentsByCategory;
  window.getAllComponentTypes = getAllComponentTypes;
  window.getComponentInfo = getComponentInfo;
}
