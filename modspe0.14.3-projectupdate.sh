#!/bin/bash

# 1. إعداد المسار المستهدف للحفظ
TARGET_DIR="/storage/emulated/0/ModsPE0.14.3"

# التحقق من وجود المسار وإذا لم يكن موجوداً يتم إنشاؤه تلقائياً
if [ ! -d "$TARGET_DIR" ]; then
    echo "📁 Target directory not found. Creating path: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# 2. رابط API الخاص بجيت هاب للـ Release
API_URL="https://api.github.com/repos/BrCraft131313/ModsPE0.14.3/releases/tags/Latest"

# ملف حفظ التخزين المؤقت للتحقق من آخر حالة
CACHE_FILE="$TARGET_DIR/.last_downloaded_mod"

echo "🔍 Checking repository and verifying local files..."

# جلب بيانات الـ Release باستخدام curl
RESPONSE=$(curl -s "$API_URL")

# استخراج جميع روابط تحميل المودات (Assets)
ALL_DOWNLOAD_URLS=$(echo "$RESPONSE" | grep -o '"browser_download_url": "[^"]*"' | cut -d '"' -f 4)

# التأكد من صحة الحصول على البيانات
if [ -z "$ALL_DOWNLOAD_URLS" ]; then
    echo "❌ Failed to reach release page or no mods available."
    exit 1
fi

# متغير لتتبع ما إذا تم تحميل أو استرجاع أي ملفات
DOWNLOADED_COUNT=0

# 3. فحص كل مود في الـ Release والتأكد من وجوده محلياً
for file_url in $ALL_DOWNLOAD_URLS; do
    file_name=$(basename "$file_url")
    local_file="$TARGET_DIR/$file_name"

    # إذا كان الملف غير موجود (سواء تم حذفه بالخطأ أو مود جديد تم إضافته)
    if [ ! -f "$local_file" ]; then
        echo "📥 Missing or deleted mod detected! Restoring/Downloading: $file_name"
        curl -L -s "$file_url" -o "$local_file"
        DOWNLOADED_COUNT=$((DOWNLOADED_COUNT + 1))
    fi
done

# 4. النتيجة والإنهاء
if [ $DOWNLOADED_COUNT -eq 0 ]; then
    echo "✅ All mods are intact and up to date. No missing files found."
else
    # تحديث الكاش باسم أحدث مود في القائمة
    LATEST_FILE_URL=$(echo "$ALL_DOWNLOAD_URLS" | tail -n 1)
    echo "$(basename "$LATEST_FILE_URL")" > "$CACHE_FILE"

    echo "🎉 Successfully restored/updated $DOWNLOADED_COUNT mod(s) in:"
    echo "$TARGET_DIR"
fi
