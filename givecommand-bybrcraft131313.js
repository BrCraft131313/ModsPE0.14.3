//بداية كود المود 
//بداية كود بداية العالم 
function newLevel(){
    //رسالة توضح اسم المود وصانعه 
    clientMessage("Welcome To GiveCommand by BrCraft131313!")
}
//نهاية كود بداية العالم 
// بداية مود الإعطاء (GiveMod)
function procCmd(cmd) {
    // تقسيم النص المكتوب بناءً على المسافات
    var args = cmd.split(" ");
    var mainCmd = args[0];

    // أمر الإعطاء
    if (mainCmd === "give") {
        var itemId = parseInt(args[1]);
        var itemCount = parseInt(args[2]);

        // التأكد من إدخال رقم الـ ID
        if (!isNaN(itemId)) {
            // الفحص هل المادة موجودة باللعبة فعلياً
            if (Item.isValidItem(itemId)) {
                
                // تحديد الكمية الافتراضية بـ 1 إذا لم يكتب المستخدِم كمية
                if (isNaN(itemCount) || itemCount <= 0) {
                    itemCount = 1;
                }

                // إعطاء المادة وطباعة الرسالة
                addItemInventory(itemId, itemCount);
                clientMessage("Given item " + itemId + " x" + itemCount + " to Player!");
            } else {
                // تنبيه في حال كان الـ ID غير موجود
                clientMessage("Error: Item ID " + itemId + " does not exist!");
            }
        } else {
            // رسالة المساعدة في حال أخطأ في الصيغة
            clientMessage("Usage: /give <ID> <Amount>");
        }
    }
}
// نهاية مود الإعطاء
//نهاية كود المود 