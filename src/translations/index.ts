/**
 * Translation system for the application
 * Contains all text strings organized by language
 */

import { Language } from '@/utils/i18n'

// Define the structure of our translations
type TranslationKeys = {
  common: {
    login: string
    logout: string
    back: string
    loading: string
    error: string
    success: string
  }
  home: {
    title: string
    sendEth: string
    transactionSuccess: string
    transactionFailed: string
    notConnected: string
    insufficientBalance: string
  }
  wallet: {
    title: string
    description: string
    noWalletFound: string
    createWallet: string
    regenerateWallet: string
    flushDb: string
    yourAddress: string
    messageToSign: string
    enterMessage: string
    signMessage: string
    signature: string
    verifySignature: string
    verificationSuccess: string
    verificationFailed: string
  }
  navigation: {
    newPage: string
    walletGenerator: string
    referral: string
  }
  newPage: {
    title: string
    subtitle: string
    accountInfo: string
    connectedAddress: string
    balance: string
    connectWallet: string
    lastTransaction: string
    backHome: string
  }
}

// Define translations for each supported language
type Translations = {
  [key in Language]: TranslationKeys
}

export const translations: Translations = {
  // English
  en: {
    common: {
      login: 'Login',
      logout: 'Logout',
      back: 'Back',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    home: {
      title: 'Hello world!',
      sendEth: 'Send 0.0001 ETH to self',
      transactionSuccess: 'Transaction successful',
      transactionFailed: 'Transaction failed',
      notConnected: 'Please connect your wallet',
      insufficientBalance: 'Please connect with an account that has a bit of ETH',
    },
    wallet: {
      title: 'Welcome to Message Signer',
      description: 'Securely sign and verify Ethereum messages with your wallet',
      noWalletFound: 'No Ethereum Wallet Found',
      createWallet: 'Create New Ethereum Wallet',
      regenerateWallet: 'Generate New Wallet',
      flushDb: 'Flush DB',
      yourAddress: 'Your Ethereum Wallet Address',
      messageToSign: 'Message to Sign',
      enterMessage: 'Enter your message...',
      signMessage: 'Sign Message',
      signature: 'Ethereum Signature',
      verifySignature: 'Verify Signature',
      verificationSuccess: 'Signature is valid and matches the current wallet address',
      verificationFailed: 'Signature does not match the current wallet address',
    },
    navigation: {
      newPage: 'New page',
      walletGenerator: 'Wallet generator',
      referral: 'Referral',
    },
    newPage: {
      title: 'Welcome to New Page',
      subtitle: 'Unleash your imagination in this new page!',
      accountInfo: 'Account Information',
      connectedAddress: 'Connected Address:',
      balance: 'Balance:',
      connectWallet: 'Connect your wallet to get started',
      lastTransaction: 'Last Transaction:',
      backHome: 'Back Home',
    },
  },

  // Mandarin Chinese
  zh: {
    common: {
      login: '登录',
      logout: '登出',
      back: '返回',
      loading: '加载中...',
      error: '错误',
      success: '成功',
    },
    home: {
      title: '你好，世界！',
      sendEth: '向自己发送 0.0001 ETH',
      transactionSuccess: '交易成功',
      transactionFailed: '交易失败',
      notConnected: '请连接您的钱包',
      insufficientBalance: '请使用拥有一些 ETH 的账户连接',
    },
    wallet: {
      title: '欢迎使用消息签名器',
      description: '使用您的钱包安全地签名和验证以太坊消息',
      noWalletFound: '未找到以太坊钱包',
      createWallet: '创建新的以太坊钱包',
      regenerateWallet: '生成新钱包',
      flushDb: '清空数据库',
      yourAddress: '您的以太坊钱包地址',
      messageToSign: '要签名的消息',
      enterMessage: '输入您的消息...',
      signMessage: '签名消息',
      signature: '以太坊签名',
      verifySignature: '验证签名',
      verificationSuccess: '签名有效并匹配当前钱包地址',
      verificationFailed: '签名与当前钱包地址不匹配',
    },
    navigation: {
      newPage: '新页面',
      walletGenerator: '钱包生成器',
      referral: '推荐',
    },
    newPage: {
      title: '欢迎来到新页面',
      subtitle: '在这个新页面释放你的想象力！',
      accountInfo: '账户信息',
      connectedAddress: '已连接地址：',
      balance: '余额：',
      connectWallet: '连接您的钱包以开始',
      lastTransaction: '最后交易：',
      backHome: '返回首页',
    },
  },

  // Hindi
  hi: {
    common: {
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      back: 'पीछे',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
    },
    home: {
      title: 'नमस्ते दुनिया!',
      sendEth: 'स्वयं को 0.0001 ETH भेजें',
      transactionSuccess: 'लेन-देन सफल',
      transactionFailed: 'लेन-देन विफल',
      notConnected: 'कृपया अपना वॉलेट कनेक्ट करें',
      insufficientBalance: 'कृपया ऐसे खाते से कनेक्ट करें जिसमें थोड़ा ETH हो',
    },
    wallet: {
      title: 'मैसेज साइनर में आपका स्वागत है',
      description: 'अपने वॉलेट से ईथेरियम संदेशों को सुरक्षित रूप से साइन और सत्यापित करें',
      noWalletFound: 'कोई ईथेरियम वॉलेट नहीं मिला',
      createWallet: 'नया ईथेरियम वॉलेट बनाएं',
      regenerateWallet: 'नया वॉलेट जनरेट करें',
      flushDb: 'डीबी खाली करें',
      yourAddress: 'आपका ईथेरियम वॉलेट पता',
      messageToSign: 'साइन करने के लिए संदेश',
      enterMessage: 'अपना संदेश दर्ज करें...',
      signMessage: 'संदेश साइन करें',
      signature: 'ईथेरियम सिग्नेचर',
      verifySignature: 'सिग्नेचर वेरिफाई करें',
      verificationSuccess: 'सिग्नेचर वैध है और वर्तमान वॉलेट पते से मेल खाता है',
      verificationFailed: 'सिग्नेचर वर्तमान वॉलेट पते से मेल नहीं खाता',
    },
    navigation: {
      newPage: 'नया पेज',
      walletGenerator: 'वॉलेट जनरेटर',
      referral: 'रेफरल',
    },
    newPage: {
      title: 'नए पेज पर आपका स्वागत है',
      subtitle: 'इस नए पेज पर अपनी कल्पना को मुक्त करें!',
      accountInfo: 'खाता जानकारी',
      connectedAddress: 'कनेक्टेड पता:',
      balance: 'बैलेंस:',
      connectWallet: 'शुरू करने के लिए अपना वॉलेट कनेक्ट करें',
      lastTransaction: 'अंतिम लेनदेन:',
      backHome: 'होम पर वापस जाएं',
    },
  },

  // Spanish
  es: {
    common: {
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      back: 'Atrás',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
    },
    home: {
      title: '¡Hola mundo!',
      sendEth: 'Enviar 0.0001 ETH a sí mismo',
      transactionSuccess: 'Transacción exitosa',
      transactionFailed: 'Transacción fallida',
      notConnected: 'Por favor conecte su billetera',
      insufficientBalance: 'Por favor conecte con una cuenta que tenga un poco de ETH',
    },
    wallet: {
      title: 'Bienvenido al Firmador de Mensajes',
      description: 'Firme y verifique mensajes de Ethereum de forma segura con su billetera',
      noWalletFound: 'No se encontró ninguna billetera Ethereum',
      createWallet: 'Crear nueva billetera Ethereum',
      regenerateWallet: 'Generar nueva billetera',
      flushDb: 'Vaciar BD',
      yourAddress: 'Su dirección de billetera Ethereum',
      messageToSign: 'Mensaje para firmar',
      enterMessage: 'Ingrese su mensaje...',
      signMessage: 'Firmar mensaje',
      signature: 'Firma Ethereum',
      verifySignature: 'Verificar firma',
      verificationSuccess: 'La firma es válida y coincide con la dirección de la billetera actual',
      verificationFailed: 'La firma no coincide con la dirección de la billetera actual',
    },
    navigation: {
      newPage: 'Nueva página',
      walletGenerator: 'Generador de billetera',
      referral: 'Referido',
    },
    newPage: {
      title: 'Bienvenido a Nueva Página',
      subtitle: '¡Libera tu imaginación en esta nueva página!',
      accountInfo: 'Información de la cuenta',
      connectedAddress: 'Dirección conectada:',
      balance: 'Saldo:',
      connectWallet: 'Conecta tu billetera para comenzar',
      lastTransaction: 'Última transacción:',
      backHome: 'Volver a Inicio',
    },
  },

  // French
  fr: {
    common: {
      login: 'Connexion',
      logout: 'Déconnexion',
      back: 'Retour',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
    home: {
      title: 'Salut tout le monde !',
      sendEth: 'Envoyer 0.0001 ETH à soi-même',
      transactionSuccess: 'Transaction réussie',
      transactionFailed: 'Échec de la transaction',
      notConnected: 'Veuillez connecter votre wallet',
      insufficientBalance: "Veuillez vous connecter avec un compte qui possède un peu d'ETH",
    },
    wallet: {
      title: 'Bienvenue sur le Signataire de Messages',
      description: 'Signez et vérifiez en toute sécurité des messages Ethereum avec votre wallet',
      noWalletFound: 'Aucun wallet',
      createWallet: 'Créer un Nouveau wallet Ethereum',
      regenerateWallet: 'Générer un nouveau wallet',
      flushDb: 'Vider la BD',
      yourAddress: 'Votre adresse Ethereum',
      messageToSign: 'Message à signer',
      enterMessage: 'Entrez votre message...',
      signMessage: 'Signer le mlessage',
      signature: 'Signature',
      verifySignature: 'Vérifier la signature',
      verificationSuccess: 'La signature est valide et correspond à ce wallet',
      verificationFailed: 'La signature ne correspond pas à ce wallet',
    },
    navigation: {
      newPage: 'Nouvelle page',
      walletGenerator: 'Générateur de wallet',
      referral: 'Parrainage',
    },
    newPage: {
      title: 'Bienvenue sur la nouvelle page',
      subtitle: 'Libérez votre imagination sur cette nouvelle page !',
      accountInfo: 'Informations du compte',
      connectedAddress: 'Adresse connectée :',
      balance: 'Solde :',
      connectWallet: 'Connectez votre wallet pour commencer',
      lastTransaction: 'Dernière transaction :',
      backHome: "Retour à l'accueil",
    },
  },

  // Arabic
  ar: {
    common: {
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
    },
    home: {
      title: 'مرحبا بالعالم!',
      sendEth: 'إرسال 0.0001 ETH لنفسك',
      transactionSuccess: 'تمت المعاملة بنجاح',
      transactionFailed: 'فشلت المعاملة',
      notConnected: 'يرجى توصيل محفظتك',
      insufficientBalance: 'يرجى الاتصال بحساب يحتوي على قليل من ETH',
    },
    wallet: {
      title: 'مرحبًا بك في موقع توقيع الرسائل',
      description: 'قم بتوقيع رسائل إيثريوم والتحقق منها بشكل آمن باستخدام محفظتك',
      noWalletFound: 'لم يتم العثور على محفظة إيثريوم',
      createWallet: 'إنشاء محفظة إيثريوم جديدة',
      regenerateWallet: 'إنشاء محفظة جديدة',
      flushDb: 'مسح قاعدة البيانات',
      yourAddress: 'عنوان محفظة الإيثريوم الخاصة بك',
      messageToSign: 'رسالة للتوقيع',
      enterMessage: 'أدخل رسالتك...',
      signMessage: 'توقيع الرسالة',
      signature: 'توقيع الإيثريوم',
      verifySignature: 'التحقق من التوقيع',
      verificationSuccess: 'التوقيع صالح ويتطابق مع عنوان المحفظة الحالي',
      verificationFailed: 'التوقيع لا يتطابق مع عنوان المحفظة الحالي',
    },
    navigation: {
      newPage: 'صفحة جديدة',
      walletGenerator: 'منشئ المحفظة',
      referral: 'إحالة',
    },
    newPage: {
      title: 'مرحبًا بك في الصفحة الجديدة',
      subtitle: 'أطلق العنان لخيالك في هذه الصفحة الجديدة!',
      accountInfo: 'معلومات الحساب',
      connectedAddress: 'العنوان المتصل:',
      balance: 'الرصيد:',
      connectWallet: 'قم بتوصيل محفظتك للبدء',
      lastTransaction: 'آخر معاملة:',
      backHome: 'العودة إلى الصفحة الرئيسية',
    },
  },

  // Bengali
  bn: {
    common: {
      login: 'লগ ইন',
      logout: 'লগ আউট',
      back: 'পিছনে',
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফল',
    },
    home: {
      title: 'ওহে বিশ্ব!',
      sendEth: 'নিজেকে 0.0001 ETH পাঠান',
      transactionSuccess: 'লেনদেন সফল',
      transactionFailed: 'লেনদেন ব্যর্থ',
      notConnected: 'অনুগ্রহ করে আপনার ওয়ালেট সংযুক্ত করুন',
      insufficientBalance: 'অনুগ্রহ করে এমন একটি অ্যাকাউন্টের সাথে সংযোগ করুন যার কিছু ETH আছে',
    },
    wallet: {
      title: 'মেসেজ সাইনারে স্বাগতম',
      description: 'আপনার ওয়ালেট দিয়ে নিরাপদে ইথেরিয়াম বার্তা স্বাক্ষর এবং যাচাই করুন',
      noWalletFound: 'কোনও ইথেরিয়াম ওয়ালেট পাওয়া যায়নি',
      createWallet: 'নতুন ইথেরিয়াম ওয়ালেট তৈরি করুন',
      regenerateWallet: 'নতুন ওয়ালেট তৈরি করুন',
      flushDb: 'ডাটাবেস খালি করুন',
      yourAddress: 'আপনার ইথেরিয়াম ওয়ালেট ঠিকানা',
      messageToSign: 'স্বাক্ষর করার বার্তা',
      enterMessage: 'আপনার বার্তা লিখুন...',
      signMessage: 'বার্তা স্বাক্ষর করুন',
      signature: 'ইথেরিয়াম স্বাক্ষর',
      verifySignature: 'স্বাক্ষর যাচাই করুন',
      verificationSuccess: 'স্বাক্ষর বৈধ এবং বর্তমান ওয়ালেট ঠিকানার সাথে মেলে',
      verificationFailed: 'স্বাক্ষর বর্তমান ওয়ালেট ঠিকানার সাথে মেলে না',
    },
    navigation: {
      newPage: 'নতুন পৃষ্ঠা',
      walletGenerator: 'ওয়ালেট জেনারেটর',
      referral: 'রেফারেল',
    },
    newPage: {
      title: 'নতুন পৃষ্ঠায় স্বাগতম',
      subtitle: 'এই নতুন পৃষ্ঠায় আপনার কল্পনাকে মুক্ত করুন!',
      accountInfo: 'অ্যাকাউন্ট তথ্য',
      connectedAddress: 'সংযুক্ত ঠিকানা:',
      balance: 'ব্যালেন্স:',
      connectWallet: 'শুরু করতে আপনার ওয়ালেট সংযোগ করুন',
      lastTransaction: 'সর্বশেষ লেনদেন:',
      backHome: 'হোমে ফিরে যান',
    },
  },

  // Russian
  ru: {
    common: {
      login: 'Вход',
      logout: 'Выход',
      back: 'Назад',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успех',
    },
    home: {
      title: 'Привет, мир!',
      sendEth: 'Отправить 0.0001 ETH себе',
      transactionSuccess: 'Транзакция успешна',
      transactionFailed: 'Транзакция не удалась',
      notConnected: 'Пожалуйста, подключите ваш кошелек',
      insufficientBalance: 'Пожалуйста, подключитесь с аккаунтом, на котором есть немного ETH',
    },
    wallet: {
      title: 'Добро пожаловать в Подписчик сообщений',
      description:
        'Безопасно подписывайте и проверяйте сообщения Ethereum с помощью вашего кошелька',
      noWalletFound: 'Кошелек Ethereum не найден',
      createWallet: 'Создать новый кошелек Ethereum',
      regenerateWallet: 'Сгенерировать новый кошелек',
      flushDb: 'Очистить БД',
      yourAddress: 'Адрес вашего кошелька Ethereum',
      messageToSign: 'Сообщение для подписи',
      enterMessage: 'Введите ваше сообщение...',
      signMessage: 'Подписать сообщение',
      signature: 'Подпись Ethereum',
      verifySignature: 'Проверить подпись',
      verificationSuccess: 'Подпись действительна и соответствует текущему адресу кошелька',
      verificationFailed: 'Подпись не соответствует текущему адресу кошелька',
    },
    navigation: {
      newPage: 'Новая страница',
      walletGenerator: 'Генератор кошельков',
      referral: 'Рекомендация',
    },
    newPage: {
      title: 'Добро пожаловать на новую страницу',
      subtitle: 'Раскройте свое воображение на этой новой странице!',
      accountInfo: 'Информация об аккаунте',
      connectedAddress: 'Подключенный адрес:',
      balance: 'Баланс:',
      connectWallet: 'Подключите ваш кошелек, чтобы начать',
      lastTransaction: 'Последняя транзакция:',
      backHome: 'Вернуться на главную',
    },
  },

  // Portuguese
  pt: {
    common: {
      login: 'Entrar',
      logout: 'Sair',
      back: 'Voltar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
    },
    home: {
      title: 'Olá, mundo!',
      sendEth: 'Enviar 0.0001 ETH para si mesmo',
      transactionSuccess: 'Transação bem-sucedida',
      transactionFailed: 'Falha na transação',
      notConnected: 'Por favor, conecte sua carteira',
      insufficientBalance: 'Por favor, conecte-se com uma conta que tenha um pouco de ETH',
    },
    wallet: {
      title: 'Bem-vindo ao Assinador de Mensagens',
      description: 'Assine e verifique mensagens Ethereum com segurança usando sua carteira',
      noWalletFound: 'Nenhuma carteira Ethereum encontrada',
      createWallet: 'Criar nova carteira Ethereum',
      regenerateWallet: 'Gerar nova carteira',
      flushDb: 'Limpar BD',
      yourAddress: 'Seu endereço de carteira Ethereum',
      messageToSign: 'Mensagem para assinar',
      enterMessage: 'Digite sua mensagem...',
      signMessage: 'Assinar mensagem',
      signature: 'Assinatura Ethereum',
      verifySignature: 'Verificar assinatura',
      verificationSuccess: 'A assinatura é válida e corresponde ao endereço da carteira atual',
      verificationFailed: 'A assinatura não corresponde ao endereço da carteira atual',
    },
    navigation: {
      newPage: 'Nova página',
      walletGenerator: 'Gerador de carteira',
      referral: 'Indicação',
    },
    newPage: {
      title: 'Bem-vindo à Nova Página',
      subtitle: 'Libere sua imaginação nesta nova página!',
      accountInfo: 'Informações da Conta',
      connectedAddress: 'Endereço conectado:',
      balance: 'Saldo:',
      connectWallet: 'Conecte sua carteira para começar',
      lastTransaction: 'Última transação:',
      backHome: 'Voltar para a Página Inicial',
    },
  },

  // Urdu
  ur: {
    common: {
      login: 'لاگ ان',
      logout: 'لاگ آؤٹ',
      back: 'واپس',
      loading: 'لوڈ ہو رہا ہے...',
      error: 'خرابی',
      success: 'کامیابی',
    },
    home: {
      title: 'ہیلو دنیا!',
      sendEth: 'خود کو 0.0001 ETH بھیجیں',
      transactionSuccess: 'لین دین کامیاب',
      transactionFailed: 'لین دین ناکام',
      notConnected: 'براہ کرم اپنا والیٹ منسلک کریں',
      insufficientBalance: 'براہ کرم ایسے اکاؤنٹ سے منسلک ہوں جس میں تھوڑا سا ETH ہو',
    },
    wallet: {
      title: 'میسج سائنر میں خوش آمدید',
      description: 'اپنے والیٹ سے محفوظ طریقے سے ایتھیریم پیغامات پر دستخط کریں اور تصدیق کریں',
      noWalletFound: 'کوئی ایتھیریم والیٹ نہیں ملا',
      createWallet: 'نیا ایتھیریم والیٹ بنائیں',
      regenerateWallet: 'نیا والیٹ بنائیں',
      flushDb: 'ڈیٹابیس خالی کریں',
      yourAddress: 'آپ کا ایتھیریم والیٹ ایڈریس',
      messageToSign: 'دستخط کرنے کے لیے پیغام',
      enterMessage: 'اپنا پیغام درج کریں...',
      signMessage: 'پیغام پر دستخط کریں',
      signature: 'ایتھیریم دستخط',
      verifySignature: 'دستخط کی تصدیق کریں',
      verificationSuccess: 'دستخط درست ہے اور موجودہ والیٹ ایڈریس سے مطابقت رکھتا ہے',
      verificationFailed: 'دستخط موجودہ والیٹ ایڈریس سے مطابقت نہیں رکھتا',
    },
    navigation: {
      newPage: 'نیا صفحہ',
      walletGenerator: 'والیٹ جنریٹر',
      referral: 'حوالہ',
    },
    newPage: {
      title: 'نئے صفحے میں خوش آمدید',
      subtitle: 'اس نئے صفحے پر اپنے تخیل کو آزاد کریں!',
      accountInfo: 'اکاؤنٹ کی معلومات',
      connectedAddress: 'منسلک ایڈریس:',
      balance: 'بیلنس:',
      connectWallet: 'شروع کرنے کے لیے اپنا والیٹ منسلک کریں',
      lastTransaction: 'آخری لین دین:',
      backHome: 'ہوم پیج پر واپس جائیں',
    },
  },
}

/**
 * Get translations for the current language
 * @param language Current language code
 * @returns Translation object for the specified language
 */
export function getTranslations(language: Language) {
  return translations[language]
}

/**
 * Hook to use translations in components
 * @param language Current language code
 * @returns Translation object for the specified language
 */
export function useTranslations(language: Language) {
  return translations[language]
}
