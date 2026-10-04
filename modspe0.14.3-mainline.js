/* ==========================================================================
   المود: التخطي التلقائي لشاشة الموت (Skip Death Screen / Auto Respawn)
   ========================================================================== */

// متغيرات تخزين إحداثيات الرسبون
var defaultSpawnX = null;
var defaultSpawnY = null;
var defaultSpawnZ = null;

function modTick() {
    // التقاط موقع اللاعب الأولي كـ Spawn عند بدء تشغيل العالم
    if (defaultSpawnX === null) {
        var player = Player.getEntity();
        defaultSpawnX = Entity.getX(player);
        defaultSpawnY = Entity.getY(player);
        defaultSpawnZ = Entity.getZ(player);
    }
}

function entityHurtHook(attacker, victim, halfhearts) {
    var player = Player.getEntity();

    // التحقق من أن الكائن المتضرر هو اللاعب
    if (victim == player) {
        var currentHealth = Entity.getHealth(player);

        // إذا كان الضرر الموجه كافياً للقضاء على اللاعب
        if (currentHealth - halfhearts <= 0) {
            // إلغاء حدث الضرر الأصلي لمنع ظهور شاشة الموت الرسمية
            preventDefault();

            // استعادة صحة اللاعب بالكامل
            Entity.setHealth(player, 20);

            // تحديد موقع الإعادة (تُفضل متغيرات Checkpoint إذا كانت معرّفة)
            var targetX = (typeof lastSpawnX !== "undefined" && lastSpawnX !== null) ? lastSpawnX + 0.5 : defaultSpawnX;
            var targetY = (typeof lastSpawnY !== "undefined" && lastSpawnY !== null) ? lastSpawnY + 1 : defaultSpawnY;
            var targetZ = (typeof lastSpawnZ !== "undefined" && lastSpawnZ !== null) ? lastSpawnZ + 0.5 : defaultSpawnZ;

            // نقل اللاعب فوراً إلى نقطة الرسبون
            Entity.setPosition(player, targetX, targetY, targetZ);

            // إرسال رسالة توضيحية للاعب
            clientMessage("[Auto Respawn] Death screen skipped! Teleported to spawn point.");
        }
    }
}
