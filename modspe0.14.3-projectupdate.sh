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

echo "🔍 Checking repository for updates and verifying local mods..."

# جلب بيانات الـ Release بالكامل بصيغة JSON
RESPONSE=$(curl -s "$API_URL")

# التأكد من صحة الحصول على البيانات
if [ -z "$RESPONSE" ] || echo "$RESPONSE" | grep -q '"message": "Not Found"'; then
    echo "❌ Failed to reach release page or no mods available."
    exit 1
fi

# عدد التحديثات التي تمت
DOWNLOADED_COUNT=0

# استخراج كتل الـ assets وقراءتها عنصر بعنصر (الرابط، الاسم، وتاريخ التحديث)
echo "$RESPONSE" | grep -E '"name"|"browser_download_url"|"updated_at"' | while read -r line; do
    if echo "$line" | grep -q '"name":'; then
        file_name=$(echo "$line" | cut -d '"' -f 4)
    elif echo "$line" | grep -q '"updated_at":'; then
        remote_date=$(echo "$line" | cut -d '"' -f 4)
    elif echo "$line" | grep -q '"browser_download_url":'; then
        file_url=$(echo "$line" | cut -d '"' -f 4)

        local_file="$TARGET_DIR/$file_name"

        # تحويل تاريخ الملف على جيت هاب إلى صيغة ثواني لسهولة المقارنة
        remote_timestamp=$(date -d "$remote_date" +%s 2>/dev/null || date -D "%Y-%m-%dT%H:%M:%SZ" -d "$remote_date" +%s)

        NEEDS_UPDATE=false

        if [ ! -f "$local_file" ]; then
            echo "📥 New/Missing mod detected: $file_name"
            NEEDS_UPDATE=true
        else
            # جلب تاريخ المود المحلي
            local_timestamp=$(stat -c %Y "$local_file" 2>/dev/null || stat -f %m "$local_file")

            # إذا كان المود الموجود على المستودع أحدث من النسخة المحلية
            if [ "$remote_timestamp" -gt "$local_timestamp" ]; then
                echo "🔄 Update available for: $file_name (Removing old version...)"
                rm -f "$local_file"
                NEEDS_UPDATE=true
            fi
        fi

        # تنزيل النسخة الجديدة
        if [ "$NEEDS_UPDATE" = true ]; then
            echo "⬇️ Downloading latest version of: $file_name"
            curl -L -s "$file_url" -o "$local_file"
            
            # ضبط تاريخ تعديل الملف المحلي ليطابق تاريخ المود في جيت هاب
            touch -m -t $(date -d "@$remote_timestamp" +%Y%m%d%H%M.%S 2>/dev/null || date -r "$remote_timestamp" +%Y%m%d%H%M.%S) "$local_file" 2>/dev/null
            
            echo "$file_name" >> "$TARGET_DIR/.updated_tmp"
        fi
    fi
done

# حساب عدد التحديثات من الملف المؤقت
if [ -f "$TARGET_DIR/.updated_tmp" ]; then
    DOWNLOADED_COUNT=$(wc -l < "$TARGET_DIR/.updated_tmp")
    rm -f "$TARGET_DIR/.updated_tmp"
fi

# 4. النتيجة والإنهاء
if [ "$DOWNLOADED_COUNT" -eq 0 ]; then
    echo "✅ All local mods are up to date with the repository!"
else
    echo "🎉 Successfully deleted old versions and updated $DOWNLOADED_COUNT mod(s) in:"
    echo "$TARGET_DIR"
fi
