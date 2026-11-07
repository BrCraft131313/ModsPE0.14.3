// ==========================================
// ModPE Script: time-widget-bybrcraft131313.js
// Target: Minecraft PE 0.14.3 - Time Clock System
// ==========================================

function newLevel() {
    clientMessage("§aTime Clock Widget Loaded! Tap with a Clock (ID: 347) to get current time.");
}

// دالة جلب وتنسيق الوقت الحالي تماماً كمنطق الساعة الرقمية
function getCurrentTimeString() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = String(now.getMinutes());
    if (minutes.length < 2) { minutes = '0' + minutes; } // بديل لـ padstart لضمان التوافق التام مع بيئة Rhino القديمة
    
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) { hours = 12; }
    
    return hours + ":" + minutes + " " + ampm;
}

function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    // عند استخدام الساعة (ID: 347) بالنقر بها في العالم
    if (itemid == 347) {
        var currentTime = getCurrentTimeString();
        // يطبع الوقت الناتج في الشات داخل اللعبة
        clientMessage("§e[Clock] Current Time: §f" + currentTime);
    }
}
