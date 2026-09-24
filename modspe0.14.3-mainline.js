/*
 * Mod Name     : Custom Pi Physics, Gravity, Jump, Speed & FOV
 * Target Engine: MCPE 0.14.3 (Native ModPE Script)
 * Standard    : MECANE (Messages English, Comments Arabic, No Emojis)
 */

// ==========================================
// 1. المتغيرات وإعدادات الباي
// ==========================================

var ORIGINAL_PI = Math.PI; // 3.141592653589793
var customPI = Math.PI;

var showAura = true;
var auraRadius = 3;

// مصفوفة تتبع المقذوفات النشطة
var activeProjectiles = [];
var PROJECTILE_TYPES = [80, 81, 82, 85, 86]; // Arrow, Snowball, Egg, Fireball, Splash Potion

var lastYVel = 0;

// ==========================================
// 2. التقاط الكيانات الملقاة (entityAddedHook)
// ==========================================

function entityAddedHook(entity) {
    var typeId = Entity.getEntityTypeId(entity);
    for (var i = 0; i < PROJECTILE_TYPES.length; i++) {
        if (typeId === PROJECTILE_TYPES[i]) {
            activeProjectiles.push(entity);
            break;
        }
    }
}

// ==========================================
// 3. معالجة أوامر الشات (/pi)
// ==========================================

function chatHook(str) {
    var args = str.trim().toLowerCase().split(" ");
    var cmd = args[0];

    if (cmd === "pi" || cmd === "/pi") {

        if (args.length < 2) {
            clientMessage("§e[Pi Mod] Usage: /pi <number | reset | circle | aura>");
            clientMessage("§e[Pi Mod] Current Pi: §b" + customPI + " §7(Original: " + ORIGINAL_PI.toFixed(4) + ")");
            return;
        }

        var subCmd = args[1];

        if (subCmd === "reset") {
            customPI = ORIGINAL_PI;
            updatePlayerEffects();
            clientMessage("§a[Pi Mod] Pi reset to original value (" + ORIGINAL_PI.toFixed(5) + ").");
            return;
        }

        if (subCmd === "aura") {
            showAura = !showAura;
            clientMessage("§a[Pi Mod] Visual aura toggled: " + (showAura ? "ON" : "OFF"));
            return;
        }

        if (subCmd === "circle") {
            buildDistortedCircle();
            return;
        }

        var newVal = parseFloat(subCmd);
        if (isNaN(newVal) || newVal <= 0) {
            clientMessage("§c[Pi Mod] Invalid number. Please enter a positive value.");
            return;
        }

        customPI = newVal;
        updatePlayerEffects();
        clientMessage("§a[Pi Mod] Pi value updated to: §e" + customPI);
        clientMessage("§7[Pi Mod] Gravity, jump height, speed, and FOV recalculated!");
    }
}

// ==========================================
// 4. التكرار الدوري (modTick)
// ==========================================

function modTick() {
    if (showAura) {
        renderAura();
    }
    
    updateProjectilePhysics();
    applyCustomGravity();

    if (Math.abs(customPI - ORIGINAL_PI) > 0.01) {
        updatePlayerEffects();
    }
}

// ==========================================
// 5. تأثير Pi على السرعة، القفز، و FOV
// ==========================================

function updatePlayerEffects() {
    var player = Player.getEntity();
    if (player === null) return;

    // تنظيف التأثيرات السابقة
    Entity.removeEffect(player, 1); // Speed
    Entity.removeEffect(player, 2); // Slowness
    Entity.removeEffect(player, 8); // Jump Boost

    var ratio = customPI / ORIGINAL_PI;

    // زيادة Pi: زيادة السرعة، توسيع FOV، وقفزة أعلى
    if (ratio > 1.05) {
        var speedAmp = Math.min(15, Math.floor((ratio - 1.0) * 3));
        var jumpAmp = Math.min(10, Math.floor((ratio - 1.0) * 2.5));

        Entity.addEffect(player, 1, 40, speedAmp, false, false);
        Entity.addEffect(player, 8, 40, jumpAmp, false, false);
    } 
    // نقصان Pi: بطء الحركة، تضييق FOV، وقفزة ثقيلة
    else if (ratio < 0.95) {
        var slowAmp = Math.min(10, Math.floor((1.0 - ratio) * 4));
        Entity.addEffect(player, 2, 40, slowAmp, false, false);
    }
}

