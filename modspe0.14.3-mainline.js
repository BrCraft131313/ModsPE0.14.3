// ==========================================
// ModPE Script: ThorHammer.js
// Minecraft PE 0.14.3
// ==========================================

// 1. استدعاء البرق عند ضرب الوحوش/اللاعبين بالفأس الذهبي
function attackHook(attacker, victim) {
    var heldItem = Player.getCarriedItem();
    
    if (heldItem == 286) { // 286 = Golden Axe
        var vx = Entity.getX(victim);
        var vy = Entity.getY(victim);
        var vz = Entity.getZ(victim);
        
        // استدعاء كائن البرق (Lightning Entity ID = 93)
        Level.spawnMob(vx, vy, vz, 93);
    }
}

// 2. استدعاء البرق عند الضغط بالفأس الذهبي على الأرض
function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    if (itemId == 286) { // 286 = Golden Axe
        Level.spawnMob(x, y, z, 93);
    }
}
