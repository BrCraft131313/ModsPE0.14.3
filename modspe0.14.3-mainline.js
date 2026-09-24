/*
 * Mod Name     : PvP Training Dummy (Native ModPE + DPS & Armor)
 * Target Engine: MCPE 0.14.3 (BlockLauncher / ModPE Script)
 * Standard    : MECANE (Messages English, Comments Arabic, No Emojis)
 */

// ==========================================
// 1. تسجيل بيضة الاستدعاء والمتغيرات
// ==========================================

ModPE.setItem(500, "spawn_egg", 0, "Spawn PvP Dummy");

var DUMMY_NAME = "§l§c[PvP Dummy]§r";
var currentCombo = 0;
var hitTimestamps = [];
var lastHitTime = 0;

// متغيرات حساب الـ DPS
var comboDamage = 0;
var comboStartTime = 0;

// ==========================================
// 2. حدث استخدام بيضة الاستدعاء
// ==========================================

function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    if (itemId === 500) {
        var dummy = Level.spawnMob(x + 0.5, y + 1.0, z + 0.5, 32, "");
        
        Entity.setNameTag(dummy, DUMMY_NAME);
        Entity.setImmobile(dummy, true);
        
        // تأثير مقاومة النار لتجنب الاحتراق بالشمس
        Entity.addEffect(dummy, 12, 999999, 1, false, true);
        
        resetStats();
        clientMessage("§a[PvP Dummy] Dummy spawned. Use /dummyarmor <leather|iron|gold|diamond|clear> to equip armor.");
    }
}

// ==========================================
// 3. حدث إلحاق الضرر (CPS, DPS & Combo)
// ==========================================

function entityHurtHook(attacker, victim, halfhearts) {
    if (Entity.getNameTag(victim) === DUMMY_NAME) {
        var now = Date.now();
        hitTimestamps.push(now);

        // تنظيف مؤقت الـ CPS (الضربات في آخر ثانية)
        while (hitTimestamps.length > 0 && hitTimestamps[0] < now - 1000) {
            hitTimestamps.shift();
        }

        var cps = hitTimestamps.length;
        
        // بدء حساب زمن الـ Combo والـ DPS
        if (currentCombo === 0) {
            comboStartTime = now;
            comboDamage = 0;
        }

        currentCombo++;
        comboDamage += halfhearts;
        lastHitTime = now;

        // حساب الـ DPS (إجمالي الضرر / الثواني المنقضية)
        var durationSec = Math.max(1, (now - comboStartTime) / 1000);
        var dps = (comboDamage / durationSec).toFixed(1);

        // إعادة صحة الدمية وإطفاء النيران
        Entity.setHealth(victim, Entity.getMaxHealth(victim));
        Entity.setFireTicks(victim, 0);

        // إرسال البيانات
        clientMessage("§a[PvP Dummy] §fCombo: §e" + currentCombo + " §f| CPS: §b" + cps + " §f| DPS: §c" + dps + " §f| Hit: §d" + halfhearts + " HP");
        ModPE.showTipMessage("§eCombo: " + currentCombo + " §f| §bCPS: " + cps + " §f| §cDPS: " + dps);
    }
}

// ==========================================
// 4. التكرار الدوري لتصفير الـ Combo
// ==========================================

function modTick() {
    var now = Date.now();

    while (hitTimestamps.length > 0 && hitTimestamps[0] < now - 1000) {
        hitTimestamps.shift();
    }

    if (currentCombo > 0 && (now - lastHitTime > 2000)) {
        var durationSec = Math.max(1, (lastHitTime - comboStartTime) / 1000);
        var finalDps = (comboDamage / durationSec).toFixed(1);
        
        clientMessage("§c[PvP Dummy] Combo ended! Total Damage: " + comboDamage + " HP | Avg DPS: " + finalDps);
        resetStats();
    }
}

// ==========================================
// 5. إدارة أوامر الشات وتغيير الدروع
// ==========================================

function chatHook(str) {
    var args = str.trim().toLowerCase().split(" ");
    var cmd = args[0];

    if (cmd === "giveegg" || cmd === "/giveegg") {
        Player.addItemInventory(500, 1, 0);
        clientMessage("§a[PvP Dummy] Spawn egg added!");
    } 
    else if (cmd === "cleardummy" || cmd === "/cleardummy") {
        var count = removeAllDummies();
        clientMessage("§a[PvP Dummy] Cleared " + count + " dummy entity(ies).");
    }
    else if (cmd === "dummyarmor" || cmd === "/dummyarmor") {
        var armorType = args[1] || "clear";
        applyArmorToDummies(armorType);
    }
}

// ==========================================
// 6. دوال مساعدة (Helper Functions)
// ==========================================

function resetStats() {
    currentCombo = 0;
    hitTimestamps = [];
    comboDamage = 0;
    comboStartTime = 0;
}

function removeAllDummies() {
    var allEntities = Entity.getAll();
    var count = 0;
    for (var i = 0; i < allEntities.length; i++) {
        if (Entity.getNameTag(allEntities[i]) === DUMMY_NAME) {
            Entity.remove(allEntities[i]);
            count++;
        }
    }
    return count;
}

function applyArmorToDummies(type) {
    var armorSet = [0, 0, 0, 0]; // خوذة، درع، بنطال، حذاء

    if (type === "leather") {
        armorSet = [298, 299, 300, 301];
    } else if (type === "iron") {
        armorSet = [306, 307, 308, 309];
    } else if (type === "gold") {
        armorSet = [314, 315, 316, 317];
    } else if (type === "diamond") {
        armorSet = [310, 311, 312, 313];
    }

    var allEntities = Entity.getAll();
    var updated = 0;

    for (var i = 0; i < allEntities.length; i++) {
        if (Entity.getNameTag(allEntities[i]) === DUMMY_NAME) {
            for (var slot = 0; slot < 4; slot++) {
                Entity.setArmorItem(allEntities[i], slot, armorSet[slot], 1, 0);
            }
            updated++;
        }
    }

    clientMessage("§a[PvP Dummy] Set armor to [" + type.toUpperCase() + "] on " + updated + " dummy(ies).");
}
