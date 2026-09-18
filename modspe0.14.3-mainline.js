// Custom Spawn Mod for MCPE 0.14.3

var spawnX = null;
var spawnY = null;
var spawnZ = null;

function procCmd(cmd) {
    var args = cmd.split(" ");
    var command = args[0].toLowerCase();

    // أمر تحديد السباون في الموقع الحالي
    if (command == "setspawn") {
        var px = Math.floor(Player.getX());
        var py = Math.floor(Player.getY());
        var pz = Math.floor(Player.getZ());

        // تعيين السباون الرئيسي للعالم عند الموت
        Level.setSpawn(px, py, pz);

        // حفظ الإحداثيات في المتغيرات وتخزينها في العالم
        spawnX = px;
        spawnY = py;
        spawnZ = pz;

        ModPE.saveData("spawn_x", px.toString());
        ModPE.saveData("spawn_y", py.toString());
        ModPE.saveData("spawn_z", pz.toString());

        clientMessage("§a[Spawn] Spawn point set to: " + px + ", " + py + ", " + pz);
        preventDefault();
    } 

    // أمر الانتقال إلى السباون
    else if (command == "spawn") {
        // قراءة الإحداثيات المحفوظة إن لم تكن مجهزة في الذاكرة
        if (spawnX == null) {
            var savedX = ModPE.readData("spawn_x");
            var savedY = ModPE.readData("spawn_y");
            var savedZ = ModPE.readData("spawn_z");

            if (savedX != "" && savedY != "" && savedZ != "") {
                spawnX = parseInt(savedX);
                spawnY = parseInt(savedY);
                spawnZ = parseInt(savedZ);
            }
        }

        // في حال عدم تعيين سباون سابقاً
        if (spawnX == null) {
            clientMessage("§c[Spawn] No spawn point set yet! Use /setspawn first.");
            preventDefault();
            return;
        }

        // نقل اللاعب فوق بلكة السباون مباشرة
        Entity.setPosition(Player.getEntity(), spawnX + 0.5, spawnY + 1, spawnZ + 0.5);

        clientMessage("§b[Spawn] Teleported to spawn!");
        preventDefault();
    }
}
