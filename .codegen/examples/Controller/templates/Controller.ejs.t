---
to: .codegen/generated/Controllers/<%=name%>Controller.php
force: true
---
<?php

class <%=name%>Controller <%=interfaces ? `implements ${interfaces}` : null%> {
<% if (interface_methods) { %>
<%-interface_methods%>
<% } %>
}
