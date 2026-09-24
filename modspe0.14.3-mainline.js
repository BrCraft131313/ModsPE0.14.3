/*
 * Mod Name     : Herobrine Nightmare Experience Mod (Ultra Hard)
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
var eventInterval = 160; // حدث كل 8 ثواني تقريباً (أسرع وأكثر إخافة)

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
// 3. طقوس التوتم واستدعام مباشر
// ==========================================

function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    if (itemId === 259 && blockId === 87) {
        if (Level.getTile(x, y - 1, z) === 41) {
            isHerobrineActive = true;
            Level.spawnMob(x + 0.5, y + 2, z + 0.5, 93); // Lightning Bolt
            
            // ترسبن هيروبراين فوراً مع قفزة رعب
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

    // توجيه هيروبراين والنسخ نحو اللاعب دائماً
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

            // إذا اقترب جداً يضرب اللاعب ويصعقه ثم يختفي
            if (dist < 2.5) {
                var player = Player.getEntity();
                Entity.addEffect(player, 20, 100, 2, false, true); // Wither Effect
                Level.spawnMob(px, py, pz, 93); // Lightning Bolt
                vanishHerobrine();
            }
        } else {
            herobrineEntity = null;
        }
    }

    // تحديث اتجاه نظر النسخ
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
    var rand = Math.floor(Math.random() * 6);

    if (rand === 0) {
        // الحدث 1: هجوم القفزة والمركّب (Jumpscare) خلف ظهر اللاعب
        jumpscareAttack();
    } 
    else if (rand === 1) {
        // الحدث 2: استدعاء دائرة من النسخ تحيط باللاعب (Circle of Clones)
        spawnCloneCircle();
    } 
    else if (rand === 2) {
        // الحدث 3: إطفاء الشموع المحيطة باللاعب وتحويل المكان لظلام
        snuffNearbyTorches();
    } 
    else if (rand === 3) {
        // الحدث 4: قذف اللاعب في الهواء (Telekinesis Attack)
        telekineticToss();
    } 
    else if (rand === 4) {
        // الحدث 5: عمى وغثيان مع رسالة مرعبة
        var player = Player.getEntity();
        Entity.addEffect(player, 15, 120, 2, false, false); // Blindness
        Entity.addEffect(player, 9, 120, 1, false, false);  // Nausea
        clientMessage("§4§lCAN YOU FEEL MY PRESENCE?");
    } 
    else if (rand === 5) {
        // الحدث 6: نيران وتحويل الجو لليل وصواعق متتالية
        Level.setNightMode(true);
        var px = Math.floor(Player.getX());
        var py = Math.floor(Player.getY());
        var pz = Math.floor(Player.getZ());
        
        Level.setTile(px + 1, py, pz, 51);
        Level.setTile(px - 1, py, pz, 51);
        Level.setTile(px, py, pz + 1, 51);
        Level.setTile(px, py, pz - 1, 51);
        
        clientMessage("§c[Herobrine] THIS WORLD IS MINE.");
    }
}

// ==========================================
// 6. دوال المساعدة الميكانيكية
// ==========================================

function jumpscareAttack() {
    removeHerobrine();

    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();

    var yaw = Entity.getYaw(Player.getEntity());
    var rad = yaw * (Math.PI / 180);

    // ظهور خلف اللاعب مباشرة على بعد 2 بلوكة
    var hx = px + Math.sin(rad) * 2;
    var hz = pz - Math.cos(rad) * 2;

    herobrineEntity = Level.spawnMob(hx, py, hz, 32, "");
    configureHerobrineEntity(herobrineEntity);

    // شلل وعمى مؤقت للاعب
    var player = Player.getEntity();
    Entity.addEffect(player, 2, 40, 255, false, false);  // Slowness (Freeze)
    Entity.addEffect(player, 15, 40, 1, false, false);   // Blindness
    Level.playSound(px, py, pz, "random.explode", 1.0, 0.5);
}

function spawnCloneCircle() {
    removeHerobrine();
    removeAllClones();

    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();
    var radius = 5;

    // استدعاء 4 نسخ في 4 اتجاهات مختلفة تحيط باللاعب
    var angles = [0, 90, 180, 270];
    for (var i = 0; i < angles.length; i++) {
        var rad = angles[i] * (Math.PI / 180);
        var cx = px + Math.sin(rad) * radius;
        var cz = pz + Math.cos(rad) * radius;

        var clone = Level.spawnMob(cx, py, cz, 32, "");
        configureHerobrineEntity(clone);
        clonesList.push(clone);
    }

    clientMessage("§4§lLOOK AROUND YOU.");
}

function telekineticToss() {
    var player = Player.getEntity();
    Entity.setVelY(player, 1.2); // رفع اللاعب للسماء
    Level.spawnMob(Player.getX(), Player.getY(), Player.getZ(), 93); // صاعقة
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
                if (tile === 50) { // Torch
                    Level.setTile(x, y, z, 0); // تدمير الشعلة
                    Level.addParticle(4, x + 0.5, y + 0.5, z + 0.5, 0, 0, 0, 1);
                }
            }
        }
    }
    clientMessage("§0§l[Darkness Falls]");
}

function configureHerobrineEntity(ent) {
    if (ent !== null && ent !== undefined) {
        Entity.setNameTag(ent, "§c§lHerobrine");
        Entity.setImmobile(ent, true);
        for (var s = 0; s < 4; s++) {
            Entity.setArmorItem(ent, s, 0, 0, 0);
        }
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
                                      
