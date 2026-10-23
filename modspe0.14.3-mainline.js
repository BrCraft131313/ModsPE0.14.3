// بداية كود المود 
// بداية كود بداية العالم 
function newLevel() {
    // رسالة توضح اسم المود وصانعه 
    clientMessage("Welcome To GiveCommand by BrCraft131313!");
}
// نهاية كود بداية العالم 

// بداية مود الإعطاء (GiveMod)
function procCmd(cmd) {
    // تقسيم النص المكتوب بناءً على المسافات
    var args = cmd.split(" ");
    var mainCmd = args[0];

    // أمر الإعطاء
    if (mainCmd === "give") {
        var itemId = parseInt(args[1]);
        var itemData = parseInt(args[2]);
        var itemCount = parseInt(args[3]);

        // التأكد من إدخال رقم الـ ID
        if (!isNaN(itemId)) {
            // الفحص هل المادة موجودة باللعبة فعلياً
            if (Item.isValidItem(itemId)) {
                
                // تحديد الـ Data الافتراضي بـ 0 إذا لم يُكتب
                if (isNaN(itemData) || itemData < 0) {
                    itemData = 0;
                }

                // تحديد الكمية الافتراضية بـ 1 إذا لم يكتب المستخدِم كمية
                if (isNaN(itemCount) || itemCount <= 0) {
                    itemCount = 1;
                }

                // إعطاء المادة بالـ Data والكمية المحددة وطباعة الرسالة
                addItemInventory(itemId, itemCount, itemData);
                clientMessage("Given item " + itemId + ":" + itemData + " x" + itemCount + " to Player!");
            } else {
                // تنبيه في حال كان الـ ID غير موجود
                clientMessage("Error: Item ID " + itemId + " does not exist!");
            }
        } else {
            // رسالة المساعدة في حال أخطأ في الصيغة
            clientMessage("Usage: /give <id> <data> <quantity>");
        }
    }
}
// نهاية مود الإعطاء
// نهاية كود المود
