/* ==========================================================================
   المود: حجر الانتقال العشوائي (Teleport Crystal)
   ========================================================================== */

function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    // عند استخدام الألماسة (ID 264)
    if (itemid == 264) {
        var player = Player.getEntity();
        var rx = (Math.random() * 100) - 50;
        var rz = (Math.random() * 100) - 50;

        var px = Entity.getX(player) + rx;
        var py = Entity.getY(player) + 5;
        var pz = Entity.getZ(player) + rz;

        Entity.setPosition(player, px, py, pz);
        clientMessage("[Teleport] Teleported to random location!");
    }
}
