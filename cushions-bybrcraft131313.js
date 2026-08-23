// ==========================================
// Sit On Chairs & Slabs Mod (Fixed Version)
// ==========================================

// جميع معرّفات الستاير والسلابات (شاملة الخشب والحجر)
var SITTING_BLOCKS = [
    // الستاير (Stairs)
    53, 67, 108, 109, 114, 128, 134, 135, 136, 156, 163, 164, 180,
    // السلابات (Slabs)
    44, 126, 157, 158
];

function isSittableBlock(blockId) {
    for (var i = 0; i < SITTING_BLOCKS.length; i++) {
        if (SITTING_BLOCKS[i] === blockId) {
            return true;
        }
    }
    return false;
}

function useItem(x, y, z, itemId, blockId, side, itemData, blockData) {
    
    if (isSittableBlock(blockId)) {
        
        var entities = Entity.getAll();
        var chairCart = null;
        
        // البحث عن عربة مسبقة في الموقع
        for (var i = 0; i < entities.length; i++) {
            if (Entity.getEntityTypeId(entities[i]) === 84) {
                var ex = Entity.getX(entities[i]);
                var ey = Entity.getY(entities[i]);
                var ez = Entity.getZ(entities[i]);
                
                if (Math.abs(ex - (x + 0.5)) < 0.5 && 
                    Math.abs(ey - (y + 0.5)) < 0.8 && 
                    Math.abs(ez - (z + 0.5)) < 0.5) {
                    chairCart = entities[i];
                    break;
                }
            }
        }
        
        // رفع ارتفاع الرسبون إلى (y + 0.5) لرفع اللاعب فوق الستاير والسلابات
        if (chairCart === null) {
            chairCart = Level.spawnMob(x + 0.5, y + 0.5, z + 0.5, 84, "");
        }
        
        // إركاب اللاعب
        Entity.rideAnimal(Player.getEntity(), chairCart);
        
        // منع التفاعل الافتراضي للبلوكة لضمان الجلوس على السلاب
        preventDefault();
    }
}

function destroyBlock(x, y, z, player) {
    var entities = Entity.getAll();
    for (var i = 0; i < entities.length; i++) {
        if (Entity.getEntityTypeId(entities[i]) === 84) {
            var ex = Entity.getX(entities[i]);
            var ey = Entity.getY(entities[i]);
            var ez = Entity.getZ(entities[i]);
            
            if (Math.abs(ex - (x + 0.5)) < 0.6 && 
                Math.abs(ey - (y + 0.5)) < 0.9 && 
                Math.abs(ez - (z + 0.5)) < 0.6) {
                Entity.remove(entities[i]);
            }
        }
    }
}
