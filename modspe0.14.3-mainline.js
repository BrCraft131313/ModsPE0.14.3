// ==========================================
// تعريف المعرفات والمتغيرات العامة
// ==========================================
var STICK_ID = 280; // عصا التحكم بالزمن
var LUCKY_LOG_ID = 17; // أخشاب شجرة الحظ والجوائز

var playerElement = null; // عنصر القدرات الخاصة للاعب

// ==========================================
// 1. نظام القدرات الخاصة (Element Master)
// ==========================================
function procCmd(command) {
    var cmd = command.split(" ");
    
    // أمر اختيار العنصر: /element fire أو /element water أو /element earth
    if (cmd[0] == "element") {
        if (cmd.length > 1) {
            var type = cmd[1].toLowerCase();
            if (type == "fire" || type == "water" || type == "earth") {
                playerElement = type;
                clientMessage("Selected Element: " + type.toUpperCase());
            } else {
                clientMessage("Unknown Element! Choose: fire, water, earth");
            }
        }
    }
}

// تطبيق التأثيرات المستمرة للقدرات عبر دالة التحديث
function modTick() {
    if (playerElement == "fire") {
        // إعطاء مقاومة النار
        Entity.addEffect(Player.getEntity(), MobEffect.fireResistance, 40, 1, false, false);
    } else if (playerElement == "water") {
        // إعطاء قدرة التنفس تحت الماء والسرعة
        Entity.addEffect(Player.getEntity(), MobEffect.waterBreathing, 40, 1, false, false);
        Entity.addEffect(Player.getEntity(), MobEffect.movementSpeed, 40, 1, false, false);
    } else if (playerElement == "earth") {
        // إعطاء قوة الحفر وتأثير المقاومة
        Entity.addEffect(Player.getEntity(), MobEffect.digSpeed, 40, 1, false, false);
        Entity.addEffect(Player.getEntity(), MobEffect.damageResistance, 40, 1, false, false);
    }
}

// ==========================================
// 2. عصا التحكم بالزمن
// ==========================================
function useItem(x, y, z, itemId, blockId, side, data) {
    // عصا التحكم بالزمن (عند الضغط بالعصا على أي بلوكة)
    if (itemId == STICK_ID) {
        var currentTime = Level.getTime();
        // التبديل بين الليل والنهار
        if (currentTime < 12000) {
            Level.setTime(14000);
            clientMessage("Time Set To: NIGHT");
        } else {
            Level.setTime(0);
            clientMessage("Time Set To: DAY");
        }
        
        // استدعاء صاعقة برقية على الموقع المضغوط
        Level.spawnMob(x, y + 1, z, 93); // ID 93 للصاعقة
    }
}

// ==========================================
// 3. شجرة المغامرات والجوائز (Lucky Tree)
// ==========================================
function destroyBlock(x, y, z, side) {
    var blockId = getTile(x, y, z);
    
    // عند كسر جذع خشب الشجرة
    if (blockId == LUCKY_LOG_ID) {
        var luck = Math.floor(Math.random() * 4); // توليد رقم عشوائي من 0 إلى 3
        
        if (luck == 0) {
            // جائزة أسطورية: دايموند
            Level.dropItem(x, y, z, 0, 264, 3, 0); // Diamond ID = 264
            clientMessage("LUCKY! You found Diamonds!");
        } else if (luck == 1) {
            // استدعاء وحش مفاجئ
            Level.spawnMob(x, y + 1, z, 32); // Zombie ID = 32
            clientMessage("UNLUCKY! Zombie Spawned!");
        } else if (luck == 2) {
            // إنفجار مفاجئ
            Level.explode(x, y, z, 2.0);
            clientMessage("BOOM! Trap Activated!");
        } else if (luck == 3) {
            // تفاح ذهبي للتغذية
            Level.dropItem(x, y, z, 0, 322, 1, 0); // Golden Apple ID = 322
            clientMessage("LUCKY! Golden Apple Dropped!");
        }
    }
}
