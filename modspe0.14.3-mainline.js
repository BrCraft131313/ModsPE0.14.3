// ================================================
// ModPE Script: Strict Vertical Aether Portal (ID 90)
// Target Version: Minecraft PE 0.14.3
// Launcher: BlockLauncher / BlockLauncher Pro
// ================================================

var teleportCooldown = 0;
var GLOWSTONE = 89;
var PORTAL_BLOCK = 90;

function useItem(x, y, z, itemId, blockId, side) {
    // الضغط بدلو الماء
    if (itemId == 325 && Player.getCarriedItemData() == 8) {
        
        var targetX = x;
        var targetY = y;
        var targetZ = z;

        if (side == 0) targetY--;
        else if (side == 1) targetY++;
        else if (side == 2) targetZ--;
        else if (side == 3) targetZ++;
        else if (side == 4) targetX--;
        else if (side == 5) targetX++;

        var targetBlock = getTile(targetX, targetY, targetZ);
        if (targetBlock == 0 || targetBlock == 8 || targetBlock == 9) {
            
            // محاولة إنشاء بوابة عمودية فقط على محور X ثم Z
            if (tryBuildVerticalPortalX(targetX, targetY, targetZ)) {
                preventDefault();
                Level.playSound(targetX, targetY, targetZ, "random.glass", 1.0, 1.0);
            } else if (tryBuildVerticalPortalZ(targetX, targetY, targetZ)) {
                preventDefault();
                Level.playSound(targetX, targetY, targetZ, "random.glass", 1.0, 1.0);
            }
        }
    }
}

// فحص وبناء بوابة عمودية على محور X (تتطلب إطار غلوستون كامل مغلق)
function tryBuildVerticalPortalX(startX, startY, startZ) {
    var minX = startX, maxX = startX;
    var minY = startY, maxY = startY;

    // توسيع الحدود داخل الفراغ العمودي
    while (getTile(minX - 1, startY, startZ) == 0 && (startX - minX) < 10) minX--;
    while (getTile(maxX + 1, startY, startZ) == 0 && (maxX - startX) < 10) maxX++;
    while (getTile(startX, minY - 1, startZ) == 0 && (startY - minY) < 10) minY--;
    while (getTile(startX, maxY + 1, startZ) == 0 && (maxY - startY) < 10) maxY++;

    // التأكد من أن الإطار بالكامل من الغلوستون (89)
    for (var x = minX; x <= maxX; x++) {
        if (getTile(x, minY - 1, startZ) != GLOWSTONE) return false;
        if (getTile(x, maxY + 1, startZ) != GLOWSTONE) return false;
    }
    for (var y = minY; y <= maxY; y++) {
        if (getTile(minX - 1, y, startZ) != GLOWSTONE) return false;
        if (getTile(maxX + 1, y, startZ) != GLOWSTONE) return false;
    }

    // تعبئة الفراغ العمودي الداخلي فقط
    for (var fillX = minX; fillX <= maxX; fillX++) {
        for (var fillY = minY; fillY <= maxY; fillY++) {
            setTile(fillX, fillY, startZ, PORTAL_BLOCK);
        }
    }
    return true;
}

// فحص وبناء بوابة عمودية على محور Z (تتطلب إطار غلوستون كامل مغلق)
function tryBuildVerticalPortalZ(startX, startY, startZ) {
    var minZ = startZ, maxZ = startZ;
    var minY = startY, maxY = startY;

    while (getTile(startX, startY, minZ - 1) == 0 && (startZ - minZ) < 10) minZ--;
    while (getTile(startX, startY, maxZ + 1) == 0 && (maxZ - startZ) < 10) maxZ++;
    while (getTile(startX, minY - 1, startZ) == 0 && (startY - minY) < 10) minY--;
    while (getTile(startX, maxY + 1, startZ) == 0 && (maxY - startY) < 10) maxY++;

    for (var z = minZ; z <= maxZ; z++) {
        if (getTile(startX, minY - 1, z) != GLOWSTONE) return false;
        if (getTile(startX, maxY + 1, z) != GLOWSTONE) return false;
    }
    for (var y = minY; y <= maxY; y++) {
        if (getTile(startX, y, minZ - 1) != GLOWSTONE) return false;
        if (getTile(startX, y, maxZ + 1) != GLOWSTONE) return false;
    }

    for (var fillZ = minZ; fillZ <= maxZ; fillZ++) {
        for (var fillY = minY; fillY <= maxY; fillY++) {
            setTile(startX, fillY, fillZ, PORTAL_BLOCK);
        }
    }
    return true;
}

function modTick() {
    if (teleportCooldown > 0) {
        teleportCooldown--;
        return;
    }

    var px = Math.floor(getPlayerX());
    var py = Math.floor(getPlayerY());
    var pz = Math.floor(getPlayerZ());

    if (isNearPortalBlock(px, py, pz)) {
        teleportToAetherSky();
    }
}

function isNearPortalBlock(x, y, z) {
    for (var dx = -1; dx <= 1; dx++) {
        for (var dy = 0; dy <= 1; dy++) {
            for (var dz = -1; dz <= 1; dz++) {
                if (getTile(x + dx, y + dy, z + dz) == PORTAL_BLOCK) {
                    return true;
                }
            }
        }
    }
    return false;
}

function teleportToAetherSky() {
    teleportCooldown = 120;

    clientMessage("§b[Aether Mod] §eTeleporting to the sky via Aether Portal...");

    var targetX = Math.floor(getPlayerX());
    var targetY = 128;
    var targetZ = Math.floor(getPlayerZ());

    for (var bx = -1; bx <= 1; bx++) {
        for (var bz = -1; bz <= 1; bz++) {
            setTile(targetX + bx, targetY - 1, targetZ + bz, GLOWSTONE);
        }
    }

    setPosition(getPlayerEnt(), targetX + 0.5, targetY + 1, targetZ + 0.5);
    Entity.addEffect(getPlayerEnt(), MobEffect.damageResistance, 200, 4, false, false);
}
