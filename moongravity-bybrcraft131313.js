function procCmd(cmd) {
    // تنظيف النص وتحويله إلى حروف صغيرة
    var command = cmd.trim().toLowerCase();

    // أمر انعدام الجاذبية (تأثير محاكاة قمرية)
    if (command == "moon") {
        // تأثير القفز العالي (المعرف: 8) وتأثير البطء لمنع السقوط السريع (المعرف: 2)
        Entity.addEffect(Player.getEntity(), 8, 999999 * 20, 4, false, true);
        Entity.addEffect(Player.getEntity(), 2, 999999 * 20, 1, false, true);
        clientMessage("Zero Gravity / Moon Mode: ON");
    }

    // أمر إلغاء انعدام الجاذبية
    if (command == "unmoon") {
        Entity.removeEffect(Player.getEntity(), 8);
        Entity.removeEffect(Player.getEntity(), 2);
        clientMessage("Zero Gravity / Moon Mode: OFF");
    }
}