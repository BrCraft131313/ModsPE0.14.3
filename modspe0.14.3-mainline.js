// ==========================================
// مود Spider Climb - التخطي الكامل للحافة (0.14.3)
// ==========================================

function modTick() {
    var player = Player.getEntity();
    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();
    var yaw = Entity.getYaw(player);

    var radians = yaw * Math.PI / 180;
    var dx = -Math.sin(radians);
    var dz = Math.cos(radians);

    // نقطة التحسس أمام اللاعب
    var checkX = Math.floor(px + (dx * 0.5));
    var checkY = Math.floor(py);
    var checkZ = Math.floor(pz + (dz * 0.5));

    var blockAtFeet = Level.getTile(checkX, checkY, checkZ);
    var blockAtHead = Level.getTile(checkX, checkY + 1, checkZ);

    if (Player.isFlying()) return;

    var velX = Entity.getVelX(player);
    var velZ = Entity.getVelZ(player);
    var isPushing = (Math.abs(velX) > 0.001 || Math.abs(velZ) > 0.001);

    if (isPushing) {
        // إذا كان هناك بلوك عند قدميك أو رأسك (جدار)
        if (blockAtFeet !== 0 || blockAtHead !== 0) {
            Entity.setVelY(player, 0.2); // رفع السرعة قليلاً للتغلب على احتكاك الحافة
            Entity.setVelX(player, dx * 0.15);
            Entity.setVelZ(player, dz * 0.15);
        }
        // إذا وصلت للحافة تماماً (البلوك تحت القدمين لكن لا يوجد بلوك أمام القدمين)
        else {
            var blockBelowFeet = Level.getTile(checkX, checkY - 1, checkZ);
            if (blockBelowFeet !== 0) {
                // إعطاء قفزة خفيفة ودفعة للأمام لتوضع فوق البلوكة
                Entity.setVelY(player, 0.25);
                Entity.setPosition(player, px + (dx * 0.1), py + 0.1, pz + (dz * 0.1));
            }
        }
    } else {
        // الثبات عند ترك أزرار الحركة
        if ((blockAtFeet !== 0 || blockAtHead !== 0) && Entity.getVelY(player) < 0) {
            Entity.setVelY(player, 0);
        }
    }
    }
