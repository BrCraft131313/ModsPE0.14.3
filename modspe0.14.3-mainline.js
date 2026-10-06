/* ==========================================================================
   المود: زيادة القلوب عند تلقي الضرر (Damage-To-Hearts Immunity Mod for 0.14.3)
   الوظيفة: منع الموت وزيادة الحد الأقصى للقلوب عند كل محاولة إلحاق ضرر باللاعب
   ========================================================================== */

var HEARTS_ADDITION_PER_HIT = 2; // عدد القلوب المضافة عند كل ضربة (كل قلب = 2 نقطة صحة)

function entityHurtHook(attacker, victim, damage) {
    // التحقق من أن الكائن المتضرر هو اللاعب
    if (victim == Player.getEntity()) {
        preventDefault(); // إلغاء الضرر القادم لمنع الموت المفاجئ

        // جلب الحد الأقصى الحالي للصحة وزيادته
        var currentMaxHealth = Entity.getMaxHealth(victim);
        var newMaxHealth = currentMaxHealth + (HEARTS_ADDITION_PER_HIT * 2);

        // تطبيق الحد الأقصى الجديد وتعبئة القلوب بالكامل
        Entity.setMaxHealth(victim, newMaxHealth);
        Entity.setHealth(victim, newMaxHealth);

        // إرسال رسالة باللغة الإنجليزية وفق معيار MECANE
        clientMessage("§a[Immunity] Max health increased! Total hearts: " + (newMaxHealth / 2));
    }
}
