// حالة تفعيل المود
var keepInventoryEnabled = true;

// مصفوفات متغيرة لحفظ الأغراض والدروع
var savedInventory = [];
var savedArmor = [];
var needsRestoring = false;
var restoreTimer = 0;

// 1. أمر تفعيل/إلغاء المود
function procCmd(command) {
    var cmd = command.toLowerCase().split(" ");
    
    if (cmd[0] == "keepinventory" || cmd[0] == "ki") {
        keepInventoryEnabled = !keepInventoryEnabled;
        if (keepInventoryEnabled) {
            clientMessage("§a[KeepInventory] Mod is ENABLED!");
        } else {
            clientMessage("§c[KeepInventory] Mod is DISABLED!");
        }
    }
}

// 2. التقاط لحظة الموت وتفريغ الشنطة فوراً لتجنب التدبيل
function entityHurtHook(attacker, victim, halfHearts) {
    if (!keepInventoryEnabled) return;

    if (victim == Player.getEntity()) {
        var currentHealth = Entity.getHealth(Player.getEntity());
        
        // عند حدوث الضربة القاضية
        if (currentHealth - halfHearts <= 0 && !needsRestoring) {
            
            savedInventory = [];
            savedArmor = [];
            
            // أ) حفظ ثم مسح الشنطة (36 خانة)
            for (var i = 0; i < 36; i++) {
                var id = Player.getInventorySlot(i);
                var count = Player.getInventorySlotCount(i);
                var data = Player.getInventorySlotData(i);
                
                if (id > 0 && count > 0) {
                    savedInventory.push({id: id, count: count, data: data});
                }
                // تفريغ الخانة حتى لا تتدبل بعد الرسبنة
                Player.clearInventorySlot(i);
            }
            
            // ب) حفظ ثم مسح الدروع (4 خانات)
            for (var a = 0; a < 4; a++) {
                var armorId = Player.getArmorSlot(a);
                var armorDamage = Player.getArmorSlotDamage(a);
                
                if (armorId > 0) {
                    savedArmor.push({slot: a, id: armorId, damage: armorDamage});
                }
                // مسح خانة الدرع
                Player.setArmorSlot(a, 0, 0);
            }
            
            needsRestoring = true;
            restoreTimer = 15;
            
            clientMessage("§a[KeepInventory] Your items and armor have been saved!");
        }
    }
}

// 3. إعادة الأغراض والدروع المحفوظة فقط
function modTick() {
    if (needsRestoring) {
        if (Entity.getHealth(Player.getEntity()) > 0) {
            if (restoreTimer > 0) {
                restoreTimer--;
            } else {
                // أ) استرجاع عناصر الشنطة
                for (var i = 0; i < savedInventory.length; i++) {
                    var item = savedInventory[i];
                    addItemInventory(item.id, item.count, item.data);
                }
                
                // ب) استرجاع الدروع
                for (var a = 0; a < savedArmor.length; a++) {
                    var armor = savedArmor[a];
                    Player.setArmorSlot(armor.slot, armor.id, armor.damage);
                }
                
                // تنظيف البيانات والتصفير
                savedInventory = [];
                savedArmor = [];
                needsRestoring = false;
                
                clientMessage("§e[KeepInventory] All your items and armor were restored!");
            }
        }
    }
}

// 4. عند دخول العالم
function newLevel() {
    needsRestoring = false;
    restoreTimer = 0;
    clientMessage("§bKeepInventory Mod Active!");
    clientMessage("§eToggle Command: §f/keepinventory");
    }
