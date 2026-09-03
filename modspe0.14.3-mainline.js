var riddenMob = null;
var isRidingMob = false;
var SADDLE_ID = 329;

function attackHook(attacker, victim) {
    if (attacker == Player.getEntity() && Player.getCarriedItem() == SADDLE_ID) {
        mountMob(victim);
        preventDefault();
    }
}

function useItemOnEntity(entity, itemId, side) {
    if (itemId == SADDLE_ID) mountMob(entity);
}

function mountMob(mob) {
    if (mob != Player.getEntity()) {
        riddenMob = mob;
        isRidingMob = true;
        clientMessage("§a[Saddle Mod] Mounted!");
    }
}

function modTick() {
    if (isRidingMob && riddenMob != null) {
        var player = Player.getEntity();

        // النزول بالشفت
        if (Entity.isSneaking(player) || Entity.getHealth(riddenMob) <= 0) {
            isRidingMob = false;
            riddenMob = null;
            clientMessage("§c[Saddle Mod] Dismounted!");
            return;
        }

        // سحب الموب تحت رجول اللاعب مباشرة دون استخدام rideAnimal المكسورة
        var px = Entity.getX(player);
        var py = Entity.getY(player) - 1.2; // يخليه تحتك بالضبط
        var pz = Entity.getZ(player);
        var yaw = Entity.getYaw(player);

        Entity.setPosition(riddenMob, px, py, pz);
        Entity.setRot(riddenMob, yaw, 0);
    }
}

function newLevel() {
    riddenMob = null;
    isRidingMob = false;
}
