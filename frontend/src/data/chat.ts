import type { Locale } from "@/lib/i18n";

export type QA = { q: string; a: string; k: string[] };

// ✏️ پاسخ‌ها عمومی و صادقانه نوشته شده‌اند (چون قیمت/ارسال/گارانتی به منطقه بستگی دارد).
// وقتی سیاست‌های واقعی فروشگاه مشخص شد، همین متن‌ها رو ویرایش کن.
export const CHAT_TEXT = {
  en: {
    title: "LUXORA Beauty Assistant", online: "Online now", placeholder: "Type your question…", send: "Send",
    open: "Open chat", close: "Close chat", social: "Contact us",
    welcome: "Hi, I'm your LUXORA beauty assistant. Ask me about styling tools, makeup, skincare, shipping or your order.",
    fallback: "I couldn't find an exact answer, but our team is happy to help personally. Message us on WhatsApp or call us.",
    suggestions: "Popular questions", typing: "Typing…", wa: "Chat on WhatsApp", call: "Call us",
  },
  fa: {
    title: "مشاور زیبایی LUXORA", online: "آنلاین", placeholder: "سؤالت را بنویس…", send: "ارسال",
    open: "باز کردن چت", close: "بستن چت", social: "ارتباط با ما",
    welcome: "سلام، من مشاور زیبایی LUXORA هستم. درباره ابزار حالت‌دهی مو، آرایش، مراقبت از پوست، ارسال یا سفارشت بپرس.",
    fallback: "پاسخ دقیقی پیدا نکردم، ولی تیم ما با کمال میل شخصاً کمکت می‌کند. در واتساپ پیام بده یا تماس بگیر.",
    suggestions: "سؤال‌های پرتکرار", typing: "در حال نوشتن…", wa: "گفتگو در واتساپ", call: "تماس با ما",
  },
} as const;

export const QUICK: Record<Locale, number[]> = { en: [2, 8, 16, 19, 20, 30], fa: [2, 8, 16, 19, 20, 30] };

