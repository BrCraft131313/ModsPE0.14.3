/*
 * Mod Name     : Herobrine Army & Horror Experience Mod
 * Target Engine: MCPE 0.14.3 (Native ModPE Script)
 * Standard    : MECANE (Messages English, Comments Arabic, No Emojis)
 */

// ==========================================
// 1. المتغيرات العامة
// ==========================================

var isHerobrineActive = false;
var herobrineEntity = null;
var clonesList = [];
var tickCounter = 0;
var eventInterval = 160; // حدث كل 8 ثواني تقريباً

// ==========================================
// 2. معالجة أوامر الشات (/herobrine)
// ==========================================

function chatHook(str) {
    var args = str.trim().toLowerCase().split(" ");
    var cmd = args[0];

    if (cmd === "herobrine" || cmd === "/herobrine") {
        if (args.length < 2) {
            clientMessage("§e[Herobrine Mod] Usage: /herobrine <start | stop | spawn>");
            return;
        }

        var subCmd = args[1];

        if (subCmd === "start") {
            isHerobrineActive = true;
            clientMessage("§c[Herobrine] YOUR NIGHTMARE BEGINS NOW...");
        } 
        else if (subCmd === "stop") {
            isHerobrineActive = false;
            removeHerobrine();
            removeAllClones();
            clientMessage("§a[Herobrine] The nightmare has ended.");
        } 
        else if (subCmd === "spawn") {
            isHerobrineActive = true;
            jumpscareAttack();
            clientMessage("§4§l[Herobrine] BEHIND YOU.");
        }
    }
}

// ==========================================
// 3. طقوس التوتم واستدعاء مباشر
// ==========================================

function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    if (itemId === 259 && blockId === 87) {
        if (Level.getTile(x, y - 1, z) === 41) {
            isHerobrineActive = true;
            Level.spawnMob(x + 0.5, y + 2, z + 0.5, 93); // Lightning Bolt
            
            jumpscareAttack();
            clientMessage("§4§l[Herobrine] YOU SHOULD NOT HAVE DONE THAT.");
        }
    }
}

// ==========================================
// 4. التكرار الدوري والتحديث المستمر
// ==========================================

function modTick() {
    if (!isHerobrineActive) return;

    tickCounter++;

    if (tickCounter >= eventInterval) {
        tickCounter = 0;
        triggerRandomHorrorEvent();
    }

    if (herobrineEntity !== null) {
        lookAtPlayer(herobrineEntity);

        var px = Player.getX();
        var py = Player.getY();
        var pz = Player.getZ();

        var hx = Entity.getX(herobrineEntity);
        var hy = Entity.getY(herobrineEntity);
        var hz = Entity.getZ(herobrineEntity);

        if (hx !== undefined) {
            var dist = Math.sqrt(Math.pow(px - hx, 2) + Math.pow(py - hy, 2) + Math.pow(pz - hz, 2));

            if (dist < 2.5) {
                var player = Player.getEntity();
                Entity.addEffect(player, 20, 100, 2, false, true); // Wither Effect
                Level.spawnMob(px, py, pz, 93); // Lightning Bolt
                Level.playSound(px, py, pz, "mob.ghast.scream", 1.0, 1.0);
                vanishHerobrine();
            }
        } else {
            herobrineEntity = null;
        }
    }

    for (var i = 0; i < clonesList.length; i++) {
        if (clonesList[i] !== null) {
            lookAtPlayer(clonesList[i]);
        }
    }
}

// ==========================================
// 5. أحداث الرعب المتقدمة
// ==========================================

function triggerRandomHorrorEvent() {
    removeAllClones();
    var rand = Math.floor(Math.random() * 8);

    if (rand === 0) {
        jumpscareAttack();
    } 
    else if (rand === 1) {
        spawnCloneCircle();
    } 
    else if (rand === 2) {
        snuffNearbyTorches();
    } 
    else if (rand === 3) {
        telekineticToss();
    } 
    else if (rand === 4) {
        destroyNearbyBlocks();
    }
    else if (rand === 5) {
        spawnMinionArmy(); // الحدث الجديد: استدعاء جيش الوحوش
    }
    else if (rand === 6) {
        var player = Player.getEntity();
        Entity.addEffect(player, 15, 120, 2, false, false); // Blindness
        Entity.addEffect(player, 9, 120, 1, false, false);  // Nausea
        Level.playSound(Player.getX(), Player.getY(), Player.getZ(), "mob.ghast.charge", 1.0, 0.8);
        clientMessage("§4§lCAN YOU FEEL MY PRESENCE?");
    } 
    else if (rand === 7) {
        Level.setNightMode(true);
        var px = Math.floor(Player.getX());
        var py = Math.floor(Player.getY());
        var pz = Math.floor(Player.getZ());
        
        Level.setTile(px + 1, py, pz, 51);
        Level.setTile(px - 1, py, pz, 51);
        Level.setTile(px, py, pz + 1, 51);
        Level.setTile(px, py, pz - 1, 51);
        
        Level.playSound(px, py, pz, "mob.ghast.scream", 1.0, 0.6);
        clientMessage("§c[Herobrine] THIS WORLD IS MINE.");
    }
}

// ==========================================
// 6. دوال المساعدة الميكانيكية
// ==========================================

