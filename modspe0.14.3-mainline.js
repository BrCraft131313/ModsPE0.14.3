// ==========================================
// مود SkyBox الشامل - جميع أيتمات وبلوكات 0.14.3
// ==========================================

var skyboxItems = [
    // --- البلوكات الأساسية ومواد البناء ---
    {id: 1, count: 16, damage: 0},   // Stone
    {id: 1, count: 16, damage: 1},   // Granite
    {id: 1, count: 16, damage: 2},   // Polished Granite
    {id: 1, count: 16, damage: 3},   // Diorite
    {id: 1, count: 16, damage: 4},   // Polished Diorite
    {id: 1, count: 16, damage: 5},   // Andesite
    {id: 1, count: 16, damage: 6},   // Polished Andesite
    {id: 2, count: 16, damage: 0},   // Grass Block
    {id: 3, count: 16, damage: 0},   // Dirt
    {id: 3, count: 16, damage: 2},   // Podzol
    {id: 4, count: 16, damage: 0},   // Cobblestone
    {id: 5, count: 16, damage: 0},   // Oak Wood Planks
    {id: 5, count: 16, damage: 1},   // Spruce Wood Planks
    {id: 5, count: 16, damage: 2},   // Birch Wood Planks
    {id: 5, count: 16, damage: 3},   // Jungle Wood Planks
    {id: 5, count: 16, damage: 4},   // Acacia Wood Planks
    {id: 5, count: 16, damage: 5},   // Dark Oak Wood Planks
    {id: 12, count: 16, damage: 0},  // Sand
    {id: 12, count: 16, damage: 1},  // Red Sand
    {id: 13, count: 16, damage: 0},  // Gravel
    {id: 17, count: 8, damage: 0},   // Oak Log
    {id: 17, count: 8, damage: 1},   // Spruce Log
    {id: 17, count: 8, damage: 2},   // Birch Log
    {id: 17, count: 8, damage: 3},   // Jungle Log
    {id: 162, count: 8, damage: 0},  // Acacia Log
    {id: 162, count: 8, damage: 1},  // Dark Oak Log
    {id: 20, count: 8, damage: 0},   // Glass
    {id: 24, count: 16, damage: 0},  // Sandstone
    {id: 24, count: 16, damage: 1},  // Chiseled Sandstone
    {id: 24, count: 16, damage: 2},  // Smooth Sandstone
    {id: 45, count: 16, damage: 0},  // Bricks
    {id: 48, count: 16, damage: 0},  // Mossy Cobblestone
    {id: 49, count: 8, damage: 0},   // Obsidian
    {id: 87, count: 16, damage: 0},  // Netherrack
    {id: 88, count: 16, damage: 0},  // Soul Sand
    {id: 89, count: 8, damage: 0},   // Glowstone
    {id: 98, count: 16, damage: 0},  // Stone Bricks
    {id: 98, count: 16, damage: 1},  // Mossy Stone Bricks
    {id: 98, count: 16, damage: 2},  // Cracked Stone Bricks
    {id: 98, count: 16, damage: 3},  // Chiseled Stone Bricks
    {id: 112, count: 16, damage: 0}, // Nether Brick Block
    {id: 121, count: 16, damage: 0}, // End Stone
    {id: 155, count: 16, damage: 0}, // Quartz Block
    {id: 155, count: 16, damage: 1}, // Chiseled Quartz Block
    {id: 155, count: 16, damage: 2}, // Pillar Quartz Block
    {id: 168, count: 16, damage: 0}, // Prismarine
    {id: 168, count: 16, damage: 1}, // Prismarine Bricks
    {id: 168, count: 16, damage: 2}, // Dark Prismarine
    {id: 169, count: 8, damage: 0},  // Sea Lantern
    {id: 172, count: 16, damage: 0}, // Hardened Clay
    {id: 159, count: 16, damage: 0}, // White Stained Clay
    {id: 159, count: 16, damage: 14},// Red Stained Clay
    {id: 35, count: 16, damage: 0},  // White Wool
    {id: 35, count: 16, damage: 14}, // Red Wool
    {id: 35, count: 16, damage: 11}, // Blue Wool
    {id: 35, count: 16, damage: 5},  // Lime Wool
    {id: 35, count: 16, damage: 4},  // Yellow Wool

    // --- الريدستون والأجهزة وآلات التفاعل ---
    {id: 50, count: 16, damage: 0},  // Torch
    {id: 54, count: 2, damage: 0},   // Chest
    {id: 61, count: 1, damage: 0},   // Furnace
    {id: 58, count: 1, damage: 0},   // Crafting Table
    {id: 145, count: 1, damage: 0},  // Anvil
    {id: 116, count: 1, damage: 0},  // Enchantment Table
    {id: 84, count: 1, damage: 0},   // Jukebox
    {id: 23, count: 2, damage: 0},   // Dispenser
    {id: 158, count: 2, damage: 0},  // Dropper
    {id: 154, count: 2, damage: 0},  // Hopper
    {id: 331, count: 16, damage: 0}, // Redstone Dust
    {id: 76, count: 8, damage: 0},   // Redstone Torch
    {id: 152, count: 2, damage: 0},  // Redstone Block
    {id: 123, count: 4, damage: 0},  // Redstone Lamp
    {id: 69, count: 4, damage: 0},   // Lever
    {id: 77, count: 4, damage: 0},   // Stone Button
    {id: 143, count: 4, damage: 0},  // Wooden Button
    {id: 70, count: 2, damage: 0},   // Stone Pressure Plate
    {id: 72, count: 2, damage: 0},   // Wooden Pressure Plate
    {id: 147, count: 2, damage: 0},  // Light Weighted Pressure Plate (Gold)
    {id: 148, count: 2, damage: 0},  // Heavy Weighted Pressure Plate (Iron)
    {id: 93, count: 4, damage: 0},   // Redstone Repeater
    {id: 149, count: 4, damage: 0},  // Redstone Comparator
    {id: 29, count: 2, damage: 0},   // Sticky Piston
    {id: 33, count: 2, damage: 0},   // Piston
    {id: 165, count: 4, damage: 0},  // Slime Block
    {id: 175, count: 1, damage: 0},  // Large Fern / Sunflower / Double Plant

    // --- المعادن والخامات والخيور ---
    {id: 263, count: 8, damage: 0},  // Coal
    {id: 263, count: 8, damage: 1},  // Charcoal
    {id: 265, count: 8, damage: 0},  // Iron Ingot
    {id: 266, count: 8, damage: 0},  // Gold Ingot
    {id: 264, count: 4, damage: 0},  // Diamond
    {id: 388, count: 4, damage: 0},  // Emerald
    {id: 351, count: 8, damage: 4},  // Lapis Lazuli
    {id: 406, count: 16, damage: 0}, // Nether Quartz
    {id: 42, count: 2, damage: 0},   // Iron Block
    {id: 41, count: 2, damage: 0},   // Gold Block
    {id: 57, count: 1, damage: 0},   // Diamond Block
    {id: 133, count: 1, damage: 0},  // Emerald Block
    {id: 22, count: 2, damage: 0},   // Lapis Lazuli Block

    // --- الأطعمة والمحاصيل والنباتات ---
    {id: 260, count: 8, damage: 0},  // Apple
    {id: 322, count: 1, damage: 0},  // Golden Apple
    {id: 322, count: 1, damage: 1},  // Enchanted Golden Apple
    {id: 297, count: 8, damage: 0},  // Bread
    {id: 319, count: 8, damage: 0},  // Raw Porkchop
    {id: 320, count: 8, damage: 0},  // Cooked Porkchop
    {id: 363, count: 8, damage: 0},  // Raw Beef
    {id: 364, count: 8, damage: 0},  // Cooked Beef
    {id: 365, count: 8, damage: 0},  // Raw Chicken
    {id: 366, count: 8, damage: 0},  // Cooked Chicken
    {id: 411, count: 8, damage: 0},  // Raw Mutton
    {id: 412, count: 8, damage: 0},  // Cooked Mutton
    {id: 349, count: 8, damage: 0},  // Raw Fish
    {id: 350, count: 8, damage: 0},  // Cooked Fish
    {id: 349, count: 8, damage: 1},  // Raw Salmon
    {id: 350, count: 8, damage: 1},  // Cooked Salmon
    {id: 349, count: 8, damage: 2},  // Clownfish
    {id: 349, count: 8, damage: 3},  // Pufferfish
    {id: 357, count: 12, damage: 0}, // Cookie
    {id: 360, count: 8, damage: 0},  // Melon Slice
    {id: 391, count: 8, damage: 0},  // Carrot
    {id: 392, count: 8, damage: 0},  // Potato
    {id: 393, count: 8, damage: 0},  // Baked Potato
    {id: 396, count: 2, damage: 0},  // Golden Carrot
    {id: 400, count: 4, damage: 0},  // Pumpkin Pie
    {id: 295, count: 8, damage: 0},  // Wheat Seeds
    {id: 362, count: 8, damage: 0},  // Melon Seeds
    {id: 361, count: 8, damage: 0},  // Pumpkin Seeds
    {id: 372, count: 8, damage: 0},  // Nether Wart
    {id: 335, count: 1, damage: 0},  // Milk Bucket
    {id: 354, count: 1, damage: 0},  // Cake
    {id: 39, count: 5, damage: 0},   // Brown Mushroom
    {id: 40, count: 5, damage: 0},   // Red Mushroom
    {id: 81, count: 4, damage: 0},   // Cactus
    {id: 338, count: 8, damage: 0},  // Sugar Cane
    {id: 106, count: 8, damage: 0},  // Vines
    {id: 111, count: 8, damage: 0},  // Lily Pad

    // --- الأدوات، الأسلحة، والدروع ---
    {id: 256, count: 1, damage: 0},  // Iron Shovel
    {id: 257, count: 1, damage: 0},  // Iron Pickaxe
    {id: 258, count: 1, damage: 0},  // Iron Axe
    {id: 267, count: 1, damage: 0},  // Iron Sword
    {id: 292, count: 1, damage: 0},  // Iron Hoe
    {id: 276, count: 1, damage: 0},  // Diamond Sword
    {id: 278, count: 1, damage: 0},  // Diamond Pickaxe
    {id: 261, count: 1, damage: 0},  // Bow
    {id: 262, count: 16, damage: 0}, // Arrow
    {id: 259, count: 1, damage: 0},  // Flint and Steel
    {id: 346, count: 1, damage: 0},  // Fishing Rod
    {id: 359, count: 1, damage: 0},  // Shears
    {id: 325, count: 1, damage: 0},  // Bucket
    {id: 325, count: 1, damage: 8},  // Water Bucket
    {id: 325, count: 1, damage: 10}, // Lava Bucket
    {id: 306, count: 1, damage: 0},  // Iron Helmet
    {id: 307, count: 1, damage: 0},  // Iron Chestplate
    {id: 308, count: 1, damage: 0},  // Iron Leggings
    {id: 309, count: 1, damage: 0},  // Iron Boots
    {id: 310, count: 1, damage: 0},  // Diamond Helmet
    {id: 311, count: 1, damage: 0},  // Diamond Chestplate
    {id: 312, count: 1, damage: 0},  // Diamond Leggings
    {id: 313, count: 1, damage: 0},  // Diamond Boots

    // --- كيمياء وجرعات (Brewing & Potions) ---
    {id: 379, count: 1, damage: 0},  // Brewing Stand
    {id: 380, count: 1, damage: 0},  // Cauldron
    {id: 374, count: 4, damage: 0},  // Glass Bottle
    {id: 377, count: 4, damage: 0},  // Blaze Powder
    {id: 378, count: 4, damage: 0},  // Magma Cream
    {id: 370, count: 2, damage: 0},  // Ghast Tear
    {id: 382, count: 4, damage: 0},  // Glistering Melon
    {id: 375, count: 4, damage: 0},  // Fermented Spider Eye
    {id: 373, count: 1, damage: 14}, // Potion of Healing
    {id: 373, count: 1, damage: 21}, // Potion of Regeneration
    {id: 373, count: 1, damage: 12}, // Potion of Fire Resistance
    {id: 373, count: 1, damage: 8},  // Potion of Swiftness
    {id: 373, count: 1, damage: 9},  // Potion of Slowness
    {id: 373, count: 1, damage: 5},  // Potion of Strength
    {id: 373, count: 1, damage: 31}, // Potion of Night Vision
    {id: 373, count: 1, damage: 16398}, // Splash Potion of Healing
    {id: 373, count: 1, damage: 16389}, // Splash Potion of Harm
    {id: 373, count: 1, damage: 16388}, // Splash Potion of Poison

    // --- المكونات والمواد المتنوعة ---
    {id: 280, count: 16, damage: 0}, // Stick
    {id: 268, count: 1, damage: 0},  // Wooden Sword
    {id: 287, count: 8, damage: 0},  // String
    {id: 288, count: 8, damage: 0},  // Feather
    {id: 289, count: 8, damage: 0},  // Gunpowder
    {id: 296, count: 16, damage: 0}, // Wheat
    {id: 334, count: 8, damage: 0},  // Leather
    {id: 336, count: 8, damage: 0},  // Brick
    {id: 337, count: 16, damage: 0}, // Clay Balls
    {id: 344, count: 4, damage: 0},  // Egg
    {id: 348, count: 8, damage: 0},  // Glowstone Dust
    {id: 352, count: 8, damage: 0},  // Bone
    {id: 353, count: 16, damage: 0}, // Sugar
    {id: 339, count: 16, damage: 0}, // Paper
    {id: 340, count: 4, damage: 0},  // Book
    {id: 403, count: 1, damage: 0},  // Enchanted Book
    {id: 368, count: 4, damage: 0},  // Ender Pearl
    {id: 367, count: 8, damage: 0},  // Rotten Flesh
    {id: 369, count: 2, damage: 0},  // Blaze Rod
    {id: 381, count: 2, damage: 0},  // Eye of Ender
    {id: 405, count: 16, damage: 0}, // Nether Brick Item
    {id: 410, count: 4, damage: 0},  // Rabbit Hide
    {id: 409, count: 2, damage: 0},  // Rabbit's Foot

    // --- الزينة، المواصلات والبناء الدقيق ---
    {id: 321, count: 1, damage: 0},  // Painting
    {id: 389, count: 2, damage: 0},  // Item Frame
    {id: 323, count: 2, damage: 0},  // Sign
    {id: 355, count: 1, damage: 0},  // Bed
    {id: 328, count: 1, damage: 0},  // Minecart
    {id: 342, count: 1, damage: 0},  // Chest Minecart
    {id: 408, count: 1, damage: 0},  // Hopper Minecart
    {id: 333, count: 1, damage: 0},  // Boat
    {id: 329, count: 1, damage: 0},  // Saddle
    {id: 417, count: 1, damage: 0},  // Iron Horse Armor
    {id: 418, count: 1, damage: 0},  // Gold Horse Armor
    {id: 419, count: 1, damage: 0},  // Diamond Horse Armor
    {id: 65, count: 8, damage: 0},   // Ladder
    {id: 85, count: 8, damage: 0},   // Fence
    {id: 107, count: 2, damage: 0},  // Fence Gate
    {id: 101, count: 8, damage: 0},  // Iron Bars
    {id: 102, count: 8, damage: 0},  // Glass Pane
    {id: 53, count: 8, damage: 0},   // Oak Stairs
    {id: 67, count: 8, damage: 0},   // Cobblestone Stairs
    {id: 108, count: 8, damage: 0},  // Brick Stairs
    {id: 109, count: 8, damage: 0},  // Stone Brick Stairs
    {id: 114, count: 8, damage: 0},  // Nether Brick Stairs
    {id: 128, count: 8, damage: 0},  // Sandstone Stairs
    {id: 156, count: 8, damage: 0},  // Quartz Stairs
    {id: 126, count: 8, damage: 0},  // Oak Wood Slab
    {id: 44, count: 8, damage: 0},   // Stone Slab
    {id: 44, count: 8, damage: 1},   // Sandstone Slab
    {id: 44, count: 8, damage: 3},   // Cobblestone Slab
    {id: 44, count: 8, damage: 4},   // Brick Slab
    {id: 44, count: 8, damage: 5},   // Stone Brick Slab
    {id: 44, count: 8, damage: 6},   // Quartz Slab
    {id: 44, count: 8, damage: 7}    // Nether Brick Slab
];

