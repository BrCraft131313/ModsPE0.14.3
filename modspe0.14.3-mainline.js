// CountDown Mod for MCPE 0.14.3
// يطبع عد تنازلي من 10 إلى 0 مع تشغيل صوت عند كل ثانية وصوت انفجار عند النهاية

var countNumber = -1;
var ticks = 0;

function procCmd(command) {
    var args = command.split(" ");
    var cmd = args[0].toLowerCase();

    if (cmd == "count") {
        if (countNumber > -1) {
            clientMessage("§c[CountDown] Countdown is already running!");
            return;
        }
        countNumber = 10;
        ticks = 0;
        clientMessage("§a[CountDown] Countdown started!");
    }
}

function modTick() {
    if (countNumber < 0) return;

    ticks++;

    // كل 20 Ticks تعادل ثانية واحدة تقريباً
    if (ticks >= 20) {
        ticks = 0;

        var player = Player.getEntity();
        if (!player) return;

        var x = Entity.getX(player);
        var y = Entity.getY(player);
        var z = Entity.getZ(player);

        if (countNumber > 0) {
            // طباعة الرقم بتنسيق مميز
            clientMessage("§e§l[CountDown] §c" + countNumber);
            
            // تشغيل صوت النقر (Click Sound)
            Level.playSound(x, y, z, "random.click", 1.0, 1.0 + (10 - countNumber) * 0.05);
            
            countNumber--;
        } else if (countNumber == 0) {
            // وصول العد للنهاية
            clientMessage("§6§l[CountDown] §a§lGO!");
            
            // تشغيل صوت انفجار عند الصفر
            Level.playSound(x, y, z, "random.explode", 1.0, 1.0);
            
            countNumber = -1; // إنهاء العد
        }
    }
}
