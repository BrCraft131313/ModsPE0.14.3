// ==========================================
// مود Lucky Block (الإسفنج المحظوظ) - (0.14.3)
// ==========================================

function destroyBlock(x, y, z, side) {
    // الحصول على نوع البلوكة المكسورة
    var blockId = Level.getTile(x, y, z);

    // التحقق مما إذا كانت البلوكة هي الإسفنج (ID = 19)
    if (blockId == 19) {
        
        // اختيار رقم عشوائي من 1 إلى 6
        var randomNumber = Math.floor(Math.random() * 6) + 1;

        switch (randomNumber) {
            case 1:
                // مكافأة قيمة: دايموند
                Level.dropItem(x + 0.5, y + 0.5, z + 0.5, 0, 264, 3, 0); // 3 دايموند
                clientMessage("§a[Lucky Block] §fYou got lucky! 3 Diamonds!");
                break;

            case 2:
                // فخ: رسبنة زومبي
                Level.spawnMob(x + 0.5, y, z + 0.5, 32); // ID الزومبي = 32
                clientMessage("§c[Lucky Block] §fBad luck! A Zombie appeared!");
                break;

            case 3:
                // أدوات: سيف دايموند
                Level.dropItem(x + 0.5, y + 0.5, z + 0.5, 0, 276, 1, 0); 
                clientMessage("§a[Lucky Block] §fYou received a Diamond Sword!");
                break;

            case 4:
                // بلوكات قيمة: بلوك ذهب
                Level.dropItem(x + 0.5, y + 0.5, z + 0.5, 0, 41, 2, 0); 
                clientMessage("§e[Lucky Block] §fYou got 2 Gold Blocks!");
                break;

            case 5:
                // فخ: انفجار خفيف مكان البلوكة
                Level.explode(x + 0.5, y + 0.5, z + 0.5, 2);
                clientMessage("§4[Lucky Block] §fWatch out! Explosion!");
                break;

            case 6:
                // طعام: تفاح ذهبي
                Level.dropItem(x + 0.5, y + 0.5, z + 0.5, 0, 322, 2, 0); 
                clientMessage("§6[Lucky Block] §fYou received 2 Golden Apples!");
                break;
        }
    }
}
