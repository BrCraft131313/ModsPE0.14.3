// Realistic Slow Elevator Mod for MCPE 0.14.3
// جميع التعليقات باللغة العربية والرسائل بالإنجليزية

var LEVER_ID = 69;
var isMoving = false;
var elevatorState = null;

function useItem(x, y, z, itemId, blockId, side) {
    if (blockId == LEVER_ID && !isMoving) {

        // 1. البحث عن كافة أذرع التحكم على نفس العمود الرأسي
        var leversY = [];
        for (var checkY = 0; checkY < 128; checkY++) {
            if (Level.getTile(x, checkY, z) == LEVER_ID) {
                leversY.push(checkY);
            }
        }

        if (leversY.length < 2) {
            clientMessage("[Elevator] Need at least 2 levers on the pillar!");
            return;
        }

        // 2. تحديد الطابق الحالي والهدف
        var currentPlatformY = y - 1;
        var targetPlatformY = (y == leversY[0]) ? (leversY[1] - 1) : (leversY[0] - 1);

        if (currentPlatformY == targetPlatformY) return;

        // 3. التعرف على نوع بلوكة الأرضية
        var blockType = 0;
        for (var dx = -2; dx <= 2; dx++) {
            for (var dz = -2; dz <= 2; dz++) {
                if (dx == 0 && dz == 0) continue;
                var t = Level.getTile(x + dx, currentPlatformY, z + dz);
                if (t != 0 && t != LEVER_ID) {
                    blockType = t;
                    break;
                }
            }
            if (blockType != 0) break;
        }

        if (blockType == 0) blockType = 5; // خشب افتراضي

        // 4. تجهيز بيانات الحركة التدريجية البطيئة
        var direction = (targetPlatformY > currentPlatformY) ? 1 : -1;

        elevatorState = {
            x: x,
            z: z,
            currentY: currentPlatformY,
            targetY: targetPlatformY,
            direction: direction,
            blockType: blockType,
            leverData: Level.getData(x, y, z),
            tickDelay: 0
        };

        isMoving = true;
        
        // حساب المعادلة: 2 * |y2 - y1|
        var distance = Math.abs(targetPlatformY - currentPlatformY);
        var calculatedHeight = 2 * distance;

        // رفع اللاعب وفق المعادلة الرياضية المحسوبة
        var player = Player.getEntity();
        Entity.setPosition(player, x + 0.5, currentPlatformY + calculatedHeight, z + 0.5);
        Entity.setVelY(player, 0);

        clientMessage("[Elevator] Moving...");
        preventDefault();
    }
}

function modTick() {
    if (!isMoving || elevatorState == null) return;

    // تبطيء الحركة لجعلها واقعية (كل 4 تاكات خطوة)
    elevatorState.tickDelay++;
    if (elevatorState.tickDelay < 4) return;
    elevatorState.tickDelay = 0;

    var x = elevatorState.x;
    var z = elevatorState.z;
    var currentY = elevatorState.currentY;
    var blockType = elevatorState.blockType;
    var nextY = currentY + elevatorState.direction;

    // 1. مسح المنصة القديمة
    for (var bx = x - 1; bx <= x + 1; bx++) {
        for (var bz = z - 1; bz <= z + 1; bz++) {
            if (bx == x && bz == z) continue;
            Level.setTile(bx, currentY, bz, 0, 0);
        }
    }

    // 2. بناء المنصة في الارتفاع الجديد
    for (var bx = x - 1; bx <= x + 1; bx++) {
        for (var bz = z - 1; bz <= z + 1; bz++) {
            if (bx == x && bz == z) continue;
            Level.setTile(bx, nextY, bz, blockType, 0);
        }
    }

    // 3. تحديث الارتفاع الحالي
    elevatorState.currentY = nextY;

    // 4. عند الوصول إلى الطابق المستهدف
    if (elevatorState.currentY == elevatorState.targetY) {
        isMoving = false;
        elevatorState = null;
        clientMessage("[Elevator] Arrived!");
    }
}
