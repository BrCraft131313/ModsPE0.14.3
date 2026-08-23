// بداية كود مود رادار الخطر
var timer = 0;

function modTick() {
    timer++;
    
    // الفحص كل ثانية تقريباً (20 tick) لتقليل الضغط على اللعبة
    if (timer >= 20) {
        timer = 0;
        var allEntities = Entity.getAll();
        var pX = Player.getX();
        var pY = Player.getY();
        var pZ = Player.getZ();
        
        for (var i = 0; i < allEntities.length; i++) {
            var ent = allEntities[i];
            var type = Entity.getEntityTypeId(ent);
            
            // فحص الكائنات العدائية (الزومبي 32، الكريبر 33، السكيلتون 34)
            if (type == 32 || type == 33 || type == 34) {
                var eX = Entity.getX(ent);
                var eY = Entity.getY(ent);
                var eZ = Entity.getZ(ent);
                
                // حساب المسافة بين اللاعب والوحش
                var distance = Math.sqrt(Math.pow(pX - eX, 2) + Math.pow(pY - eY, 2) + Math.pow(pZ - eZ, 2));
                
                if (distance <= 8) {
                    Level.playSound(pX, pY, pZ, "random.click", 1.0, 2.0);
                    Level.addParticle(ParticleType.redstone, pX, pY + 2, pZ, 0, 0, 0, 5);
                    clientMessage(ChatColor.RED + "[WARNING] Hostile entity nearby!");
                    break;
                }
            }
        }
    }
}

// نهاية الكود
