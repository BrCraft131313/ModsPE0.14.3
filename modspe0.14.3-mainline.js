// ===============================================
// ModPE Script: Smart Diamond Axe Fill Tool (v3)
// Target: Minecraft PE 0.14.3
// ===============================================

var fillEnabled = false;
var sizeX = 1;
var sizeY = 1;
var sizeZ = 1;
var targetBlockId = 0; // 0 تعني هواء (تفريغ)

var DIAMOND_AXE_ID = 279;

// مصفوفات لتخزين سجل البلوكات السابقة لاسترجاعها
var globalHistory = []; // سجل لجميع العمليات التاريخية (/unfill @a)
var lastOperationHistory = []; // سجل العملية الأخيرة فقط (/unfill)

/**
 * التقاط الأوامر المدخلة في الشات
 */
function chatHook(str) {
    var args = str.split(" ");
    var cmd = args[0];

    // أمر التراجع
    if (cmd === "/unfill") {
        preventDefault();

        // التراجع عن جميع العمليات واستعادة العالم كلياً (/unfill @a)
        if (args.length === 2 && args[1] === "@a") {
            if (globalHistory.length === 0) {
                clientMessage(ChatColor.RED + "[Fill Mod] No global history found!");
                return;
            }

            // استعادة البلوكات من الأحدث للأقدم
            for (var i = globalHistory.length - 1; i >= 0; i--) {
                var b = globalHistory[i];
                Level.setTile(b.x, b.y, b.z, b.id, b.data);
            }

            clientMessage(ChatColor.GREEN + "[Fill Mod] Restored world to initial state! (" + globalHistory.length + " blocks total)");
            globalHistory = [];
            lastOperationHistory = [];
            return;
        }

        // التراجع عن آخر عملية فقط (/unfill)
        if (lastOperationHistory.length === 0) {
            clientMessage(ChatColor.RED + "[Fill Mod] No previous operation to undo!");
            return;
        }

        for (var j = lastOperationHistory.length - 1; j >= 0; j--) {
            var block = lastOperationHistory[j];
            Level.setTile(block.x, block.y, block.z, block.id, block.data);
        }

        clientMessage(ChatColor.GREEN + "[Fill Mod] Undone last operation (" + lastOperationHistory.length + " blocks restored)!");
        lastOperationHistory = []; // تفريغ سجل العملية الأخيرة بعد التراجع
        return;
    }

    // أمر التعبئة بنوع بلوكة محدد: /infill X Y Z ID
    if (cmd === "/infill") {
        preventDefault();
        if (args.length === 5) {
            var inputX = parseInt(args[1]);
            var inputY = parseInt(args[2]);
            var inputZ = parseInt(args[3]);
            var blockId = parseInt(args[4]);

            if (isNaN(inputX) || isNaN(inputY) || isNaN(inputZ) || isNaN(blockId)) {
                clientMessage(ChatColor.RED + "[Fill Mod] Error: Invalid parameters!");
                return;
            }

            sizeX = inputX;
            sizeY = inputY;
            sizeZ = inputZ;
            targetBlockId = blockId;
            fillEnabled = true;

            clientMessage(ChatColor.GREEN + "[Fill Mod] Set fill target ID: " + targetBlockId + " with dimensions: " + sizeX + "x" + sizeY + "x" + sizeZ);
        } else {
            clientMessage(ChatColor.YELLOW + "Usage: /infill X Y Z <BlockID>");
        }
        return;
    }

    // أمر التحكم الأساسي والقائمة المساعدة /fill
    if (cmd === "/fill") {
        preventDefault();

        // عرض قائمة المساعدة والتعليمات عند كتابة /fill -h
        if (args.length === 2 && args[1] === "-h") {
            clientMessage(ChatColor.GOLD + "=== Smart Fill Tool Help ===");
            clientMessage(ChatColor.YELLOW + "/fill 1" + ChatColor.WHITE + " : Enable tool.");
            clientMessage(ChatColor.YELLOW + "/fill 0" + ChatColor.WHITE + " : Disable tool.");
            clientMessage(ChatColor.YELLOW + "/fill X Y Z" + ChatColor.WHITE + " : Set dimensions for air clearing (e.g. /fill 3 -3 10).");
            clientMessage(ChatColor.YELLOW + "/infill X Y Z ID" + ChatColor.WHITE + " : Set dimensions and block ID for filling.");
            clientMessage(ChatColor.YELLOW + "/unfill" + ChatColor.WHITE + " : Undo last operation.");
            clientMessage(ChatColor.YELLOW + "/unfill @a" + ChatColor.WHITE + " : Restore entire world back to state before all fills.");
            clientMessage(ChatColor.AQUA + "Tip: Equip Diamond Axe and hit a block to trigger!");
            return;
        }

        if (args.length === 2) {
            if (args[1] === "1") {
                fillEnabled = true;
                clientMessage(ChatColor.GREEN + "[Fill Mod] Tool enabled!");
            } else if (args[1] === "0") {
                fillEnabled = false;
                clientMessage(ChatColor.RED + "[Fill Mod] Tool disabled.");
            }
        } 
        else if (args.length === 4) {
            var inputX = parseInt(args[1]);
            var inputY = parseInt(args[2]);
            var inputZ = parseInt(args[3]);

            if (isNaN(inputX) || isNaN(inputY) || isNaN(inputZ)) {
                clientMessage(ChatColor.RED + "[Fill Mod] Error: Invalid dimensions!");
                return;
            }

            sizeX = inputX;
            sizeY = inputY;
            sizeZ = inputZ;
            targetBlockId = 0; // إرجاع الوضع الافتراضي (تفريغ / air)
            fillEnabled = true;

            clientMessage(ChatColor.GREEN + "[Fill Mod] Dimensions set to: " + sizeX + "x" + sizeY + "x" + sizeZ);
        } else {
            clientMessage(ChatColor.YELLOW + "Usage: Type /fill -h for help.");
        }
    }
}

