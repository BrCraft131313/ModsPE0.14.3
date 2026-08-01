// ===============================================
// Diamond Ore Crafting Mod
// Made for ModPE / Minecraft PE 0.14.3
// ===============================================

// 1. وصفة باستخدام الكبلستون (Cobblestone - ID 4)
Item.addShapedRecipe(
    56, 1, 0, // الناتج: بلوكة Diamond Ore (ID 56) بعدد 1
    [
        "ccc", // السطر الأول: 3 كبلستون
        "cdc", // السطر الثاني: كبلستون - دايموند - كبلستون
        "ccc"  // السطر الثالث: 3 كبلستون
    ],
    [
        "c", 4, 0,   // الحرف 'c' يرمز للـ Cobblestone (ID 4)
        "d", 264, 0  // الحرف 'd' يرمز للـ Diamond (ID 264)
    ]
);

// 2. وصفة باستخدام الستون العادي (Stone - ID 1)
Item.addShapedRecipe(
    56, 1, 0, // الناتج: بلوكة Diamond Ore (ID 56) بعدد 1
    [
        "sss", // السطر الأول: 3 ستون
        "sds", // السطر الثاني: ستون - دايموند - ستون
        "sss"  // السطر الثالث: 3 ستون
    ],
    [
        "s", 1, 0,   // الحرف 's' يرمز للـ Stone (ID 1)
        "d", 264, 0  // الحرف 'd' يرمز للـ Diamond (ID 264)
    ]
);

// رسالة توضيحية عند تشغيل المود
function newLevel() {
    clientMessage("Diamond Ore Crafting Mod Enabled!");
}
