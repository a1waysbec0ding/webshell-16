package eu.jcrons.webshell;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

public class WindowsShell {

    private ProcessBuilder pb;
    private Process p;
    private PrintWriter pw;

    public WindowsShell() {
        pb = new ProcessBuilder("cmd");
        try {
            p = pb.start();
            pw = new PrintWriter(p.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String execute(String command) {

        command = command.replaceAll("\r", "");
        pw.write(command.trim() + "\n");
        pw.flush();

        pw.write("|__stop__|\n");
        pw.flush();

        StringBuilder sb = new StringBuilder();
        Scanner s = new Scanner(p.getInputStream(), "UTF-8");
        while (s.hasNextLine()) {
            String line = s.nextLine();
            sb.append(line + "\n");
            if (line.contains("|__stop__|")) {
                break;
            }
        }
        String str = sb.toString();
        str = str.substring(command.length());
        str = str.replace("|__stop__|", "");
        return str;
    }

}
