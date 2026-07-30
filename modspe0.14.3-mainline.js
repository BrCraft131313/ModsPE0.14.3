// بداية كود مود الأحذية الخارقة

function modTick() {
    var player = Player.getEntity();
    
    // فحص خانة الحذاء (Index 3 في الدروع)
    var bootSlot = Player.getArmorSlot(3);
    
    // ID: 317 هو حذاء الذهب
    if (bootSlot == 317) {
        Player.setCanFly(true);
        Entity.addEffect(player, MobEffect.movementSpeed, 20, 2, false, false);
        Level.addParticle(ParticleType.flame, Player.getX(), Player.getY(), Player.getZ(), 0, 0, 0, 3);
    } else {
        // إذا لم يكن يرتدي الحذاء الذهبي وكانت اللعبة في وضع البقاء
        if (Level.getGameMode() == 0) {
            Player.setCanFly(false);
        }
    }
}

// نهاية الكود
