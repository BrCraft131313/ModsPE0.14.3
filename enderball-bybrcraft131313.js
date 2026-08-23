// ==========================================
// ModPE Script: enderball-bybrcraft131313.js
// Minecraft PE 0.14.3
// ==========================================

// 1. دالة تعمل عند اصطدام أي مقذوف ببلوكة في العالم
function projectileHitBlockHook(entity, x, y, z, side) {
    // التحقق مما إذا كان المقذوف هو كرة ثلج (المعرف 81 الخاص بـ SNOWBALL Entity)
    if (Entity.getEntityTypeId(entity) == 81) {
        // جلب كائن اللاعب الحالي
        var player = Player.getEntity();
        
        // رفع مستوى الانتقال العمودي (Y + 2.0) لتفادي انغراس رأس اللاعب داخل البلوكة العلوية
        Entity.setPosition(player, x + 0.5, y + 2.0, z + 0.5);
        
        // تشغيل صوت الانتقال السريع (تيلبورت) في نقطة الوصول
        Level.playSound(x, y, z, "mob.endermen.portal", 1, 1);
    }
}

// 2. دالة تعمل عند اصطدام أي مقذوف بكائن آخر (مثل الحيوانات أو الوحوش)
function projectileHitEntityHook(entity, targetEntity) {
    // التحقق مما إذا كان المقذوف كرة ثلج
    if (Entity.getEntityTypeId(entity) == 81) {
        var player = Player.getEntity();
        
        // جلب إحداثيات الكائن الذي تم ضربه بالكرة
        var targetX = Entity.getX(targetEntity);
        var targetY = Entity.getY(targetEntity);
        var targetZ = Entity.getZ(targetEntity);
        
        // نقل اللاعب فوق الكائن المستهدف بمقدار 2 بلوكة لضمان عدم الاحتباس
        Entity.setPosition(player, targetX, targetY + 2.0, targetZ);
        
        // تشغيل صوت الانتقال السريع في الموقع الجديد
        Level.playSound(targetX, targetY, targetZ, "mob.endermen.portal", 1, 1);
    }
}

// 3. دالة إسقاط كرة الثلج عند موت الأندر مان
function deathHook(attacker, victim) {
    // المعرف 38 هو الخاص بالـ Enderman
    if (Entity.getEntityTypeId(victim) == 38) {
        // إلغاء إسقاط الموارد والخبرة الافتراضية
        preventDefault();
        
        // جلب إحداثيات موقع موت الأندر مان
        var x = Entity.getX(victim);
        var y = Entity.getY(victim);
        var z = Entity.getZ(victim);
        
        // حساب عدد عشوائي لكرات الثلج (إما 1 أو 2)
        var count = Math.floor(Math.random() * 2) + 1;
        
        // إسقاط كرة الثلج (Item ID: 332) في موقع الموت
        Level.dropItem(x, y + 0.5, z, 0.5, 332, count, 0);
    }
}