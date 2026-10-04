/* ==========================================================================
   المود: طاولة التصنيع المحمولة (Portable Workbench)
   ========================================================================== */

var tempWorkbenchX = null;
var tempWorkbenchY = null;
var tempWorkbenchZ = null;

// دالة إرجاع البلوك الأصلي وإزالة طاولة التصنيع المؤقتة
function restoreTempBlock() {
    if (tempWorkbenchX !== null) {
        Level.setTile(tempWorkbenchX, tempWorkbenchY, tempWorkbenchZ, 0);
        tempWorkbenchX = null;
        tempWorkbenchY = null;
        tempWorkbenchZ = null;
    }
}

function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    // عند الضغط باستخدام عنصر طاولة التصنيع (ID 58)
    if (itemid == 58) {
        var targetX = x;
        var targetY = y;
        var targetZ = z;

        // تحديد موقع وضع الطاولة بناءً على الوجه المجهد (Side)
        if (side == 0) targetY--;
        else if (side == 1) targetY++;
        else if (side == 2) targetZ--;
        else if (side == 3) targetZ++;
        else if (side == 4) targetX--;
        else if (side == 5) targetX++;

        // وضع طاولة تصنيع مؤقتة في المكان الفارغ
        if (Level.getTile(targetX, targetY, targetZ) == 0) {
            restoreTempBlock();

            tempWorkbenchX = targetX;
            tempWorkbenchY = targetY;
            tempWorkbenchZ = targetZ;

            Level.setTile(targetX, targetY, targetZ, 58);
            clientMessage("[Workbench] Temporary workbench placed! Tap it to craft.");
        }
    }
}

function modTick() {
    // تنظيف وإزالة طاولة التصنيع المؤقتة عند ابتعاد اللاعب أكثر من 4 بلوكات
    if (tempWorkbenchX !== null && Level.getTime() % 10 == 0) {
        var player = Player.getEntity();
        var px = Entity.getX(player);
        var py = Entity.getY(player);
        var pz = Entity.getZ(player);

        var dx = px - tempWorkbenchX;
        var dy = py - tempWorkbenchY;
        var dz = pz - tempWorkbenchZ;
        var distSq = dx * dx + dy * dy + dz * dz;

        if (distSq > 16) {
            restoreTempBlock();
            clientMessage("[Workbench] Temporary workbench removed.");
        }
    }
}
