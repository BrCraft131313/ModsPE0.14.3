// Magic Piston Mod - المود 3 من 9 (تعديل كراش التنزيل)
var pistonHeight = 0;
var SLIMEBALL_ID = 341;

function procCmd(command) {
    var args = command.split(" ");
    var cmd = args[0].toLowerCase();

    if (cmd == "piston" || cmd == "pist") {
        if (args.length > 1) {
            pistonHeight = parseInt(args[1], 10);
            clientMessage("§a[Piston Mod] Height set to: " + pistonHeight);
        } else {
            clientMessage("§c[Piston Mod] Usage: /piston <height>");
        }
    }
}

function useItem(x, y, z, itemId, blockId, side) {
    if (itemId == SLIMEBALL_ID && pistonHeight != 0) {
        
        // 1. تحديد أعلى بلوكة متصلة بالعمود
        var topY = y;
        while (Level.getTile(x, topY + 1, z) != 0 && topY < 255) {
            topY++;
        }

        // 2. الرفع للأعلى (pistonHeight > 0)
        if (pistonHeight > 0) {
            for (var currY = topY; currY >= y; currY--) {
                var tile = Level.getTile(x, currY, z);
                var data = Level.getData(x, currY, z);
                
                Level.setTile(x, currY + pistonHeight, z, tile, data);
                Level.setTile(x, currY, z, 0, 0);
            }
            clientMessage("§a[Piston Mod] Shifted UP by " + pistonHeight);

        // 3. التنزيل للأسفل (pistonHeight < 0)
        } else if (pistonHeight < 0) {
            for (var currY = y; currY <= topY; currY++) {
                var tile = Level.getTile(x, currY, z);
                var data = Level.getData(x, currY, z);
                
                var targetY = currY + pistonHeight;
                if (targetY >= 0) {
                    Level.setTile(x, targetY, z, tile, data);
                    Level.setTile(x, currY, z, 0, 0);
                }
            }
            clientMessage("§a[Piston Mod] Shifted DOWN by " + Math.abs(pistonHeight));
        }

        preventDefault();
    }
}