function newLevel() {
    addItemInventory(54, 1, 0);
    clientMessage("Use /skybox For Random Items(But use it a lot so you can benefit from it)");
}

function procCmd(cmd) {
    var args = cmd.split(" ");
    
    if (args[0] === "skybox") {
        var px = Math.floor(Player.getX());
        var py = Math.floor(Player.getY());
        var pz = Math.floor(Player.getZ());
        
        var chestFound = false;
        
        for (var x = px - 5; x <= px + 5; x++) {
            for (var y = py - 3; y <= py + 3; y++) {
                for (var z = pz - 5; z <= pz + 5; z++) {
                    if (Level.getTile(x, y, z) === 54) {
                        
                        var randomIndex = Math.floor(Math.random() * skyboxItems.length);
                        var selectedItem = skyboxItems[randomIndex];
                        var randomSlot = Math.floor(Math.random() * 27);
                        
                        // الترتيب الصحيح: id, damage, count
                        Level.setChestSlot(x, y, z, randomSlot, selectedItem.id, selectedItem.damage, selectedItem.count);
                        
                        clientMessage(ChatColor.GOLD + "[SkyBox] Item added to slot " + (randomSlot + 1) + "!");
                        chestFound = true;
                        break;
                    }
                }
                if (chestFound) break;
            }
            if (chestFound) break;
        }
        
        if (!chestFound) {
            clientMessage(ChatColor.RED + "[SkyBox] No chest found nearby!");
        }
    }
    }
     
