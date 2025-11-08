# إعداد قاعدة البيانات - Database Setup

هذا الدليل يشرح كيفية إعداد التطبيق للعمل مع قاعدة البيانات المحلية والإنتاجية.

## المتطلبات

- PostgreSQL مثبت محلياً (للبيئة المحلية)
- قاعدة بيانات PostgreSQL على Clever Cloud (للإنتاج)

## إعداد ملفات البيئة

### 1. إنشاء ملف `.env.local` للبيئة المحلية

قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع وأضف التالي:

```env
# قاعدة البيانات المحلية
DATABASE_URL="postgresql://user:password@localhost:5432/gscapital?schema=public"

# قاعدة البيانات الإنتاجية (Clever Cloud) - اختياري
# يمكنك استخدام POSTGRESQL_ADDON_URI مباشرة في الإنتاج
DATABASE_URL_PRODUCTION="postgresql://ufcrm2axh4k3ebggotah:Zg5acDKbyfMKawsB3xUWqQ6Y210JEF@bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com:50013/bwvxuivwblvpdx6vselx"

# البيئة
NODE_ENV="development"

# إعدادات الخادم
PORT=3000
HOSTNAME=0.0.0.0
```

**ملاحظة:** استبدل `user` و `password` و `gscapital` بمعلومات قاعدة البيانات المحلية الخاصة بك.

### 2. إعداد قاعدة البيانات المحلية

إذا لم تكن لديك قاعدة بيانات محلية، قم بإنشائها:

```bash
# إنشاء قاعدة بيانات جديدة
createdb gscapital

# أو باستخدام psql
psql -U postgres
CREATE DATABASE gscapital;
```

### 3. تشغيل Migrations

بعد إعداد ملف `.env.local`، قم بتشغيل migrations:

```bash
# توليد Prisma Client
npm run db:generate

# تطبيق migrations على قاعدة البيانات المحلية
npm run db:migrate
```

## الإنتاج (Production)

### إعداد متغيرات البيئة في الخادم

عند النشر على الخادم (Clever Cloud أو أي منصة أخرى)، يمكنك استخدام أحد الخيارات التالية:

#### الخيار 1: استخدام POSTGRESQL_ADDON_URI (موصى به لـ Clever Cloud)

```env
NODE_ENV=production
POSTGRESQL_ADDON_URI="postgresql://ufcrm2axh4k3ebggotah:Zg5acDKbyfMKawsB3xUWqQ6Y210JEF@bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com:50013/bwvxuivwblvpdx6vselx"
```

#### الخيار 2: استخدام DATABASE_URL_PRODUCTION

```env
NODE_ENV=production
DATABASE_URL_PRODUCTION="postgresql://ufcrm2axh4k3ebggotah:Zg5acDKbyfMKawsB3xUWqQ6Y210JEF@bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com:50013/bwvxuivwblvpdx6vselx"
```

#### الخيار 3: استخدام DATABASE_URL مباشرة

```env
NODE_ENV=production
DATABASE_URL="postgresql://ufcrm2axh4k3ebggotah:Zg5acDKbyfMKawsB3xUWqQ6Y210JEF@bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com:50013/bwvxuivwblvpdx6vselx"
```

#### الخيار 4: استخدام المتغيرات المنفصلة (Clever Cloud)

إذا كانت منصة النشر توفر المتغيرات المنفصلة، يمكنك استخدامها:

```env
NODE_ENV=production
POSTGRESQL_ADDON_HOST="bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com"
POSTGRESQL_ADDON_DB="bwvxuivwblvpdx6vselx"
POSTGRESQL_ADDON_USER="ufcrm2axh4k3ebggotah"
POSTGRESQL_ADDON_PORT="50013"
POSTGRESQL_ADDON_PASSWORD="Zg5acDKbyfMKawsB3xUWqQ6Y210JEF"
POSTGRESQL_ADDON_URI="postgresql://ufcrm2axh4k3ebggotah:Zg5acDKbyfMKawsB3xUWqQ6Y210JEF@bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com:50013/bwvxuivwblvpdx6vselx"
```

### معلومات قاعدة البيانات Clever Cloud

- **Host:** bwvxuivwblvpdx6vselx-postgresql.services.clever-cloud.com
- **Database:** bwvxuivwblvpdx6vselx
- **User:** ufcrm2axh4k3ebggotah
- **Port:** 50013
- **Password:** Zg5acDKbyfMKawsB3xUWqQ6Y210JEF
- **Version:** PostgreSQL 15

## كيف يعمل التبديل التلقائي

التطبيق يختار قاعدة البيانات تلقائياً بناءً على `NODE_ENV`:

- **في التطوير (`NODE_ENV=development`):** يستخدم `DATABASE_URL` (قاعدة البيانات المحلية)

- **في الإنتاج (`NODE_ENV=production`):** يبحث عن قاعدة البيانات بالترتيب التالي:
  1. `POSTGRESQL_ADDON_URI` (لـ Clever Cloud)
  2. `DATABASE_URL_PRODUCTION` (مخصص)
  3. `DATABASE_URL` (الاحتياطي)

هذا يعني أن التطبيق سيعمل تلقائياً مع Clever Cloud إذا كانت متغيرات `POSTGRESQL_ADDON_*` معرّفة.

## الأوامر المفيدة

```bash
# تشغيل التطبيق في وضع التطوير
npm run dev

# بناء التطبيق للإنتاج
npm run build

# تشغيل التطبيق في وضع الإنتاج
npm run start

# تطبيق migrations
npm run db:migrate

# دفع التغييرات إلى قاعدة البيانات (بدون migrations)
npm run db:push

# توليد Prisma Client
npm run db:generate
```

## استكشاف الأخطاء

### خطأ: DATABASE_URL is not set

تأكد من وجود ملف `.env.local` في المجلد الرئيسي وأنه يحتوي على `DATABASE_URL`.

### خطأ: Cannot connect to database

1. تأكد من أن PostgreSQL يعمل محلياً
2. تحقق من صحة معلومات الاتصال في `DATABASE_URL`
3. تأكد من أن قاعدة البيانات موجودة

### خطأ في الإنتاج

1. تحقق من أن متغيرات البيئة معرّفة في الخادم
2. تأكد من أن قاعدة البيانات Clever Cloud قابلة للوصول من عنوان IP الخادم
3. تحقق من صحة معلومات الاتصال

