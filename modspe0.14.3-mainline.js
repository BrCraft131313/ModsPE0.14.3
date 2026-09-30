// ==========================================
// ModPE Script: fireball-bybrcraft131313.js
// Minecraft PE 0.14.3
// ==========================================

// دالة تعمل عند اصطدام أي مقذوف ببلوكة في العالم
function projectileHitBlockHook(entity, x, y, z, side) {
    // التحقق مما إذا كان المقذوف هو كرة ثلج (Snowball Entity ID = 81)
    if (Entity.getEntityTypeId(entity) == 81) {
        // إحداث انفجار ناري عند إحداثيات الاصطدام المباشرة
        Level.explode(x, y, z, 1.5, true);
        }
}
