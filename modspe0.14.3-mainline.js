/* ==========================================================================
   المود: تسمية الكائنات (NameTag GUI Mod) - النسخة المصححة
   ========================================================================== */

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var targetMob = -1;
var isDialogOpen = false; // حماية لمنع تكرار فتح النافذة

ModPE.setItem(518, "name_tag", 0, "NameTag", 64);

function attackHook(attacker, victim) {
    if (attacker == Player.getEntity() && Player.getCarriedItem() == 518) {
        if (Entity.isSneaking(attacker)) {
            // إذا كانت هناك نافذة مفتوحة بالفعل، تجاهل الضربة الثانية
            if (isDialogOpen) return;

            targetMob = victim;
            isDialogOpen = true;

            showNameDialog();

            var currentHp = Entity.getHealth(victim);
            Entity.setHealth(victim, currentHp + 1);

            if (typeof preventDefault === "function") {
                preventDefault(); 
            }
        } else {
            clientMessage("[NameTag] You must sneak (shift) to name this mob!");
        }
    }
}

function showNameDialog() {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                var layout = new android.widget.LinearLayout(ctx);
                layout.setOrientation(1);
                layout.setPadding(50, 40, 50, 40);

                var input = new android.widget.EditText(ctx);
                input.setHint("Enter mob name...");
                layout.addView(input);

                var dialog = new android.app.AlertDialog.Builder(ctx);
                dialog.setTitle("Set NameTag");
                dialog.setView(layout);

                dialog.setPositiveButton("Enter", new android.content.DialogInterface.OnClickListener({
                    onClick: function(dialogInterface, i) {
                        // تحويل كائن جافا إلى نص جافاسكريبت صريح
                        var newName = ("" + input.getText()).trim();

                        if (targetMob != -1 && newName.length > 0) {
                            Entity.setNameTag(targetMob, newName);
                            clientMessage("[NameTag] Mob successfully named: " + newName);
                        } else if (newName.length === 0) {
                            clientMessage("[NameTag] Name cannot be empty.");
                        } else {
                            clientMessage("[NameTag] Target mob lost!");
                        }

                        // إعادة ضبط الحالة بعد الانتهاء
                        targetMob = -1;
                        isDialogOpen = false;
                    }
                }));

                dialog.setNegativeButton("Cancel", new android.content.DialogInterface.OnClickListener({
                    onClick: function(dialogInterface, i) {
                        targetMob = -1;
                        isDialogOpen = false;
                    }
                }));

                dialog.show();
            } catch (e) {
                clientMessage("GUI Error: " + e);
                targetMob = -1;
                isDialogOpen = false;
            }
        }
    }));
                              }
