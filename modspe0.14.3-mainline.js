// مصفوفة لتتبع الإنجازات التي تم فتحها
var achievements = {};

// عدادات الإنجازات التراكمية
var stats = {
    blocksBroken: 0,
    mobsKilled: 0
};

// دالة مخصصة لطباعة الإنجاز في الشات بأمان
function unlockAchievement(id, title, description) {
    if (!achievements[id]) {
        achievements[id] = true;
        clientMessage("§e§l[Achievement Unlocked!] §f" + title);
        clientMessage("§a" + description);
    }
}

// 1. عند دخول أو إنشاء العالم
function newLevel() {
    clientMessage("§bWelcome to the World! Type §e/achievements §bto see all available achievements.");
}

// 2. أمر لمعرفة قائمة الإنجازات المتاحة وحالتها
function procCmd(command) {
    var cmd = command.toLowerCase().split(" ");
    if (cmd[0] == "achievements" || cmd[0] == "ach") {
        clientMessage("§e=== §lAchievements List §r§e===");
        clientMessage((achievements["pickaxe"] ? "§a[✔]" : "§c[✘]") + " §fTime to Mine! - Mine any block with a pickaxe");
        clientMessage((achievements["lava"] ? "§a[✔]" : "§c[✘]") + " §fHot Stuff! - Use a lava bucket");
        clientMessage((achievements["tnt"] ? "§a[✔]" : "§c[✘]") + " §fKaboom! - Ignite TNT");
        clientMessage((achievements["golden_apple"] ? "§a[✔]" : "§c[✘]") + " §fOverpowered - Eat a Golden Apple");
        clientMessage((achievements["farmer"] ? "§a[✔]" : "§c[✘]") + " §fA Seedy Place - Plant a seed");
        clientMessage((achievements["enchanting"] ? "§a[✔]" : "§c[✘]") + " §fLibrarian! - Open Enchanting Table");
        clientMessage((achievements["anvil"] ? "§a[✔]" : "§c[✘]") + " §fHeavy Metal! - Open Anvil");
        clientMessage((achievements["fish"] ? "§a[✔]" : "§c[✘]") + " §fFishy Business - Use a Fishing Rod");
        clientMessage((achievements["hooked"] ? "§a[✔]" : "§c[✘]") + " §fHook, Line, and Sinker - Hit entity with rod");
        clientMessage((achievements["zombie_villager"] ? "§a[✔]" : "§c[✘]") + " §fZombie Doctor? - Hit a Zombie Villager");
        clientMessage((achievements["wood"] ? "§a[✔]" : "§c[✘]") + " §fGetting Wood! - Mine wood");
        clientMessage((achievements["diamonds"] ? "§a[✔]" : "§c[✘]") + " §fDIAMONDS! - Mine diamond ore");
        clientMessage((achievements["redstone"] ? "§a[✔]" : "§c[✘]") + " §fDelicious Fish - Mine redstone ore");
        clientMessage((achievements["miner_1000"] ? "§a[✔]" : "§c[✘]") + " §fDedicated Miner - Break 1,000 blocks");
        clientMessage((achievements["creeper_slayer"] ? "§a[✔]" : "§c[✘]") + " §fShort Fuse - Kill a Creeper");
        clientMessage((achievements["skeleton_slayer"] ? "§a[✔]" : "§c[✘]") + " §fSniper Duel - Kill a Skeleton");
        clientMessage((achievements["enderman_slayer"] ? "§a[✔]" : "§c[✘]") + " §fStaring Contest - Kill an Enderman");
        clientMessage((achievements["pigman_slayer"] ? "§a[✔]" : "§c[✘]") + " §fAnger Management - Kill a Zombie Pigman");
        clientMessage((achievements["the_end"] ? "§a[✔]" : "§c[✘]") + " §fThe End? - Kill a Ghast");
        clientMessage((achievements["monster_hunter"] ? "§a[✔]" : "§c[✘]") + " §fMonster Hunter - Kill 100 monsters");
        clientMessage((achievements["near_death"] ? "§a[✔]" : "§c[✘]") + " §fNot Today! - Survive with 0.5 heart");
    }
}

