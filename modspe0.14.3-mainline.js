/* ==========================================================================
   المود: تطبيق تأثير الويذر عند الاقتراب من زهرة البوبي (Poppy)
   ========================================================================== */

var POPPY_ID = 38;         // معرف البلوك للزهرة الحمراء (Red Flower)
var WITHER_EFFECT_ID = 20; // معرف تأثير الويذر (Wither)

function modTick() {
    // الفحص كل 10 تيكس للتحسين وتقليل استهلاك الموارد
    if (Level.getTime() % 10 != 0) return;

    var player = Player.getEntity();
    var px = Math.floor(Entity.getX(player));
    var py = Math.floor(Entity.getY(player));
    var pz = Math.floor(Entity.getZ(player));

    var radius = 2; // نطاق القرب حول اللاعب (بلوكتين)
    var isNearPoppy = false;

    // فحص البلوكات المحيطة باللاعب
    for (var x = px - radius; x <= px + radius; x++) {
        for (var y = py - 1; y <= py + 2; y++) {
            for (var z = pz - radius; z <= pz + radius; z++) {
                
                // التحقق من وجود الزهرة وتأكيد القيمة الفرعية لزهرة البوبي (Data = 0)
                if (Level.getTile(x, y, z) == POPPY_ID && Level.getData(x, y, z) == 0) {
                    isNearPoppy = true;
                    break;
                }
            }
            if (isNearPoppy) break;
        }
        if (isNearPoppy) break;
    }

    // تطبيق التأثير عند القرب من الزهرة
    if (isNearPoppy) {
        // إضافة تأثير الويذر لمدة 5 ثوانٍ (100 تيكس) وبمستوى 1 (Amplifier = 0)
        Entity.addEffect(player, WITHER_EFFECT_ID, 100, 0, false, true);
    }
}
