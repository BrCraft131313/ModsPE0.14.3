/* ==========================================================================
   المود: خوذة الرؤية الليلية (Night Vision Helmet)
   ========================================================================== */

function modTick() {
    if (Level.getTime() % 20 != 0) return;

    var player = Player.getEntity();
    // فحص الخوذة المرتداة في الخانة الأولى (Slot 0) باستخدام Player.getArmorSlot
    var helmet = Player.getArmorSlot(0);

    // إذا كانت الخوذة ألماسية (310) أو سلسلة (302)
    if (helmet == 310 || helmet == 302) {
        Entity.addEffect(player, 16, 300, 0, false, true);
    }
}
