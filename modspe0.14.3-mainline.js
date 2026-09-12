// ================================================
// ModPE Script: Companion Dog Challenge
// Target: Minecraft PE 0.14.3 / BlockLauncher
// ================================================

// متغيرات حفظ حالة الكلب وإحداثيات الجلوس
var dogEntity = null;
var isDogSitting = false;
var sitX = 0;
var sitY = 0;
var sitZ = 0;

// دالة newLevel لضمان تنفيذ الترسبن فور إكتمال تحميل العالم
function newLevel() {
    isDogSitting = false;

    var px = getPlayerX();
    var py = getPlayerY();
    var pz = getPlayerZ();

    // إعطاء اللاعب عصا الجلوس (ID: 280) عند الدخول
    Player.addItemInventory(280, 1, 0);
    clientMessage("§b[Companion Mod] §aYou received the Sit Stick! Your companion is here.");

    // ترسبن الذئب بشكل صحيح باستخدام Level.spawnMob لمنع خطأ ReferenceError
    // تم رفع الإحداثي Y بمقدار 1 لمنع اختناقه داخل الأرض
    dogEntity = Level.spawnMob(px + 1, py + 1, pz + 1, 14);

    if (dogEntity != null) {
        Entity.setHealth(dogEntity, 20);
    }
}

// التحديث المستمر لمتابعة حالة الكلب وتثبيته عند الجلوس
function modTick() {
    if (dogEntity != null) {
        // التحقق من موت الكلب وخروج اللاعب من العالم فوراً
        if (Entity.getHealth(dogEntity) <= 0) {
            clientMessage("§c[Companion Mod] §4Your companion died! Leaving the world...");
            dogEntity = null;
            ModPE.leaveGame();
            return;
        }

        // تثبيت إحداثيات الكلب بالكامل ومنع حركته أثناء وضع الجلوس
        if (isDogSitting) {
            Entity.setPosition(dogEntity, sitX, sitY, sitZ);
            Entity.setVelX(dogEntity, 0);
            Entity.setVelY(dogEntity, 0);
            Entity.setVelZ(dogEntity, 0);
        }
    }
}

// دالة استخدام العنصر (الضغط على البلوكة بالعصا)
function useItem(x, y, z, itemId, blockId, side) {
    // التحقق من أن العنصر المستعمل هو عصا Sit Stick (ID 280)
    if (itemId == 280) {
        preventDefault();

        if (dogEntity != null && Entity.getHealth(dogEntity) > 0) {
            if (!isDogSitting) {
                // تفعيل وضع الجلوس وحفظ إحداثيات البلوكة
                isDogSitting = true;

                sitX = x + 0.5;
                sitY = y + 1.0;
                sitZ = z + 0.5;

                Entity.setPosition(dogEntity, sitX, sitY, sitZ);
                clientMessage("Sit: §2ON!");
            } else {
                // إلغاء وضع الجلوس ليعود للتبعية
                isDogSitting = false;
                clientMessage("Sit: §4OFF!");
            }
        } else {
            clientMessage("§cNo companion available!");
        }
    }
}
