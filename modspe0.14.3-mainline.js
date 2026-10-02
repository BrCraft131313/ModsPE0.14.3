/* ==========================================================================
   المود: مود آكل اللحوم (Carnivore Mod)
   معيار MECANE: الرسائل بالإنجليزية، التعليقات بالعربية، بدون إيموجيات
   ========================================================================== */

var meatIds = [363, 366, 319, 320, 364, 411, 412, 423, 424, 349, 350, 460, 461, 462, 367];
var plantIds = [260, 322, 297, 391, 392, 393, 396, 360, 457, 459, 282, 354];

var lastCarriedItem = 0;
var lastCount = 0;

function isMeat(id) {
    for (var i = 0; i < meatIds.length; i++) {
        if (meatIds[i] == id) return true;
    }
    return false;
}

function isPlant(id) {
    for (var i = 0; i < plantIds.length; i++) {
        if (plantIds[i] == id) return true;
    }
    return false;
}

function modTick() {
    var player = Player.getEntity();
    var currentItem = Player.getCarriedItem();
    var currentCount = Player.getCarriedItemCount();

    // فحص نقص كمية الأكل في اليد (دليل على إتمام عملية الأكل)
    if (currentItem == lastCarriedItem && currentCount < lastCount) {
        if (isPlant(currentItem)) {
            // أكل النباتات يؤدي إلى الموت الفوري
            Entity.setHealth(player, 0);
            clientMessage("[Carnivore] You ate plants! Carnivores cannot eat plants.");
        } else if (isMeat(currentItem)) {
            var maxHealth = 20;
            
            // أكل اللحوم يعيد القلوب بالكامل للحد الأقصى
            Entity.setHealth(player, maxHealth);
            clientMessage("[Carnivore] Delicious meat! Health fully restored.");
        }
    }

    lastCarriedItem = currentItem;
    lastCount = currentCount;
}
