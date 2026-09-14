// متغيرات تتبع حالة الجوع والماء
var lastHunger = -1;
var maxWater = 20;
var currentWater = 20;

// متغيرات تتبع العناصر التي يحملها اللاعب
var lastCarriedId = -1;
var lastCarriedCount = 0;
var lastCarriedData = -1;

// حدث بدء العالم أو الدخول إليه
function newLevel() {
    lastHunger = Player.getHunger();
    currentWater = maxWater;
    lastCarriedId = Player.getCarriedItem();
    lastCarriedCount = Player.getCarriedItemCount();
    lastCarriedData = Player.getCarriedItemData();
}

// حدث التكرار البرمجي المباشر
function modTick() {
    var player = Player.getEntity();
    var currentHunger = Player.getHunger();

    // التهيئة المبدئية
    if (lastHunger === -1) {
        lastHunger = currentHunger;
    } else {
        // حساب فرق نقص الجوع
        var hungerDiff = lastHunger - currentHunger;

        if (hungerDiff > 0) {
            var currentHealth = Entity.getHealth(player);

            // حالة نقص نصف هنقر: نقص موية وتضرر قلب واحد
            if (hungerDiff === 1) {
                currentWater = Math.max(0, currentWater - 1);
                var newHealth = Math.max(0, currentHealth - 2);
                Entity.setHealth(player, newHealth);
                clientMessage("You lost 1 water level and took 1 heart of damage!");
            }
            // حالة نقص هنقر كامل أو أكثر: نقص مويتين وتضرر قلبين
            else if (hungerDiff >= 2) {
                currentWater = Math.max(0, currentWater - 2);
                var newHealth = Math.max(0, currentHealth - 4);
                Entity.setHealth(player, newHealth);
                clientMessage("You lost 2 water levels and took 2 hearts of damage!");
            }

            lastHunger = currentHunger;
        } else if (currentHunger > lastHunger) {
            lastHunger = currentHunger;
        }
    }

    // فحص عملية شرب الماء عبر تتبع تغير القارورة في اليد
    var currentId = Player.getCarriedItem();
    var currentCount = Player.getCarriedItemCount();
    var currentData = Player.getCarriedItemData();

    // إذا كان اللاعب يحمل قارورة ماء (ID 373 Data 0) وتم شربها
    if (lastCarriedId === 373 && lastCarriedData === 0) {
        // تحقق من نقصان العدد أو تحول القارورة إلى فارغة (ID 374)
        if ((currentId === 373 && currentCount < lastCarriedCount) || currentId === 374) {
            var currentHealth = Entity.getHealth(player);
            var maxHealth = 20;

            // زيادة الصحة بمقدار قلب واحد (2 نقاط صحة)
            var newHealth = Math.min(maxHealth, currentHealth + 2);
            Entity.setHealth(player, newHealth);

            // زيادة الجوع بمقدار نصف هنقر (1 نقطة)
            var newHunger = Math.min(20, Player.getHunger() + 1);
            Player.setHunger(newHunger);
            lastHunger = newHunger;

            // استرجاع مستوى الماء
            currentWater = Math.min(maxWater, currentWater + 2);

            clientMessage("You drank water and restored 1 heart and 0.5 hunger!");
        }
    }

    // تحديث قيم العنصر المحمول للFrame القادم
    lastCarriedId = currentId;
    lastCarriedCount = currentCount;
    lastCarriedData = currentData;
}
