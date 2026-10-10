// 1. دالة تعمل عند اصطدام أي مقذوف ببلوكة في العالم
function projectileHitBlockHook(entity, x, y, z, side) {
    // التحقق مما إذا كان المقذوف هو كرة ثلج (المعرف 81 الخاص بـ SNOWBALL Entity)
    if (Entity.getEntityTypeId(entity) == 81) {
        clientMessage("k")
    }
}
