// ==========================================
// 1. مود مؤشر صحة الموبات واللاعبين (Mob & Player Health Bar)
// ==========================================
function attackHook(attacker, victim) {
    // التأكد من أن المهاجم هو اللاعب وأن الضحية كائن موجود
    if (attacker == Player.getEntity() && victim != null) {
        var currentHealth = Entity.getHealth(victim);
        var maxHealth = Entity.getMaxHealth(victim);
        var entityType = Entity.getEntityTypeId(victim);
        
        // عرض اسم الكائن وصحته الحالية من الإجمالي
        ModPE.showTipMessage("HP: " + currentHealth + " / " + maxHealth);
    }
}

// ==========================================
// 2. مود مغناطيس الموارد (Item Magnet)
// ==========================================
var MAGNET_ITEM_ID = 263; // الفحم (Coal) كأداة للمغناطيس

function modTick() {
    var player = Player.getEntity();
    var carriedItem = Player.getCarriedItem();
    
    // التفعيل يتم عند حمل الفحم في اليد
    if (carriedItem == MAGNET_ITEM_ID) {
        var px = Entity.getX(player);
        var py = Entity.getY(player);
        var pz = Entity.getZ(player);
        
        // جلب جميع الكائنات في العالم
        var list = Entity.getAll();
        for (var i = 0; i < list.length; i++) {
            // التحقق مما إذا كان الكائن عبارة عن عنصر ملقى على الأرض (Item Drop ID = 64)
            if (Entity.getEntityTypeId(list[i]) == 64) {
                var ix = Entity.getX(list[i]);
                var iy = Entity.getY(list[i]);
                var iz = Entity.getZ(list[i]);
                
                // حساب المسافة بين اللاعب والعنصر
                var dx = px - ix;
                var dy = py - iy;
                var dz = pz - iz;
                var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // سحب العناصر القريبة ضمن نطاق 10 بلوكات نحو اللاعب
                if (distance <= 10 && distance > 1) {
                    Entity.setVelX(list[i], dx * 0.15);
                    Entity.setVelY(list[i], dy * 0.15);
                    Entity.setVelZ(list[i], dz * 0.15);
                }
            }
        }
    }
}