const en: QA[] = [
  { q: "Hello", a: "Hello and welcome to LUXORA! How can I help you look and feel your best today?", k: ["hello", "hi", "hey", "good morning", "good evening"] },
  { q: "What is LUXORA?", a: "LUXORA is a beauty destination for women: premium hair styling technology, makeup, skincare and fragrance from recognized brands, presented with a refined shopping experience.", k: ["what is luxora", "about luxora", "who are you", "about you", "your store"] },
  { q: "What do you sell?", a: "Our collection covers hair tools (multi-stylers, dryers, straighteners, curlers, brushes), makeup, skincare, fragrance, body care and hair care.", k: ["what do you sell", "products", "collection", "catalog", "categories", "what do you have"] },
  { q: "Which hair tools do you have?", a: "You'll find multi-stylers, hair dryers, straighteners, curling tools, brushes and accessories. Open Shop > Hair Tools in the menu to explore them.", k: ["hair tools", "styling tools", "hair tool", "hair devices"] },
  { q: "What is a multi-styler?", a: "A multi-styler is one device with interchangeable attachments, so you can curl, add volume, smooth and dry with a single tool. That's the idea behind 'One Tool. Endless Looks.'", k: ["multi styler", "multistyler", "multi-styler", "airwrap", "attachments"] },
  { q: "How do I choose a hair dryer?", a: "Think about your hair type, how much time you have and the finish you love. Look for adjustable heat and speed settings and a nozzle for smooth, controlled styling.", k: ["hair dryer", "blow dryer", "dryer", "choose dryer"] },
  { q: "Straightener or curler: which is for me?", a: "Choose a straightener for sleek, glossy finishes and a curling tool for defined waves and curls. Many modern stylers can do both.", k: ["straightener", "flat iron", "curler", "curling", "curl iron"] },
  { q: "Which tool suits my hair type?", a: "Fine hair loves lower heat and light volume tools. Thick hair benefits from powerful dryers and wide barrels. Curly hair does well with diffusers and gentle heat. Tell me your hair type and I'll guide you.", k: ["hair type", "which tool", "suits my hair", "my hair"] },
  { q: "Do you have makeup?", a: "Yes. Explore lipstick, foundation, mascara, eyeshadow palettes, blush, highlighters and brushes from the Makeup column of the Shop menu.", k: ["makeup", "make up", "cosmetics", "lipstick", "mascara", "foundation", "eyeshadow"] },
  { q: "Do you have skincare?", a: "Yes: face creams, serums, cleansers, toners, sunscreen and masks. Choose products that match your skin type and always patch-test new ones.", k: ["skincare", "skin care", "face cream", "serum", "moisturizer", "sunscreen", "cleanser"] },
  { q: "Do you sell perfume?", a: "Yes. You'll find women's perfumes and body mists in the Fragrance & Body section.", k: ["perfume", "fragrance", "scent", "body mist", "cologne"] },
  { q: "Which brands do you carry?", a: "We feature recognized names in hair and beauty. See the Brands page and the brand rail at the bottom of every page for the full list.", k: ["brands", "brand", "which brands", "labels"] },
  { q: "Are your products authentic?", a: "LUXORA is built around recognized brands and genuine products. Check each product page for brand and sourcing details.", k: ["authentic", "original", "genuine", "fake", "real products"] },
  { q: "How much do products cost?", a: "Prices are shown on each product page and depend on the brand and your region. This website is currently a preview, so final prices appear when the store opens.", k: ["price", "cost", "how much", "expensive", "cheap"] },
  { q: "Do you have discounts or coupons?", a: "Offers and coupon codes will be announced on the website and our social pages. Follow us on Instagram so you don't miss them.", k: ["discount", "coupon", "promo", "offer", "sale", "code"] },
  { q: "Which payment methods are accepted?", a: "Payment options depend on your region and will be shown at checkout.", k: ["payment", "pay", "credit card", "card", "paypal", "cash"] },
  { q: "How long does delivery take?", a: "Delivery time depends on your region and the shipping method you select. An estimate is shown at checkout.", k: ["delivery time", "how long", "when arrive", "shipping time", "arrive"] },
  { q: "How much is shipping?", a: "Shipping cost depends on your region, weight and speed. You'll see the exact amount before paying.", k: ["shipping cost", "shipping fee", "delivery fee", "free shipping", "shipping price"] },
  { q: "Do you ship internationally?", a: "Shipping availability depends on your region. Enter your address at checkout to see the options available to you.", k: ["international", "worldwide", "abroad", "overseas", "other countries"] },
  { q: "How can I track my order?", a: "When your order ships, tracking details are sent to you. Use them to follow your parcel. Need help? Contact us with your order number.", k: ["track", "tracking", "where is my order", "order status"] },
  { q: "What is your return policy?", a: "Conditions, timeframes and eligibility are described in our Returns & Refunds policy. Hygiene-sensitive items such as makeup may have special rules.", k: ["return", "refund", "money back", "send back"] },
  { q: "Can I exchange a product?", a: "Exchange options depend on the product and condition. Contact support with your order number and we'll guide you.", k: ["exchange", "swap", "replace", "wrong item", "damaged"] },
  { q: "Is there a warranty?", a: "Warranty coverage varies by brand, product and purchase location. Please check the product details before buying.", k: ["warranty", "guarantee", "repair", "broken"] },
  { q: "Can I cancel my order?", a: "Contact us as soon as possible with your order number. If the order hasn't shipped yet, we'll do our best to help.", k: ["cancel", "cancellation", "stop my order"] },
  { q: "Can I change my delivery address?", a: "Send us your order number and the new address quickly. We can update it if the order has not been shipped.", k: ["change address", "wrong address", "new address", "update address"] },
  { q: "A product is out of stock. What now?", a: "Popular items sell out fast. Use the 'Availability' filter and check back soon, or contact us to ask about restocking.", k: ["out of stock", "restock", "unavailable", "sold out", "back in stock"] },
  { q: "Do you have gift sets?", a: "Yes. Look for Gift Sets in the filters. They make a beautiful present for birthdays, anniversaries and special days.", k: ["gift", "gift set", "present", "birthday", "anniversary"] },
  { q: "Do you offer gift wrapping?", a: "Gift options will be offered at checkout where available. Ask our team for details.", k: ["gift wrap", "wrapping", "gift box", "ribbon"] },
  { q: "How do I create an account?", a: "Customer accounts will be available when the store opens. Until then you can browse freely and contact us for help.", k: ["account", "sign up", "register", "create account", "login", "log in"] },
  { q: "I forgot my password", a: "Once accounts are live you'll be able to reset your password by email. For now, contact support if you need help.", k: ["password", "forgot", "reset"] },
  { q: "How can I reach customer support?", a: "Use the chat, the Contact page, WhatsApp, Telegram, Instagram or the phone number in the footer.", k: ["support", "customer service", "contact", "help", "talk to human", "agent"] },
  { q: "What are your working hours?", a: "Our team answers messages every day. Reply times may vary on holidays. Leave your message and we'll get back to you.", k: ["hours", "working hours", "open", "when are you open", "time"] },
  { q: "What is your phone number?", a: "You can find our phone number in the website footer and in the contact buttons next to this chat.", k: ["phone", "phone number", "call", "telephone", "number"] },
  { q: "Where can I find you on Instagram?", a: "Tap the Instagram button next to this chat or in the footer for new arrivals, styling inspiration and offers.", k: ["instagram", "insta", "ig"] },
  { q: "Do you have a Telegram channel?", a: "Yes. Use the Telegram button next to this chat or in the footer to join and message us.", k: ["telegram", "channel"] },
  { q: "Can I message you on WhatsApp?", a: "Of course. Tap the WhatsApp button next to this chat to start a conversation with our team.", k: ["whatsapp", "whats app", "wa"] },
  { q: "Are you on LinkedIn?", a: "Yes. Tap the LinkedIn button next to this chat or in the footer to follow our company page.", k: ["linkedin", "business", "career", "jobs"] },
  { q: "Which languages are supported?", a: "The website is available in English and Persian (فارسی). Use the language button in the header to switch.", k: ["language", "persian", "farsi", "english", "translate"] },
  { q: "How do I switch to dark mode?", a: "Use the sun/moon button in the header. Light mode is soft pink and dark mode is elegant black and gold.", k: ["dark mode", "dark theme", "light mode", "theme", "night"] },
  { q: "Is my payment information safe?", a: "Payments will go through secure, recognized payment providers. We never ask for card details in chat or messages.", k: ["safe", "secure", "security", "privacy", "data"] },
  { q: "Voltage and plug type of hair tools?", a: "Voltage and plug type depend on the model and regional version. Check the product specifications before buying.", k: ["voltage", "plug", "adapter", "power", "watt"] },
  { q: "How should I protect my hair from heat?", a: "Use a heat protectant, start with a lower temperature, avoid repeating passes over the same section and give your hair regular conditioning treatments.", k: ["heat protect", "damage", "damaged hair", "heat damage", "protect hair"] },
  { q: "Tips for curly hair?", a: "Curly hair loves moisture. Use a diffuser on low heat, detangle gently and finish with a lightweight oil or serum for shine.", k: ["curly", "waves", "wavy", "curls"] },
  { q: "Tips for fine, thin hair?", a: "Choose lightweight products, medium heat and volumizing attachments. Dry roots first to lift them.", k: ["fine hair", "thin hair", "volume", "flat hair", "volumizing"] },
  { q: "Tips for thick hair?", a: "Section your hair, use higher airflow and a smoothing brush, and finish with a nourishing serum for a polished look.", k: ["thick hair", "frizz", "frizzy", "smooth", "unruly"] },
  { q: "How do I clean my styling tool?", a: "Unplug and let it cool. Clean removable filters gently as the manufacturer recommends and wipe the surface with a soft dry cloth.", k: ["clean", "cleaning", "filter", "maintenance", "care for tool"] },
  { q: "Do you work with partners or wholesale?", a: "We welcome brand and business partnerships. Contact us on LinkedIn or through the Contact page.", k: ["wholesale", "partner", "partnership", "collaborate", "collaboration", "sponsor"] },
  { q: "Can I get news and offers?", a: "Follow our Instagram and Telegram for news, new arrivals and offers. A newsletter will join them soon.", k: ["newsletter", "news", "subscribe", "updates"] },
  { q: "How do I use the attachments?", a: "Switch off and let the tool cool, then click your chosen attachment into place. Curling barrels shape waves, round brushes add volume and smoothing brushes give a sleek finish. Always follow the manufacturer's manual.", k: ["how to use", "use attachment", "how do i use", "instructions", "manual", "tutorial"] },
  { q: "Thank you!", a: "You're so welcome! Wishing you a beautiful day. I'm here whenever you need me.", k: ["thanks", "thank you", "thx", "bye", "goodbye", "great"] },
];

