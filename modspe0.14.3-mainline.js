/*
 * Mod Name     : Launch Chrome Mod
 * Target Engine: MCPE 0.14.3 (BlockLauncher / ModPE Script)
 * Standard    : MECANE (Messages English, Comments Arabic, No Emojis)
 */

// ==========================================
// 1. التقاط أمر الشات (/chrome)
// ==========================================

function chatHook(str) {
    var cmd = str.trim().toLowerCase();

    if (cmd === "chrome" || cmd === "/chrome") {
        clientMessage("§a[Chrome Mod] Opening Google Chrome...");
        launchChromeApp();
    }
}

// ==========================================
// 2. دالة التعامل مع نظام أندرويد (Android Intent)
// ==========================================

function launchChromeApp() {
    var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
    if (ctx == null) return;

    // تشغيل الكود على Android UI Thread لمنع الكراش
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                var pm = ctx.getPackageManager();
                
                // محاولة تشغيل حزمة جوجل كروم الرسمية
                var intent = pm.getLaunchIntentForPackage("com.android.chrome");

                if (intent != null) {
                    ctx.startActivity(intent);
                } else {
                    // في حال عدم وجود كروم، يفتح المتصفح الافتراضي على موقع Google
                    clientMessage("§e[Chrome Mod] Chrome app not found! Opening default browser...");
                    var browserIntent = new android.content.Intent(
                        android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://www.google.com")
                    );
                    ctx.startActivity(browserIntent);
                }
            } catch (e) {
                clientMessage("§c[Chrome Mod] Error launching app: " + e);
            }
        }
    }));
}
