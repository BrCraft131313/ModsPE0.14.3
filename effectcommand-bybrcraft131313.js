function procCmd(cmd) {
    // أمر إزالة جميع التأثيرات
    if (cmd == "effect -c") {
        Entity.removeAllEffects(Player.getEntity());
        clientMessage(ChatColor.GREEN + "All effects cleared!");
        return;
    }

    // أمر إعطاء التأثيرات
    if (cmd.indexOf("effect ") == 0) {
        var args = cmd.split(" ");
        if (args.length >= 2) {
            var effectId = parseInt(args[1]);
            var duration = args[2] ? parseInt(args[2]) * 20 : 600; // المدة بالثواني (الافتراضي 30 ثانية)
            var amplifier = args[3] ? parseInt(args[3]) : 0;      // مستوى التأثير (الافتراضي 0)
            
            // التحقق من وجود ID التأثير في نطاق التأثيرات المتاحة (من 1 إلى 23)
            if (isNaN(effectId) || effectId < 1 || effectId > 23) {
                clientMessage(ChatColor.RED + "[Warning] Effect ID " + args[1] + " does not exist!");
                return;
            }

            Entity.addEffect(Player.getEntity(), effectId, duration, amplifier, false, true);
            clientMessage(ChatColor.GREEN + "Effect " + effectId + " applied!");
        } else {
            clientMessage(ChatColor.RED + "Usage: /effect <id> [seconds] [amplifier] OR /effect -c");
        }
    }
}
