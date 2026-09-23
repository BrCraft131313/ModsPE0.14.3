/*
 * Library Name : modspe0.14.3-@minecraft/serversyntax.js
 * Description  : Polyfill Wrapper translating full MCPE 0.14.3 ModPE functions into @minecraft/server API syntax.
 * Standard     : MECANE (Messages in English, Comments in Arabic, No Emojis)
 */

// ==========================================
// 1. الثوابت والقوائم المحددة (Enums Mapping)
// ==========================================

var ChatColor = {
    AQUA: "§b", BEGIN: "§", BLACK: "§0", BLUE: "§9", BOLD: "§l",
    DARK_AQUA: "§3", DARK_BLUE: "§1", DARK_GRAY: "§8", DARK_GREEN: "§2",
    DARK_PURPLE: "§5", DARK_RED: "§4", GOLD: "§6", GRAY: "§7",
    GREEN: "§a", LIGHT_PURPLE: "§d", RED: "§c", RESET: "§r",
    WHITE: "§f", YELLOW: "§e"
};

var BlockFace = {
    DOWN: 0, UP: 1, NORTH: 2, SOUTH: 3, WEST: 4, EAST: 5
};

var DimensionId = {
    NORMAL: 0, NETHER: 1, OVERWORLD: 0
};

// ==========================================
// 2. مصفوفات إدارة الأحداث والمؤقتات الداخلية
// ==========================================

var _mc_events = {
    playerInteractWithBlock: [],
    entityHit: [],
    entityHurt: [],
    entityDie: [],
    entitySpawn: [],
    entityRemove: [],
    playerSpawn: [],
    chatSend: [],
    playerBreakBlock: [],
    explosion: [],
    redstoneUpdate: []
};

var _mc_intervals = [];
var _mc_timeouts = [];
var _mc_nextTickQueue = [];
var _mc_interval_id_counter = 1;
var _mc_current_tick = 0;

// ==========================================
// 3. كائن البلوكة (Block Wrapper)
// ==========================================

function MinecraftBlock(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.location = { x: x, y: y, z: z };
}

Object.defineProperty(MinecraftBlock.prototype, "typeId", {
    get: function() { return Level.getTile(this.x, this.y, this.z); }
});

Object.defineProperty(MinecraftBlock.prototype, "permutation", {
    get: function() { return { data: Level.getData(this.x, this.y, this.z) }; }
});

MinecraftBlock.prototype.setType = function(blockId, data) {
    Level.setTile(this.x, this.y, this.z, blockId, data || 0);
};

MinecraftBlock.prototype.canSeeSky = function() {
    return Level.canSeeSky(this.x, this.y, this.z);
};

MinecraftBlock.prototype.getLightLevel = function() {
    return Level.getBrightness(this.x, this.y, this.z);
};

MinecraftBlock.prototype.getSignText = function(line) {
    return Level.getSignText(this.x, this.y, this.z, line || 0);
};

MinecraftBlock.prototype.setSignText = function(line, text) {
    Level.setSignText(this.x, this.y, this.z, line || 0, text);
};

// ==========================================
// 4. كائنات الكيانات واللاعبين (Entity & Player Wrappers)
// ==========================================

function MinecraftEntity(entityId) {
    this.id = entityId;
}

Object.defineProperty(MinecraftEntity.prototype, "typeId", {
    get: function() { return Entity.getEntityTypeId(this.id); }
});

Object.defineProperty(MinecraftEntity.prototype, "location", {
    get: function() {
        return {
            x: Entity.getX(this.id),
            y: Entity.getY(this.id),
            z: Entity.getZ(this.id)
        };
    }
});

Object.defineProperty(MinecraftEntity.prototype, "velocity", {
    get: function() {
        return {
            x: Entity.getVelX(this.id),
            y: Entity.getVelY(this.id),
            z: Entity.getVelZ(this.id)
        };
    }
});

Object.defineProperty(MinecraftEntity.prototype, "nameTag", {
    get: function() { return Entity.getNameTag(this.id); },
    set: function(name) { Entity.setNameTag(this.id, name); }
});

Object.defineProperty(MinecraftEntity.prototype, "isSneaking", {
    get: function() { return Entity.isSneaking(this.id); },
    set: function(value) { Entity.setSneaking(this.id, value); }
});

Object.defineProperty(MinecraftEntity.prototype, "target", {
    get: function() { return new MinecraftEntity(Entity.getTarget(this.id)); },
    set: function(targetEntity) { Entity.setTarget(this.id, targetEntity.id || targetEntity); }
});

