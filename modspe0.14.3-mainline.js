// ==========================================
// ModPE Script: autofarm-bybrcraft131313.js
// Target: Minecraft PE 0.14.3
// ==========================================

// تعريف معرف عصا المزرعة التلقائية
var AUTOFARM_STICK_ID = 537;

// تسجيل العصا وإضافتها لحقيبة الألعاب الإبداعية
ModPE.setItem(AUTOFARM_STICK_ID, "stick", 0, "AutoFarm Stick", 1);
Player.addItemCreativeInv(AUTOFARM_STICK_ID, 1, 0);

// منح العصا للاعب عند دخول العالم
function newLevel() {
    addItemInventory(AUTOFARM_STICK_ID, 1, 0);
    clientMessage(">>> AUTOFARM STICK ADDED! TAP ON GROUND TO GENERATE FARM! <<<");
}

// دالة التفاعل وإنشاء المزرعة التلقائية فور الضغط بالعصا
function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
    if (itemid === AUTOFARM_STICK_ID) {
        
        // أبعاد المزرعة (7x7)
        var startX = x - 3;
        var startZ = z - 3;
        var endX = x + 3;
        var endZ = z + 3;
        
        // بناء الهيكل الخارجي والأرضية المحروثة والمجرى المائي
        for (var dx = startX; dx <= endX; dx++) {
            for (var dz = startZ; dz <= endZ; dz++) {
                
                // الإطار الخارجي من جذوع الخشب (Oak Log - ID 17)
                if (dx === startX || dx === endX || dz === startZ || dz === endZ) {
                    Level.setTile(dx, y, dz, 17, 0);
                    Level.setTile(dx, y + 1, dz, 0, 0); // تفريغ الهواء فوق الإطار
                } 
                // المجرى المائي في خط المنتصف (Water - ID 9)
                else if (dz === z) {
                    Level.setTile(dx, y, dz, 9, 0);
                    Level.setTile(dx, y + 1, dz, 0, 0);
                } 
                // باقي المساحة أرض محروثة جاهزة للزراعة (Farmland - ID 60)
                else {
                    Level.setTile(dx, y, dz, 60, 7); // 7 تعني أرض محروثة ورطبة
                    Level.setTile(dx, y + 1, dz, 0, 0);
                }
            }
        }
        
        clientMessage(">>> AUTOMATIC FARM GENERATED SUCCESSFULLY! <<<");
        preventDefault();
    }
}
