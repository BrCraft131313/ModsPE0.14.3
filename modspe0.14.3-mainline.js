// ==========================================
// ModPE Script: MineVein.js (Fixed Drops)
// Minecraft PE 0.14.3
// ==========================================

// دالة لمعرفة المورد الناتج المخصص لكل خام
function getOreDrop(blockId) {
    switch (blockId) {
        case 16:  return { id: 263, data: 0, count: 1 }; // فحم (Coal)
        case 15:  return { id: 15,  data: 0, count: 1 }; // خام الحديد (Iron Ore)
        case 14:  return { id: 14,  data: 0, count: 1 }; // خام الذهب (Gold Ore)
        case 56:  return { id: 264, data: 0, count: 1 }; // ألماس (Diamond)
        case 129: return { id: 388, data: 0, count: 1 }; // زمرد (Emerald)
        case 153: return { id: 406, data: 0, count: 1 }; // كوارتز (Quartz)
        case 73:  
        case 74:  return { id: 331, data: 0, count: 4 }; // ريدستون (Redstone Dust x4)
        case 21:  return { id: 351, data: 4, count: 4 }; // لاجورد (Lapis Lazuli x4)
        default:  return null;
    }
}

function destroyBlock(x, y, z, side) {
    var blockId = getTile(x, y, z);
    var dropInfo = getOreDrop(blockId);
    
    if (dropInfo != null) {
        // إلغاء الكسر الافتراضي لمنع تكرار الموارد أو تساقط البلوكة الخام
        preventDefault();
        breakVein(x, y, z, blockId, 0);
    }
}

function breakVein(x, y, z, targetId, count) {
    if (count > 30) return; // حد أقصى لمنع الـ Lag

    for (var ix = -1; ix <= 1; ix++) {
        for (var iy = -1; iy <= 1; iy++) {
            for (var iz = -1; iz <= 1; iz++) {
                var nx = x + ix;
                var ny = y + iy;
                var nz = z + iz;

                var currentBlock = getTile(nx, ny, nz);
                
                // مطابقة الخام (مع مراعاة حالة الريدستون المضيء 74 والمطفأ 73)
                if (currentBlock == targetId || (targetId == 73 && currentBlock == 74) || (targetId == 74 && currentBlock == 73)) {
                    var drop = getOreDrop(currentBlock);
                    
                    // 1. تحويل البلوكة إلى هواء
                    setTile(nx, ny, nz, 0);
                    
                    // 2. إسقاط النتيجة الفعلية (مثل الألماس أو الفحم) في موقع البلوكة
                    if (drop != null) {
                        Level.dropItem(nx + 0.5, ny + 0.5, nz + 0.5, 0, drop.id, drop.count, drop.data);
                    }
                    
                    count++;
                    breakVein(nx, ny, nz, targetId, count);
                }
            }
        }
    }
             }
