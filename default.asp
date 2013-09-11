<!-- #include file="../../_portal.asp" -->
<%
Response.Expires = 0
Call InitNugget("SystemCheck2")
giNugFlags = giNugFlags Or (DISABLE_CACHE + DISABLE_SETTINGS)
gsNugTitle = ResourceManager.GetString("NUGTITLE_" & gsNugID, gstrNamespace, gstrLangCode, "System Check 2 [BETA]", Nothing, gstrLangResourcePath)
gsNugTitle = EnvVar("NUGTITLE_" & gsNugID, gsNugTitle)

Dim sNuggetPath: sNuggetPath = gsPortalBase & "nuggets/" & gsNugID & "/"

Dim sNuggetText, iAt, sCheck
sNuggetText = NuggetContainer(gsNugID)
iAt = InStr(1, sNuggetText, "<!--NUGGET_TEXT-->", 1)
If iAt = 0 Then
	Response.Write sNuggetText
Else
    sCheck = "," & EnvVar("SystemCheck2", "browser,javascript,ajax,cookies,popups,java,acrobat,flash,quicktime,windowsmedia") & ","
    'trim whitespace after commas and convert to all lower case
    sCheck = LCase(Trim(Replace(sCheck, ", ", ",")))
	Response.Write Mid(sNuggetText, 1, iAt - 1)
%>
<div id="browserCheck">
	<noscript>
		<p>Javascript is not enabled!</p>
	</noscript>
</div>
<link href="<%=sNuggetPath%>css/style-browsercheck.css" rel="stylesheet" type="text/css" media="all" />
<script src="<%=sNuggetPath%>jquery-1.10.1.min.js"></script>
<script src="<%=sNuggetPath%>jquery-1.10.1.min.map"></script>
<script src="<%=sNuggetPath%>jquery-migrate-1.2.0.min.js"></script>
<script src="<%=sNuggetPath%>modernizer.js"></script>
<script src="<%=sNuggetPath%>jquery-angelsysheck.js"></script>
<script>
	$(document).ready(function(){
		$("#browserCheck").systemCheck();
	});
</script>
<% 
	Response.Write Mid(sNuggetText, iAt)
End If 
Set dLang = Nothing
%>
