/* ==========================================================================
   المود: أداة القبض على الموبس (Mob Catcher Egg)
   ========================================================================== */

function attackHook(attacker, victim) {
    var player = Player.getEntity();

    // عند ضرب الكائن باستخدام بيضة عادية (ID 344)
    if (attacker == player && Player.getCarriedItem() == 344) {
        var typeId = Entity.getEntityTypeId(victim);

        if (typeId > 0 && typeId != 63) {
            var x = Entity.getX(victim);
            var y = Entity.getY(victim);
            var z = Entity.getZ(victim);

            Entity.remove(victim);
            Level.dropItem(x, y, z, 0, 383, 1, typeId);
            clientMessage("[Mob Catcher] Mob caught into spawn egg!");
        }
    }
}
