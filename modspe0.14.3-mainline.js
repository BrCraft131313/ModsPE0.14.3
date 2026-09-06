// متغيرات النظام
var touchEnabled = false; // تشغيل/إيقاف المود
var targetId = null;      // البلوكة الناتجة (مثلاً 2 للـ Grass)
var triggerId = null;     // البلوكة المحددة لللمس (null تعني أي بلوكة)
var mode = null;          // "block" أو "kill"

// معالجة الأوامر /touch
function procCmd(cmd) {
    var args = cmd.split(" ");
    if (args[0] === "touch") {
        
        // أمر التشغيل/الإيقاف السريع: /touch
        if (args.length === 1) {
            touchEnabled = !touchEnabled;
            clientMessage("§a[TouchMod] §wEnabled: " + (touchEnabled ? "§2ON" : "§cOFF"));
            return;
        }

        // /touch kill
        if (args[1] === "kill" && args.length === 2) {
            mode = "kill";
            triggerId = null;
            touchEnabled = true;
            clientMessage("§a[TouchMod] §wKill mode enabled for all blocks!");
            return;
        }

        // /touch [triggerId] kill (مثال: /touch 2 kill)
        if (args.length === 3 && args[2] === "kill") {
            mode = "kill";
            triggerId = parseInt(args[1]);
            touchEnabled = true;
            clientMessage("§a[TouchMod] §wKill mode enabled for Block ID: " + triggerId);
            return;
        }

        // /touch block [targetId] (مثال: /touch block 2)
        if (args[1] === "block" && args.length === 3) {
            mode = "block";
            targetId = parseInt(args[2]);
            triggerId = null;
            touchEnabled = true;
            clientMessage("§a[TouchMod] §wChange all blocks to Block ID: " + targetId);
            return;
        }

        // /touch [triggerId] block [targetId] (مثال: /touch 2 block 46)
        if (args.length === 4 && args[2] === "block") {
            mode = "block";
            triggerId = parseInt(args[1]);
            targetId = parseInt(args[3]);
            touchEnabled = true;
            clientMessage("§a[TouchMod] §wChange Block ID " + triggerId + " to Block ID " + targetId);
            return;
        }
    }
}

// فحص البلوكة التي يقف عليها اللاعب
function modTick() {
    if (!touchEnabled) return;

    var px = Math.floor(Entity.getX(Player.getEntity()));
    var py = Math.floor(Entity.getY(Player.getEntity())) - 1; // البلوكة تحت القدم مباشرة
    var pz = Math.floor(Entity.getZ(Player.getEntity()));

    var currentBlock = getTile(px, py, pz);

    // التأكد من أن اللاعب لا يقف على الهواء
    if (currentBlock !== 0) {
        processTouch(px, py, pz, currentBlock);
    }
}

// فحص الضغط على البلوكة باليد
function useItem(x, y, z, itemid, blockid) {
    if (!touchEnabled) return;
    processTouch(x, y, z, blockid);
}

// منطق التحويل أو القتل
function processTouch(x, y, z, currentBlock) {
    // إذا تم تحديد بلوكة معينة وكان اللاعب يقف/يضغط على بلوكة مختلفة، يتم التجاهل
    if (triggerId !== null && currentBlock !== triggerId) {
        return;
    }

    if (mode === "kill") {
        Entity.setHealth(Player.getEntity(), 0); // قتل اللاعب
    } else if (mode === "block" && targetId !== null) {
        if (currentBlock !== targetId) { // تجنب التكرار لنفس البلوكة
            setTile(x, y, z, targetId);
        }
    }
}
