// دالة تعمل عند اصطدام أي مقذوف ببلوكة في العالم
function projectileHitBlockHook(entity, x, y, z, side) {
    // التحقق مما إذا كان المقذوف هو كرة ثلج (المعرف 81 الخاص بـ SNOWBALL)
    if (Entity.getEntityTypeId(entity) == 81) {
        // جلب كائن اللاعب الحالي
        var player = Player.getEntity();
        
        // نقل اللاعب إلى موقع اصطدام الكرة (زيادة 1.5 على محور Y لمنع انغراس اللاعب داخل البلوكة)
        Entity.setPosition(player, x + 0.5, y + 1.5, z + 0.5);
        
        // تشغيل صوت الانتقال السريع (تيلبورت) في نقطة الوصول
        Level.playSound(x, y, z, "mob.endermen.portal", 1, 1);
    }
}

// دالة تعمل عند اصطدام أي مقذوف بكائن آخر (مثل الحيوانات أو الوحوش)
function projectileHitEntityHook(entity, targetEntity) {
    // التحقق مما إذا كان المقذوف كرة ثلج
    if (Entity.getEntityTypeId(entity) == 81) {
        var player = Player.getEntity();
        
        // جلب إحداثيات الكائن الذي تم ضربه بالكرة
        var targetX = Entity.getX(targetEntity);
        var targetY = Entity.getY(targetEntity);
        var targetZ = Entity.getZ(targetEntity);
        
        // نقل اللاعب فوراً إلى موقع الكائن المستهدف
        Entity.setPosition(player, targetX, targetY + 1, targetZ);
        
        // تشغيل صوت الانتقال السريع في الموقع الجديد
        Level.playSound(targetX, targetY, targetZ, "mob.endermen.portal", 1, 1);
    }
}
