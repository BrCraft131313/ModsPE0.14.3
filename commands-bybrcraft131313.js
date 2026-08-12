//بداية كود المود
//بداية كود بداية العالم
function newLevel(){
    //طباعة رسالة ترحيبية توضح اسم المود وصانعه 
    clientMessage("Welcome To CommandsMod By BrCraft131313!")
}
//نهاية كود بداية العالم

//بداية كود الأوامر
function procCmd(cmd){
    //امر إلغاء الطيران
    if(cmd=="unfly"){
        Player.setCanFly(false)
        clientMessage("Fly: Off")
    }
    //أمر تفعيل الطيران
    if(cmd=="fly"){
        Player.setCanFly(true)
        clientMessage("Fly: ON")
    }
    //أمر الخروج من العالم
    if(cmd=="bye"){
        ModPE.leaveGame()
        clientMessage("Bye!")
    }
    //خدعة
    if(cmd=="egg"){
        clientMessage("BrCraft131313")
    }
 

    //أمر تنظيف المخزن
        if(cmd=="clear"){
        for (var i = 0; i < 45; i++) 
        Player.clearInventorySlot(i)
        clientMessage("Everything in Inventory has been deleted!")
    }
    //أمر الترحيب الأول
    if(cmd=="hi"){
        clientMessage("Hi!")
    }
    //أمر الترحيب الثاني
    if(cmd=="hello"){
        clientMessage("Hello!")
    }
    //أمر للمعلومات عن المود
    if(cmd=="info"){
        clientMessage("Mod Name: Commands, Creator: BrCraft131313, Version: V173, Sum Of Commands/All Commands= 25")
    }
    //تحويل الوقت إلى الصباح 
    if(cmd=="time day"){
        Level.setTime(0)
        clientMessage("The time has been changed to morning!")
    }
    //تحويل الوقت إلى الليل
    if(cmd=="time night"){
        Level.setTime(14000)
        clientMessage("The time has been changed to night!")
    }
    if (cmd == "yaw") {
        // [1] جلب الكائن الخاص باللاعب
        var player = getPlayerEnt();
        
        // [2] جلب قيمة الـ Yaw (زاوية الدوران الأفقية)
        var yawValue = getYaw(player);
        
        // [3] تقريب الرقم لمنع ظهور كسور طويلة في الشات
        var roundedYaw = Math.round(yawValue);
        
        // [4] طباعة النتيجة للاعب
        clientMessage("Your Yaw: " + roundedYaw);
    }
        if (cmd == "pitch") {
        // جلب كائن اللاعب
        var player = getPlayerEnt();
        
        // جلب زاوية النظر الرأسية (فوق/تحت)
        var pitchValue = getPitch(player);
        
        // تقريب الرقم
        var roundedPitch = Math.round(pitchValue);
        
        // طباعة النتيجة
        clientMessage("Your Pitch: " + roundedPitch);
    }
    //أمر تغيير الوضع إلى الوضع الإبداعي
    if(cmd=="gm 1"){
        //تحويل الوضع إلى الوضع الإبداعي 
        Level.setGameMode(1)
        //رسالة توضح بأن تم تغيير الوضع إلى الوضع الإبداعي 
        clientMessage("Changed To Creative!")
    }
    //أمر تغيير الوضع إلى وضع البقاء على قيد الحياة 
    if(cmd=="gm 0"){
       //تحويل الوضع إلى وضع البقاء على قيد الحياة 
        Level.setGameMode(0)
        //رسالة توضح بأن تم تغيير الوضع إلى وضع البقاء على قيد الحياة 
        clientMessage("Changed To Survival!")
    }
        // أمر تفعيل الرؤية الليلية اللانهائية
    if(cmd == "gamma") {
        // تأثير الرؤية الليلية (المعرف: 16)، المدة بالأطر (999999)، الدرجة (1)
        Entity.addEffect(Player.getEntity(), 16, 999999 * 20, 1, false, true);
        clientMessage("Night Vision: ON");
    }

    // أمر إلغاء الرؤية الليلية
    if(cmd == "ungamma") {
        // إزالة تأثير الرؤية الليلية (المعرف: 16) من اللاعب
        Entity.removeEffect(Player.getEntity(), 16);
        clientMessage("Night Vision: OFF");
    }
    //أمر يعطيك معلومات عني 
    if(cmd=="infome"){
        clientMessage("About me: My Github: github.com/BrCraft131313 , My YouTube: m.youtube.com/@brcraft-v8v , My TikTok: tiktok.com/@brcraft131313 My Portfolio: https://brcraft131313.github.io/Portfolio/, My Name is BrCraft131313")
    }
    // أمر المعالجة الشاملة والتعبئة
    if (cmd == "heal") {
        Player.setHealth(20);
        Player.setHunger(20);
        Player.setSaturation(20);
        Entity.removeAllEffects(Player.getEntity());
        clientMessage("Health & Hunger restored!");
    }

    // أمر مسح جميع الكائنات والوحوش
    if (cmd == "kill @a") {
        var all = Entity.getAll();
        for (var i = 0; i < all.length; i++) {
            if (!Player.isPlayer(all[i])) {
                Entity.remove(all[i]);
            }
        }
        clientMessage("All entities removed!");
    }

    
    // أمر تشغيل المطر
    if (cmd == "rain on") {
        Level.setRainLevel(1.0);
        clientMessage("Rain enabled.");
    }

    // أمر إيقاف المطر
    if (cmd == "rain off") {
        Level.setRainLevel(0.0);
        clientMessage("Rain disabled.");
    }
    if (cmd == "speed 2") {
    ModPE.setGameSpeed(40.0);
    clientMessage("Game Speed x2");
}
if (cmd == "speed 1") {
    ModPE.setGameSpeed(20.0);
    clientMessage("Game Speed Normal");
}

if (cmd == "stats") {
    clientMessage("World: " + Level.getWorldName());
    clientMessage("GameMode: " + Level.getGameMode());
    clientMessage("Difficulty: " + Level.getDifficulty());
}

    
 
    
    //قائمة المودات(المساعدة)
    if(cmd=="help"){
        clientMessage("Sum Of Commands/All Commands(25) = fly, unfly, bye, egg, help, clear, hi, hello,info, time day, time night, yaw, pitch, gm 1, gm 0, gamma, ungamma, infome, heal, kill @a, rain on, rain off, speed 1, speed 2, stats")
    }
    //نهاية كود الأوامر
}
//نهاية كود المود