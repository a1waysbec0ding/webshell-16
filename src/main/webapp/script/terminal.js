if (typeof jQuery === "undefined") {
    throw new Error("Terminal requires jQuery");
}

(function() {

    // Create structure
    var terminal = $("#terminal");

    terminal.append("<div id='terminal-output'></div>");
    var terminalOutput = $("#terminal-output");

    terminal.append("<div id='terminal-input'></div>");
    var terminalInput = $("#terminal-input");

    terminalInput.append("<span id='prompt'>C:\&gt;&nbsp;</span>");
    var prompt = $("#prompt");

    terminalInput.append("<span id='command'></span>");
    var command = $("#command");

    terminalInput.append("<span id='cursor'>&nbsp;</span>");
    var cursor = $("#cursor");

    // Terminal events
    terminal.click(function() {
        terminal.attr("tabindex", 0);
        terminal.focus();
        cursorBlinking(true);
    });

    terminal.blur(function() {
        cursorBlinking(false);
    });

    terminal.keydown(function(e) {
        if (e.keyCode == 8) { //BACKSPACE
            command.text(command.text().slice(0,-1));
            return false;
        } else
        if (e.keyCode == 13) {
            terminalOutput.append(prompt.text());
            terminalOutput.append(command.text());
            $.post("command", {
                type: "command",
                value: command.text()
            }).done(function(data) {
                var lines = data.split("\n");
                prompt.html(lines[lines.length - 2]);
                if(data.lastIndexOf("\n") > 0) {
                    data = data.substring(0, data.lastIndexOf("\n"));
                    data = data.substring(0, data.lastIndexOf("\n"));
                }
                terminalOutput.append(data + "\n");
                terminal.scrollTop(9999999);
            });
            command.text("");
        }
    });

    terminal.keypress(function(e) {
        command.append(String.fromCharCode(e.charCode));
        e.stopPropagation();
        return false;
    });

    // Cursor blinking
    function cursorBlinking(blink) {
        if (blink) {
            if (this.cursorInterval) {
                clearInterval(this.cursorInterval);
            }
            this.cursorInterval = setInterval(function() {
                if (cursor.hasClass("cursor-inverted")) {
                    cursor.removeClass("cursor-inverted");
                } else {
                    cursor.addClass("cursor-inverted");
                }
            }, 500);
        } else {
            cursor.removeClass("cursor-inverted");
            clearInterval(this.cursorInterval);
        }
    }

    $.post("command", {
        type: "init",
        value: "|__stop__|"
    }).done(function(data) {
        var lines = data.split("\n");
        prompt.html(lines[lines.length - 2]);
        if(data.lastIndexOf("\n") > 0) {
            data = data.substring(0, data.lastIndexOf("\n"));
            data = data.substring(0, data.lastIndexOf("\n"));
        }
        terminalOutput.append(data + "\n");
        terminal.scrollTop(9999999);
    });

})();