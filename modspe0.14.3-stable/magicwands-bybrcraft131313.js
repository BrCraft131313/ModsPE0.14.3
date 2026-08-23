// بداية كود مود العصا السحرية

function newLevel() {
    clientMessage(ChatColor.GOLD + "Magic Wands Mod Loaded!");
}

// الـ Hook المسؤول عن استخدام الأغراض عند الضغط على الكتل
function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
    
    // فحص ما إذا كان العنصر المستخدم هو العصا (Stick = ID 280)
    if (itemid == 280) {
        
        // 1. عصا البرق: عند الضغط على أي كتلة تستدعي ضربة برق
        if (Player.getCarriedItemData() == 0) {
            Level.spawnMob(x, y + 1, z, EntityType.LIGHTNING_BOLT, "");
            Level.addParticle(ParticleType.flame, x, y + 1, z, 0, 0, 0, 20);
            clientMessage(ChatColor.YELLOW + "[Magic] Lightning Strike!");
        }
        
        // 2. عصا الانفجار السحري: إذا كانت Dmg/Data = 1
        else if (Player.getCarriedItemData() == 1) {
            Level.explode(x, y + 1, z, 3.0, false);
            Level.addParticle(ParticleType.hugeexplosion, x, y + 1, z, 0, 0, 0, 1);
            clientMessage(ChatColor.RED + "[Magic] Magic Explosion!");
        }
        
        // 3. عصا الشفاء والارتفاع: إذا كانت Dmg/Data = 2
        else if (Player.getCarriedItemData() == 2) {
            Player.setHealth(20);
            Entity.addEffect(Player.getEntity(), MobEffect.jump, 200, 2, false, true);
            Level.addParticle(ParticleType.heart, Player.getX(), Player.getY() + 1, Player.getZ(), 0, 0, 0, 10);
            clientMessage(ChatColor.GREEN + "[Magic] Healed & Jump Boosted!");
        }
        
        // 4. عصا النار: إذا كانت Dmg/Data = 3
        else if (Player.getCarriedItemData() == 3) {
            Level.setTile(x, y + 1, z, 51, 0); // 51 هو ID النار
            Level.addParticle(ParticleType.lava, x, y + 1, z, 0, 0, 0, 10);
            clientMessage(ChatColor.GOLD + "[Magic] Fire Spun!");
        }
    }
}

// أمر للتبديل بين أنواع السحر للعصا
function procCmd(cmd) {
    if (cmd == "wand 0") {
        Player.addItemInventory(280, 1, 0);
        clientMessage(ChatColor.AQUA + "Gave Lightning Wand (Data 0)");
    }
    if (cmd == "wand 1") {
        Player.addItemInventory(280, 1, 1);
        clientMessage(ChatColor.AQUA + "Gave Explosion Wand (Data 1)");
    }
    if (cmd == "wand 2") {
        Player.addItemInventory(280, 1, 2);
        clientMessage(ChatColor.AQUA + "Gave Heal Wand (Data 2)");
    }
    if (cmd == "wand 3") {
        Player.addItemInventory(280, 1, 3);
        clientMessage(ChatColor.AQUA + "Gave Fire Wand (Data 3)");
    }
    
    
    if (cmd == "wand help") {
        clientMessage("All Commands/Sum Of Commands (5) = wand 0, wand 1, wand 2, wand 3, wand help");
    }
}

// نهاية كود المود