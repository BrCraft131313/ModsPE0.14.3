/* ==========================================================================
   المود: قطع الأشجار السريع (Tree Capitator)
   ========================================================================== */

function destroyBlock(x, y, z, side) {
    var blockId = Level.getTile(x, y, z);
    var item = Player.getCarriedItem();
    
    // التحقق من أن البلوك المكسور خشب وأن اللاعب يحمل فأس (حديد، ماس، خشب، حجر، ذهب)
    if ((blockId == 17 || blockId == 162) && (item == 258 || item == 271 || item == 275 || item == 279 || item == 286)) {
        for (var ny = y + 1; ny <= y + 15; ny++) {
            var currentBlock = Level.getTile(x, ny, z);
            if (currentBlock == 17 || currentBlock == 162) {
                Level.destroyBlock(x, ny, z, true);
            } else {
                break;
            }
        }
    }
}
