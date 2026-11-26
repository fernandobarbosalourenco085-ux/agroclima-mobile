var MES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
var CULT={
"Milho":{m:[1,2,3],ciclo:"110 a 140 dias",agua:"400 a 600 mm",dica:"Plante quando o solo já estiver úmido de forma regular, para evitar falhas na germinação."},
"Feijão":{m:[2,3,4],ciclo:"60 a 80 dias",agua:"300 a 450 mm",dica:"Aguenta bem períodos curtos de seca, mas precisa de umidade na floração."},
"Banana":{m:[1,2,3],ciclo:"100 a 130 dias",agua:"350 a 500 mm",dica:"Boa opção para áreas com chuva irregular e também serve de ração."},
"Mandioca":{m:[0,1,2,3,4],ciclo:"8 a 18 meses",agua:"600 a 1000 mm",dica:"Plante com solo úmido; depois de enraizada, tolera bem a estiagem."},
"Todos":{m:[1,2,3],ciclo:"150 a 180 dias",agua:"700 a 900 mm",dica:"Evite plantar tarde: a colheita precisa cair no período seco."}
};
var DIAS=["S","T","Q","Q","S","S","D"],CHUVA7=[0,6,2,0,8,2,0];
var PROX=[{d:"Qui",mm:0,t:"Sem chuva"},{d:"Sex",mm:2,t:"Fraca"},{d:"Sáb",mm:5,t:"Moderada"},{d:"Dom",mm:0,t:"Sem chuva"},{d:"Seg",mm:0,t:"Sem chuva"}];
var SIT=[{n:"Milho",s:"Condição favorável nesta semana",p:"go",t:"Pode plantar"},{n:"Feijão",s:"Espere a chuva se firmar",p:"wait",t:"Aguarde"},{n:"Banana",s:"Janela ainda não abriu",p:"no",t:"Monitorar"}];
var HORA=[{n:"Milho",s:"Pode plantar nesta semana",p:"go",t:"Pode plantar"},{n:"Feijão",s:"Espere a chuva se firmar",p:"wait",t:"Aguarde"},{n:"Banana",s:"Janela ainda não abriu",p:"no",t:"Ainda não"}];
var ALERTAS=[
{n:"alta",tag:"Atenção",t:"Risco de veranico",d:"Pode haver um período de poucos dias sem chuva. Acompanhe e previna antes de plantar.",q:"Hoje • 08:00"},
{n:"media",tag:"Plantio",t:"Janela favorável para milho",d:"As condições climáticas indicam uma boa oportunidade para iniciar o plantio nesta semana.",q:"Ontem • 16:30"},
{n:"baixa",tag:"Informativo",t:"Acompanhe a umidade do solo",d:"O monitoramento da umidade ajuda a plantar o milho e a evitar perdas na lavoura.",q:"12 mar • 09:15"}
];
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}

/* gráfico de 7 dias */
function bars(svg){
var W=360,H=130,bw=30,pad=18,gap=(W-pad*2-bw*7)/6,max=10,h=H-44,html="";
for(var i=0;i<7;i++){var x=pad+i*(bw+gap),bh=Math.max(2,CHUVA7[i]/max*h),y=H-22-bh;
html+='<rect class="b" x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="3"/>';
html+='<text x="'+(x+bw/2)+'" y="'+(H-6)+'" text-anchor="middle">'+DIAS[i]+'</text>';
if(CHUVA7[i]>0)html+='<text class="t" x="'+(x+bw/2)+'" y="'+(y-4)+'" text-anchor="middle">'+CHUVA7[i]+'</text>'}
svg.innerHTML=html}
function prox(el){el.innerHTML=PROX.map(function(p){return '<div class="day"><span class="note">'+p.d+'</span><svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg><b>'+p.mm+' mm</b><i>'+p.t+'</i></div>'}).join("")}
function linhas(arr,cls){return arr.map(function(c){return '<div class="li"><div><b>'+c.n+'</b><span class="s">'+c.s+'</span></div><span class="pill '+c.p+'">'+c.t+'</span></div>'}).join("")}
function pickCult(){
var c=CULT[$("#selCult").value];
$("#meses").innerHTML=MES.map(function(m,i){return '<span class="'+(c.m.indexOf(i)>-1?'ok':'')+'">'+m+'</span>'}).join("");
$("#ciclo").textContent=c.ciclo;$("#agua").textContent=c.agua;$("#dica").textContent=c.dica}
function lista(f){
var itens=ALERTAS.filter(function(a){return f==="todas"||a.n===f});
$("#lista").innerHTML=itens.length?itens.map(function(a){
return '<article class="card alert '+a.n+'"><span class="tag plain">'+a.tag+'</span><h3>'+a.t+'</h3><p style="margin:0 0 .3rem;font-size:.92rem" class="muted">'+a.d+'</p><p class="note" style="margin:0">'+a.q+'</p></article>'}).join(""):'<p class="muted">Nenhum aviso com essa gravidade no momento.</p>'}

/* senha (demonstração: guarda só o hash) */
function hash(t){
if(window.crypto&&crypto.subtle&&window.TextEncoder){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(t)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return("0"+x.toString(16)).slice(-2)}).join("")})}
return Promise.resolve("p:"+t)}
function getCad(){try{return JSON.parse(localStorage.getItem("agroclima:cadastro"))}catch(x){return null}}
function personaliza(){
var c=getCad(),h=new Date().getHours(),s=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
var nome=c&&c.nome?c.nome.split(/\s+/)[0]:"";
$("#saudacao").textContent=s+(nome?", "+nome:"");
var loc=c&&c.mun?c.mun:"Médio Curu, Itapajé/CE";
$("#local").textContent=loc+" | dados de exemplo";$("#loc2").textContent=loc}
function liberar(){try{sessionStorage.setItem("agroclima:entrou","1")}catch(x){}document.body.classList.remove("locked");personaliza();location.hash="#inicio";rota()}