MinecraftEntity.prototype.teleport = function(x, y, z) {
    if (typeof x === "object") {
        Entity.setPosition(this.id, x.x, x.y, x.z);
    } else {
        Entity.setPosition(this.id, x, y, z);
    }
};

MinecraftEntity.prototype.applyImpulse = function(vector) {
    if (vector.x !== undefined) Entity.setVelX(this.id, vector.x);
    if (vector.y !== undefined) Entity.setVelY(this.id, vector.y);
    if (vector.z !== undefined) Entity.setVelZ(this.id, vector.z);
};

MinecraftEntity.prototype.setRotation = function(pitch, yaw) {
    Entity.setRot(this.id, pitch, yaw);
};

MinecraftEntity.prototype.getRotation = function() {
    return { pitch: Entity.getPitch(this.id), yaw: Entity.getYaw(this.id) };
};

MinecraftEntity.prototype.addEffect = function(effectId, durationTicks, options) {
    var amp = (options && options.amplifier) ? options.amplifier : 0;
    Entity.addEffect(this.id, effectId, durationTicks, amp, false, true);
};

MinecraftEntity.prototype.removeEffect = function(effectId) {
    Entity.removeEffect(this.id, effectId);
};

MinecraftEntity.prototype.clearEffects = function() {
    Entity.removeAllEffects(this.id);
};

MinecraftEntity.prototype.setOnFire = function(seconds) {
    Entity.setFireTicks(this.id, Math.floor(seconds * 20));
};

MinecraftEntity.prototype.setImmobile = function(value) {
    Entity.setImmobile(this.id, value);
};

MinecraftEntity.prototype.remove = function() {
    Entity.remove(this.id);
};

MinecraftEntity.prototype.ride = function(targetEntity) {
    Entity.rideAnimal(this.id, targetEntity.id || targetEntity);
};

// محاكاة المكونات الداخلية للكيان (Health, Hunger, Inventory)
MinecraftEntity.prototype.getComponent = function(componentId) {
    var self = this;
    if (componentId === "minecraft:health") {
        return {
            get currentValue() { return Entity.getHealth(self.id); },
            get effectiveMax() { return Entity.getMaxHealth(self.id); },
            setCurrentValue: function(val) { Entity.setHealth(self.id, val); },
            setMaxValue: function(val) { Entity.setMaxHealth(self.id, val); }
        };
    }
    return null;
};

// محاكاة كائن اللاعب (Player Wrapper)
function MinecraftPlayer(entityId) {
    MinecraftEntity.call(this, entityId);
}
MinecraftPlayer.prototype = Object.create(MinecraftEntity.prototype);

Object.defineProperty(MinecraftPlayer.prototype, "name", {
    get: function() { return Player.getName(this.id); }
});

Object.defineProperty(MinecraftPlayer.prototype, "level", {
    get: function() { return Player.getLevel(); },
    set: function(lvl) { Player.setLevel(lvl); }
});

Object.defineProperty(MinecraftPlayer.prototype, "xpEarnedAtCurrentLevel", {
    get: function() { return Player.getExp(); },
    set: function(exp) { Player.setExp(exp); }
});

Object.defineProperty(MinecraftPlayer.prototype, "isFlying", {
    get: function() { return Player.isFlying(); },
    set: function(value) { Player.setFlying(value); }
});

Object.defineProperty(MinecraftPlayer.prototype, "canFly", {
    get: function() { return Player.canFly(); },
    set: function(value) { Player.setCanFly(value); }
});

Object.defineProperty(MinecraftPlayer.prototype, "selectedSlotIndex", {
    get: function() { return Player.getSelectedSlotId(); },
    set: function(slot) { Player.setSelectedSlotId(slot); }
});

Object.defineProperty(MinecraftPlayer.prototype, "score", {
    get: function() { return Player.getScore(); }
});

MinecraftPlayer.prototype.sendMessage = function(message) {
    clientMessage(message);
};

MinecraftPlayer.prototype.addExperience = function(amount) {
    Player.addExp(amount);
};

MinecraftPlayer.prototype.getCarriedItem = function() {
    return {
        typeId: Player.getCarriedItem(),
        amount: Player.getCarriedItemCount(),
        data: Player.getCarriedItemData()
    };
};

MinecraftPlayer.prototype.getPointedBlock = function() {
    var x = Player.getPointedBlockX();
    var y = Player.getPointedBlockY();
    var z = Player.getPointedBlockZ();
    return new MinecraftBlock(x, y, z);
};