function spawnMinionArmy() {
    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();
    var count = 6;
    var radius = 4;

    for (var i = 0; i < count; i++) {
        var angle = (i * (360 / count)) * (Math.PI / 180);
        var mx = px + Math.sin(angle) * radius;
        var mz = pz + Math.cos(angle) * radius;

        // التبديل العشوائي بين الزومبي (ID 32) والسكلتون (ID 34)
        var mobType = (i % 2 === 0) ? 32 : 34; 
        var minion = Level.spawnMob(mx, py, mz, mobType, "");

        if (minion !== null && minion !== undefined) {
            Entity.setNameTag(minion, "§cHerobrine's Minion");
            Entity.addEffect(minion, 1, 600, 1, false, false); // Speed
        }
    }

    Level.playSound(px, py, pz, "mob.ghast.scream", 1.0, 0.8);
    clientMessage("§4§l[Herobrine] RISE MY SERVANTS!");
}

function jumpscareAttack() {
    removeHerobrine();

    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();

    var yaw = Entity.getYaw(Player.getEntity());
    var rad = yaw * (Math.PI / 180);

    var hx = px + Math.sin(rad) * 2;
    var hz = pz - Math.cos(rad) * 2;

    herobrineEntity = Level.spawnMob(hx, py, hz, 32, "");
    configureHerobrineEntity(herobrineEntity);

    var player = Player.getEntity();
    Entity.addEffect(player, 2, 40, 255, false, false);  // Slowness
    Entity.addEffect(player, 15, 40, 1, false, false);   // Blindness
    
    Level.playSound(px, py, pz, "mob.ghast.scream", 1.0, 1.0);
}

function spawnCloneCircle() {
    removeHerobrine();
    removeAllClones();

    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();
    var radius = 5;

    var angles = [0, 90, 180, 270];
    for (var i = 0; i < angles.length; i++) {
        var rad = angles[i] * (Math.PI / 180);
        var cx = px + Math.sin(rad) * radius;
        var cz = pz + Math.cos(rad) * radius;

        var clone = Level.spawnMob(cx, py, cz, 32, "");
        configureHerobrineEntity(clone);
        clonesList.push(clone);
    }

    Level.playSound(px, py, pz, "mob.ghast.charge", 1.0, 0.7);
    clientMessage("§4§lLOOK AROUND YOU.");
}

function destroyNearbyBlocks() {
    var px = Math.floor(Player.getX());
    var py = Math.floor(Player.getY());
    var pz = Math.floor(Player.getZ());
    var radius = 3;

    for (var x = px - radius; x <= px + radius; x++) {
        for (var y = py; y <= py + 3; y++) {
            for (var z = pz - radius; z <= pz + radius; z++) {
                var tile = Level.getTile(x, y, z);
                if (tile !== 0 && tile !== 7) {
                    Level.setTile(x, y, z, 0);
                    Level.addParticle(4, x + 0.5, y + 0.5, z + 0.5, 0, 0, 0, 1);
                }
            }
        }
    }
    Level.playSound(px, py, pz, "random.explode", 1.0, 0.8);
    Level.playSound(px, py, pz, "mob.ghast.scream", 1.0, 0.9);
    clientMessage("§c[Herobrine] YOUR SHELTER WON'T SAVE YOU.");
}

function telekineticToss() {
    var player = Player.getEntity();
    Entity.setVelY(player, 1.2);
    Level.spawnMob(Player.getX(), Player.getY(), Player.getZ(), 93);
    Level.playSound(Player.getX(), Player.getY(), Player.getZ(), "mob.ghast.scream", 1.0, 0.5);
    clientMessage("§c[Herobrine] KNEEL BEFORE ME.");
}

function snuffNearbyTorches() {
    var px = Math.floor(Player.getX());
    var py = Math.floor(Player.getY());
    var pz = Math.floor(Player.getZ());
    var radius = 6;

    for (var x = px - radius; x <= px + radius; x++) {
        for (var y = py - 2; y <= py + 3; y++) {
            for (var z = pz - radius; z <= pz + radius; z++) {
                var tile = Level.getTile(x, y, z);
                if (tile === 50) {
                    Level.setTile(x, y, z, 0);
                    Level.addParticle(4, x + 0.5, y + 0.5, z + 0.5, 0, 0, 0, 1);
                }
            }
        }
    }
    Level.playSound(px, py, pz, "random.fizz", 1.0, 0.5);
    clientMessage("§0§l[Darkness Falls]");
}

function configureHerobrineEntity(ent) {
    if (ent !== null && ent !== undefined) {
        Entity.setNameTag(ent, "§c§lHerobrine");
        Entity.setImmobile(ent, true);
        Entity.setCarriedItem(ent, 0, 0, 0);
    }
}

function lookAtPlayer(ent) {
    if (ent === null || ent === undefined) return;
    var px = Player.getX();
    var pz = Player.getZ();
    var hx = Entity.getX(ent);
    var hz = Entity.getZ(ent);

    if (hx !== undefined) {
        var dx = px - hx;
        var dz = pz - hz;
        var yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
        Entity.setRot(ent, 0, yaw);
    }
}

function vanishHerobrine() {
    if (herobrineEntity !== null) {
        var hx = Entity.getX(herobrineEntity);
        var hy = Entity.getY(herobrineEntity);
        var hz = Entity.getZ(herobrineEntity);

        if (hx !== undefined) {
            for (var i = 0; i < 20; i++) {
                Level.addParticle(4, hx + (Math.random() - 0.5), hy + 1, hz + (Math.random() - 0.5), 0, 0, 0, 1);
            }
        }
        Entity.remove(herobrineEntity);
        herobrineEntity = null;
    }
}

function removeHerobrine() {
    if (herobrineEntity !== null) {
        Entity.remove(herobrineEntity);
        herobrineEntity = null;
    }
}

function removeAllClones() {
    for (var i = 0; i < clonesList.length; i++) {
        if (clonesList[i] !== null) {
            Entity.remove(clonesList[i]);
        }
    }
    clonesList = [];
            }
        
