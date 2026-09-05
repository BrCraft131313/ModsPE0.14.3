// البحث عن أهداف القرويين في كل دورة (modTick)
function modTick() {
    var allEntities = Entity.getAll();
    
    for (var i = 0; i < allEntities.length; i++) {
        var ent = allEntities[i];
        
        // التحقق مما إذا كان الكائن قروي (Villager ID: 15)
        if (Entity.getEntityTypeId(ent) == 15) {
            var vx = Math.floor(Entity.getX(ent));
            var vy = Math.floor(Entity.getY(ent));
            var vz = Math.floor(Entity.getZ(ent));
            
            // البحث عن أقرب هدف في نطاق 10 بلوكات حول القروي
            var target = findNearestTarget(vx, vy, vz, 10);
            
            if (target != null) {
                // حساب الاتجاه نحو الهدف
                var dx = (target.x + 0.5) - Entity.getX(ent);
                var dz = (target.z + 0.5) - Entity.getZ(ent);
                var distance = Math.sqrt(dx * dx + dz * dz);
                
                // إذا كان القروي بعيداً عن الهدف، سحبه بقوة نحو الهدف
                if (distance > 1.2) {
                    var speed = 0.25; // سرعة الحركة
                    
                    // دفع القروي مباشرة نحو الهدف (يتغلب على المشي العشوائي)
                    Entity.setVelX(ent, (dx / distance) * speed);
                    Entity.setVelZ(ent, (dz / distance) * speed);
                    
                    // التدوير المباشر لنظر القروي نحو البلوكة
                    var yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
                    Entity.setRot(ent, yaw, 0);
                    
                    // قفز تلقائي إذا صادف القروي بلوكة في طريقه
                    var nextX = Math.floor(Entity.getX(ent) + (dx / distance) * 0.8);
                    var nextZ = Math.floor(Entity.getZ(ent) + (dz / distance) * 0.8);
                    if (getTile(nextX, Math.floor(Entity.getY(ent)), nextZ) != 0) {
                        Entity.setVelY(ent, 0.35);
                    }
                } else {
                    // التوقف التام عند الوصول للهدف
                    Entity.setVelX(ent, 0);
                    Entity.setVelZ(ent, 0);
                }
            }
        }
    }
}

// دالة للبحث عن أقرب سرير أو بلوكة إيميرلد
function findNearestTarget(px, py, pz, radius) {
    var nearestDist = 999;
    var targetPos = null;
    
    // الفحص في نطاق مربّع حول القروي
    for (var x = -radius; x <= radius; x++) {
        for (var y = -2; y <= 3; y++) {
            for (var z = -radius; z <= radius; z++) {
                var bx = px + x;
                var by = py + y;
                var bz = pz + z;
                
                var blockId = getTile(bx, by, bz);
                
                // ID السرير = 26 | ID بلوكة الإيميرلد = 133
                if (blockId == 26 || blockId == 133) {
                    var dist = Math.sqrt(x * x + y * y + z * z);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        targetPos = {x: bx, y: by, z: bz};
                    }
                }
            }
        }
    }
    return targetPos;
}
