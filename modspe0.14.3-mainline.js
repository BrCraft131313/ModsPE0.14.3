/* ==========================================================================
   المود: سيف مصاص الدماء (Vampiric Sword)
   ========================================================================== */

function attackHook(attacker, victim) {
    var player = Player.getEntity();
    
    // عند ضرب أي هدف بسيف ألماسي (ID 276) يتم استعادة نقطة صحة
    if (attacker == player && Player.getCarriedItem() == 276) {
        var currentHealth = Entity.getHealth(player);
        if (currentHealth < 20) {
            Entity.setHealth(player, Math.min(20, currentHealth + 2));
            clientMessage("[Vampire] Health stolen from target!");
        }
    }
}
