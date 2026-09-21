package com.brcraft131313.cmdmakerformcpe0143;

public class ModFunctionsData {

    // الأقسام الرئيسية بالعربية
    public static final String[] CATEGORIES_AR = {
        "1. الدوال العامة (Global Functions)",
        "2. واجهة ModPE (وظائف المحرك والتعديلات)",
        "3. فئة العالم (Level Class)",
        "4. فئة اللاعب (Player Class)",
        "5. فئة الكائنات/الكيانات (Entity Class)",
        "6. فئة العناصر (Item Class)",
        "7. فئة البلوكات (Block Class)",
        "8. فئة السيرفر (Server Class)"
    };

    // الأقسام الرئيسية بالإنجليزية
    public static final String[] CATEGORIES_EN = {
        "1. Global Functions",
        "2. ModPE Interface & Engine",
        "3. Level Class",
        "4. Player Class",
        "5. Entity Class",
        "6. Item Class",
        "7. Block Class",
        "8. Server Class"
    };

    public static String[] getCategories(boolean isArabic) {
        return isArabic ? CATEGORIES_AR : CATEGORIES_EN;
    }

    public static String[] getFunctionsByCategory(int categoryIndex) {
        switch (categoryIndex) {
            case 0: // Global
                return new String[]{
                    "addItemInventory(id, quantity, data)",
                    "bl_setMobSkin(entity, skinPath)",
                    "bl_spawnMob(x, y, z, entityType, skinPath)",
                    "clientMessage(message)",
                    "explode(x, y, z, power, causesFire)",
                    "getCarriedItem()",
                    "getLevel()",
                    "getPitch(entity)",
                    "getPlayerEnt()",
                    "getPlayerX()", "getPlayerY()", "getPlayerZ()",
                    "getTile(x, y, z)",
                    "getYaw(entity)",
                    "preventDefault()",
                    "print(text)",
                    "rideAnimal(rider, mount)",
                    "setNightMode(isNight)",
                    "setPosition(entity, x, y, z)",
                    "setPositionRelative(entity, dx, dy, dz)",
                    "setRot(entity, yaw, pitch)",
                    "setTile(x, y, z, blockId, data)",
                    "setVelX(entity, velocityX)", "setVelY(entity, velocityY)", "setVelZ(entity, velocityZ)",
                    "spawnChicken(x, y, z, skinPath)",
                    "spawnCow(x, y, z, skinPath)",
                    "spawnPigZombie(x, y, z, heldItemId, skinPath)"
                };

            case 1: // ModPE
                return new String[]{
                    "ModPE.dumpVtable(className, address)",
                    "ModPE.getBytesFromTexturePack(filePath)",
                    "ModPE.getI18n(translationKey)",
                    "ModPE.getLanguage()",
                    "ModPE.getMinecraftVersion()",
                    "ModPE.langEdit(key, value)",
                    "ModPE.leaveGame()",
                    "ModPE.log(message)",
                    "ModPE.openInputStreamFromTexturePack(filePath)",
                    "ModPE.overrideTexture(oldPath, newPath)",
                    "ModPE.readData(key)",
                    "ModPE.removeData(key)",
                    "ModPE.resetFov()",
                    "ModPE.resetImages()",
                    "ModPE.saveData(key, value)",
                    "ModPE.selectLevel(worldName)",
                    "ModPE.setCamera(entity)",
                    "ModPE.setFoodItem(id, textureName, nutrition, saturationModifier, name, textureIndex)",
                    "ModPE.setFov(fovAngle)",
                    "ModPE.setGameSpeed(speedRatio)",
                    "ModPE.setGuiBlocks(filePath)",
                    "ModPE.setItem(id, textureName, textureIndex, name, maxStack)",
                    "ModPE.setItems(filePath)",
                    "ModPE.setTerrain(filePath)",
                    "ModPE.setUiRenderDebug(enabled)",
                    "ModPE.showTipMessage(message)",
                    "ModPE.takeScreenshot(fileName)"
                };

            case 2: // Level
                return new String[]{
                    "Level.addParticle(particleType, x, y, z, velocityX, velocityY, velocityZ, scale)",
                    "Level.biomeIdToName(biomeId)",
                    "Level.canSeeSky(x, y, z)",
                    "Level.destroyBlock(x, y, z, dropItems)",
                    "Level.dropItem(x, y, z, force, id, count, data)",
                    "Level.explode(x, y, z, power, causesFire)",
                    "Level.getAddress()",
                    "Level.getBiome(x, z)",
                    "Level.getBiomeName(x, z)",
                    "Level.getBrightness(x, y, z)",
                    "Level.getChestSlot(x, y, z, slotIndex)",
                    "Level.getChestSlotCount(x, y, z, slotIndex)",
                    "Level.getChestSlotCustomName(x, y, z, slotIndex)",
                    "Level.getChestSlotData(x, y, z, slotIndex)",
                    "Level.getData(x, y, z)",
                    "Level.getDifficulty()",
                    "Level.getFurnaceSlot(x, y, z, slotIndex)",
                    "Level.getFurnaceSlotCount(x, y, z, slotIndex)",
                    "Level.getFurnaceSlotData(x, y, z, slotIndex)",
                    "Level.getGameMode()",
                    "Level.getGrassColor(x, z)",
                    "Level.getLightningLevel()",
                    "Level.getRainLevel()",
                    "Level.getSignText(x, y, z, lineIndex)",
                    "Level.getSpawnerEntityType(x, y, z)",
                    "Level.getTile(x, y, z)",
                    "Level.getTime()",
                    "Level.getWorldDir()",
                    "Level.getWorldName()",
                    "Level.playSound(x, y, z, soundName, volume, pitch)",
                    "Level.playSoundEnt(entity, soundName, volume, pitch)",
                    "Level.setChestSlot(x, y, z, slotIndex, id, data, count)",
                    "Level.setChestSlotCustomName(x, y, z, slotIndex, name)",
                    "Level.setDifficulty(difficulty)",
                    "Level.setFurnaceSlot(x, y, z, slotIndex, id, data, count)",
                    "Level.setGameMode(gameMode)",
                    "Level.setGrassColor(x, z, color)",
                    "Level.setLightningLevel(lightningLevel)",
                    "Level.setNightMode(isNight)",
                    "Level.setRainLevel(rainLevel)",
                    "Level.setSignText(x, y, z, lineIndex, text)",
                    "Level.setSpawn(x, y, z)",
                    "Level.setSpawnerEntityType(x, y, z, entityType)",
                    "Level.setTile(x, y, z, blockId, data)",
                    "Level.setTime(time)",
                    "Level.spawnChicken(x, y, z, skinPath)",
                    "Level.spawnCow(x, y, z, skinPath)",
                    "Level.spawnMob(x, y, z, entityType, skinPath)"
                };

            case 3: // Player
                return new String[]{
                    "Player.addExp(amount)",
                    "Player.addItemCreativeInv(id, count, data)",
                    "Player.addItemInventory(id, count, data)",
                    "Player.canFly()",
                    "Player.clearInventorySlot(slotIndex)",
                    "Player.enchant(slotIndex, enchantmentId, level)",
                    "Player.getArmorSlot(slotIndex)",
                    "Player.getArmorSlotDamage(slotIndex)",
                    "Player.getCarriedItem()",
                    "Player.getCarriedItemCount()",
                    "Player.getCarriedItemData()",
                    "Player.getDimension()",
                    "Player.getEnchantments(slotIndex)",
                    "Player.getEntity()",
                    "Player.getExhaustion()",
                    "Player.getExp()",
                    "Player.getHunger()",
                    "Player.getInventorySlot(slotIndex)",
                    "Player.getInventorySlotCount(slotIndex)",
                    "Player.getInventorySlotData(slotIndex)",
                    "Player.getItemCustomName(slotIndex)",
                    "Player.getLevel()",
                    "Player.getName(playerEntity)",
                    "Player.getPointedBlockData()",
                    "Player.getPointedBlockId()",
                    "Player.getPointedBlockSide()",
                    "Player.getPointedBlockX()", "Player.getPointedBlockY()", "Player.getPointedBlockZ()",
                    "Player.getPointedEntity()",
                    "Player.getPointedVecX()", "Player.getPointedVecY()", "Player.getPointedVecZ()",
                    "Player.getSaturation()",
                    "Player.getSelectedSlotId()",
                    "Player.getX()", "Player.getY()", "Player.getZ()",
                    "Player.isFlying()",
                    "Player.isPlayer(entity)",
                    "Player.setArmorSlot(slotIndex, id, data)",
                    "Player.setCanFly(canFly)",
                    "Player.setExhaustion(exhaustion)",
                    "Player.setExp(expProgress)",
                    "Player.setFlying(isFlying)",
                    "Player.setHealth(health)",
                    "Player.setHunger(hunger)",
                    "Player.setInventorySlot(slotIndex, id, count, data)",
                    "Player.setItemCustomName(slotIndex, customName)",
                    "Player.setLevel(level)",
                    "Player.setSaturation(saturation)",
                    "Player.setSelectedSlotId(slotIndex)"
                };

            case 4: // Entity
                return new String[]{
                    "Entity.addEffect(entity, effectId, duration, amplifier, showParticles, showIcon)",
                    "Entity.getAll()",
                    "Entity.getAnimalAge(entity)",
                    "Entity.getArmor(entity, slotIndex)",
                    "Entity.getArmorCustomName(entity, slotIndex)",
                    "Entity.getArmorDamage(entity, slotIndex)",
                    "Entity.getEntityTypeId(entity)",
                    "Entity.getExtraData(entity, key)",
                    "Entity.getHealth(entity)",
                    "Entity.getItemEntityCount(entity)",
                    "Entity.getItemEntityData(entity)",
                    "Entity.getItemEntityId(entity)",
                    "Entity.getMaxHealth(entity)",
                    "Entity.getMobSkin(entity)",
                    "Entity.getNameTag(entity)",
                    "Entity.getPitch(entity)",
                    "Entity.getRenderType(entity)",
                    "Entity.getRider(entity)",
                    "Entity.getRiding(entity)",
                    "Entity.getTarget(entity)",
                    "Entity.getUniqueId(entity)",
                    "Entity.getVelX(entity)", "Entity.getVelY(entity)", "Entity.getVelZ(entity)",
                    "Entity.getX(entity)", "Entity.getY(entity)", "Entity.getYaw(entity)", "Entity.getZ(entity)",
                    "Entity.isSneaking(entity)",
                    "Entity.remove(entity)",
                    "Entity.removeAllEffects(entity)",
                    "Entity.removeEffect(entity, effectId)",
                    "Entity.rideAnimal(rider, mount)",
                    "Entity.setAnimalAge(entity, age)",
                    "Entity.setArmor(entity, slotIndex, id, data)",
                    "Entity.setArmorCustomName(entity, slotIndex, customName)",
                    "Entity.setCape(entity, capePath)",
                    "Entity.setCarriedItem(entity, id, count, data)",
                    "Entity.setCollisionSize(entity, width, height)",
                    "Entity.setExtraData(entity, key, value)",
                    "Entity.setFireTicks(entity, ticks)",
                    "Entity.setHealth(entity, health)",
                    "Entity.setImmobile(entity, isImmobile)",
                    "Entity.setMaxHealth(entity, maxHealth)",
                    "Entity.setMobSkin(entity, skinPath)",
                    "Entity.setNameTag(entity, name)",
                    "Entity.setPosition(entity, x, y, z)",
                    "Entity.setPositionRelative(entity, dx, dy, dz)",
                    "Entity.setRenderType(entity, renderType)",
                    "Entity.setRot(entity, yaw, pitch)",
                    "Entity.setSneaking(entity, isSneaking)",
                    "Entity.setTarget(entity, targetEntity)",
                    "Entity.setVelX(entity, velocityX)", "Entity.setVelY(entity, velocityY)", "Entity.setVelZ(entity, velocityZ)",
                    "Entity.spawnMob(x, y, z, entityType, skinPath)"
                };

            case 5: // Item
                return new String[]{
                    "Item.addCraftRecipe(id, count, data, ingredientsArray)",
                    "Item.addFurnaceRecipe(outputId, inputId, inputData)",
                    "Item.addShapedRecipe(id, count, data, shapeArray, ingredientsArray)",
                    "Item.defineArmor(id, iconName, iconIndex, name, texturePath, defensePoints, maxDamage, armorType)",
                    "Item.defineThrowable(id, iconName, iconIndex, name, maxStack)",
                    "Item.getCustomThrowableRenderType(id)",
                    "Item.getMaxDamage(id)",
                    "Item.getMaxStackSize(id)",
                    "Item.getName(id, data, rawName)",
                    "Item.getTextureCoords(id, data)",
                    "Item.getUseAnimation(id)",
                    "Item.internalNameToId(internalName)",
                    "Item.isValidItem(id)",
                    "Item.setCategory(id, category)",
                    "Item.setEnchantType(id, enchantType, enchantability)",
                    "Item.setHandEquipped(id, isHandEquipped)",
                    "Item.setMaxDamage(id, maxDamage)",
                    "Item.setProperties(id, propertiesObject)",
                    "Item.setStackedByData(id, stackedByData)",
                    "Item.setUseAnimation(id, useAnimation)",
                    "Item.translatedNameToId(translatedName)"
                };

            case 6: // Block
                return new String[]{
                    "Block.defineBlock(id, name, texturesArray, materialSource, isOpaque, renderType)",
                    "Block.defineLiquidBlock(id, name, texturesArray, materialSource)",
                    "Block.getAllBlockIds()",
                    "Block.getDestroyTime(id, data)",
                    "Block.getFriction(id, data)",
                    "Block.getRenderType(id)",
                    "Block.getTextureCoords(id, side, data)",
                    "Block.setColor(id, colorsArray)",
                    "Block.setDestroyTime(id, destroyTime)",
                    "Block.setExplosionResistance(id, resistance)",
                    "Block.setFriction(id, friction)",
                    "Block.setLightLevel(id, lightLevel)",
                    "Block.setLightOpacity(id, opacity)",
                    "Block.setRedstoneConsumer(id, isConsumer)",
                    "Block.setRenderLayer(id, renderLayer)",
                    "Block.setRenderType(id, renderType)",
                    "Block.setShape(id, minX, minY, minZ, maxX, maxY, maxZ, data)"
                };

            case 7: // Server
                return new String[]{
                    "Server.getAddress()",
                    "Server.getAllPlayerNames()",
                    "Server.getAllPlayers()",
                    "Server.getPort()",
                    "Server.joinServer(address, port)",
                    "Server.sendChat(message)"
                };

            default:
                return new String[]{};
        }
    }
}
