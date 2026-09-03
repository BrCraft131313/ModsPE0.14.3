// Mace Axe Knockup Mod for MCPE 0.14.3
// جميع التعليقات باللغة العربية والرسائل بالإنجليزية

// تعريف معرفات العناصر (Item IDs) للفؤوس
var WOOD_AXE = 271;
var STONE_AXE = 275;
var IRON_AXE = 258;
var GOLD_AXE = 286;
var DIAMOND_AXE = 279;

function attackHook(attacker, victim) {
    // التكتيك يتفعل فوراً بمجرد ضرب الكائن ضربة واحدة دون الحاجة لقتله
    if (attacker == Player.getEntity()) {
        var heldItem = Player.getCarriedItem();
        var launchPower = 0;

        switch (heldItem) {
            case WOOD_AXE:
                launchPower = 0.38; // يرفع حوالي 1 بلوكة
                break;
            case STONE_AXE:
                launchPower = 0.52; // يرفع حوالي 2 بلوكة
                break;
            case IRON_AXE:
                launchPower = 0.72; // يرفع حوالي 4 بلوكات
                break;
            case GOLD_AXE:
                launchPower = 1.02; // يرفع حوالي 8 بلوكات
                break;
            case DIAMOND_AXE:
                launchPower = 1.45; // يرفع حوالي 16 بلوكة
                break;
        }

        // إطلاق اللاعب للأعلى مباشرة عند كل ضربة
        if (launchPower > 0) {
            Entity.setVelY(Player.getEntity(), launchPower);
        }
    }
}
