// ===============================================
// ModPE Script: Home / Sethome System
// Version: 1.2 (Fixed Save Data for MCPE 0.14.3)
// ===============================================

// Variables to store home coordinates
var homeX = null;
var homeY = null;
var homeZ = null;
var isHomeSet = false;

// دالة تُستدعى تلقائياً عند الدخول للعالم لتحميل الإحداثيات المحفوظة
function selectLevelHook() {
    var savedX = ModPE.readData("home_x");
    var savedY = ModPE.readData("home_y");
    var savedZ = ModPE.readData("home_z");
    var savedSet = ModPE.readData("home_isSet");

    if (savedSet === "true" && savedX !== "") {
        homeX = parseFloat(savedX);
        homeY = parseFloat(savedY);
        homeZ = parseFloat(savedZ);
        isHomeSet = true;
    }
}

function procCmd(command) {
    var cmd = command.split(" ");
    var mainCmd = cmd[0].toLowerCase();

    // 1. Save home location command (/sethome)
    if (mainCmd === "sethome") {
        homeX = getPlayerX();
        homeY = getPlayerY();
        homeZ = getPlayerZ();
        isHomeSet = true;

        // حفظ الإحداثيات باستخدام الدوال الرسمية الصحيحة
        ModPE.saveData("home_x", homeX.toString());
        ModPE.saveData("home_y", homeY.toString());
        ModPE.saveData("home_z", homeZ.toString());
        ModPE.saveData("home_isSet", "true");

        // Round coordinates for display
        var printX = Math.floor(homeX);
        var printY = Math.floor(homeY);
        var printZ = Math.floor(homeZ);

        clientMessage("§a[HomeMod] Home location saved & stored! §7(X: " + printX + ", Y: " + printY + ", Z: " + printZ + ")");
    }

    // 2. Teleport to home command (/home)
    else if (mainCmd === "home") {
        if (isHomeSet === true && homeX !== null) {
            // Teleport the player to the saved coordinates
            setPosition(getPlayerEnt(), homeX, homeY, homeZ);
            clientMessage("§b[HomeMod] Teleported to your home!");
        } else {
            clientMessage("§c[HomeMod] You haven't set a home location yet! Use /sethome first.");
        }
    }
}