/* ==========================================================================
   المود: توتم الخلود (Totem of Undying)
   معيار MECANE: الرسائل بالإنجليزية، التعليقات بالعربية، بدون إيموجيات
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. تعريف العنصر ووصفة الصنع
// --------------------------------------------------------------------------
ModPE.setItem(517, "gold_ingot", 0, "Totem of Undying", 1);

Item.addShapedRecipe(517, 1, 0, [
    "EEE",
    "EGE",
    "EEE"
], ["E", 388, 0, "G", 266, 0]);


// --------------------------------------------------------------------------
// 2. دالة حساب عدد التوتمات في حقيبة اللاعب
// --------------------------------------------------------------------------
function getTotemCount() {
    var count = 0;
    for (var slot = 0; slot < 45; slot++) {
        if (Player.getInventorySlot(slot) == 517) {
            count += Player.getInventorySlotCount(slot);
        }
    }
    return count;
}


// --------------------------------------------------------------------------
// 3. حدث التعرض للضرر وزيادة القلوب
// --------------------------------------------------------------------------
function entityHurtHook(attacker, victim, halfHearts) {
    if (victim == Player.getEntity()) {
        var totemCount = getTotemCount();
        if (totemCount > 0) {
            var player = Player.getEntity();
            var currentHealth = Entity.getHealth(player);
            var maxHealth = 20;
            
            // إضافة قلب كامل (2 نقطة صحة) لكل توتم يمتلكه اللاعب
            var healAmount = totemCount * 2;
            var newHealth = Math.min(maxHealth, currentHealth + healAmount);
            
            Entity.setHealth(player, newHealth);
            clientMessage("[Totem] Active! Restored " + (healAmount / 2) + " hearts based on " + totemCount + " Totems.");
        }
    }
}