const fa: QA[] = [
  { q: "سلام", a: "سلام و به LUXORA خوش اومدی! چطور می‌تونم کمکت کنم بهترین نسخه‌ی خودت باشی؟", k: ["سلام", "درود", "hi", "hello", "وقت بخیر", "صبح بخیر", "عصر بخیر"] },
  { q: "LUXORA چیه؟", a: "LUXORA مقصد زیبایی بانوان است: فناوری حرفه‌ای حالت‌دهی مو، آرایش، مراقبت از پوست و عطر از برندهای شناخته‌شده، با تجربه‌ای شیک از خرید.", k: ["لوکسورا", "luxora", "درباره", "شما کی", "کی هستید", "فروشگاه شما"] },
  { q: "چه محصولاتی دارید؟", a: "مجموعه‌ی ما شامل ابزار مو (مولتی‌استایلر، سشوار، اتو، فر، برس)، آرایش، مراقبت از پوست، عطر، مراقبت از بدن و مراقبت از مو است.", k: ["چه محصولاتی", "محصولات", "کلکسیون", "دسته", "چی دارید", "چی میفروشید", "کاتالوگ"] },
  { q: "چه ابزارهای مویی دارید؟", a: "مولتی‌استایلر، سشوار، اتو مو، ابزار فر، برس و لوازم جانبی. از منوی فروشگاه > ابزار حالت‌دهی مو ببینشون.", k: ["ابزار مو", "ابزار حالت", "وسایل مو", "دستگاه مو"] },
  { q: "مولتی‌استایلر چیه؟", a: "مولتی‌استایلر یک دستگاه با سرپیچ‌های قابل تعویض است؛ با یک ابزار می‌تونی فر کنی، حجم بدی، صاف کنی و خشک کنی. ایده‌ی «یک ابزار؛ استایل‌های بی‌پایان» همین است.", k: ["مولتی", "استایلر", "ایرراپ", "سرپیچ", "سرپیچ ها", "multi"] },
  { q: "سشوار رو چطور انتخاب کنم؟", a: "نوع مو، زمانی که داری و حالتی که دوست داری رو در نظر بگیر. دنبال تنظیم حرارت و سرعت و یک نازل برای حالت‌دهی صاف و کنترل‌شده باش.", k: ["سشوار", "انتخاب سشوار", "سشوار خوب", "سشوار مناسب"] },
  { q: "اتو مو یا ابزار فر؟", a: "اتو مو برای حالت صاف و براق است و ابزار فر برای موج و فر مشخص. خیلی از استایلرهای مدرن هر دو کار را انجام می‌دهند.", k: ["اتو", "اتو مو", "فر", "فر کن", "ابزار فر", "حالت دهنده", "بیگودی"] },
  { q: "کدوم ابزار برای موی من مناسبه؟", a: "موی نازک حرارت کمتر و ابزار حجم‌دهنده سبک می‌خواهد. موی ضخیم از سشوار قوی و بشکه‌ی پهن‌تر سود می‌برد. موی فر با دیفیوزر و حرارت ملایم عالی می‌شود. نوع موت رو بگو تا راهنماییت کنم.", k: ["نوع مو", "کدوم ابزار", "مناسب موی من", "موی من"] },
  { q: "آرایش هم دارید؟", a: "بله. رژ لب، کرم پودر، ریمل، پالت سایه، رژگونه، هایلایتر و براش رو از ستون آرایش منوی فروشگاه ببین.", k: ["آرایش", "لوازم آرایش", "رژ لب", "رژ", "ریمل", "کرم پودر", "سایه", "آرایشی"] },
  { q: "محصولات مراقبت از پوست دارید؟", a: "بله: کرم صورت، سرم، پاک‌کننده، تونر، ضدآفتاب و ماسک. محصول مناسب نوع پوستت رو انتخاب کن و محصول جدید رو اول تست کن.", k: ["پوست", "کرم صورت", "کرم", "سرم", "مرطوب کننده", "ضدآفتاب", "پاک کننده", "مراقبت پوست"] },
  { q: "عطر هم میفروشید؟", a: "بله. عطر زنانه و بادی میست رو در بخش عطر و بدن پیدا می‌کنی.", k: ["عطر", "ادکلن", "بوی", "بادی میست", "خوشبو"] },
  { q: "چه برندهایی دارید؟", a: "برندهای شناخته‌شده‌ی مو و زیبایی. صفحه‌ی برندها و ریل برندهای پایین هر صفحه رو ببین.", k: ["برند", "برندها", "چه برندی", "مارک"] },
  { q: "محصولات اصل هستند؟", a: "LUXORA بر پایه‌ی برندهای شناخته‌شده و محصولات اصل ساخته شده است. جزئیات برند و تأمین هر محصول در صفحه‌ی همان محصول آمده.", k: ["اصل", "اورجینال", "اصالت", "تقلبی", "فیک", "اورجینال هست"] },
  { q: "قیمت محصولات چقدره؟", a: "قیمت هر محصول در صفحه‌ی همان محصول است و به برند و منطقه بستگی دارد. این وب‌سایت فعلاً پیش‌نمایش است و قیمت نهایی با بازشدن فروشگاه نمایش داده می‌شود.", k: ["قیمت", "چنده", "چقدره", "هزینه محصول", "گرون", "ارزون", "قیمت ها"] },
  { q: "تخفیف یا کد تخفیف دارید؟", a: "پیشنهادها و کدهای تخفیف در سایت و صفحات اجتماعی اعلام می‌شود. ما را در اینستاگرام دنبال کن تا از دستشان ندهی.", k: ["تخفیف", "کد تخفیف", "کوپن", "حراج", "پیشنهاد ویژه", "ارزان تر"] },
  { q: "روش‌های پرداخت چیه؟", a: "روش‌های پرداخت به منطقه‌ات بستگی دارد و هنگام تسویه حساب نمایش داده می‌شود.", k: ["پرداخت", "پرداخت کنم", "کارت", "درگاه", "نقدی", "اقساط", "روش پرداخت"] },
  { q: "ارسال چقدر طول می‌کشه؟", a: "زمان ارسال به منطقه و روش ارسال انتخابی بستگی دارد. تخمین آن هنگام تسویه حساب نمایش داده می‌شود.", k: ["زمان ارسال", "چقدر طول", "کی میرسه", "چند روزه", "تحویل", "زمان تحویل"] },
  { q: "هزینه‌ی ارسال چقدره؟", a: "هزینه‌ی ارسال به منطقه، وزن و سرعت ارسال بستگی دارد. مبلغ دقیق قبل از پرداخت نمایش داده می‌شود.", k: ["هزینه ارسال", "پست", "ارسال رایگان", "هزینه پست", "کرایه"] },
  { q: "به خارج از کشور هم ارسال می‌کنید؟", a: "امکان ارسال به منطقه‌ی شما بستگی دارد. آدرست رو هنگام تسویه حساب وارد کن تا گزینه‌های موجود را ببینی.", k: ["خارج", "بین المللی", "کشور دیگه", "خارج از کشور", "ارسال خارجی"] },
  { q: "چطور سفارشم رو پیگیری کنم؟", a: "وقتی سفارشت ارسال شد، کد پیگیری برایت فرستاده می‌شود. با آن بسته‌ات را دنبال کن. کمک خواستی با شماره سفارش پیام بده.", k: ["پیگیری", "کد رهگیری", "رهگیری", "سفارشم کجاست", "وضعیت سفارش"] },
  { q: "شرایط مرجوعی چیه؟", a: "شرایط، مهلت و صلاحیت مرجوعی در سیاست «بازگشت و استرداد» توضیح داده شده. کالاهای بهداشتی مثل آرایش ممکن است قوانین ویژه داشته باشند.", k: ["مرجوع", "بازگشت", "استرداد", "پس دادن", "برگشت وجه", "پس بدم"] },
  { q: "می‌تونم محصول رو تعویض کنم؟", a: "امکان تعویض به نوع و وضعیت محصول بستگی دارد. با شماره سفارش به پشتیبانی پیام بده تا راهنمایی‌ات کنیم.", k: ["تعویض", "عوض کنم", "اشتباهی", "خراب رسید", "آسیب دیده", "معیوب"] },
  { q: "گارانتی دارند؟", a: "گارانتی به برند، محصول و محل خرید بستگی دارد. لطفاً قبل از خرید جزئیات محصول را ببین.", k: ["گارانتی", "ضمانت", "تعمیر", "خراب شد", "خرابی"] },
  { q: "می‌تونم سفارشم رو لغو کنم؟", a: "هر چه زودتر با شماره سفارش با ما تماس بگیر. اگر هنوز ارسال نشده باشد، تلاش می‌کنیم کمک کنیم.", k: ["لغو", "کنسل", "انصراف", "کنسل کنم"] },
  { q: "می‌تونم آدرس تحویل رو عوض کنم؟", a: "شماره سفارش و آدرس جدید رو سریع برایمان بفرست. اگر سفارش هنوز ارسال نشده باشد، آدرس را اصلاح می‌کنیم.", k: ["تغییر آدرس", "آدرس اشتباه", "آدرس جدید", "آدرس عوض"] },
  { q: "محصول ناموجود شده؛ چه کنم؟", a: "محصولات محبوب زود تمام می‌شوند. از فیلتر «موجودی» استفاده کن و دوباره سر بزن، یا برای تأمین مجدد با ما در تماس باش.", k: ["ناموجود", "تموم شده", "موجود نیست", "موجود میشه", "تامین مجدد", "تمام شده"] },
  { q: "ست هدیه دارید؟", a: "بله. در فیلترها «ست‌های هدیه» را ببین. برای تولد، سالگرد و روزهای خاص هدیه‌ی قشنگی هستند.", k: ["هدیه", "ست هدیه", "کادو", "تولد", "سالگرد", "کادویی"] },
  { q: "بسته‌بندی کادویی دارید؟", a: "گزینه‌های هدیه در صورت امکان هنگام تسویه حساب ارائه می‌شود. جزئیات را از تیم ما بپرس.", k: ["بسته بندی", "کادو پیچ", "جعبه هدیه", "روبان", "کادوپیچی"] },
  { q: "چطور حساب کاربری بسازم؟", a: "حساب کاربری با بازشدن فروشگاه فعال می‌شود. تا آن موقع می‌تونی آزادانه ببینی و برای کمک با ما در تماس باشی.", k: ["حساب", "ثبت نام", "عضویت", "حساب کاربری", "ورود", "لاگین"] },
  { q: "رمز عبورم را فراموش کردم", a: "وقتی حساب‌ها فعال شد، می‌تونی رمزت را با ایمیل بازیابی کنی. فعلاً اگر کمک خواستی با پشتیبانی تماس بگیر.", k: ["رمز", "رمز عبور", "فراموش", "بازیابی", "پسورد"] },
  { q: "چطور با پشتیبانی تماس بگیرم؟", a: "از همین چت، صفحه‌ی تماس، واتساپ، تلگرام، اینستاگرام یا شماره‌ی تلفن فوتر استفاده کن.", k: ["پشتیبانی", "ارتباط", "تماس با شما", "کمک", "اپراتور", "مشاور انسانی"] },
  { q: "ساعت کاری شما چیه؟", a: "تیم ما هر روز به پیام‌ها پاسخ می‌دهد؛ زمان پاسخ در تعطیلات ممکن است متفاوت باشد. پیامت را بگذار تا جواب بدهیم.", k: ["ساعت کاری", "ساعت", "چه ساعتی", "باز هستید", "ساعت کار"] },
  { q: "شماره تلفن شما چیه؟", a: "شماره‌ی تلفن ما در فوتر سایت و دکمه‌های تماس کنار همین چت قرار دارد.", k: ["شماره تلفن", "تلفن", "شماره", "زنگ بزنم", "تماس تلفنی", "موبایل"] },
  { q: "اینستاگرام شما چیه؟", a: "دکمه‌ی اینستاگرام کنار این چت یا در فوتر را بزن؛ تازه‌ها، الهام استایل و پیشنهادها آنجاست.", k: ["اینستاگرام", "اینستا", "پیج"] },
  { q: "کانال تلگرام دارید؟", a: "بله. با دکمه‌ی تلگرام کنار این چت یا در فوتر عضو شو و پیام بده.", k: ["تلگرام", "کانال", "تلگرام شما"] },
  { q: "در واتساپ پیام بدم؟", a: "حتماً. دکمه‌ی واتساپ کنار این چت را بزن تا گفتگو با تیم ما شروع شود.", k: ["واتساپ", "واتس اپ", "واتس"] },
  { q: "لینکدین هم دارید؟", a: "بله. دکمه‌ی لینکدین کنار این چت یا فوتر را بزن و صفحه‌ی ما را دنبال کن.", k: ["لینکدین", "لینکداین", "کار", "همکاری شغلی", "استخدام"] },
  { q: "چه زبان‌هایی پشتیبانی می‌شود؟", a: "سایت به فارسی و انگلیسی در دسترس است. با دکمه‌ی زبان در هدر جابه‌جا شو.", k: ["زبان", "فارسی", "انگلیسی", "ترجمه"] },
  { q: "چطور حالت تیره را فعال کنم؟", a: "از دکمه‌ی خورشید/ماه در هدر استفاده کن. حالت روشن صورتی ملایم و حالت تیره مشکی و طلایی شیک است.", k: ["حالت تیره", "تم", "دارک", "شب", "حالت شب", "تم تیره"] },
  { q: "اطلاعات پرداختم امن است؟", a: "پرداخت‌ها از طریق درگاه‌های امن و شناخته‌شده انجام می‌شود. ما هرگز اطلاعات کارت را در چت یا پیام نمی‌خواهیم.", k: ["امن", "امنیت", "حریم خصوصی", "اطلاعات", "اعتماد"] },
  { q: "ولتاژ و نوع دوشاخه‌ی ابزارها؟", a: "ولتاژ و نوع دوشاخه به مدل و نسخه‌ی منطقه‌ای بستگی دارد. قبل از خرید مشخصات محصول را ببین.", k: ["ولتاژ", "دوشاخه", "برق", "وات", "مبدل"] },
  { q: "چطور از حرارت از مو محافظت کنم؟", a: "از محافظ حرارتی استفاده کن، با دمای کمتر شروع کن، چند بار روی یک بخش نکش و مرتب مو را تقویت کن.", k: ["محافظ حرارت", "آسیب", "موی آسیب دیده", "سوختگی مو", "حرارت", "خشک و شکننده"] },
  { q: "نکته برای موی فر؟", a: "موی فر عاشق رطوبت است. با دیفیوزر و حرارت کم خشک کن، آرام شانه بزن و برای براقی روغن یا سرم سبک بزن.", k: ["موی فر", "فر مو", "مو فر", "موج", "مواج", "کِرلی"] },
  { q: "نکته برای موی نازک؟", a: "محصولات سبک، حرارت متوسط و سرپیچ حجم‌دهنده انتخاب کن. ریشه‌ها را اول خشک کن تا بالا بیایند.", k: ["موی نازک", "نازک", "کم پشت", "حجم", "حجم دهنده", "ریزش"] },
  { q: "نکته برای موی ضخیم؟", a: "موها را بخش‌بندی کن، جریان هوای بیشتر و برس صاف‌کننده بزن و با سرم مغذی تمامش کن.", k: ["موی ضخیم", "ضخیم", "وز", "موی وزدار", "وز مو", "صاف کردن"] },
  { q: "ابزارم را چطور تمیز کنم؟", a: "به برق نزن و بگذار خنک شود. فیلترهای قابل جداشدن را طبق توصیه‌ی سازنده ملایم تمیز کن و سطح را با پارچه‌ی خشک نرم پاک کن.", k: ["تمیز", "تمیز کردن", "فیلتر", "نگهداری", "شستن"] },
  { q: "همکاری یا خرید عمده دارید؟", a: "از همکاری برندها و کسب‌وکارها استقبال می‌کنیم. از طریق لینکدین یا صفحه‌ی تماس با ما در ارتباط باش.", k: ["عمده", "همکاری", "نمایندگی", "اسپانسر", "پارتنر", "فروش عمده"] },
  { q: "خبر و پیشنهادها را کجا ببینم؟", a: "اینستاگرام و تلگرام ما را دنبال کن؛ خبرنامه هم به‌زودی اضافه می‌شود.", k: ["خبرنامه", "اخبار", "عضویت خبرنامه", "جدیدترین", "تازه ها"] },
  { q: "سرپیچ‌ها را چطور استفاده کنم؟", a: "دستگاه را خاموش کن و بگذار خنک شود، بعد سرپیچ دلخواه را جا بزن. بشکه‌ی فر موج می‌سازد، برس گرد حجم می‌دهد و برس صاف‌کننده حالت براق و مرتب. همیشه دفترچه‌ی سازنده را دنبال کن.", k: ["طرز استفاده", "چطور استفاده", "نحوه استفاده", "راهنما", "آموزش", "دفترچه"] },
  { q: "ممنون!", a: "خواهش می‌کنم! روز قشنگی داشته باشی. هر وقت لازم بود اینجام.", k: ["ممنون", "مرسی", "متشکر", "خداحافظ", "ممنونم", "دمت گرم", "عالی"] },
];

export const QA_DATA: Record<Locale, QA[]> = { en, fa };

const norm = (s: string) =>
  s.toLowerCase()
    .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[\u064B-\u065F\u0640]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

/** Returns the best matching answer or null. Longer keyword hits score higher. */
export function findAnswer(locale: Locale, text: string): QA | null {
  const t = ` ${norm(text)} `;
  if (t.trim().length < 2) return null;
  let best: QA | null = null, bestScore = 0;
  for (const qa of QA_DATA[locale]) {
    let score = 0;
    for (const raw of qa.k) {
      const k = norm(raw);
      if (k && t.includes(` ${k} `) ) score += 3 + k.length / 6;
      else if (k.length >= 4 && t.includes(k)) score += 1.5 + k.length / 10;
    }
    if (norm(qa.q) === norm(text)) score += 10;
    if (score > bestScore) { bestScore = score; best = qa; }
  }
  return bestScore >= 1.5 ? best : null;
}
