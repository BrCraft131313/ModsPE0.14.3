/* ==========================================================================
   المود: استدعاء دائرة TNT عند رمي سنارة الصيد
   ========================================================================== */

// القطر الافتراضي للدائرة
var tntDiameter = 10;

// 1. التعامل مع أمر الضبط /tntring <circlediameter>
function procCmd(cmd) {
    var args = cmd.split(" ");
    
    if (args[0] === "tntring") {
        if (args.length > 1 && !isNaN(args[1])) {
            var val = parseInt(args[1]);
            if (val > 0) {
                tntDiameter = val;
                clientMessage("[TNTRing] Circle diameter set to: " + tntDiameter);
            } else {
                clientMessage("[TNTRing] Error: Diameter must be greater than 0.");
            }
        } else {
            clientMessage("[TNTRing] Usage: /tntring <circlediameter>");
        }
    }
}

// 2. اكتشاف رمي سنارة الصيد وتوليد دائرة الـ TNT
function entityAddedHook(entity) {
    // المعرف 77 يمثل خطاف سنارة الصيد عند إطلاقه
    if (Entity.getEntityTypeId(entity) == 77) {
        var player = Player.getEntity();
        var px = Entity.getX(player);
        var py = Entity.getY(player);
        var pz = Entity.getZ(player);
        var spawnY = py + 10; // الارتفاع المطلوب 10 فوق اللاعب

        var radius = tntDiameter / 2;
        // حساب عدد الكائنات بناءً على القطر لتغطية الدائرة بشكل متناسق
        var tntCount = Math.max(8, Math.floor(Math.PI * tntDiameter));

        for (var i = 0; i < tntCount; i++) {
            var angle = (i / tntCount) * 2 * Math.PI;
            var x = px + radius * Math.cos(angle);
            var z = pz + radius * Math.sin(angle);

            // إرسال TNT مشتعل (المعرف 65) على ارتفاع 10 فوق اللاعب
            Level.spawnMob(x, spawnY, z, 65);
        }

        clientMessage("[TNTRing] TNT ring spawned at height +10 with diameter " + tntDiameter + "!");
    }
}
