/*
 * Library Name : modspe0.14.3-@minecraft/serversyntax.js
 * Description  : Polyfill Wrapper translating full MCPE 0.14.3 ModPE functions into @minecraft/server API syntax.
 * Includes     : Native Java File I/O, Android Vibrator, Toast Notifications, ES5 Rhino Compatibility.
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
// 2. إدارة التعامل مع ملفات Java (Java File I/O)
// ==========================================

var FileIO = {
    read: function(filePath) {
        try {
            var file = new java.io.File(filePath);
            if (!file.exists()) return null;
            var reader = new java.io.BufferedReader(new java.io.FileReader(file));
            var line, content = "";
            while ((line = reader.readLine()) !== null) {
                content += line + "\n";
            }
            reader.close();
            return content;
        } catch(e) {
            print("FileIO Read Error: " + e);
            return null;
        }
    },
    write: function(filePath, text) {
        try {
            var file = new java.io.File(filePath);
            if (file.getParentFile() && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            var writer = new java.io.BufferedWriter(new java.io.FileWriter(file, false));
            writer.write(text);
            writer.flush();
            writer.close();
            return true;
        } catch(e) {
            print("FileIO Write Error: " + e);
            return false;
        }
    },
    append: function(filePath, text) {
        try {
            var file = new java.io.File(filePath);
            if (file.getParentFile() && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            var writer = new java.io.BufferedWriter(new java.io.FileWriter(file, true));
            writer.write(text);
            writer.flush();
            writer.close();
            return true;
        } catch(e) {
            print("FileIO Append Error: " + e);
            return false;
        }
    },
    exists: function(filePath) {
        try {
            return new java.io.File(filePath).exists();
        } catch(e) {
            return false;
        }
    },
    deleteFile: function(filePath) {
        try {
            return new java.io.File(filePath)["delete"]();
        } catch(e) {
            return false;
        }
    },
    mkdir: function(dirPath) {
        try {
            return new java.io.File(dirPath).mkdirs();
        } catch(e) {
            return false;
        }
    }
};

// ==========================================
// 3. مصفوفات إدارة الأحداث والمؤقتات الداخلية
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
// 4. كائن البلوكة (Block Wrapper)
// ==========================================

function MinecraftBlock(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.location = { x: x, y: y, z: z };
}

Object.defineProperty(MinecraftBlock.prototype, "typeId", {
    get: function() { return Level.getTile(this.x, this.y, this.z); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftBlock.prototype, "permutation", {
    get: function() { return { data: Level.getData(this.x, this.y, this.z) }; },
    configurable: true,
    enumerable: true
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
// 5. كائنات الكيانات واللاعبين (Entity & Player Wrappers)
// ==========================================

function MinecraftEntity(entityId) {
    this.id = entityId;
}

Object.defineProperty(MinecraftEntity.prototype, "typeId", {
    get: function() { return Entity.getEntityTypeId(this.id); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftEntity.prototype, "location", {
    get: function() {
        return {
            x: Entity.getX(this.id),
            y: Entity.getY(this.id),
            z: Entity.getZ(this.id)
        };
    },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftEntity.prototype, "velocity", {
    get: function() {
        return {
            x: Entity.getVelX(this.id),
            y: Entity.getVelY(this.id),
            z: Entity.getVelZ(this.id)
        };
    },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftEntity.prototype, "nameTag", {
    get: function() { return Entity.getNameTag(this.id); },
    set: function(name) { Entity.setNameTag(this.id, name); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftEntity.prototype, "isSneaking", {
    get: function() { return typeof Entity.isSneaking === "function" ? Entity.isSneaking(this.id) : false; },
    set: function(value) { if (typeof Entity.setSneaking === "function") Entity.setSneaking(this.id, value); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftEntity.prototype, "target", {
    get: function() { return new MinecraftEntity(Entity.getTarget(this.id)); },
    set: function(targetEntity) { Entity.setTarget(this.id, (targetEntity && targetEntity.id !== undefined) ? targetEntity.id : targetEntity); },
    configurable: true,
    enumerable: true
});

MinecraftEntity.prototype.teleport = function(x, y, z) {
    if (typeof x === "object" && x !== null) {
        Entity.setPosition(this.id, x.x, x.y, x.z);
    } else {
        Entity.setPosition(this.id, x, y, z);
    }
};

MinecraftEntity.prototype.applyImpulse = function(vector) {
    if (vector && vector.x !== undefined) Entity.setVelX(this.id, vector.x);
    if (vector && vector.y !== undefined) Entity.setVelY(this.id, vector.y);
    if (vector && vector.z !== undefined) Entity.setVelZ(this.id, vector.z);
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
    if (typeof Entity.setImmobile === "function") {
        Entity.setImmobile(this.id, value);
    }
};

MinecraftEntity.prototype.remove = function() {
    Entity.remove(this.id);
};

MinecraftEntity.prototype.ride = function(targetEntity) {
    var targetId = (targetEntity && targetEntity.id !== undefined) ? targetEntity.id : targetEntity;
    Entity.rideAnimal(this.id, targetId);
};

MinecraftEntity.prototype.getComponent = function(componentId) {
    var self = this;
    if (componentId === "minecraft:health") {
        var comp = {};
        Object.defineProperty(comp, "currentValue", {
            get: function() { return Entity.getHealth(self.id); },
            configurable: true,
            enumerable: true
        });
        Object.defineProperty(comp, "effectiveMax", {
            get: function() { return Entity.getMaxHealth(self.id); },
            configurable: true,
            enumerable: true
        });
        comp.setCurrentValue = function(val) { Entity.setHealth(self.id, val); };
        comp.setMaxValue = function(val) { Entity.setMaxHealth(self.id, val); };
        return comp;
    }
    return null;
};

// محاكاة كائن اللاعب (Player Wrapper)
function MinecraftPlayer(entityId) {
    MinecraftEntity.call(this, entityId);
}
MinecraftPlayer.prototype = Object.create(MinecraftEntity.prototype);
MinecraftPlayer.prototype.constructor = MinecraftPlayer;

Object.defineProperty(MinecraftPlayer.prototype, "name", {
    get: function() { return typeof Player.getName === "function" ? Player.getName(this.id) : "Player"; },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftPlayer.prototype, "level", {
    get: function() { return typeof Player.getLevel === "function" ? Player.getLevel() : 0; },
    set: function(lvl) { if (typeof Player.setLevel === "function") Player.setLevel(lvl); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftPlayer.prototype, "xpEarnedAtCurrentLevel", {
    get: function() { return typeof Player.getExp === "function" ? Player.getExp() : 0; },
    set: function(exp) { if (typeof Player.setExp === "function") Player.setExp(exp); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftPlayer.prototype, "isFlying", {
    get: function() { return typeof Player.isFlying === "function" ? Player.isFlying() : false; },
    set: function(value) { if (typeof Player.setFlying === "function") Player.setFlying(value); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftPlayer.prototype, "canFly", {
    get: function() { return typeof Player.canFly === "function" ? Player.canFly() : false; },
    set: function(value) { if (typeof Player.setCanFly === "function") Player.setCanFly(value); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftPlayer.prototype, "selectedSlotIndex", {
    get: function() { return typeof Player.getSelectedSlotId === "function" ? Player.getSelectedSlotId() : 0; },
    set: function(slot) { if (typeof Player.setSelectedSlotId === "function") Player.setSelectedSlotId(slot); },
    configurable: true,
    enumerable: true
});

Object.defineProperty(MinecraftPlayer.prototype, "score", {
    get: function() { return typeof Player.getScore === "function" ? Player.getScore() : 0; },
    configurable: true,
    enumerable: true
});

MinecraftPlayer.prototype.sendMessage = function(message) {
    clientMessage(message);
};

MinecraftPlayer.prototype.addExperience = function(amount) {
    if (typeof Player.addExp === "function") Player.addExp(amount);
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
    return (ent !== -1 && ent !== null && ent !== undefined) ? new MinecraftEntity(ent) : null;
};

MinecraftPlayer.prototype.onScreenDisplay = {
    setActionBar: function(text) {
        if (typeof ModPE.showTipMessage === "function") {
            ModPE.showTipMessage(text);
        }
    }
};

MinecraftPlayer.prototype.getComponent = function(componentId) {
    var self = this;
    if (componentId === "minecraft:hunger") {
        var hungerComp = {};
        Object.defineProperty(hungerComp, "currentValue", {
            get: function() { return typeof Player.getHunger === "function" ? Player.getHunger() : 20; },
            set: function(val) { if (typeof Player.setHunger === "function") Player.setHunger(val); },
            configurable: true,
            enumerable: true
        });
        Object.defineProperty(hungerComp, "saturation", {
            get: function() { return typeof Player.getSaturation === "function" ? Player.getSaturation() : 5; },
            set: function(val) { if (typeof Player.setSaturation === "function") Player.setSaturation(val); },
            configurable: true,
            enumerable: true
        });
        Object.defineProperty(hungerComp, "exhaustion", {
            get: function() { return typeof Player.getExhaustion === "function" ? Player.getExhaustion() : 0; },
            set: function(val) { if (typeof Player.setExhaustion === "function") Player.setExhaustion(val); },
            configurable: true,
            enumerable: true
        });
        return hungerComp;
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
// 6. كائن البعد (Dimension Wrapper)
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
// 7. تعريف كائن world
// ==========================================

var world = {
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

Object.defineProperty(world, "name", {
    get: function() { return Level.getWorldName(); },
    configurable: true,
    enumerable: true
});

// ==========================================
// 8. تعريف كائن system (يشمل الهزاز و Java File I/O و Native Tools)
// ==========================================

var system = {
    fileIO: FileIO,
    
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
        for (var i = _mc_intervals.length - 1; i >= 0; i--) {
            if (_mc_intervals[i].id === runId) {
                _mc_intervals.splice(i, 1);
                return;
            }
        }
        for (var j = _mc_timeouts.length - 1; j >= 0; j--) {
            if (_mc_timeouts[j].id === runId) {
                _mc_timeouts.splice(j, 1);
                return;
            }
        }
    },
    vibrate: function(milliseconds) {
        try {
            var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
            if (ctx) {
                var vibrator = ctx.getSystemService(android.content.Context.VIBRATOR_SERVICE);
                if (vibrator) {
                    vibrator.vibrate(milliseconds || 100);
                }
            }
        } catch(e) {
            print("Vibrate Error: " + e);
        }
    },
    showToast: function(message) {
        try {
            var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
            if (ctx) {
                ctx.runOnUiThread(new java.lang.Runnable({
                    run: function() {
                        android.widget.Toast.makeText(ctx, String(message), android.widget.Toast.LENGTH_SHORT).show();
                    }
                }));
            }
        } catch(e) {
            clientMessage(message);
        }
    },
    copyToClipboard: function(text) {
        try {
            var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
            if (ctx) {
                ctx.runOnUiThread(new java.lang.Runnable({
                    run: function() {
                        var clipboard = ctx.getSystemService(android.content.Context.CLIPBOARD_SERVICE);
                        var clip = android.content.ClipData.newPlainText("Copied Text", text);
                        clipboard.setPrimaryClip(clip);
                    }
                }));
            }
        } catch(e) {
            print("Clipboard Error: " + e);
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

Object.defineProperty(system, "currentTick", {
    get: function() { return _mc_current_tick; },
    configurable: true,
    enumerable: true
});

Object.defineProperty(system, "minecraftVersion", {
    get: function() { return ModPE.getMinecraftVersion(); },
    configurable: true,
    enumerable: true
});

// ==========================================
// 9. ربط أحداث ModPE الأصلية بالـ Wrapper
// ==========================================

function modTick() {
    _mc_current_tick++;

    // 1. معالجة مهام الدورة التكرارية القادمة (system.run)
    while (_mc_nextTickQueue.length > 0) {
        var fn = _mc_nextTickQueue.shift();
        try { fn(); } catch(e) { print("Error in system.run: " + e); }
    }

    // 2. معالجة الفواصل الزمنية (system.runInterval)
    var intervalsCopy = _mc_intervals.slice(0);
    for (var i = 0; i < intervalsCopy.length; i++) {
        var task = intervalsCopy[i];
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
            var callbackToRun = timer.callback;
            _mc_timeouts.splice(j, 1);
            try { callbackToRun(); } catch(e) { print("Error in runTimeout: " + e); }
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
