/*
 * Mod Name   : Villager Trading System
 * Target Ver : MCPE 0.14.3
 * Standard   : MECANE (Messages English, Comments Arabic, No Emojis)
 */

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

// معرفات العناصر والموارد المستخدمة
var EMERALD = 388;
var COAL = 263;
var BREAD = 297;
var IRON_SWORD = 267;
var GOLDEN_APPLE = 322;

// اعتراض حدث ضرب أو النقر على الكائنات
function attackHook(attacker, victim) {
    // التحقق من أن المعتدي هو اللاعب وأن الهدف قروي (Villager Entity ID = 15)
    if (attacker == Player.getEntity() && Entity.getEntityTypeId(victim) == 15) {
        // إلغاء إلحاق الضرر بالقروي عند فتح قائمة المقايضة
        preventDefault();
        
        // فتح واجهة المقايضة
        openTradeGUI();
    }
}

// إنشاء واجهة خيارات المقايضة
function openTradeGUI() {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                var builder = new android.app.AlertDialog.Builder(ctx);
                builder.setTitle("Villager Trade Market");

                // قائمة الصفقات المتاحة لدى القروي
                var trades = [
                    "1. 5 Emeralds -> 1 Iron Sword",
                    "2. 10 Coal -> 1 Emerald",
                    "3. 3 Emeralds -> 8 Bread",
                    "4. 8 Emeralds -> 1 Golden Apple"
                ];

                builder.setItems(trades, new android.content.DialogInterface.OnClickListener({
                    onClick: function(dialog, which) {
                        processTrade(which);
                    }
                }));

                builder.setNegativeButton("Close", null);
                builder.create().show();

            } catch(e) {
                print("Trade GUI Error: " + e);
            }
        }
    }));
}

// تنفيذ صفقة المقايضة بناء على الخيار المحدد
function processTrade(tradeIndex) {
    var heldItem = Player.getCarriedItem();
    var heldCount = Player.getCarriedItemCount();

    // الصفقة 1: 5 زمرد مقابل سيف حديدي
    if (tradeIndex == 0) {
        if (heldItem == EMERALD && heldCount >= 5) {
            deductHeldItem(EMERALD, 5);
            Player.addItemInventory(IRON_SWORD, 1, 0);
            clientMessage("[Trade] Successful: Acquired 1x Iron Sword.");
        } else {
            clientMessage("[Trade] Failed: Hold at least 5 Emeralds in hand.");
        }
    }
    // الصفقة 2: 10 فحم مقابل زمردة
    else if (tradeIndex == 1) {
        if (heldItem == COAL && heldCount >= 10) {
            deductHeldItem(COAL, 10);
            Player.addItemInventory(EMERALD, 1, 0);
            clientMessage("[Trade] Successful: Acquired 1x Emerald.");
        } else {
            clientMessage("[Trade] Failed: Hold at least 10 Coal in hand.");
        }
    }
    // الصفقة 3: 3 زمرد مقابل 8 خبز
    else if (tradeIndex == 2) {
        if (heldItem == EMERALD && heldCount >= 3) {
            deductHeldItem(EMERALD, 3);
            Player.addItemInventory(BREAD, 8, 0);
            clientMessage("[Trade] Successful: Acquired 8x Bread.");
        } else {
            clientMessage("[Trade] Failed: Hold at least 3 Emeralds in hand.");
        }
    }
    // الصفقة 4: 8 زمرد مقابل تفاحة ذهبية
    else if (tradeIndex == 3) {
        if (heldItem == EMERALD && heldCount >= 8) {
            deductHeldItem(EMERALD, 8);
            Player.addItemInventory(GOLDEN_APPLE, 1, 0);
            clientMessage("[Trade] Successful: Acquired 1x Golden Apple.");
        } else {
            clientMessage("[Trade] Failed: Hold at least 8 Emeralds in hand.");
        }
    }
}

// دالة الخصم المباشر من العنصر الممسوك بيد اللاعب
function deductHeldItem(itemId, amount) {
    var currentCount = Player.getCarriedItemCount();
    var newCount = currentCount - amount;

    if (newCount > 0) {
        Entity.setCarriedItem(Player.getEntity(), itemId, newCount, 0);
    } else {
        Entity.setCarriedItem(Player.getEntity(), 0, 0, 0);
    }
}
