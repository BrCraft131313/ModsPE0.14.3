/* ==========================================================================
   المود: الإضاءة التلقائية (Auto Torch)
   ========================================================================== */

function modTick() {
    if (Level.getTime() % 20 != 0) return;

    var player = Player.getEntity();
    var px = Math.floor(Entity.getX(player));
    var py = Math.floor(Entity.getY(player));
    var pz = Math.floor(Entity.getZ(player));

    // وضع شعلة إذا كان المكان مظلماً وكان اللاعب يحمل شعلة في يده
    if (Level.getBrightness(px, py, pz) < 7 && Level.getTile(px, py, pz) == 0) {
        if (Player.getCarriedItem() == 50) {
            Level.setTile(px, py, pz, 50);
            clientMessage("[Auto Torch] Torch placed automatically!");
        }
    }
}
