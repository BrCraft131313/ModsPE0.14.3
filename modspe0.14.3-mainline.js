// تعريف معرف أداة بيضة رسبون الزعيم الأسطوري الأقوى في التاريخ
var ULTIMATE_BOSS_EGG_ID = 531;

// تسجيل العنصر في المود وتحديد الشكل والاسم والحد الأقصى في التكديس[span_2](start_span)[span_2](end_span)
ModPE.setItem(ULTIMATE_BOSS_EGG_ID, "spawn_egg", 0, "Ultimate Boss Spawn Egg", 64);

// إضافة بيضة الرسبون إلى قائمة الكرياتف[span_3](start_span)[span_3](end_span)
Player.addItemCreativeInv(ULTIMATE_BOSS_EGG_ID, 1, 0);

// متغيرات تتبع الكيان الأسطوري[span_4](start_span)[span_4](end_span)
var ultimateBossId = -1;
var bossTickCounter = 0;

// استقبال الأوامر من الشات لاستدعاء الزعيم يدوياً[span_5](start_span)[span_5](end_span)
function procCmd(cmd) {
    var args = cmd.split(" ");
    if (args[0] === "ultimateboss") {
        var px = Player.getX();
        var py = Player.getY();
        var pz = Player.getZ();
        spawnUltimateBoss(px, py + 2, pz);
        clientMessage("The Ultimate Boss has been summoned via command.");
    }
}

// دالة إنشاء الزعيم الأسطوري الجامع لقوى الويذر والاندردراجون والواردن[span_6](start_span)[span_6](end_span)
function spawnUltimateBoss(x, y, z) {
    // استخدام الغول الحديدي (Entity ID 20) كقاعدة أساسية ضخمة وقوية[span_7](start_span)[span_7](end_span)
    var bossEnt = Level.spawnMob(x, y, z, 20);
    
    if (bossEnt) {
        Entity.setNameTag(bossEnt, "The Apex Destroyer [Wither + Dragon + Warden]");
        
        if (typeof Entity.setMaxHealth === "function") {
            Entity.setMaxHealth(bossEnt, 1000);
        }
        Entity.setHealth(bossEnt, 1000);
        
        ultimateBossId = bossEnt;
        clientMessage("WARNING: The ultimate entity has awakened!");
    }
    return bossEnt;
}

// التحديث المستمر لإدارة قدرات الزعيم المرعبة (طيران، انفجارات، سحب اللاعب، وتجديد الصحة)[span_8](start_span)[span_8](end_span)
function modTick() {
    if (ultimateBossId === -1) return;
    
    bossTickCounter++;
    
    // التحقق من حالة حياة الزعيم[span_9](start_span)[span_9](end_span)
    if (!Entity.getHealth(ultimateBossId) || Entity.getHealth(ultimateBossId) <= 0) {
        clientMessage("Incredible! The Ultimate Boss has been defeated!");
        ultimateBossId = -1;
        return;
    }
    
    // تجديد الصحة المستمر (قوة الويذر والتجديد المطلق)[span_10](start_span)[span_10](end_span)
    var currentHealth = Entity.getHealth(ultimateBossId);
    if (currentHealth < 1000 && bossTickCounter % 20 === 0) {
        Entity.setHealth(ultimateBossId, Math.min(1000, currentHealth + 15));
    }
    
    var bx = Entity.getX(ultimateBossId);
    var by = Entity.getY(ultimateBossId);
    var bz = Entity.getZ(ultimateBossId);
    
    var px = Player.getX();
    var py = Player.getY();
    var pz = Player.getZ();
    
    var dx = px - bx;
    var dy = py - by;
    var dz = pz - bz;
    var distSq = dx * dx + dz * dz;
    var dist = Math.sqrt(distSq);
    
    // ميزة الطيران والملاحقة (دمج قدرة الاندردراجون والويذر في الطيران الحر)[span_11](start_span)[span_11](end_span)
    if (dist > 2.0) {
        var speed = 0.35;
        var vx = (dx / dist) * speed;
        var vz = (dz / dist) * speed;
        var vy = (dy / dist) * speed + 0.1;
        
        if (typeof Entity.setVelX === "function") {
            Entity.setVelX(ultimateBossId, vx);
            Entity.setVelY(ultimateBossId, vy);
            Entity.setVelZ(ultimateBossId, vz);
        }
    }
    
    // قدرة الجذب المغناطيسي الصوتي (قوة الواردن وسحب الفريسة)[span_12](start_span)[span_12](end_span)
    if (distSq < 100.0 && bossTickCounter % 40 === 0) {
        var playerEnt = Player.getEntity();
        if (typeof Entity.setVelX === "function" && dist > 0) {
            Entity.setVelX(playerEnt, (dx / dist) * 1.2);
            Entity.setVelY(playerEnt, 0.6);
            Entity.setVelZ(playerEnt, (dz / dist) * 1.2);
        }
        clientMessage("The boss unleashed a massive sonic roar and pulled you in!");
    }
    
    // قدرة تفجير محيطية دورية مع تصحيح قراءة وتعديل صحة اللاعب عبر الكيان[span_13](start_span)[span_13](end_span)
    if (distSq < 36.0 && bossTickCounter % 60 === 0) {
        Level.explode(bx, by, bz, 4.0);
        var playerEnt = Player.getEntity();
        var playerHealth = Entity.getHealth(playerEnt);
        if (playerHealth > 0) {
            Entity.setHealth(playerEnt, Math.max(0, playerHealth - 6));
        }
    }
}

// حماية مطلقة للزعيم من أي ضرر خارجي عشوائي ليبقى الأقوى على الإطلاق[span_14](start_span)[span_14](end_span)
function entityHurtHook(attacker, victim, halfhearts) {
    if (ultimateBossId === -1) return;
    
    if (victim === ultimateBossId) {
        if (attacker !== Player.getEntity()) {
            preventDefault();
        } else {
            var currentHealth = Entity.getHealth(ultimateBossId);
            Entity.setHealth(ultimateBossId, Math.max(1, currentHealth - 1));
            preventDefault();
        }
    }
}

// التقاط الهجوم المباشر للزعيم على الكائنات لضمان فتك مدمر[span_15](start_span)[span_15](end_span)
function attackHook(attacker, victim) {
    if (ultimateBossId === -1) return;
    
    if (attacker === ultimateBossId) {
        var victimHealth = Entity.getHealth(victim);
        if (victimHealth > 0) {
            Entity.setHealth(victim, Math.max(0, victimHealth - 20));
        }
    }
}

// التقاط الضغط واستخدام بيضة الرسبون لاستدعاء الكيان المرعب[span_16](start_span)[span_16](end_span)
function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    if (itemid === ULTIMATE_BOSS_EGG_ID) {
        spawnUltimateBoss(x + 0.5, y + 1.0, z + 0.5);
        clientMessage("Ultimate Boss spawned successfully via egg.");
        return;
    }
}
   
