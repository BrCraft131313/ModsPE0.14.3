// Car Minecart Mod - الاصدار المصلح 0.14.3
var RAIL_ID = 66;

function modTick() {
    var player = Player.getEntity();
    var cart = Entity.getRidingEntity ? Entity.getRidingEntity(player) : null;

    // البحث عن العربة التي يركبها اللاعب حالياً
    if (cart == null || cart == 0) {
        var entities = Entity.getAll();
        for (var i = 0; i < entities.length; i++) {
            if (Entity.getEntityTypeId(entities[i]) == 84) {
                var dx = Entity.getX(player) - Entity.getX(entities[i]);
                var dy = Entity.getY(player) - Entity.getY(entities[i]);
                var dz = Entity.getZ(player) - Entity.getZ(entities[i]);
                // فحص القرب الشديد لضمان أن اللاعب ركب العربة
                if (Math.abs(dx) < 0.8 && Math.abs(dz) < 0.8 && Math.abs(dy) < 1.2) {
                    cart = entities[i];
                    break;
                }
            }
        }
    }

    // التحريك فقط إذا كان اللاعب داخل العربة
    if (cart != null && cart != 0) {
        var yaw = Entity.getYaw(player);
        var rad = yaw * (Math.PI / 180);

        var pVx = Entity.getVelX(player);
        var pVz = Entity.getVelZ(player);

        // الحركة عند الضغط على أزرار الاتجاهات
        if (Math.abs(pVx) > 0.001 || Math.abs(pVz) > 0.001) {
            var speed = 0.35;
            var moveX = -Math.sin(rad) * speed;
            var moveZ = Math.cos(rad) * speed;

            var cx = Entity.getX(cart);
            var cy = Entity.getY(cart);
            var cz = Entity.getZ(cart);

            // وضع السكة تحت العربة فقط
            var tx = Math.floor(cx);
            var ty = Math.floor(cy - 0.5);
            var tz = Math.floor(cz);

            var tile = Level.getTile(tx, ty, tz);
            if (tile == 0 || tile == 31 || tile == 78) {
                Level.setTile(tx, ty, tz, RAIL_ID, 0);
            }

            // تطبيق الحركة على العربة
            Entity.setVelX(cart, moveX);
            Entity.setVelZ(cart, moveZ);
            Entity.setRot(cart, yaw, 0);
        }
    }
}
