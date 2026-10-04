/* ==========================================================================
   المود: كتاب وقلم (Book and Quill) بصفحة خاصة وواجهة كتابة أندرويد
   ========================================================================== */

// المعرف المكتبي لعنصر Book and Quill
var BOOK_AND_QUILL_ID = 386;

// 1. تسجيل وتعريف العنصر رسمياً في اللعبة
ModPE.setItem(BOOK_AND_QUILL_ID, "book_writable", 0, "Book and Quill", 1);

// 2. إضافة العنصر إلى قائمة الإبداعي (Creative Inventory)
Player.addItemCreativeInv(BOOK_AND_QUILL_ID, 1, 0);

// تخزين النصوص المكتوبة بربطها بمعرّف الكتاب الفريد
var booksData = {};

// عداد توليد معرّفات فريدة للكتب الجديدة
var nextBookId = 1;

// 3. التفاعل عند استخدام العنصر على بلوك
function useItem(x, y, z, itemId, blockId, side, itemData) {
    if (itemId == BOOK_AND_QUILL_ID) {
        var player = Player.getEntity();
        var currentData = itemData;

        // إذا كان الكتاب جديداً (Data = 0)، يتم إعطاؤه معرّفاً فريداً
        if (currentData == 0) {
            currentData = nextBookId;
            nextBookId++;
            // تحديث بيانات العنصر المحمول في يد اللاعب بالمعرف الجديد
            Entity.setCarriedItem(player, BOOK_AND_QUILL_ID, Player.getCarriedItemCount(), currentData);
        }

        // فتح واجهة الأندرويد للكتابة
        openBookUI(currentData);
    }
}

// 4. دالة إظهار واجهة الكتابة والحفظ عبر أندرويد UI
function openBookUI(bookId) {
    var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                var builder = new android.app.AlertDialog.Builder(ctx);
                builder.setTitle("Book and Quill (Page 1)");

                // إنشاء حقل النص
                var input = new android.widget.EditText(ctx);
                input.setHint("Write your text here...");

                // استرجاع النص الخاص بهذا الكتاب إن وجد
                if (booksData[bookId]) {
                    input.setText(booksData[bookId]);
                }

                builder.setView(input);

                // زر الحفظ Save
                builder.setPositiveButton("Save", new android.content.DialogInterface.OnClickListener({
                    onClick: function(dialog, which) {
                        var text = input.getText().toString();
                        booksData[bookId] = text;
                        clientMessage("[Book] Page content saved successfully.");
                    }
                }));

                // زر الإلغاء Cancel
                builder.setNegativeButton("Cancel", new android.content.DialogInterface.OnClickListener({
                    onClick: function(dialog, which) {
                        dialog.dismiss();
                    }
                }));

                builder.show();
            } catch (err) {
                clientMessage("[Book Error] Unable to open editor interface.");
            }
        }
    }));
}
