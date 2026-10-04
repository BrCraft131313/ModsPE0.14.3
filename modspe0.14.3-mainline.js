/* ==========================================================================
   المود: ساعة التحكم بالوقت (Time Controller Clock)
   ========================================================================== */

function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    // عند استخدام عنصر الساعة (ID 347)
    if (itemid == 347) {
        if (Level.getTime() % 24000 < 12000) {
            Level.setTime(14000);
            clientMessage("[Time Clock] Time set to Night!");
        } else {
            Level.setTime(0);
            clientMessage("[Time Clock] Time set to Day!");
        }
    }
}
