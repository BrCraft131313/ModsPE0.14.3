// ModPE Script: Launch Feather for MCPE 0.14.3
// ID الريشة في ماينكرافت هو 288

function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    // التحقق من الضغط باستخدام الريشة
    if (itemId == 288) {
        
        // جلب معرف اللاعب الحالي
        var player = Player.getEntity();
        
        // إعطاء دفع عمودي للاعب للأعلى (قيم Y السرعة 1.2 تدفع تقريباً 10 بلوكات)
        Entity.setVelY(player, 1.2);
        
        // إظهار رسالة تفاعلية بسيطة
        clientMessage("§a[MLG Launch] Launching Up!");
        
        // إذا كان اللاعب في وضع البقاء، يتم خصم ريشة واحدة عند الاستخدام
        if (Level.getGameMode() == 0) {
            var count = Player.getCarriedItemCount();
            if (count > 1) {
                Entity.setCarriedItem(player, 288, count - 1, itemDamage);
            } else {
                Entity.setCarriedItem(player, 0, 0, 0);
            }
        }
    }
}

