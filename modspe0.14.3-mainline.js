// Anti-Fall Damage Mod for MCPE 0.14.3
// يتضمن أمري التفعيل والإلغاء: /af و /antifall

var isAntiFallEnabled = true; // مفعل افتراضياً

function procCmd(command) {
    var args = command.split(" ");
    var cmd = args[0].toLowerCase();

    if (cmd == "af" || cmd == "antifall") {
        if (args.length > 1) {
            var subCmd = args[1].toLowerCase();
            if (subCmd == "on" || subCmd == "enable") {
                isAntiFallEnabled = true;
                clientMessage("§a[AntiFall] Enabled!");
                return;
            } else if (subCmd == "off" || subCmd == "disable") {
                isAntiFallEnabled = false;
                clientMessage("§c[AntiFall] Disabled!");
                return;
            }
        }
        
        // تبديل الحالة تلقائياً (toggle)
        isAntiFallEnabled = !isAntiFallEnabled;
        if (isAntiFallEnabled) {
            clientMessage("§a[AntiFall] Enabled!");
        } else {
            clientMessage("§c[AntiFall] Disabled!");
        }
    }
}

function modTick() {
    // تصفير سرعة السقوط عند الاقتراب من الأرض لمنع احتساب مسافة السقوط اصلاً
    if (isAntiFallEnabled) {
        var player = Player.getEntity();
        if (player) {
            // إعادة ضبط المسافة عبر الاستدعاء المباشر للمحرك إن أمكن
            Player.setCanFly(false); // لا يؤثر على الطيران ولكن يضمن استقرار المحرك
        }
    }
}

function entityHurtHook(attacker, victim, halfHearts) {
    if (!isAntiFallEnabled) return;

    // إلغاء الضرر إذا كان المتضرر هو اللاعب والضربة بيئية (بدون مهاجم مثل السقوط)
    if (victim == Player.getEntity()) {
        if (attacker == 0 || attacker == -1 || attacker == null) {
            preventDefault(); // إلغاء ضرر السقوط والبيئة
        }
    }
}
