// ===============================================
// ModPE Script: Smart Diamond Axe Fill Tool (v4 - Persistent History)
// Target: Minecraft PE 0.14.3
// ===============================================

var fillEnabled = false;
var sizeX = 1;
var sizeY = 1;
var sizeZ = 1;
var targetBlockId = 0;

var DIAMOND_AXE_ID = 279;

var globalHistory = [];
var lastOperationHistory = [];

// مسار حفظ السجل على الذاكرة الداخلية للجهاز
var HISTORY_FILE_PATH = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/fill_history.json";

/**
 * دالة حفظ السجل في ملف خارجي
 */
function saveHistoryToFile() {
    try {
        var file = new java.io.File(HISTORY_FILE_PATH);
        var data = {
            global: globalHistory,
            last: lastOperationHistory
        };
        var jsonString = JSON.stringify(data);
        
        var writer = new java.io.FileWriter(file);
        writer.write(jsonString);
        writer.flush();
        writer.close();
    } catch (e) {
        // Handle error silently
    }
}

/**
 * دالة قراءة السجل من الملف الخارجي
 */
function loadHistoryFromFile() {
    try {
        var file = new java.io.File(HISTORY_FILE_PATH);
        if (!file.exists()) {
            globalHistory = [];
            lastOperationHistory = [];
            return;
        }

        var reader = new java.io.BufferedReader(new java.io.FileReader(file));
        var builder = new java.lang.StringBuilder();
        var line;
        while ((line = reader.readLine()) !== null) {
            builder.append(line);
        }
        reader.close();

        var data = JSON.parse(builder.toString());
        globalHistory = data.global || [];
        lastOperationHistory = data.last || [];
    } catch (e) {
        globalHistory = [];
        lastOperationHistory = [];
    }
}

/**
 * يتم استدعاؤها تلقائياً عند فتح/دخول عالم
 */
function selectLevelHook() {
    loadHistoryFromFile();
}

/**
 * يتم استدعاؤها تلقائياً عند الخروج من العالم
 */
function leaveGame() {
    saveHistoryToFile();
}

function chatHook(str) {
    var args = str.split(" ");
    var cmd = args[0];

    if (cmd === "/unfill") {
        preventDefault();

        if (args.length === 2 && args[1] === "@a") {
            if (globalHistory.length === 0) {
                clientMessage(ChatColor.RED + "[Fill Mod] No global history found!");
                return;
            }

            for (var i = globalHistory.length - 1; i >= 0; i--) {
                var b = globalHistory[i];
                Level.setTile(b.x, b.y, b.z, b.id, b.data);
            }

            clientMessage(ChatColor.GREEN + "[Fill Mod] Restored world! (" + globalHistory.length + " blocks total)");
            globalHistory = [];
            lastOperationHistory = [];
            saveHistoryToFile();
            return;
        }

        if (lastOperationHistory.length === 0) {
            clientMessage(ChatColor.RED + "[Fill Mod] No previous operation to undo!");
            return;
        }

        for (var j = lastOperationHistory.length - 1; j >= 0; j--) {
            var block = lastOperationHistory[j];
            Level.setTile(block.x, block.y, block.z, block.id, block.data);
        }

        clientMessage(ChatColor.GREEN + "[Fill Mod] Undone last operation (" + lastOperationHistory.length + " blocks restored)!");
        lastOperationHistory = [];
        saveHistoryToFile();
        return;
    }

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

    if (cmd === "/fill") {
        preventDefault();

        if (args.length === 2 && args[1] === "-h") {
            clientMessage(ChatColor.GOLD + "=== Smart Fill Tool Help ===");
            clientMessage(ChatColor.YELLOW + "/fill 1" + ChatColor.WHITE + " : Enable tool.");
            clientMessage(ChatColor.YELLOW + "/fill 0" + ChatColor.WHITE + " : Disable tool.");
            clientMessage(ChatColor.YELLOW + "/fill X Y Z" + ChatColor.WHITE + " : Set dimensions for air clearing.");
            clientMessage(ChatColor.YELLOW + "/infill X Y Z ID" + ChatColor.WHITE + " : Set dimensions and block ID for filling.");
            clientMessage(ChatColor.YELLOW + "/unfill" + ChatColor.WHITE + " : Undo last operation.");
            clientMessage(ChatColor.YELLOW + "/unfill @a" + ChatColor.WHITE + " : Restore entire world back to state before all fills.");
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
            targetBlockId = 0;
            fillEnabled = true;

            clientMessage(ChatColor.GREEN + "[Fill Mod] Dimensions set to: " + sizeX + "x" + sizeY + "x" + sizeZ);
        } else {
            clientMessage(ChatColor.YELLOW + "Usage: Type /fill -h for help.");
        }
    }
}

function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
    if (fillEnabled && itemid === DIAMOND_AXE_ID) {
        preventDefault();

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

                        lastOperationHistory.push(blockRecord);
                        globalHistory.push(blockRecord);

                        Level.setTile(targetX, targetY, targetZ, targetBlockId, 0);
                    }
                }
            }
        }

        saveHistoryToFile();

        clientMessage(ChatColor.GREEN + "[Fill Mod] Applied (" + targetBlockId + ") to area!");
    }
}