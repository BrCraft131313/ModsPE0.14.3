/*
 * Mod Name     : Celebrity Companion Mod
 * Target Engine: MCPE 0.14.3 (Native ModPE Script)
 * Standard    : MECANE (Messages in English, Comments in Arabic, No Emojis)
 */

// ==========================================
// 1. المتغيرات العامة لإدارة التابعين
// ==========================================

var isCompanionActive = false;
var companionEntityId = 32; // زومبي افتراضياً
var triggerItemId = 264;    // دايموند افتراضياً
var companionQuantity = 3;  // العدد الافتراضي
var spawnedCompanions = [];

// ==========================================
// 2. معالجة أوامر الشات (/companion)
// ==========================================

function chatHook(str) {
    var args = str.trim().toLowerCase().split(" ");
    var cmd = args[0];

    if (cmd === "companion" || cmd === "/companion") {
        
        // أمر إيقاف وتشغيل التابعين
        if (args[1] === "clear" || args[1] === "off") {
            clearCompanions();
            isCompanionActive = false;
            clientMessage("§c[Companion] Companion mode disabled.");
            return;
        }

        // التحقق من صحة المدخلات: /companion <entityId> <itemId> <quantity>
        if (args.length < 4) {
            clientMessage("§e[Companion] Usage: /companion <entityId> <itemId> <quantity>");
            clientMessage("§e[Companion] Example: /companion 32 264 5");
            return;
        }

        companionEntityId = parseInt(args[1], 10);
        triggerItemId = parseInt(args[2], 10);
        companionQuantity = parseInt(args[3], 10);

        // وضع حد أقصى للحماية من الـ Lag
        if (isNaN(companionQuantity) || companionQuantity < 1) companionQuantity = 1;
        if (companionQuantity > 25) companionQuantity = 25;

        clearCompanions();
        isCompanionActive = true;

        clientMessage("§a[Companion] Mode activated! Hold Item ID " + triggerItemId + " to summon " + companionQuantity + " follower(s).");
    }
}

// ==========================================
// 3. التكرار الدوري لمتابعة اللاعب وحساب المتجهات
// ==========================================

function modTick() {
    if (!isCompanionActive) return;

    var currentItem = Player.getCarriedItem();

    // إذا كان اللاعب يمسك الأيتم المحدد في يده
    if (currentItem === triggerItemId) {
        
        // استدعاء التابعين عند عدم وجودهم
        if (spawnedCompanions.length === 0) {
            spawnCompanionsNearPlayer();
        }

        var px = Player.getX();
        var py = Player.getY();
        var pz = Player.getZ();

        for (var i = 0; i < spawnedCompanions.length; i++) {
            var ent = spawnedCompanions[i];

            // التحقق من أن الكائن ما زال حياً وموجوداً
            if (Entity.getX(ent) === undefined || Entity.getHealth(ent) <= 0) {
                continue;
            }

            var ex = Entity.getX(ent);
            var ey = Entity.getY(ent);
            var ez = Entity.getZ(ent);

            var dx = px - ex;
            var dy = py - ey;
            var dz = pz - ez;
            var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // إطفاء النيران لمنع احتراقهم بالشمس
            Entity.setFireTicks(ent, 0);

            // الانتقال الآني إذا ابتعد اللاعب كثيراً (أكثر من 20 بلوكة)
            if (distance > 20) {
                Entity.setPosition(ent, px + (Math.random() * 2 - 1), py, pz + (Math.random() * 2 - 1));
            } 
            // حركة التتبع إذا كانت المسافة بين 2.5 و 20 بلوكة
            else if (distance > 2.5) {
                var speed = 0.28;
                var vx = (dx / distance) * speed;
                var vz = (dz / distance) * speed;

                Entity.setVelX(ent, vx);
                Entity.setVelZ(ent, vz);

                // تدوير الموب ليتجه بنظره نحو اللاعب
                var yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
                Entity.setRot(ent, 0, yaw);
            }
        }
    } 
    // حذف التابعين فوراً بمجرد تغيير الأيتم من اليد
    else {
        if (spawnedCompanions.length > 0) {
            clearCompanions();
        }
    }
}

// ==========================================
// 4. دوال مساعدة (Helper Functions)
// ==========================================

function spawnCompanionsNearPlayer() {
    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();

    for (var i = 0; i < companionQuantity; i++) {
        var offsetX = (Math.random() * 4) - 2;
        var offsetZ = (Math.random() * 4) - 2;

        var ent = Level.spawnMob(px + offsetX, py, pz + offsetZ, companionEntityId, "");
        
        Entity.setNameTag(ent, "§l§b[Fan #" + (i + 1) + "]§r");
        Entity.addEffect(ent, 12, 999999, 1, false, true); // Fire Resistance

        spawnedCompanions.push(ent);
    }
}

function clearCompanions() {
    for (var i = 0; i < spawnedCompanions.length; i++) {
        Entity.remove(spawnedCompanions[i]);
    }
    spawnedCompanions = [];
}
