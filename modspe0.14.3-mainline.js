// ==========================================
// ModPE Script: soul-sand-bubble.js
// Minecraft PE 0.14.3
// ==========================================

function modTick() {
    var player = Player.getEntity();
    var px = Math.floor(Entity.getX(player));
    var py = Math.floor(Entity.getY(player));
    var pz = Math.floor(Entity.getZ(player));

    // 1. التحقق مما إذا كان اللاعب يسبح أو واقفاً داخل بلوكة ماء (Water ID = 8 or 9)
    var currentBlock = getTile(px, py, pz);
    if (currentBlock == 8 || currentBlock == 9) {
        
        // 2. البحث عن بلوكة Soul Sand (ID = 88) تحت مسار الماء الذي يقف فيه اللاعب
        // يتم الفحص لعدة بلوكات لأسفل لضمان استمرار عمود الفقاعات
        for (var i = 1; i <= 10; i++) {
            var blockBelow = getTile(px, py - i, pz);
            
            // إذا وجدنا بلوكة هواء أو أي بلوكة صلبة غير الماء أثناء النزول نتوقف
            if (blockBelow != 8 && blockBelow != 9 && blockBelow != 88) {
                break;
            }
            
            // إذا وصلنا لبلوكة Soul Sand وتحتها ماء متصل
            if (blockBelow == 88) {
                // إعطاء قوة دفع راسية إلى الأعلى (Upward Velocity)
                Entity.setVelY(player, 0.35);
                
                // إظهار تأثير بصري (جسيمات ماء/دخان) لمحاكاة الفقاعات حول اللاعب
                Level.addParticle(ParticleType.waterBubble, px + 0.5, py + 0.5, pz + 0.5, 0, 0.2, 0, 5);
                break;
            }
        }
    }
}
