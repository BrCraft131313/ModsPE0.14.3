// خريطة لربط أسماء الكائنات بالـ ID الخاص بها في MCPE 0.14.3
var entityIds = {
    "chicken": 10,
    "cow": 11,
    "pig": 12,
    "sheep": 13,
    "wolf": 14,
    "villager": 15,
    "mooshroom": 16,
    "squid": 17,
    "rabbit": 18,
    "bat": 19,
    "iron_golem": 20,
    "snow_golem": 21,
    "ocelot": 22,
    "zombie": 32,
    "creeper": 33,
    "skeleton": 34,
    "spider": 35,
    "zombie_pigman": 36,
    "slime": 37,
    "enderman": 38,
    "cave_spider": 39,
    "silverfish": 40,
    "blaze": 41,
    "magma_cube": 42,
    "ghast": 41,
    "witch": 45
};

function procCmd(cmd) {
    var args = cmd.split(" ");
    
    // عند كتابة /summon
    if (args[0] === "summon") {
        if (args.length >= 2) {
            var entityName = args[1].toLowerCase();
            // إذا لم يحدد اللاعب العدد، يفترض أن العدد 1 تلقائياً
            var quantity = args[2] ? parseInt(args[2]) : 1;
            
            // التحقق من صحة اسم الكائن
            if (entityIds.hasOwnProperty(entityName)) {
                var typeId = entityIds[entityName];
                
                // جلب إحداثيات اللاعب لرسبنة الكائنات عنده
                var player = Player.getEntity();
                var px = Entity.getX(player);
                var py = Entity.getY(player);
                var pz = Entity.getZ(player);
                
                // تحديد حد أقصى للرسبنة (مثلاً 500) لمنع الكراش واللاغ القوي
                if (quantity > 500) {
                    quantity = 500;
                    clientMessage("§c[SummonMod] Quantity capped at 500 to prevent lag!");
                }
                
                // حلقة تكرار لرسبنة العدد المطلوب
                for (var i = 0; i < quantity; i++) {
                    Level.spawnMob(px, py, pz, typeId);
                }
                
                clientMessage("§a[SummonMod] Spawned " + quantity + " " + entityName + "(s)!");
            } else {
                clientMessage("§c[Error] Unknown entity name: " + entityName);
            }
        } else {
            clientMessage("§eUsage: /summon <entityName> [quantity]");
        }
    }
}
