/* ==========================================================================
   المود: أداة كسر البدروك (Bedrock Breaker)
   ========================================================================== */

function useItem(x, y, z, itemid, blockid, side, itemdamage, blockdamage) {
    // عند النقر على بلوك البدروك (ID 7) باستخدام معول ألماسي (ID 278)
    if (blockid == 7 && itemid == 278) {
        Level.setTile(x, y, z, 0);
        Level.dropItem(x + 0.5, y + 0.5, z + 0.5, 0, 7, 1, 0);
        clientMessage("[Bedrock Breaker] Bedrock destroyed!");
    }
}
