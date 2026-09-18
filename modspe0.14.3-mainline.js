// Custom Spawn Mod for MCPE 0.14.3

function procCmd(cmd) {
    var args = cmd.split(" ");
    var command = args[0].toLowerCase();

    // أمر تحديد السباون في الموقع الحالي
    if (command == "setspawn") {
        var px = Math.floor(Player.getX());
        var py = Math.floor(Player.getY());
        var pz = Math.floor(Player.getZ());

        // تعيين السباون الرئيسي للروم/العالم
        Level.setSpawn(px, py, pz);

        clientMessage("§a[Spawn] Spawn point set to: " + px + ", " + py + ", " + pz);
        preventDefault();
    } 

    // أمر الانتقال إلى السباون
    else if (command == "spawn") {
        var sx = Level.getSpawnX();
        var sy = Level.getSpawnY();
        var sz = Level.getSpawnZ();

        // نقل اللاعب فوق بلكة السباون مباشرة
        Entity.setPosition(Player.getEntity(), sx + 0.5, sy + 1, sz + 0.5);

        clientMessage("§b[Spawn] Teleported to spawn!");
        preventDefault();
    }
}
