// ==========================================
// ModPE Script: SlimeBoots.js (Dynamic Height Bounce)
// Minecraft PE 0.14.3
// ==========================================

var highestY = 0;
var needBounce = false;
var bounceVelY = 0;

function modTick() {
    var player = Player.getEntity();
    var currentY = Entity.getY(player);
    var velY = Entity.getVelY(player);

    // إذا كان اللاعب واقفا أو صاعداً للأعلى، نحدث أعلى نقطة باستمرار
    if (velY >= -0.05) {
        highestY = currentY;
    } else {
        // أثناء السقوط، نحفظ أعلى ارتفاع تم الوصول إليه
        highestY = Math.max(highestY, currentY);
    }

    // تنفيذ الارتداد في الفريم التالي داخل modTick
    if (needBounce) {
        Entity.setVelY(player, bounceVelY);
        
        // إظهار تأثير جسيمات السلايم (ID 16)
        var px = Entity.getX(player);
        var py = Entity.getY(player);
        var pz = Entity.getZ(player);
        Level.addParticle(16, px, py, pz, 0, 0.1, 0, 20);
        
        // إعادة تعيين المتغيرات
        needBounce = false;
        bounceVelY = 0;
        highestY = Entity.getY(player);
    }
}

function entityHurtHook(attacker, victim, hearts) {
    if (victim == Player.getEntity()) {
        
        // جلب ID الحذاء (3 = Boots)
        var bootsId = Player.getArmorSlot(3);

        // إذا كان يرتدي حذاء الألماس المخصص (313)
        if (bootsId == 313) {
            
            // 1. إلغاء ضرر السقوط تماماً
            preventDefault();

            var currentY = Entity.getY(victim);
            // حساب فرق الارتفاع: (أعلى ارتفاع - الارتفاع الحالي عند الاصطدام)
            var fallDistance = highestY - currentY;

            if (fallDistance > 1) {
                // تحويل مسافة السقوط لسرعة دفع رأسية تعيدك لقمة الارتفاع
                bounceVelY = Math.sqrt(0.15 * fallDistance);
                needBounce = true;
            }
        }
    }
}