// 3. التفاعل مع العناصر
function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    if (itemId == 327) {
        unlockAchievement("lava", "Hot Stuff!", "Careful! Lava is extremely hot!");
    }
    if (itemId == 259 && blockId == 46) {
        unlockAchievement("tnt", "Kaboom!", "Ignite a block of TNT!");
    }
    if (itemId == 322) {
        unlockAchievement("golden_apple", "Overpowered", "Consume a Golden Apple!");
    }
    if (itemId == 295) {
        unlockAchievement("farmer", "A Seedy Place", "Plant a seed in tilled soil!");
    }
    if (blockId == 116) {
        unlockAchievement("enchanting", "Librarian!", "Access an Enchanting Table!");
    }
    if (blockId == 145) {
        unlockAchievement("anvil", "Heavy Metal!", "Use an Anvil to repair or forge!");
    }
    if (itemId == 346) {
        unlockAchievement("fish", "Fishy Business", "Use a fishing rod to catch something!");
    }
}

// 4. كسر البلوكات
function destroyBlock(x, y, z, side) {
    var blockId = Level.getTile(x, y, z);
    var heldItem = Player.getCarriedItem();
    stats.blocksBroken++;

    // إنجاز التعدين بالبيككس عند كسر أي بلوكة بيككس (270, 274, 257, 278, 285)
    if (heldItem == 270 || heldItem == 274 || heldItem == 257 || heldItem == 278 || heldItem == 285) {
        unlockAchievement("pickaxe", "Time to Mine!", "Use a pickaxe to mine!");
    }

    // جمع الخشب (Wood = 17, Wood2 = 162)
    if (blockId == 17 || blockId == 162) {
        unlockAchievement("wood", "Getting Wood!", "Collect wood from a tree!");
    }

    // الألماس (Diamond Ore = 56)
    if (blockId == 56) {
        unlockAchievement("diamonds", "DIAMONDS!", "Acquire shiny blue diamonds!");
    }

    // الريدستون (Redstone Ore = 73 or 74)
    if (blockId == 73 || blockId == 74) {
        unlockAchievement("redstone", "Delicious Fish", "Mine redstone ore for engineering!");
    }

    // كسر 1,000 بلوكة
    if (stats.blocksBroken >= 1000) {
        unlockAchievement("miner_1000", "Dedicated Miner", "Break 1,000 blocks in total!");
    }
}

// 5. الضرب والتفاعل مع الكائنات
function attackHook(attacker, victim) {
    if (attacker && victim && attacker == Player.getEntity()) {
        var item = Player.getCarriedItem();
        var type = Entity.getEntityTypeId(victim);

        if (item == 346) {
            unlockAchievement("hooked", "Hook, Line, and Sinker", "Hit an entity using a fishing rod!");
        }

        if (type == 44) {
            unlockAchievement("zombie_villager", "Zombie Doctor?", "Encounter a Zombie Villager!");
        }
    }
}

// 6. عند قتل الكائنات
function entityDeathHook(entity, attacker) {
    if (attacker && entity && attacker == Player.getEntity()) {
        var type = Entity.getEntityTypeId(entity);
        stats.mobsKilled++;

        if (type == 33) {
            unlockAchievement("creeper_slayer", "Short Fuse", "Defeat a Creeper!");
        }
        if (type == 34) {
            unlockAchievement("skeleton_slayer", "Sniper Duel", "Defeat a Skeleton!");
        }
        if (type == 38) {
            unlockAchievement("enderman_slayer", "Staring Contest", "Defeat an Enderman!");
        }
        if (type == 36) {
            unlockAchievement("pigman_slayer", "Anger Management", "Defeat a Zombie Pigman!");
        }
        if (type == 41) {
            unlockAchievement("the_end", "The End?", "Defeat the Ghast!");
        }
        if (stats.mobsKilled >= 100) {
            unlockAchievement("monster_hunter", "Monster Hunter", "Defeat 100 monsters!");
        }
    }
}

// 7. عند إصابة اللاعب بنصف قلب
function entityHurtHook(attacker, victim, halfHearts) {
    if (victim && victim == Player.getEntity()) {
        if (Entity.getHealth(Player.getEntity()) <= 1) {
            unlockAchievement("near_death", "Not Today!", "Survive an attack with only half a heart left!");
        }
    }
}
