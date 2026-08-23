// بداية كود مود الأحذية الخارقة (المعدل)

var waterCleanTimer = -1; // مؤقت لإزالة الموية بعد السقوط
var savedWaterX = 0, savedWaterY = 0, savedWaterZ = 0;

function modTick() {
    var player = Player.getEntity();
    
    // فحص خانة الحذاء (Index 3 في الدروع)
    var bootSlot = Player.getArmorSlot(3);
    
    // ID: 317 هو حذاء الذهب
    if (bootSlot == 317) {
        Player.setCanFly(true);
        Entity.addEffect(player, MobEffect.movementSpeed, 20, 2, false, false);
        Level.addParticle(ParticleType.flame, Player.getX(), Player.getY(), Player.getZ(), 0, 0, 0, 3);
        
        // --- كود الإنقاذ التلقائي بالماء عند السقوط ---
        var px = Math.floor(Player.getX());
        var py = Math.floor(Player.getY());
        var pz = Math.floor(Player.getZ());
        
        // إذا كان اللاعب يسقط بسرعة نحو الأسفل (VelY أقل من -0.5)
        if (Entity.getVelY(player) < -0.5) {
            // فحص البلوكات أسفل قدم اللاعب مباشرة (ارتفاع 1 إلى 3 بلوكات)
            for (var i = 1; i <= 3; i++) {
                var targetY = py - i;
                var blockUnder = Level.getTile(px, targetY, pz);
                
                // إذا كانت البلوكة صلبة وليست هواء أو ماء
                if (blockUnder != 0 && blockUnder != 8 && blockUnder != 9) {
                    // وضع ماء متدفق (ID 8) تحت قدم اللاعب فوراً
                    Level.setTile(px, targetY + 1, pz, 8, 0);
                    
                    // حفظ إحداثيات الموية لإزالتها بعد ثانية
                    savedWaterX = px;
                    savedWaterY = targetY + 1;
                    savedWaterZ = pz;
                    waterCleanTimer = 20; // 20 tick = ثانية واحدة
                    break;
                }
            }
        }
    } else {
        // إذا لم يكن يرتدي الحذاء الذهبي وكانت اللعبة في وضع البقاء
        if (Level.getGameMode() == 0) {
            Player.setCanFly(false);
        }
    }

    // --- نظام تنظيف الموية بعد ثانية ---
    if (waterCleanTimer > 0) {
        waterCleanTimer--;
        if (waterCleanTimer == 0) {
            // إذا كانت البلوكة لا تزال ماء، نلغيها ونرجعها هواء (ID 0)
            var currentBlock = Level.getTile(savedWaterX, savedWaterY, savedWaterZ);
            if (currentBlock == 8 || currentBlock == 9) {
                Level.setTile(savedWaterX, savedWaterY, savedWaterZ, 0, 0);
            }
            waterCleanTimer = -1;
        }
    }
}

// نهاية الكود