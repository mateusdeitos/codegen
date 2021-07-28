---
to: .codegen/generated/Controllers/<%=name%>Controller.php
force: true
---

class <%=name%>Controller {

	<% if (method_index) { %>
		<%=method_index%>
	<% } %>
	<% if (method_show) { %>
		<%=method_show%>
	<% } %>
}
