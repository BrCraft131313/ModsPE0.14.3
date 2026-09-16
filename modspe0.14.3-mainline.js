// ==========================================
// Slime Elevator & Space Mod - ModPE 0.14.3
// ==========================================

var isAscending = false;
var slimeX = 0, slimeY = 0, slimeZ = 0;
var moveTicks = 0;

// 1. فحص الهيكل: بلوكة سلايم محاطة بـ 8 بلوكات خشب
function isValidElevator(sx, sy, sz) {
    if (Level.getTile(sx, sy, sz) !== 165) return false; // 165: Slime Block

    for (var dx = -1; dx <= 1; dx++) {
        for (var dz = -1; dz <= 1; dz++) {
            if (dx === 0 && dz === 0) continue;
            var block = Level.getTile(sx + dx, sy, sz + dz);
            if (block !== 5 && block !== 17) return false; // 5: Planks, 17: Wood Log
        }
    }
    return true;
}

// 2. التفاعل مع الرافعة (Lever - ID 69)
function useItem(x, y, z, itemId, blockId, side, itemTile, itemTileData) {
    if (blockId === 69) {
        var foundSlime = false;

        // البحث عن السلايم الملاطق للرافعة
        for (var dx = -2; dx <= 2; dx++) {
            for (var dz = -2; dz <= 2; dz++) {
                for (var dy = -1; dy <= 1; dy++) {
                    var tx = x + dx;
                    var ty = y + dy;
                    var tz = z + dz;

                    if (isValidElevator(tx, ty, tz)) {
                        slimeX = tx;
                        slimeY = ty;
                        slimeZ = tz;
                        foundSlime = true;
                        break;
                    }
                }
                if (foundSlime) break;
            }
            if (foundSlime) break;
        }

        if (foundSlime) {
            var player = Player.getEntity();
            var px = Math.floor(Entity.getX(player));
            var py = Math.floor(Entity.getY(player));
            var pz = Math.floor(Entity.getZ(player));

            // التأكد من وقوف اللاعب على السلايم
            if (px === slimeX && pz === slimeZ && (py === slimeY + 1 || py === slimeY + 2)) {
                isAscending = true;
                clientMessage("[Elevator] Ascending to space...");
            } else {
                clientMessage("[Elevator] Stand on the Slime Block to activate!");
            }
        }
    }
}

// 3. حركة المصعد والتأكد من عدم السقوط
function modTick() {
    if (!isAscending) return;

    moveTicks++;
    if (moveTicks % 2 === 0) { // التحديث كل 2 Ticks لضمان سلاسة الحركة
        var player = Player.getEntity();

        // وضع خشب أسفل السلايم لمنع السقوط
        Level.setTile(slimeX, slimeY, slimeZ, 5);

        // رفع السلايم واللاعب Y+1
        slimeY++;
        Level.setTile(slimeX, slimeY, slimeZ, 165);
        Entity.setPosition(player, slimeX + 0.5, slimeY + 1.5, slimeZ + 0.5);

        // الوصول إلى الفضاء عند تجاوز ارتفاع 128
        if (slimeY >= 128) {
            isAscending = false;
            transportToSpace(player, slimeX, slimeZ);
        }
    }
}

// 4. بناء بيئة الفضاء وإعطاء التأثيرات
function transportToSpace(player, x, z) {
    var spaceY = 150; // ارتفاع المحطة الفضائية

    // بناء منصة فضائية من الأوبسيديان والزجاج
    for (var dx = -3; dx <= 3; dx++) {
        for (var dz = -3; dz <= 3; dz++) {
            if (Math.abs(dx) === 3 || Math.abs(dz) === 3) {
                Level.setTile(x + dx, spaceY, z + dz, 49); // Obsidian border
            } else {
                Level.setTile(x + dx, spaceY, z + dz, 20); // Glass platform
            }

            // تفريغ الهواء فوق المنصة
            for (var dy = 1; dy <= 4; dy++) {
                Level.setTile(x + dx, spaceY + dy, z + dz, 0);
            }
        }
    }

    // نقل اللاعب إلى المحطة الفضائية
    Entity.setPosition(player, x + 0.5, spaceY + 2, z + 0.5);

    // إضافة تأثير انعدام الجاذبية والحماية من السقوط
    Entity.addEffect(player, 8, 20 * 600, 4, false, false);  // Jump Boost V
    Entity.addEffect(player, 11, 20 * 600, 4, false, false); // Resistance V

    clientMessage("[Space] Welcome to Outer Space! Low gravity enabled.");
}

// 5. رسالة عند تحميل السكربت
function selectLevelHook() {
    clientMessage("[Elevator Mod] Slime Elevator & Space Mod loaded!");
                }
