// Block Gravity Mod for MCPE 0.14.3 (Fixed & Auto-Check)
// يجعل كل البلوكات المرتفعة تسقط تلقائياً كالرمل والجرافل باستثناء البيدروك (7)

var isGravityEnabled = true;

function procCmd(command) {
    var args = command.split(" ");
    var cmd = args[0].toLowerCase();

    if (cmd == "gv" || cmd == "gravity") {
        if (args.length > 1) {
            var subCmd = args[1].toLowerCase();
            if (subCmd == "on" || subCmd == "enable") {
                isGravityEnabled = true;
                clientMessage("§a[Gravity] Enabled!");
                return;
            } else if (subCmd == "off" || subCmd == "disable") {
                isGravityEnabled = false;
                clientMessage("§c[Gravity] Disabled!");
                return;
            }
        }
        isGravityEnabled = !isGravityEnabled;
        if (isGravityEnabled) {
            clientMessage("§a[Gravity] Enabled!");
        } else {
            clientMessage("§c[Gravity] Disabled!");
        }
    }
}

// فحص مستمر وحقيقي لكل البلوكات القريبة حول اللاعب في كل لحظة
function modTick() {
    if (!isGravityEnabled) return;

    var player = Player.getEntity();
    if (!player) return;

    var px = Math.floor(Entity.getX(player));
    var py = Math.floor(Entity.getY(player));
    var pz = Math.floor(Entity.getZ(player));

    // فحص نطاق (Radius) حول اللاعب لأسقاط البلوكات المعلقة
    var radius = 5;
    for (var x = px - radius; x <= px + radius; x++) {
        for (var y = 1; y <= py + 5; y++) {
            for (var z = pz - radius; z <= pz + radius; z++) {
                checkAndDrop(x, y, z);
            }
        }
    }
}

function checkAndDrop(x, y, z) {
    var id = getTile(x, y, z);

    // استثناء: الهواء (0)، البيدروك (7)، الماء (8, 9)، اللافا (10, 11)
    if (id == 0 || id == 7 || id == 8 || id == 9 || id == 10 || id == 11) return;

    var belowId = getTile(x, y - 1, z);

    // إذا كان أسفل البلوك هواء أو سائل، يتم تنزيله فوراً
    if (belowId == 0 || belowId == 8 || belowId == 9 || belowId == 10 || belowId == 11) {
        var data = Level.getData(x, y, z);
        setTile(x, y, z, 0, 0); // مسح البلوك العلوي
        setTile(x, y - 1, z, id, data); // إنزاله للبلوك الأسفل
    }
}