MinecraftPlayer.prototype.getPointedEntity = function() {
    var ent = Player.getPointedEntity();
    return ent !== -1 ? new MinecraftEntity(ent) : null;
};

MinecraftPlayer.prototype.onScreenDisplay = {
    setActionBar: function(text) {
        ModPE.showTipMessage(text);
    }
};

MinecraftPlayer.prototype.getComponent = function(componentId) {
    var self = this;
    if (componentId === "minecraft:hunger") {
        return {
            get currentValue() { return Player.getHunger(); },
            set currentValue(val) { Player.setHunger(val); },
            get saturation() { return Player.getSaturation(); },
            set saturation(val) { Player.setSaturation(val); },
            get exhaustion() { return Player.getExhaustion(); },
            set exhaustion(val) { Player.setExhaustion(val); }
        };
    }
    if (componentId === "minecraft:inventory") {
        return {
            container: {
                addItem: function(itemStack) {
                    Player.addItemInventory(itemStack.typeId, itemStack.amount || 1, itemStack.data || 0);
                },
                getItem: function(slot) {
                    return {
                        typeId: Player.getInventorySlot(slot),
                        amount: Player.getInventorySlotCount(slot),
                        data: Player.getInventorySlotData(slot)
                    };
                },
                setItem: function(slot, itemStack) {
                    Player.setInventorySlot(slot, itemStack.typeId, itemStack.amount || 1, itemStack.data || 0);
                },
                clearSlot: function(slot) {
                    Player.clearInventorySlot(slot);
                }
            }
        };
    }
    return MinecraftEntity.prototype.getComponent.call(this, componentId);
};

// ==========================================
// 5. كائن البعد (Dimension Wrapper)
// ==========================================

function MinecraftDimension(id) {
    this.id = id || "overworld";
}

MinecraftDimension.prototype.getBlock = function(location) {
    return new MinecraftBlock(location.x, location.y, location.z);
};

MinecraftDimension.prototype.setBlockType = function(location, blockId, data) {
    Level.setTile(location.x, location.y, location.z, blockId, data || 0);
};

MinecraftDimension.prototype.spawnEntity = function(typeId, location) {
    var ent = Level.spawnMob(location.x, location.y, location.z, typeId, "");
    return new MinecraftEntity(ent);
};

MinecraftDimension.prototype.spawnItem = function(itemStack, location) {
    Level.dropItem(location.x, location.y, location.z, 0, itemStack.typeId, itemStack.amount || 1, itemStack.data || 0);
};

MinecraftDimension.prototype.spawnParticle = function(particleType, location, velocity) {
    var vx = (velocity && velocity.x) ? velocity.x : 0;
    var vy = (velocity && velocity.y) ? velocity.y : 0;
    var vz = (velocity && velocity.z) ? velocity.z : 0;
    Level.addParticle(particleType, location.x, location.y, location.z, vx, vy, vz, 1);
};

MinecraftDimension.prototype.createExplosion = function(location, radius, options) {
    var causesFire = (options && options.causesFire) ? options.causesFire : false;
    Level.explode(location.x, location.y, location.z, radius, causesFire);
};

MinecraftDimension.prototype.playSound = function(soundId, location, options) {
    var volume = (options && options.volume) ? options.volume : 1.0;
    var pitch = (options && options.pitch) ? options.pitch : 1.0;
    Level.playSound(location.x, location.y, location.z, soundId, volume, pitch);
};

MinecraftDimension.prototype.destroyBlock = function(location, dropItems) {
    Level.destroyBlock(location.x, location.y, location.z, dropItems !== false);
};

MinecraftDimension.prototype.getEntities = function() {
    var all = Entity.getAll();
    var result = [];
    for (var i = 0; i < all.length; i++) {
        result.push(new MinecraftEntity(all[i]));
    }
    return result;
};

// ==========================================
// 6. تعريف كائن world
// ==========================================