// ==========================================
// 6. تعديل ديناميكية الجاذبية أثناء الطيران/السقوط
// ==========================================

function applyCustomGravity() {
    var player = Player.getEntity();
    if (player === null) return;

    var ratio = customPI / ORIGINAL_PI;
    if (Math.abs(ratio - 1.0) < 0.02) return;

    var vy = Entity.getVelY(player);

    // تعديل الجاذبية أثناء السقوط
    if (vy < -0.05) {
        // قيمة Pi أكبر = جاذبية أبطأ (سقوط سلس)
        // قيمة Pi أصغر = جاذبية أشد (سقوط سريع)
        var newVy = vy * (1.0 / Math.sqrt(ratio));
        Entity.setVelY(player, Math.max(-1.5, newVy));
    }
}

// ==========================================
// 7. فيزياء المقذوفات وانحراف المتجهات
// ==========================================

function updateProjectilePhysics() {
    var piRatio = customPI / ORIGINAL_PI;
    var deviationFactor = (piRatio - 1.0);

    if (Math.abs(deviationFactor) < 0.001) return;

    for (var i = activeProjectiles.length - 1; i >= 0; i--) {
        var ent = activeProjectiles[i];

        if (Entity.getX(ent) === undefined || Entity.getHealth(ent) <= 0) {
            activeProjectiles.splice(i, 1);
            continue;
        }

        var vx = Entity.getVelX(ent);
        var vy = Entity.getVelY(ent);
        var vz = Entity.getVelZ(ent);

        var angleShift = 0.08 * deviationFactor;

        var newVx = vx * Math.cos(angleShift) - vz * Math.sin(angleShift);
        var newVz = vx * Math.sin(angleShift) + vz * Math.cos(angleShift);
        var newVy = vy + (0.015 * deviationFactor);

        Entity.setVelX(ent, newVx);
        Entity.setVelY(ent, newVy);
        Entity.setVelZ(ent, newVz);
    }
}

// ==========================================
// 8. دوال الهالة والبناء الهندسي
// ==========================================

function renderAura() {
    var px = Player.getX();
    var py = Player.getY() + 0.2;
    var pz = Player.getZ();

    var steps = 30;
    var maxAngle = 2 * customPI;

    for (var i = 0; i < steps; i++) {
        var angle = (i / steps) * maxAngle;
        var x = px + auraRadius * customMathCos(angle);
        var z = pz + auraRadius * customMathSin(angle);

        Level.addParticle(14, x, py, z, 0, 0, 0, 1);
    }
}

function buildDistortedCircle() {
    var px = Math.floor(Player.getX());
    var py = Math.floor(Player.getY()) - 1;
    var pz = Math.floor(Player.getZ());

    var radius = 6;
    var totalSteps = Math.floor(20 * (customPI / ORIGINAL_PI));

    clientMessage("§a[Pi Mod] Generating geometry with Pi = " + customPI + "...");

    for (var i = 0; i < totalSteps; i++) {
        var angle = (i / totalSteps) * (2 * customPI);

        var bx = px + Math.round(radius * customMathCos(angle));
        var bz = pz + Math.round(radius * customMathSin(angle));

        Level.setTile(bx, py, bz, 35, 14);
    }
}

function customMathSin(angle) {
    var factor = ORIGINAL_PI / customPI;
    return Math.sin(angle * factor);
}

function customMathCos(angle) {
    var factor = ORIGINAL_PI / customPI;
    return Math.cos(angle * factor);
                               }
