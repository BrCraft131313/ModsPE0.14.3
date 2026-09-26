// قائمة بمعرفات (IDs) جميع الأبواب الخشبية في ماينكرافت
var WOODEN_DOORS = [
    64,  // Oak Door
    427, // Spruce Door
    428, // Birch Door
    429, // Jungle Door
    430, // Acacia Door
    431  // Dark Oak Door
];

// حدث التفاعل مع البلوكات باليد أو أداة
function useItem(x, y, z, itemId, blockId, side, blockDamage) {
    // التحقق مما إذا كانت البلوكة الملموسة إحدى الأبواب الخشبية
    if (WOODEN_DOORS.indexOf(blockId) !== -1) {
        // إلغاء حدث فتح الباب الأصلي
        preventDefault();
        
        // إلحاق ضرر قاضٍ باللاعب للقتل الفوري
        Entity.setHealth(Player.getEntity(), 0);
        
        // إرسال رسالة للاعب بالإنجليزية وفق المعيار
        clientMessage("You died by opening a wooden door!");
    }
}
