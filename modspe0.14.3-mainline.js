// ===============================================
// ModPE Script: Simple Say Command
// Target: Minecraft PE 0.14.3
// ===============================================

function chatHook(str) {
    var args = str.split(" ");
    var cmd = args[0];

    // التقاط أمر /say
    if (cmd === "/say") {
        preventDefault(); // منع ظهور الأمر الأصلي في الشات

        // التأكد من أن المستخدم كتب نصاً بعد الأمر
        if (args.length < 2) {
            clientMessage(ChatColor.RED + "Usage: /say <message>");
            return;
        }

        // دمج بقية الكلمات المقطعة لتكوين النص الكامل
        var message = args.slice(1).join(" ");

        // طباعة الرسالة في شات اللعبة
        clientMessage(ChatColor.LIGHT_PURPLE + "[Server] " + ChatColor.WHITE + message);
    }
}
