// عند البدء في كسر أو التفاعل مع أي بلوكة في العالم
function useItem(x, y, z, itemId, blockId, side, blockDamage) {
    // تجاهل البلوكة الهوائية (ID: 0)
    if (blockId != 0) {
        
        // 1. مسح البلوكة الأصلية من مكانها
        setTile(x, y, z, 0);
        
        // 2. إرسبان TNT مشتعل (Primed TNT Entity - ID: 65) في نفس الإحداثيات
        var tnt = Level.spawnMob(x + 0.5, y + 0.5, z + 0.5, 65);
        
        // إرسال تنبيه سريع في الشات
        clientMessage("§c[Boom!] Block turned into Primed TNT!");
    }
}

// خيار إضافي: عند كسر البلوكة بيدك ينشأ انفجار فوراً
function destroyBlock(x, y, z, side) {
    // إنشاء انفجار بقوة 3 (نفس قوة الـ TNT) في مكان البلوكة المكسورة
    explode(x + 0.5, y + 0.5, z + 0.5, 3.0);
}
