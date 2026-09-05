// متغير تفعيل وضع الكرة
var isBallModeActive = false;

// تفعيل وإلغاء الأمر /ball
function procCmd(cmd) {
    var args = cmd.split(" ");
    
    if (args[0] === "ball") {
        isBallModeActive = !isBallModeActive;
        
        if (isBallModeActive) {
            clientMessage("§a[BallMod] Wool Physics Enabled!");
        } else {
            clientMessage("§c[BallMod] Wool Physics Disabled.");
        }
    }
}

// عند الضغط على أي بلوكة صوف
function useItem(x, y, z, itemId, blockId, side, blockDamage) {
    // إذا كان المود مفعلاً والبلوكة صوف (ID: 35)
    if (isBallModeActive && blockId == 35) {
        
        // معرفة اتجاه وجه اللاعب (0=جنوب, 1=غرب, 2=شمال, 3=شرق)
        var yaw = Entity.getYaw(Player.getEntity());
        var direction = Math.floor((yaw + 45) / 90) % 4;
        if (direction < 0) direction += 4;
        
        // تحديد الإحداثيات الجديدة بناءً على اتجاه النظر
        var newX = x;
        var newZ = z;
        
        if (direction == 0) newZ += 1;      // للأمام (جنوب)
        else if (direction == 1) newX -= 1; // لليسار (غرب)
        else if (direction == 2) newZ -= 1; // للخلف (شمال)
        else if (direction == 3) newX += 1; // لليمين (شرق)
        
        // إزالة الصوف القديم
        setTile(x, y, z, 0);
        
        // وضع الصوف في المكان الجديد بنفس اللون
        setTile(newX, y, newZ, 35, blockDamage);
    }
}
