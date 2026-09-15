// ==========================================
// Join World Command Mod - ModsPE0.14.3
// ==========================================

// 1. معالجة الأوامر (/join)

function procCmd(command) {
    var args = command.split(" ");
    var mainCommand = args[0].toLowerCase();


    // الأمر /join <folder_name> للانتقال لأي عالم عن طريق اسم المجلد
    if (mainCommand === "join") {
        if (args[1]) {
            var targetWorld = args[1];
            clientMessage("[WorldManager] Switching to world: " + targetWorld);
            ModPE.selectLevel(targetWorld);
        } else {
            clientMessage("[WorldManager] Usage: /join <world_folder_name>");
        }
    }
}


// 3. رسالة تنبيه عند تحميل السكربت
function newLevel() {
    clientMessage("[WorldManager] Loaded! Commands: /join <world_folder_name>");
}