var world = {
    name: Level.getWorldName(),
    getDimension: function(dimensionId) {
        return new MinecraftDimension(dimensionId);
    },
    sendMessage: function(message) {
        clientMessage(message);
    },
    getAllPlayers: function() {
        return [new MinecraftPlayer(Player.getEntity())];
    },
    getTimeOfDay: function() {
        return Level.getTime();
    },
    setTimeOfDay: function(time) {
        Level.setTime(time);
    },
    getDifficulty: function() {
        return Level.getDifficulty();
    },
    setDifficulty: function(difficulty) {
        Level.setDifficulty(difficulty);
    },
    getGameMode: function() {
        return Level.getGameMode();
    },
    setGameMode: function(gameMode) {
        Level.setGameMode(gameMode);
    },
    setNightMode: function(value) {
        Level.setNightMode(value);
    },
    setWeather: function(rainLevel, lightningLevel) {
        Level.setRainLevel(rainLevel || 0);
        Level.setLightningLevel(lightningLevel || 0);
    },
    setDefaultSpawnLocation: function(x, y, z) {
        Level.setSpawn(x, y, z);
    },
    setDynamicProperty: function(key, value) {
        ModPE.saveData(key, String(value));
    },
    getDynamicProperty: function(key) {
        return ModPE.readData(key);
    },
    removeDynamicProperty: function(key) {
        ModPE.removeData(key);
    },
    afterEvents: {
        playerInteractWithBlock: {
            subscribe: function(callback) { _mc_events.playerInteractWithBlock.push(callback); }
        },
        entityHit: {
            subscribe: function(callback) { _mc_events.entityHit.push(callback); }
        },
        entityHurt: {
            subscribe: function(callback) { _mc_events.entityHurt.push(callback); }
        },
        entityDie: {
            subscribe: function(callback) { _mc_events.entityDie.push(callback); }
        },
        entitySpawn: {
            subscribe: function(callback) { _mc_events.entitySpawn.push(callback); }
        },
        entityRemove: {
            subscribe: function(callback) { _mc_events.entityRemove.push(callback); }
        },
        playerSpawn: {
            subscribe: function(callback) { _mc_events.playerSpawn.push(callback); }
        },
        chatSend: {
            subscribe: function(callback) { _mc_events.chatSend.push(callback); }
        },
        playerBreakBlock: {
            subscribe: function(callback) { _mc_events.playerBreakBlock.push(callback); }
        },
        explosion: {
            subscribe: function(callback) { _mc_events.explosion.push(callback); }
        },
        redstoneUpdate: {
            subscribe: function(callback) { _mc_events.redstoneUpdate.push(callback); }
        }
    }
};

// ==========================================
// 7. تعريف كائن system
// ==========================================

var system = {
    get currentTick() { return _mc_current_tick; },
    get minecraftVersion() { return ModPE.getMinecraftVersion(); },
    
    run: function(callback) {
        _mc_nextTickQueue.push(callback);
    },
    runInterval: function(callback, intervalTicks) {
        var id = _mc_interval_id_counter++;
        _mc_intervals.push({
            id: id,
            callback: callback,
            interval: intervalTicks || 1,
            current: 0
        });
        return id;
    },
    runTimeout: function(callback, delayTicks) {
        var id = _mc_interval_id_counter++;
        _mc_timeouts.push({
            id: id,
            callback: callback,
            delay: delayTicks || 1,
            current: 0
        });
        return id;
    },
    clearRun: function(runId) {
        for (var i = 0; i < _mc_intervals.length; i++) {
            if (_mc_intervals[i].id === runId) {
                _mc_intervals.splice(i, 1);
                return;
            }
        }
        for (var j = 0; j < _mc_timeouts.length; j++) {
            if (_mc_timeouts[j].id === runId) {
                _mc_timeouts.splice(j, 1);
                return;
            }
        }
    },
    setGameSpeed: function(speed) {
        ModPE.setGameSpeed(speed);
    },
    takeScreenshot: function(fileName) {
        ModPE.takeScreenshot(fileName || "screenshot");
    },
    leaveGame: function() {
        ModPE.leaveGame();
    },
    log: function(message) {
        ModPE.log(message);
    }
};

// ==========================================
// 8. ربط أحداث ModPE الأصلية بالـ Wrapper
// ==========================================

function modTick() {
    _mc_current_tick++;

    // 1. معالجة مهام الدورة التكرارية القادمة (system.run)
    while (_mc_nextTickQueue.length > 0) {
        var fn = _mc_nextTickQueue.shift();
        try { fn(); } catch(e) { print("Error in system.run: " + e); }
    }

    // 2. معالجة الفواصل الزمنية (system.runInterval)
    for (var i = 0; i < _mc_intervals.length; i++) {
        var task = _mc_intervals[i];
        task.current++;
        if (task.current >= task.interval) {
            task.current = 0;
            try { task.callback(); } catch(e) { print("Error in runInterval: " + e); }
        }
    }

    // 3. معالجة المؤقتات المحددة بوقت (system.runTimeout)
    for (var j = _mc_timeouts.length - 1; j >= 0; j--) {
        var timer = _mc_timeouts[j];
        timer.current++;
        if (timer.current >= timer.delay) {
            try { timer.callback(); } catch(e) { print("Error in runTimeout: " + e); }
            _mc_timeouts.splice(j, 1);
        }
    }
}

