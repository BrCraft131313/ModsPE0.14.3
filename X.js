// Load All Mods from GitHub Release automatically
(function() {
    var url = "https://api.github.com/repos/BrCraft131313/ModsPE0.14.3/releases/tags/Latest";
    
    new java.lang.Thread(function() {
        try {
            var connection = new java.net.URL(url).openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            var reader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()));
            var response = "", line;
            while ((line = reader.readLine()) != null) response += line;
            reader.close();

            // استخراج روابط التحميل لكل ملفات .js المرفوعة في الـ Release
            var regex = /"browser_download_url":\s*"([^"]+\.js)"/g;
            var match;
            while ((match = regex.exec(response)) !== null) {
                var modUrl = match[1];
                // تجاهل هذا السكربت نفسه لمنع الدوران اللانهائي
                if (modUrl.indexOf("load_all.js") === -1) {
                    eval(net.zhuoweizhang.mcpelauncher.ScriptManager.downloadScript(modUrl));
                }
            }
        } catch(e) {
            clientMessage("§cFailed to load mods from GitHub Release!");
        }
    }).start();
})();
