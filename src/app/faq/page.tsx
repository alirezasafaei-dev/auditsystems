import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seoMeta'

export const metadata: Metadata = buildPageMetadata({
  locale: 'fa',
  path: '/faq',
  title: 'سوالات متداول - پاسخ به سوالات رایج',
  description: 'پاسخ به سوالات رایج درباره چک کردن سایت، مشکلات رایج و راه حل‌ها',
})

const faqs = [
  {
    q: 'این سایت چه کاری انجام می‌دهد؟',
    a: 'ما سایت شما را بررسی می‌کنیم و مشکلاتی که باعث کند شدن، پایین آمدن در گوگل یا مشکلات امنیتی می‌شود را پیدا می‌کنیم. بعد به شما می‌گوییم چطور این مشکلات را حل کنید.',
  },
  {
    q: 'من چیزی از برنامه‌نویسی نمی‌دانم، می‌توانم استفاده کنم؟',
    a: 'بله! گزارش ما به زبان ساده نوشته شده. اگر برنامه‌نویس دارید، می‌توانید گزارش را به او بدهید. اگر ندارید، ما راهنمایی می‌کنیم که چه کسی می‌تواند کمک کند.',
  },
  {
    q: 'سئو چیست؟',
    a: 'سئو یعنی کاری کنیم که وقتی کسی در گوگل چیزی جستجو می‌کند، سایت شما را ببیند. مثلاً اگر فروشگاه کفش دارید، وقتی کسی "خرید کفش" می‌نویسد، سایت شما بالای نتایج گوگل باشد.',
  },
  {
    q: 'چرا سایت من کند است؟',
    a: 'دلایل زیادی دارد: عکس‌های خیلی بزرگ، کدهای اضافی، سرور ضعیف یا مشکلات دیگر. ما همه این‌ها را چک می‌کنیم و دقیقاً می‌گوییم کدام یکی مشکل شماست.',
  },
  {
    q: 'چقدر طول می‌کشد تا گزارش آماده شود؟',
    a: 'معمولاً چند دقیقه. بعد از اینکه آدرس سایت را وارد کنید، سیستم ما شروع به بررسی می‌کند و گزارش را برای شما می‌فرستد.',
  },
  {
    q: 'گزارش شما چه چیزهایی را نشان می‌دهد؟',
    a: 'مشکلات سایت را به سه دسته تقسیم می‌کنیم: فوری (باید الان حل شود)، مهم (باید زود حل شود) و معمولی (می‌توان بعداً حل کرد). برای هر مشکل، راه حل گام به گام می‌دهیم.',
  },
  {
    q: 'آیا امن است؟',
    a: 'بله. ما فقط سایت شما را از بیرون نگاه می‌کنیم، مثل یک بازدیدکننده عادی. به اطلاعات خصوصی یا پنل مدیریت شما دسترسی نداریم.',
  },
  {
    q: 'اگر سوالی داشتم چطور بپرسم؟',
    a: 'می‌توانید از طریق تلگرام یا ایمیل با ما تماس بگیرید. لینک‌ها در پایین صفحه هست.',
  },
]

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← بازگشت به صفحه اصلی
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">سوالات متداول</h1>
      <p className="text-lg text-gray-600 mb-12">
        پاسخ به سوالاتی که معمولاً از ما می‌پرسند
      </p>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-gray-900">{faq.q}</h2>
            <p className="text-gray-700 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-bold mb-3">سوال دیگری دارید؟</h3>
        <p className="mb-4">
          اگر پاسخ سوال خود را پیدا نکردید، می‌توانید با ما تماس بگیرید.
        </p>
        <Link
          href="https://alirezasafaeisystems.ir/?utm_source=audit&utm_medium=faq&utm_campaign=contact"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          تماس با ما
        </Link>
      </div>
    </main>
  )
}
