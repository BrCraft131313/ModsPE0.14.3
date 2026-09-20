// سكربت البيكون الزجاجي المخصص - ماينكرافت 0.14.3
// تم اختيار المعرف 210 لتجنب المعرفات المحجوزة ومعرف باب الجانقل 195

var BEACON_ID = 210;

// تعريف البلوك وشكله الخارجي بنسيج القزاز
Block.defineBlock(BEACON_ID, "Glass Beacon", [["glass", 0]], 20, false, 0);
Block.setDestroyTime(BEACON_ID, 1.0);

// دالة للتحقق من أن قاعدة 3x3 تحت البيكون مكونة من نفس نوع البلوك (9 بلوكات)
function checkPyramidBase(x, y, z, blockId) {
    for (var ix = x - 1; ix <= x + 1; ix++) {
        for (var iz = z - 1; iz <= z + 1; iz++) {
            if (Level.getTile(ix, y - 1, iz) != blockId) {
                return false;
            }
        }
    }
    return true;
}

// دالة إعطاء التأثيرات للاعب
function giveBeaconEffects(player, amplifier, durationTicks) {
    // قائمة التأثيرات: السرعة(1)، السرعة في الحفر(3)، القوة(5)، القفز العالي(8)، تجدد الصحة(10)، الحماية(11)
    var effects = [1, 3, 5, 8, 10, 11];
    for (var i = 0; i < effects.length; i++) {
        Entity.addEffect(player, effects[i], durationTicks, amplifier, false, true);
    }
}

// دالة التكرار لفحص وجود البيكون بالقرب من اللاعب
function modTick() {
    // تشغيل الفحص مرة واحدة كل ثانية (20 تاك) لتخفيف الحمل على اللعبة
    if (Level.getTime() % 20 != 0) return;

    var player = getPlayerEnt();
    var px = Math.floor(Entity.getX(player));
    var py = Math.floor(Entity.getY(player));
    var pz = Math.floor(Entity.getZ(player));

    var radius = 16;
    var activeTier = 0; // 1: حديد، 2: ذهب، 3: دايموند

    // مسح المنطقة المحيطة باللاعب بحثا عن البيكون
    for (var bx = px - radius; bx <= px + radius; bx++) {
        for (var by = py - 8; by <= py + 8; by++) {
            for (var bz = pz - radius; bz <= pz + radius; bz++) {
                if (Level.getTile(bx, by, bz) == BEACON_ID) {

                    // فحص قاعدة الدايموند (معرف 57) - المستوى الأعلى
                    if (checkPyramidBase(bx, by, bz, 57)) {
                        if (activeTier < 3) activeTier = 3;
                    }
                    // فحص قاعدة الذهب (معرف 41) - المستوى المتوسط
                    else if (checkPyramidBase(bx, by, bz, 41)) {
                        if (activeTier < 2) activeTier = 2;
                    }
                    // فحص قاعدة الحديد (معرف 42) - المستوى الأساسي
                    else if (checkPyramidBase(bx, by, bz, 42)) {
                        if (activeTier < 1) activeTier = 1;
                    }
                }
            }
        }
    }

    // تطبيق التأثيرات حسب أعلى مستوى تم العثور عليه
    if (activeTier == 1) {
        // قاعدة حديد: تأثيرات بمستوى 1 ولمدة 10 ثواني
        giveBeaconEffects(player, 0, 200);
    } else if (activeTier == 2) {
        // قاعدة ذهب: تأثيرات بمستوى 2 ولمدة 15 ثانية
        giveBeaconEffects(player, 1, 300);
    } else if (activeTier == 3) {
        // قاعدة دايموند: تأثيرات بمستوى 3 (الأعلى) ولمدة 20 ثانية
        giveBeaconEffects(player, 2, 400);
    }
}

// إشعار باللغة الإنجليزية عند وضع البلوك
function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    if (itemid == BEACON_ID) {
        clientMessage("Glass Beacon activated!");
    }
}
