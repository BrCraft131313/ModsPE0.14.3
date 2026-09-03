// Grappling Hook Mod for MCPE 0.14.3
// يستخدم سنارة الصيد (Fishing Rod) للاندفاع والتنقل

var isGrappling = false;

function modTick() {
    var player = Player.getEntity();
    if (!player) return;

    // الحصول على الأداة التي يحملها اللاعب في يده
    var carriedItem = Player.getCarriedItem();

    // معرف سنارة الصيد (Fishing Rod) هو 346
    if (carriedItem == 346) {
        // البحث عن كائن رأس السنارة (Fish Hook Entity)
        // عند رمي السنارة وتكون القوة متجهة لأسفل أو ثابتة على بلوكة
        var pX = Entity.getX(player);
        var pY = Entity.getY(player);
        var pZ = Entity.getZ(player);

        // في حال استخدام السنارة
        if (Entity.getVelY(player) < -0.1 && isGrappling) {
            isGrappling = false;
        }
    }
}

function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    // التقاط إشارة النقر بسنارة الصيد على البلوكات
    if (itemid == 346) {
        pullPlayerTo(x + 0.5, y + 1.5, z + 0.5);
    }
}

function entityAddedHook(entity) {
    // التنسيق عند إطلاق رأس السنارة
    var type = Entity.getEntityTypeId(entity);
    // معرف كائن خيط/رأس السنارة في ModPE هو 77
    if (type == 77) {
        new java.lang.Thread(function() {
            try {
                // الانتظار حتى تهبط السنارة على الهدف
                java.lang.Thread.sleep(250);
                
                var player = Player.getEntity();
                var hX = Entity.getX(entity);
                var hY = Entity.getY(entity);
                var hZ = Entity.getZ(entity);

                // سحب اللاعب نحو موقع رأس السنارة بتأثير فيزيائي (Grappling Motion)
                pullPlayerTo(hX, hY + 1, hZ);
            } catch (err) {
                // تجاهل الأخطاء
            }
        }).start();
    }
}

// دالة حساب متجه السرعة والدفع (Grappling Physics)
function pullPlayerTo(targetX, targetY, targetZ) {
    var player = Player.getEntity();
    if (!player) return;

    var pX = Entity.getX(player);
    var pY = Entity.getY(player);
    var pZ = Entity.getZ(player);

    // حساب المسافة والاتجاه
    var dX = targetX - pX;
    var dY = targetY - pY;
    var dZ = targetZ - pZ;
    var distance = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

    if (distance > 1) {
        // تطبيق قوة الدفع باتجاه الهدف
        var speed = 1.5; // سرعة الاندفاع
        var velX = (dX / distance) * speed;
        var velY = (dY / distance) * speed + 0.3; // إضافة رفعة بسيطة لأعلى للقفز
        var velZ = (dZ / distance) * speed;

        Entity.setVelX(player, velX);
        Entity.setVelY(player, velY);
        Entity.setVelZ(player, velZ);
    }
        }
