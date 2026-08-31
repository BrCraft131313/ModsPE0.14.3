// ==========================================
// مود Custom Crossbow (مضمون رسبنة البلوكات - 0.14.3)
// ==========================================

var crossAmount = 1; 
var crossBlockId = 2; 
var isSpawningExtra = false;

function procCmd(command) {
    var args = command.split(" ");
    
    if (args[0].toLowerCase() == "cross") {
        if (args.length >= 3) {
            var amount = parseInt(args[1]);
            var blockId = parseInt(args[2]);
            
            if (!isNaN(amount) && !isNaN(blockId)) {
                crossAmount = amount;
                crossBlockId = blockId;
                clientMessage("§a[Crossbow] Set arrows to: §e" + crossAmount + " §aand Block ID to: §e" + crossBlockId);
            } else {
                clientMessage("§c[Crossbow] Usage: /cross <amount> <id>");
            }
        } else {
            clientMessage("§c[Crossbow] Usage: /cross <amount> <id>");
        }
    }
}

// إنشاء الأسهم الإضافية عند الإطلاق
function entityAddedHook(entity) {
    if (isSpawningExtra) return;

    if (Entity.getEntityTypeId(entity) == 80) {
        var vx = Entity.getVelX(entity);
        var vy = Entity.getVelY(entity);
        var vz = Entity.getVelZ(entity);
        
        if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05 || Math.abs(vz) > 0.05) {
            if (crossAmount > 1) {
                isSpawningExtra = true;

                var px = Entity.getX(entity);
                var py = Entity.getY(entity);
                var pz = Entity.getZ(entity);

                for (var i = 1; i < crossAmount; i++) {
                    var svx = vx + (Math.random() - 0.5) * 0.15;
                    var svy = vy + (Math.random() - 0.5) * 0.1;
                    var svz = vz + (Math.random() - 0.5) * 0.15;

                    var newArrow = Level.spawnMob(px, py, pz, 80);
                    if (newArrow) {
                        Entity.setVelX(newArrow, svx);
                        Entity.setVelY(newArrow, svy);
                        Entity.setVelZ(newArrow, svz);
                    }
                }

                isSpawningExtra = false;
            }
        }
    }
}

// فحص الأسهم المسقرة على الأرض مباشرة
function modTick() {
    var entities = Entity.getAll();
    if (!entities) return;

    for (var i = 0; i < entities.length; i++) {
        var ent = entities[i];
        
        if (Entity.getEntityTypeId(ent) == 80) {
            var vx = Entity.getVelX(ent);
            var vy = Entity.getVelY(ent);
            var vz = Entity.getVelZ(ent);

            // إذا توقف السهم تقريباً عن الحركة (اصطدم بالأرض)
            if (Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01 && Math.abs(vz) < 0.01) {
                var x = Math.floor(Entity.getX(ent));
                var y = Math.floor(Entity.getY(ent));
                var z = Math.floor(Entity.getZ(ent));

                // وضع البلوكة مكان السهم أو تحته مباشرة
                if (Level.getTile(x, y, z) == 0) {
                    Level.setTile(x, y, z, crossBlockId);
                } else {
                    Level.setTile(x, y + 1, z, crossBlockId);
                }

                // حذف السهم بعد وضع البلوكة
                Entity.remove(ent);
            }
        }
    }
        }
