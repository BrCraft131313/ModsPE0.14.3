// ===============================================
// ModPE Script: Home / Sethome System
// Version: 1.0 (Minecraft PE 0.14.3)
// ===============================================

// Variables to store home coordinates
var homeX = null;
var homeY = null;
var homeZ = null;
var isHomeSet = false;

function procCmd(command) {
    var cmd = command.split(" ");
    var mainCmd = cmd[0].toLowerCase();

    // 1. Save home location command (/sethome)
    if (mainCmd === "sethome") {
        homeX = getPlayerX();
        homeY = getPlayerY();
        homeZ = getPlayerZ();
        isHomeSet = true;

        // Round coordinates for display
        var printX = Math.floor(homeX);
        var printY = Math.floor(homeY);
        var printZ = Math.floor(homeZ);

        clientMessage("§a[HomeMod] Home location saved successfully! §7(X: " + printX + ", Y: " + printY + ", Z: " + printZ + ")");
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
