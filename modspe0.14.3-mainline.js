// ==========================================
// ModPE Script: luckyball-bybrcraft131313.js
// Minecraft PE 0.14.3
// ==========================================

// دالة تعمل عند اصطدام كرة الثلج بالكتل
function projectileHitBlockHook(entity, x, y, z, side) {
    if (Entity.getEntityTypeId(entity) == 81) {
        var player = Player.getEntity();
        var luckyRoll = Math.floor(Math.random() * 4); // توليد رقم عشوائي من 0 إلى 3
        
        if (luckyRoll === 0) {
            // جائزة دايموند
            addItemInventory(264, 1);
            clientMessage("Lucky Roll: You won a diamond!");
        } else if (luckyRoll === 1) {
            // انتقال سريع للأعلى
            Entity.setPosition(player, x + 0.5, y + 2.0, z + 0.5);
            Level.playSound(x, y, z, "mob.endermen.portal", 1, 1);
            clientMessage("Lucky Roll: Teleported!");
        } else if (luckyRoll === 2) {
            // انفجار مفاجئ
            Level.explode(x, y, z, 2.0);
            clientMessage("Lucky Roll: Unexpected explosion!");
        } else {
            // مقلب الخروج من اللعبة
            clientMessage("Lucky Roll: Troll exit triggered!");
            ModPE.leaveGame();
        }
    }
}
