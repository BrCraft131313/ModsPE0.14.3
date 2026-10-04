/* ==========================================================================
   المود: الخنزير الطائر المسالم - الحصانة التامة وإمكانية الطيران
   ========================================================================== */

var PIG_ID = 12;
var riddenPig = -1;

// دالة فحص ما إذا كان الكائن في الهواء
function isEntityInAir(ent) {
    var x = Math.floor(Entity.getX(ent));
    var y = Math.floor(Entity.getY(ent) - 0.1);
    var z = Math.floor(Entity.getZ(ent));
    return Level.getTile(x, y, z) === 0;
}

// 1. حماية الخنزير ومنع إلحاق الضرر
function entityHurtHook(attacker, victim, halfhearts) {
    // حماية الخنزير من أي ضرر
    if (Entity.getEntityTypeId(victim) == PIG_ID) {
        if (typeof preventDefault === "function") {
            preventDefault();
        }
    }
    // منع الخنزير من إلحاق الضرر
    if (Entity.getEntityTypeId(attacker) == PIG_ID) {
        if (typeof preventDefault === "function") {
            preventDefault();
        }
    }
}

function attackHook(attacker, victim) {
    var player = Player.getEntity();
    
    // عند ضرب/الضغط على الخنزير يتم ركوبه
    if (attacker == player && Entity.getEntityTypeId(victim) == PIG_ID) {
        riddenPig = victim;
        Entity.rideAnimal(player, victim);
        
        if (typeof preventDefault === "function") {
            preventDefault();
        }
        
        clientMessage("[FlyingPig] Riding Pig! Look around to fly, Sneak (Shift) to dismount.");
    }
}

function modTick() {
    var player = Player.getEntity();
    var allEntities = Entity.getAll();

    // 2. تعبئة صحة الخنازير وإعادتها للأرض إذا كانت معلقة
    for (var i = 0; i < allEntities.length; i++) {
        var ent = allEntities[i];
        if (Entity.getEntityTypeId(ent) == PIG_ID) {

            // تعبئة صحة الخنزير للحد الأقصى
            Entity.setHealth(ent, 10);

            // إعادة الخنزير للأرض إذا كان معلقاً في الهواء وغير مركب
            if (ent != riddenPig && isEntityInAir(ent)) {
                Entity.setVelY(ent, -0.2);
            }
        }
    }

    // 3. التحكم بالطيران والنزول
    if (riddenPig != -1) {
        
        // عند النزول (Shift) أو موت الخنزير
        if (Entity.isSneaking(player) || Entity.getHealth(riddenPig) <= 0) {
            var targetPig = riddenPig;
            riddenPig = -1;

            // فك ارتباط الركوب رسمياً
            Entity.rideAnimal(player, -1);

            // تصفير جميع السرعات فوراً
            Entity.setVelX(targetPig, 0);
            Entity.setVelY(targetPig, 0);
            Entity.setVelZ(targetPig, 0);
            return;
        }

        // حساب اتجاهات الطيران 3D
        var yaw = Entity.getYaw(player);
        var pitch = Entity.getPitch(player);

        var yawRad = yaw * Math.PI / 180;
        var pitchRad = pitch * Math.PI / 180;

        var speed = 0.5;

        var vx = -Math.sin(yawRad) * Math.cos(pitchRad) * speed;
        var vy = -Math.sin(pitchRad) * speed;
        var vz = Math.cos(yawRad) * Math.cos(pitchRad) * speed;

        Entity.setVelX(riddenPig, vx);
        Entity.setVelY(riddenPig, vy);
        Entity.setVelZ(riddenPig, vz);
    }
}
