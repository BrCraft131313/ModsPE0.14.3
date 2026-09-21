package com.brcraft131313.cmdmakerformcpe0143;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;

public class MainActivity extends Activity {

    private TextView lblAuthor, lblModName, lblCodePreview;
    private EditText authorInput, modNameInput, codePreview;
    private Button btnAddFunc, btnEditMod, btnExport, btnLangToggle;

    private StringBuilder currentModCode = new StringBuilder();
    private boolean isArabic = true; // الحالة الافتراضية

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        lblAuthor = (TextView) findViewById(R.id.lblAuthor);
        lblModName = (TextView) findViewById(R.id.lblModName);
        lblCodePreview = (TextView) findViewById(R.id.lblCodePreview);

        authorInput = (EditText) findViewById(R.id.authorInput);
        modNameInput = (EditText) findViewById(R.id.modNameInput);
        codePreview = (EditText) findViewById(R.id.codePreview);

        btnAddFunc = (Button) findViewById(R.id.btnAddFunc);
        btnEditMod = (Button) findViewById(R.id.btnEditMod);
        btnExport = (Button) findViewById(R.id.btnExport);
        btnLangToggle = (Button) findViewById(R.id.btnLangToggle);

        // تبديل اللغة
        btnLangToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isArabic = !isArabic;
                updateLanguageUI();
            }
        });

        // 1. زر [Add Func]
        btnAddFunc.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showCategorySelectionDialog();
            }
        });

        // 2. زر [Edit Mod]
        btnEditMod.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showEditModDialog();
            }
        });

        // 3. زر [Export]
        btnExport.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                exportModScript();
            }
        });

        updateLanguageUI();
    }

    // تحديث كافة نصوص الواجهة حسب اللغة الحالية
    private void updateLanguageUI() {
        if (isArabic) {
            lblAuthor.setText("Author (اسم المطور):");
            authorInput.setHint("مثال: Bader");
            lblModName.setText("Mod Name (اسم المود):");
            modNameInput.setHint("مثال: SuperSword");
            lblCodePreview.setText("كود المود المجمع (Mod Code Preview):");
            codePreview.setHint("// اضغط [Add Func] لإضافة دوال أو [Edit Mod] للتعديل المباشر");
            btnLangToggle.setText("🌐 English");
        } else {
            lblAuthor.setText("Author Name:");
            authorInput.setHint("e.g. Bader");
            lblModName.setText("Mod Name:");
            modNameInput.setHint("e.g. SuperSword");
            lblCodePreview.setText("Compiled Mod Code Preview:");
            codePreview.setHint("// Press [Add Func] to add functions or [Edit Mod] to edit directly");
            btnLangToggle.setText("🌐 عربي");
        }
    }

    // ==========================================
    // 1. عرض تصنيفات الدوال
    // ==========================================
    private void showCategorySelectionDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(isArabic ? "اختر قسم الدوال:" : "Select Function Category:");
        builder.setItems(ModFunctionsData.getCategories(isArabic), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int categoryIndex) {
                showFunctionSubMenu(categoryIndex);
            }
        });
        builder.setNegativeButton(isArabic ? "إلغاء" : "Cancel", null);
        builder.show();
    }

    private void showFunctionSubMenu(final int categoryIndex) {
        final String[] functions = ModFunctionsData.getFunctionsByCategory(categoryIndex);

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(ModFunctionsData.getCategories(isArabic)[categoryIndex]);
        builder.setItems(functions, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int funcIndex) {
                String selectedFunction = functions[funcIndex] + ";\n";
                appendCode(selectedFunction);
            }
        });
        builder.setNegativeButton(isArabic ? "رجوع" : "Back", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                showCategorySelectionDialog();
            }
        });
        builder.show();
    }

    private void appendCode(String snippet) {
        currentModCode.append(snippet);
        codePreview.setText(currentModCode.toString());
        Toast.makeText(this, isArabic ? "تمت إضافة الدالة إلى الكود" : "Function added to code", Toast.LENGTH_SHORT).show();
    }

    // ==========================================
    // 2. محرر الكود المباشر [Edit Mod]
    // ==========================================
    private void showEditModDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(isArabic ? "تعديل كود المود (Edit Mod)" : "Edit Mod Code");

        final EditText editInput = new EditText(this);
        editInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        editInput.setLines(12);
        editInput.setGravity(android.view.Gravity.TOP);
        editInput.setText(codePreview.getText().toString());

        builder.setView(editInput);

        builder.setPositiveButton(isArabic ? "حفظ التعديلات" : "Save Changes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String updatedCode = editInput.getText().toString();
                currentModCode = new StringBuilder(updatedCode);
                codePreview.setText(updatedCode);
                Toast.makeText(MainActivity.this, isArabic ? "تم تحديث الكود" : "Code Updated", Toast.LENGTH_SHORT).show();
            }
        });

        builder.setNegativeButton(isArabic ? "إلغاء" : "Cancel", null);
        builder.show();
    }

    // ==========================================
    // 3. آلية التصدير [Export] (name-byauthor.js)
    // ==========================================
    private void exportModScript() {
        String author = authorInput.getText().toString().trim();
        String modName = modNameInput.getText().toString().trim();
        String rawCode = codePreview.getText().toString().trim();

        if (author.isEmpty()) {
            Toast.makeText(this, isArabic ? "الرجاء إدخال اسم المطور (Author)" : "Please enter Author name", Toast.LENGTH_SHORT).show();
            return;
        }

        if (modName.isEmpty()) {
            Toast.makeText(this, isArabic ? "الرجاء إدخال اسم المود (Mod Name)" : "Please enter Mod name", Toast.LENGTH_SHORT).show();
            return;
        }

        String cleanAuthor = author.toLowerCase().replaceAll("[^a-z0-9]", "");
        String cleanModName = modName.toLowerCase().replaceAll("[^a-z0-9]", "");
        String fileName = cleanModName + "-by" + cleanAuthor + ".js";

        StringBuilder fullScript = new StringBuilder();
        fullScript.append("/*\n");
        fullScript.append(" * Mod Generated by Mod Maker PE 0.14.3\n");
        fullScript.append(" * Name   : ").append(modName).append("\n");
        fullScript.append(" * Author : ").append(author).append("\n");
        fullScript.append(" */\n\n");
        fullScript.append(rawCode).append("\n");

        try {
            File dir = new File(getExternalFilesDir(null), "mods");
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File file = new File(dir, fileName);
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(fullScript.toString().getBytes());
            fos.close();

            String successMsg = isArabic ? 
                "تم تصدير المود بنجاح!\nاسم الملف: " + fileName : 
                "Mod exported successfully!\nFile: " + fileName;
            Toast.makeText(this, successMsg, Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            Toast.makeText(this, (isArabic ? "خطأ أثناء التصدير: " : "Export Error: ") + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }
}
