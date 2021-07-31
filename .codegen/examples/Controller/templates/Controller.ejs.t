---
to: .codegen/generated/Controllers/<%=controllerName%>Controller.php
force: true
---
<?php

class <%=controllerName%>Controller <%=interfaces ? `implements ${interfaces}` : null%> {
<% if (interface_methods) { %>
<%-interface_methods%>
<% } %>
}
