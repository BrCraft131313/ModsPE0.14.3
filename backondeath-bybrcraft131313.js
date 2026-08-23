// ==========================================
// ModPE 0.14.3 - Back On Death Mod
// ==========================================

var lastDeathX = null;
var lastDeathY = null;
var lastDeathZ = null;
var hasDeathPos = false;

// [1] Track player death and save coordinates
function deathHook(attacker, victim) {
    if (victim == Player.getEntity()) {
        lastDeathX = Entity.getX(victim);
        lastDeathY = Entity.getY(victim);
        lastDeathZ = Entity.getZ(victim);
        hasDeathPos = true;

        clientMessage(ChatColor.RED + "You died! Type " + ChatColor.YELLOW + "/back" + ChatColor.RED + " to return to your death location.");
    }
}

// [2] Process /back command
function procCmd(cmd) {
    var args = cmd.split(" ");
    var command = args[0].toLowerCase();

    if (command == "back") {
        if (hasDeathPos) {
            var player = Player.getEntity();
            
            // Teleport player to the last death position
            Entity.setPosition(player, lastDeathX, lastDeathY, lastDeathZ);
            
            clientMessage(ChatColor.GREEN + "Teleported back to your death location!");
            
            // Spawn portal particles and sound on teleport
            Level.addParticle(ParticleType.portal, lastDeathX, lastDeathY + 1, lastDeathZ, 0, 0, 0, 20);
            Level.playSound(lastDeathX, lastDeathY, lastDeathZ, "mob.endermen.portal", 1.0, 1.0);
            
            // Reset state to prevent repeated teleports to the same spot
            hasDeathPos = false;
        } else {
            clientMessage(ChatColor.RED + "No death location saved!");
        }
    }
}

// [3] Reset data on game leave
function leaveGame() {
    lastDeathX = null;
    lastDeathY = null;
    lastDeathZ = null;
    hasDeathPos = false;
}