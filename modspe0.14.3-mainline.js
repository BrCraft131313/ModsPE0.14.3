/* ==========================================================================
   المود: نقطة الحفظ (Checkpoint) - تعيين نقطة الرسبون عند الوقوف على طبق الضغط الذهبي
   ========================================================================== */

var GOLD_PLATE_ID = 147; // معرف طبق الضغط الذهبي (Light Weighted Pressure Plate)

var lastSpawnX = null;
var lastSpawnY = null;
var lastSpawnZ = null;

function modTick() {
    var player = Player.getEntity();
    var px = Math.floor(Entity.getX(player));
    var py = Math.floor(Entity.getY(player));
    var pz = Math.floor(Entity.getZ(player));

    // فحص البلوك في موقع قدمي اللاعب
    var currentBlock = Level.getTile(px, py, pz);

    // إذا لم يكن اللوح عند القدمين يتم فحص البلوك أسفله مباشرة
    if (currentBlock != GOLD_PLATE_ID) {
        currentBlock = Level.getTile(px, py - 1, pz);
        if (currentBlock == GOLD_PLATE_ID) {
            py = py - 1;
        }
    }

    // عند الوقوف على طبق الضغط الذهبي
    if (currentBlock == GOLD_PLATE_ID) {
        // التحقق من عدم تكرار التعيين لنفس الموقع لمنع إغراق الشات بالرسائل
        if (px !== lastSpawnX || py !== lastSpawnY || pz !== lastSpawnZ) {
            lastSpawnX = px;
            lastSpawnY = py;
            lastSpawnZ = pz;

            // تعيين نقطة الرسبون الجديدة
            Level.setSpawn(px, py, pz);
            clientMessage("[Checkpoint] Spawn point updated to: (" + px + ", " + py + ", " + pz + ")");
        }
    }
}
