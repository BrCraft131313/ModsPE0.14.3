/*
 * اسم المود: Gravity & Tornado Wand
 * الإصدار المستهدف: MCPE 0.14.3
 * المعيار: MECANE
 */

// متغيرات حالة المود
var isTornadoActive = false;
var tornadoRadius = 8;
var liftForce = 0.35;

// الدالة الرئيسية المستدعات مع كل إطار زمن (Tick)
function modTick() {
    if (isTornadoActive) {
        var playerX = Player.getX();
        var playerY = Player.getY();
        var playerZ = Player.getZ();

        // جلب جميع الكيانات المجاورة
        var entities = Entity.getAll();
        for (var i = 0; i < entities.length; i++) {
            var ent = entities[i];
            
            // استثناء اللاعب نفسه من التأثير
            if (ent != Player.getEntity()) {
                var entX = Entity.getX(ent);
                var entY = Entity.getY(ent);
                var entZ = Entity.getZ(ent);

                // حساب المسافة بين الكيان واللاعب
                var dx = entX - playerX;
                var dz = entZ - playerZ;
                var distance = Math.sqrt(dx * dx + dz * dz);

                // تطبيق قوة الإعصار إذا كان الكيان ضمن النطاق
                if (distance <= tornadoRadius && distance > 0.5) {
                    var angle = Math.atan2(dz, dx) + 0.3; // زاوية الدوران الحلزوني
                    var newVelX = -Math.sin(angle) * 0.5;
                    var newVelZ = Math.cos(angle) * 0.5;

                    // تطبيق المتجهات لرسم حركة الإعصار
                    Entity.setVelX(ent, newVelX);
                    Entity.setVelY(ent, liftForce);
                    Entity.setVelZ(ent, newVelZ);
                }
            }
        }
    }
}

// استخدام عصا التحكم عند الضغط على الأرض
function useItem(x, y, z, itemId, blockId, side) {
    // باستخدام Stick (ID 280)
    if (itemId == 280) {
        isTornadoActive = !isTornadoActive;
        if (isTornadoActive) {
            clientMessage("[GravityMod] Tornado Field: ACTIVATED");
        } else {
            clientMessage("[GravityMod] Tornado Field: DEACTIVATED");
        }
    }
}
