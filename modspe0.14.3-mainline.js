// Performance Booster with On-Screen UI Button for MCPE 0.14.3
// By BrCraft131313

var btnWindow = null;
var disableParticles = false;

// تشغيل الواجهة عند فتح العالم
function selectLevelHook() {
    var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
    
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                // إنشاء تخطيط الزر (Layout)
                var layout = new android.widget.LinearLayout(ctx);
                var btn = new android.widget.Button(ctx);
                
                btn.setText("⚡ Clean");
                btn.setTextColor(android.graphics.Color.YELLOW);
                btn.setTextSize(12);
                
                // جعل خلفية الزر شبه شفافة
                btn.setBackgroundColor(android.graphics.Color.argb(100, 0, 0, 0)); 

                // عند الضغط على الزر
                btn.setOnClickListener(new android.view.View.OnClickListener({
                    onClick: function(v) {
                        var count = cleanWorld();
                        print("§a[LagFix] Cleaned " + count + " items & RAM!");
                    }
                }));

                layout.addView(btn);

                // تحديد موقع الزر أعلى الزاوية اليسار (مكان الدائرة البرتقالية)
                btnWindow = new android.widget.PopupWindow(layout, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
                btnWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, 10, 10);
            } catch (e) {
                print("Error UI: " + e);
            }
        }
    }));
}

// إخفاء الزر عند الخروج من العالم
function leaveGame() {
    if (btnWindow != null) {
        var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
        ctx.runOnUiThread(new java.lang.Runnable({
            run: function() {
                if (btnWindow != null) {
                    btnWindow.dismiss();
                    btnWindow = null;
                }
            }
        }));
    }
}

// دالة إلغاء الجسيمات
function particleCreatedHook(particleType, x, y, z, vx, vy, vz) {
    if (disableParticles) {
        preventDefault();
    }
}

// دالة التنظيف المباشر
function cleanWorld() {
    var count = 0;
    var entities = Entity.getAll();
    for (var i = 0; i < entities.length; i++) {
        var ent = entities[i];
        if (Entity.getEntityTypeId(ent) == 64) { // 64 = Dropped Item
            Entity.remove(ent);
            count++;
        }
    }
    java.lang.System.gc(); // تفريغ ذاكرة الـ RAM
    return count;
}

function procCmd(command) {
    var args = command.split(" ");
    if (args[0].toLowerCase() == "noparticles") {
        disableParticles = !disableParticles;
        clientMessage("§e[LagFix] Particles disabled: " + disableParticles);
    }
}
