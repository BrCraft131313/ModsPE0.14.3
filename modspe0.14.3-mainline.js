// ===============================================
// ModPE Script: MySQL-like Database Engine
// Target: Minecraft PE 0.14.3
// ===============================================

// 1. محاكي قاعدة البيانات (Database Class)
var DB = {
    tables: {},

    // إنشاء جدول جديد (CREATE TABLE)
    createTable: function(tableName, data) {
        this.tables[tableName] = data;
    },

    // الاستعلام عن عنصر واحد (SELECT * FROM table WHERE name = 'query' LIMIT 1)
    selectOne: function(tableName, keyName) {
        var table = this.tables[tableName];
        if (!table) return null;

        var key = keyName.toLowerCase().trim();
        if (table[key] !== undefined) {
            return { name: key, id: table[key] };
        }
        return null;
    },

    // البحث الجزئي (SELECT * FROM table WHERE name LIKE '%query%')
    searchLike: function(tableName, query) {
        var table = this.tables[tableName];
        if (!table) return [];

        var results = [];
        var cleanQuery = query.toLowerCase().trim();

        for (var item in table) {
            if (item.indexOf(cleanQuery) !== -1) {
                results.push({ name: item, id: table[item] });
            }
        }
        return results;
    }
};

// ===============================================
// 2. إدخال البيانات (Data Seeding / Schema)
// ===============================================

DB.createTable("items", {
    // Hidden & Special
    "invisible bedrock": 95,
    "glowing obsidian": 246,
    "nether reactor core": 247,
    "update block": 248,
    "ateupd block": 249,
    "reserved6": 255,
    "camera": 456,
    "mob spawner": 52,
    "fire": 51,

    // Blocks & Variants (Metadata)
    "stone": 1,
    "granite": "1:1",
    "polished granite": "1:2",
    "diorite": "1:3",
    "polished diorite": "1:4",
    "andesite": "1:5",
    "polished andesite": "1:6",
    "grass block": 2,
    "dirt": 3,
    "cobblestone": 4,

    // Food & Special Items
    "apple": 260,
    "golden apple": 322,
    "enchanted golden apple": "322:1",
    "notch apple": "322:1",
    "beetroot": 457,
    "beetroot seeds": 458,
    "beetroot soup": 459
});

// ===============================================
// 3. ربط الاستعلامات بالأوامر (/id)
// ===============================================

function chatHook(str) {
    var args = str.split(" ");
    var cmd = args[0].toLowerCase();

    if (cmd === "/id") {
        preventDefault();

        if (args.length < 2) {
            clientMessage(ChatColor.YELLOW + "Usage: /id <item_name>");
            return;
        }

        var queryName = str.substring(4).trim();

        // تنفيذ استعلام المباشر (Direct Match)
        var result = DB.selectOne("items", queryName);

        if (result) {
            clientMessage(ChatColor.GREEN + "[SQL Result] " + result.name.toUpperCase() + " -> ID: " + result.id);
            return;
        }

        // في حال عدم وجود مطابقة كليّة، نفذ بحث LIKE
        var searchResults = DB.searchLike("items", queryName);

        if (searchResults.length > 0) {
            clientMessage(ChatColor.AQUA + "[SQL Suggestions] Found " + searchResults.length + " match(es):");
            for (var i = 0; i < searchResults.length; i++) {
                clientMessage(ChatColor.GRAY + "- " + searchResults[i].name + " -> ID: " + searchResults[i].id);
            }
        } else {
            clientMessage(ChatColor.RED + "[SQL Error] No records found for: " + queryName);
        }
    }
}
