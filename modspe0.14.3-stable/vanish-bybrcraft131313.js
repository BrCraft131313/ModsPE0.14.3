// ===============================================
// ModPE Script: Vanish System
// Version: 1.0 (Minecraft PE 0.14.3)
// ===============================================

function procCmd(command) {
    var cmd = command.split(" ");
    var mainCmd = cmd[0].toLowerCase();
    var subCmd = cmd[1] ? cmd[1].toLowerCase() : "";

    // فحص الأمر الرئيس /vanish
    if (mainCmd === "vanish") {

        // 1. أمر إيقاف الاختفاء (/vanish -c)
        if (subCmd === "-c") {
            // إزالة تأثير الاختفاء (MobEffect.invisibility ID هو 14)
            Entity.removeEffect(getPlayerEnt(), 14);
            clientMessage("§c[Vanish] Invisibility cleared! You are now visible.");
        } 
        
        // 2. أمر تفعيل الاختفاء اللانهائي (/vanish)
        else {
            // إضافة تأثير الاختفاء لـ 999999 ثانية (تأثير لانهائي) بدرجة 1 وبدون جسيمات (particles)
            Entity.addEffect(getPlayerEnt(), MobEffect.invisibility, 999999 * 20, 1, false, false);
            clientMessage("§a[Vanish] Infinite invisibility activated!");
        }
    }
}