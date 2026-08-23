// ===============================================
// ModPE Script: Teleport Tool (/tp)
// Target: Minecraft PE 0.14.3
// ===============================================

/**
 * التقاط الأوامر المدخلة في الشات
 */
function chatHook(str) {
    var args = str.split(" ");
    var cmd = args[0];

    if (cmd === "/tp") {
        preventDefault(); // منع إرسال الأمر للشات العام

        // عرض الإحداثيات الحالية: /tp info
        if (args.length === 2 && args[1] === "info") {
            var currentX = Math.floor(Player.getX());
            var currentY = Math.floor(Player.getY());
            var currentZ = Math.floor(Player.getZ());

            clientMessage(ChatColor.GOLD + "[TP Mod] Current Location:");
            clientMessage(ChatColor.AQUA + "X: " + currentX + " | Y: " + currentY + " | Z: " + currentZ);
            return;
        }

        // الانتقال للإحداثيات المحنّدة: /tp X Y Z
        if (args.length === 4) {
            var targetX = parseFloat(args[1]);
            var targetY = parseFloat(args[2]);
            var targetZ = parseFloat(args[3]);

            if (isNaN(targetX) || isNaN(targetY) || isNaN(targetZ)) {
                clientMessage(ChatColor.RED + "[TP Mod] Error: Coordinates must be valid numbers!");
                return;
            }

            // تنفيذ الانتقال الآني للاعب
            Entity.setPosition(Player.getEntity(), targetX, targetY, targetZ);
            clientMessage(ChatColor.GREEN + "[TP Mod] Teleported to: " + targetX + ", " + targetY + ", " + targetZ);
        } else {
            clientMessage(ChatColor.YELLOW + "Usage:");
            clientMessage(ChatColor.WHITE + "/tp X Y Z (Teleport to coordinates)");
            clientMessage(ChatColor.WHITE + "/tp info (Show current coordinates)");
        }
    }
}