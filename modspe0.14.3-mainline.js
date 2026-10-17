// ==========================================
// ModPE Script: thecleaner-bybrcraft131313.js
// Target: Minecraft PE 0.14.3
// ==========================================

// تعريف معرف أداة استدعاء المنظف
var CLEANER_ITEM_ID = 533;

// تسجيل أداة استدعاء المنظف في اللعبة وإضافتها لحقيبة الإبداعي
ModPE.setItem(CLEANER_ITEM_ID, "spawn_egg", 0, "The Cleaner Spawn Egg", 1);
Player.addItemCreativeInv(CLEANER_ITEM_ID, 1, 0);

// استخدام الأداة لاستدعاء كيان التنظيف المسالم (قروي)
function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
    if (itemid === CLEANER_ITEM_ID) {
        // استدعاء القروي كمنظف مسالم في الموقع المستهدف
        var cleanerId = Level.spawnMob(x, y + 1, z, EntityType.VILLAGER, "");
        
        // تعيين صحة عالية وشل الحركة القتالية التلقائية
        Entity.setHealth(cleanerId, 999);
        Entity.setMaxHealth(cleanerId, 999);
        Entity.setTarget(cleanerId, -1);
        
        clientMessage("The Cleaner spawned successfully.");
        preventDefault();
    }
}

// إلغاء كلي للضرر وتصفير التأثير عند محاولة ضرب الكيان أو تعرضه للهجوم
function entityHurtHook(attacker, victim, halfhearts) {
    if (Entity.getEntityTypeId(victim) === EntityType.VILLAGER) {
        // منع تلقي أي ضرر وإبقاء الصحة في أقصى حد
        Entity.setHealth(victim, 999);
        Entity.setFireTicks(victim, 0);
        preventDefault();
    }
}

// إلغاء كلي لهجوم المنظف على اللاعب أو أي كيان آخر
function attackHook(attacker, victim) {
    if (Entity.getEntityTypeId(attacker) === EntityType.VILLAGER) {
        // إلغاء الهجوم وتفريغ الهدف المهاجم تماماً
        Entity.setTarget(attacker, -1);
        preventDefault();
    }
}

// التحديث المستمر للتحكم في سلوك المنظف وتنظيف العناصر المرمية
function modTick() {
    var entities = Entity.getAll();
    
    for (var i = 0; i < entities.length; i++) {
        var entId = entities[i];
        
        // التحقق مما إذا كان الكيان هو القروي المنظف
        if (Entity.getEntityTypeId(entId) === EntityType.VILLAGER) {
            // تجريد الكيان من أي هدف هجومي باستمرار لمنع الضغط أو الضرب
            Entity.setTarget(entId, -1);
            
            // التأكد من عدم نقص الصحة وإزالة النيران إن وجدت
            if (Entity.getHealth(entId) < 999) {
                Entity.setHealth(entId, 999);
            }
            
            var cleanX = Entity.getX(entId);
            var cleanY = Entity.getY(entId);
            var cleanZ = Entity.getZ(entId);
            
            // البحث الفعال عن العناصر الملقاة على الأرض
            for (var j = 0; j < entities.length; j++) {
                var targetId = entities[j];
                
                if (Entity.getEntityTypeId(targetId) === EntityType.ITEM) {
                    var itemX = Entity.getX(targetId);
                    var itemY = Entity.getY(targetId);
                    var itemZ = Entity.getZ(targetId);
                    
                    var dx = itemX - cleanX;
                    var dy = itemY - cleanY;
                    var dz = itemZ - cleanZ;
                    var distSq = dx * dx + dy * dy + dz * dz;
                    
                    // إذا كان العنصر ضمن نطاق الكيان، يتحرك نحوه تدريجياً
                    if (distSq < 100) {
                        Entity.setPosition(entId, cleanX + (dx * 0.1), cleanY + (dy * 0.1), cleanZ + (dz * 0.1));
                        
                        // إذا وصل المنظف إلى العنصر يتم مسحه وإزالته نهائياً
                        if (distSq < 4.0) {
                            Entity.remove(targetId);
                            clientMessage("The Cleaner collected an item.");
                        }
                        break;
                    }
                }
            }
        }
    }
    }