/**
 * تنفيذ العملية عند استخدام الفأس الألماسي
 */
function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
    if (fillEnabled && itemid === DIAMOND_AXE_ID) {
        preventDefault();

        // إعادة إعادة تعيين سجل العملية الأخيرة
        lastOperationHistory = [];

        var stepX = sizeX >= 0 ? 1 : -1;
        var stepY = sizeY >= 0 ? 1 : -1;
        var stepZ = sizeZ >= 0 ? 1 : -1;

        var limitX = Math.abs(sizeX);
        var limitY = Math.abs(sizeY);
        var limitZ = Math.abs(sizeZ);

        for (var ix = 0; ix < limitX; ix++) {
            for (var iy = 0; iy < limitY; iy++) {
                for (var iz = 0; iz < limitZ; iz++) {

                    var targetX = x + (ix * stepX);
                    var targetY = y + (iz * stepZ);
                    var targetZ = z + (iy * stepY);

                    if (targetY >= 0 && targetY <= 128) {
                        var oldId = Level.getTile(targetX, targetY, targetZ);
                        var oldData = Level.getData(targetX, targetY, targetZ);

                        var blockRecord = {
                            x: targetX,
                            y: targetY,
                            z: targetZ,
                            id: oldId,
                            data: oldData
                        };

                        // إضافة البلوكة لسجل العملية الأخيرة والسجل التاريخي الشامل
                        lastOperationHistory.push(blockRecord);
                        globalHistory.push(blockRecord);

                        // وضع البلوكة الجديدة
                        Level.setTile(targetX, targetY, targetZ, targetBlockId, 0);
                    }
                }
            }
        }

        clientMessage(ChatColor.GREEN + "[Fill Mod] Applied (" + targetBlockId + ") to area!");
    }
                }
