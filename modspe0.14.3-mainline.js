// سكربت إضافة زجاج ملون بمعرفات مستقلة - ماينكرافت 0.14.3
// المعرفات المستقلة المستخدمة: 211, 212, 213, 214, 215, 216, 217, 218

// قائمة ألوان الزجاج مع المعرفات وشكل النسيج
var GLASS_TYPES = [
    { id: 211, name: "Red Glass", colorMeta: 14 },
    { id: 212, name: "Blue Glass", colorMeta: 11 },
    { id: 213, name: "Green Glass", colorMeta: 13 },
    { id: 214, name: "Yellow Glass", colorMeta: 4 },
    { id: 215, name: "Purple Glass", colorMeta: 10 },
    { id: 216, name: "Orange Glass", colorMeta: 1 },
    { id: 217, name: "Black Glass", colorMeta: 15 },
    { id: 218, name: "White Glass", colorMeta: 0 }
];

// تسجيل البلوكات وإعطائها خواص الزجاج الشفاف
for (var i = 0; i < GLASS_TYPES.length; i++) {
    var glass = GLASS_TYPES[i];
    
    // تعريف البلوك باستعمال نسج الألوان وطبقة الشفافية
    Block.defineBlock(glass.id, glass.name, [["wool", glass.colorMeta]], 20, false, 0);
    
    // سرعة الكسر مثل الزجاج العادي
    Block.setDestroyTime(glass.id, 0.3);
    
    // جعل البلوك ينفذ الضوء بالكامل
    Block.setLightOpacity(glass.id, 0);
    
    // تفعيل طبقة الرندر الشفافة (RenderLayer 1)
    Block.setRenderLayer(glass.id, 1);
}

// رسالة عند استخدام أو وضع الزجاج الملون
function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    for (var i = 0; i < GLASS_TYPES.length; i++) {
        if (itemid == GLASS_TYPES[i].id) {
            clientMessage("Placed " + GLASS_TYPES[i].name);
            break;
        }
    }
}