/* login */
function login(e){
e.preventDefault();
$("#loginStatus").textContent="Entre com seu e-mail e senha para acessar.";
var em=$("#lemail").value.trim().toLowerCase(),se=$("#lsenha").value,er={},c=getCad();
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))er.lemail="Digite um e-mail válido, como nome@exemplo.com.";
if(!se)er.lsenha="Digite sua senha.";
function mostra(){$$("#formLogin .err").forEach(function(p){p.textContent=er[p.getAttribute("data-e")]||""});var k=Object.keys(er);if(k.length)$("#"+k[0]).focus();return k.length}
if(mostra())return;
if(!c||!c.h){er.lemail="Nenhum cadastro encontrado neste aparelho. Toque em Criar cadastro.";mostra();return}
hash(se).then(function(h){
if(c.email.toLowerCase()!==em||c.h!==h){er.lsenha="E-mail ou senha incorretos.";mostra();return}
mostra();$("#formLogin").reset();liberar()})}

/* cadastro */
function cadastro(e){
e.preventDefault();
var v={nome:$("#nome").value.trim(),email:$("#email").value.trim(),mun:$("#mun").value.trim(),cult:$("#cult").value,area:$("#area").value,senha:$("#senha").value},er={};
if(v.nome.split(/\s+/).length<2)er.nome="Digite nome e sobrenome.";
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email))er.email="Digite um e-mail válido, como nome@exemplo.com.";
if(!v.mun)er.mun="Informe o município.";
if(!v.cult)er.cult="Escolha uma cultura.";
if(!(parseFloat(v.area)>0))er.area="Informe a área em hectares, maior que zero.";
if(v.senha.length<6)er.senha="A senha precisa ter no mínimo 6 caracteres.";
$$("#form .err").forEach(function(p){p.textContent=er[p.getAttribute("data-e")]||""});
var k=Object.keys(er);
if(k.length){$("#"+k[0]).focus();return}
hash(v.senha).then(function(h){
try{localStorage.setItem("agroclima:cadastro",JSON.stringify({nome:v.nome,email:v.email,mun:v.mun,cult:v.cult,area:v.area,h:h}))}catch(x){}
$("#form").reset();
$("#loginStatus").textContent="Cadastro concluído. Entre com seu e-mail e senha cadastrados.";
$("#lemail").value=v.email;
document.body.classList.add("locked");
try{sessionStorage.removeItem("agroclima:entrou")}catch(x){}
location.hash="#login";rota()})}

/* rotas */
function rota(){
var liberado=!document.body.classList.contains("locked");
var p=(location.hash||"#inicio").slice(1);
if(["login","inicio","cadastro","plantio","chuvas","avisos"].indexOf(p)<0)p="inicio";
if(!liberado){if(p!=="cadastro")p="login";if(location.hash!=="#"+p)history.replaceState(null,"","#"+p)}else if(p==="login"||p==="cadastro"){p="inicio";history.replaceState(null,"","#inicio")}
$$(".page").forEach(function(s){s.classList.toggle("on",s.id==="p-"+p)});
$$(".tabbar a").forEach(function(a){if(a.getAttribute("data-p")===p)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
window.scrollTo(0,0)}

/* início */
try{if(sessionStorage.getItem("agroclima:entrou")==="1")document.body.classList.remove("locked")}catch(x){}
var nomes=Object.keys(CULT);
$("#selCult").innerHTML=nomes.map(function(n){return "<option>"+n+"</option>"}).join("");
$("#cult").innerHTML+=nomes.map(function(n){return "<option>"+n+"</option>"}).join("");
$("#selCult").addEventListener("change",pickCult);
$("#form").addEventListener("submit",cadastro);
$("#formLogin").addEventListener("submit",login);
$("#sair").addEventListener("click",function(){try{sessionStorage.removeItem("agroclima:entrou")}catch(x){}document.body.classList.add("locked")});
$$(".chip[data-f]").forEach(function(c){c.addEventListener("click",function(){
$$(".chip[data-f]").forEach(function(o){o.setAttribute("aria-pressed",o===c?"true":"false")});lista(c.getAttribute("data-f"))})});
$$("#fb .chip").forEach(function(b){b.addEventListener("click",function(){$("#fbMsg").textContent=b.getAttribute("data-r")==="sim"?"Obrigado! Fico feliz em ajudar.":"Obrigado pelo retorno. Vamos melhorar os avisos."})});
$$("[data-msg]").forEach(function(b){b.addEventListener("click",function(){$("#acaoMsg").textContent=b.getAttribute("data-msg")})});
$("#ouvir").addEventListener("click",function(){
var t="Aguarde para plantar o feijão. Risco de veranico nos próximos 10 dias na sua região. Espere a chuva se firmar antes de plantar.";
if(window.speechSynthesis){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="pt-BR";speechSynthesis.speak(u)}else{$("#fbMsg").textContent="Seu aparelho não suporta leitura em voz alta."}});
$("#notif").addEventListener("click",function(){this.textContent="Avisos ativados (exemplo)"});
bars($("#chartHome"));bars($("#chartRain"));prox($("#prox1"));prox($("#prox2"));
$("#hora").innerHTML=linhas(HORA);
$("#culturas").innerHTML=SIT.map(function(c){return '<div class="card" style="margin-bottom:.5rem"><div class="li" style="padding:0"><div><b>'+c.n+'</b><span class="s">'+c.s+'</span></div><span class="pill '+c.p+'">'+c.t+'</span></div></div>'}).join("");
pickCult();lista("todas");personaliza();
window.addEventListener("hashchange",rota);rota();