function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
    var playerObj = new MinecraftPlayer(Player.getEntity());
    var eventData = {
        player: playerObj,
        block: new MinecraftBlock(x, y, z),
        face: side,
        itemStack: { typeId: itemId, amount: Player.getCarriedItemCount(), data: itemDamage }
    };

    for (var i = 0; i < _mc_events.playerInteractWithBlock.length; i++) {
        try { _mc_events.playerInteractWithBlock[i](eventData); }
        catch(e) { print("Error in playerInteractWithBlock: " + e); }
    }
}

function attackHook(attacker, victim) {
    var eventData = {
        damageSource: { damagingEntity: new MinecraftEntity(attacker) },
        hitEntity: new MinecraftEntity(victim)
    };

    for (var i = 0; i < _mc_events.entityHit.length; i++) {
        try { _mc_events.entityHit[i](eventData); }
        catch(e) { print("Error in entityHit: " + e); }
    }
}

function entityHurtHook(attacker, victim, halfhearts) {
    var eventData = {
        damage: halfhearts,
        damageSource: { damagingEntity: new MinecraftEntity(attacker) },
        hurtEntity: new MinecraftEntity(victim)
    };

    for (var i = 0; i < _mc_events.entityHurt.length; i++) {
        try { _mc_events.entityHurt[i](eventData); }
        catch(e) { print("Error in entityHurt: " + e); }
    }
}

function deathHook(attacker, victim) {
    var eventData = {
        damageSource: { damagingEntity: new MinecraftEntity(attacker) },
        deadEntity: new MinecraftEntity(victim)
    };

    for (var i = 0; i < _mc_events.entityDie.length; i++) {
        try { _mc_events.entityDie[i](eventData); }
        catch(e) { print("Error in entityDie: " + e); }
    }
}

function entityAddedHook(entity) {
    var eventData = { entity: new MinecraftEntity(entity) };
    for (var i = 0; i < _mc_events.entitySpawn.length; i++) {
        try { _mc_events.entitySpawn[i](eventData); }
        catch(e) { print("Error in entitySpawn: " + e); }
    }
}

function entityRemovedHook(entity) {
    var eventData = { entity: new MinecraftEntity(entity) };
    for (var i = 0; i < _mc_events.entityRemove.length; i++) {
        try { _mc_events.entityRemove[i](eventData); }
        catch(e) { print("Error in entityRemove: " + e); }
    }
}

function chatHook(str) {
    var eventData = {
        message: str,
        sender: new MinecraftPlayer(Player.getEntity())
    };

    for (var i = 0; i < _mc_events.chatSend.length; i++) {
        try { _mc_events.chatSend[i](eventData); }
        catch(e) { print("Error in chatSend: " + e); }
    }
}

function destroyBlock(x, y, z, side) {
    var eventData = {
        player: new MinecraftPlayer(Player.getEntity()),
        block: new MinecraftBlock(x, y, z),
        dimension: new MinecraftDimension("overworld")
    };

    for (var i = 0; i < _mc_events.playerBreakBlock.length; i++) {
        try { _mc_events.playerBreakBlock[i](eventData); }
        catch(e) { print("Error in playerBreakBlock: " + e); }
    }
}

function explodeHook(entity, x, y, z, power, onFire) {
    var eventData = {
        dimension: new MinecraftDimension("overworld"),
        source: new MinecraftEntity(entity),
        impactLocation: { x: x, y: y, z: z },
        radius: power
    };

    for (var i = 0; i < _mc_events.explosion.length; i++) {
        try { _mc_events.explosion[i](eventData); }
        catch(e) { print("Error in explosion: " + e); }
    }
}

function newLevel() {
    var playerObj = new MinecraftPlayer(Player.getEntity());
    var eventData = { player: playerObj };

    for (var i = 0; i < _mc_events.playerSpawn.length; i++) {
        try { _mc_events.playerSpawn[i](eventData); }
        catch(e) { print("Error in playerSpawn: " + e); }
    }
}

function redstoneUpdateHook(x, y, z, newCurrent, isWorldBuilder, blockId, blockData) {
    var eventData = {
        block: new MinecraftBlock(x, y, z),
        power: newCurrent
    };

    for (var i = 0; i < _mc_events.redstoneUpdate.length; i++) {
        try { _mc_events.redstoneUpdate[i](eventData); }
        catch(e) { print("Error in redstoneUpdate: " + e); }
    }
}
