<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Securi&Tech</title>

  <style>

    *{
      margin:0;
      padding:0;
      box-sizing:border-box;
      font-family:Arial, sans-serif;
    }

    body{
      background:#07111f;
      color:#fff;
    }

    .screen{
      display:none;
    }

    .active{
      display:block;
    }

    /* LOGIN */

    .login-screen{
      height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(to right,#07111f,#0d1b2a);
    }

    .login-box{
      width:400px;
      background:#0d1b2a;
      border:1px solid #1e293b;
      border-radius:20px;
      padding:40px;
      text-align:center;
      box-shadow:0 0 30px rgba(59,130,246,0.2);
    }

    .login-box h1{
      color:#3b82f6;
      font-size:42px;
      margin-bottom:10px;
    }

    .login-box p{
      color:#cbd5e1;
      margin-bottom:30px;
    }

    input{
      width:100%;
      padding:15px;
      margin-bottom:15px;
      border:none;
      border-radius:12px;
      background:#0f172a;
      color:white;
      font-size:16px;
    }

    button{
      border:none;
      cursor:pointer;
      transition:0.3s;
    }

    .login-btn{
      width:100%;
      padding:15px;
      background:#3b82f6;
      color:white;
      border-radius:12px;
      font-size:16px;
      font-weight:bold;
    }

    .login-btn:hover{
      opacity:0.8;
    }

    /* DASHBOARD */

    .dashboard{
      display:flex;
      min-height:100vh;
    }

    /* SIDEBAR */

    .sidebar{
      width:260px;
      background:#0d1b2a;
      border-right:1px solid #1e293b;
      padding:30px 20px;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
    }

    .logo h1{
      color:#3b82f6;
      font-size:34px;
    }

    .logo p{
      color:#94a3b8;
      margin-top:5px;
      font-size:14px;
    }

    .menu{
      margin-top:40px;
    }

    .menu button{
      width:100%;
      padding:16px;
      background:#1e3a5f;
      color:white;
      border-radius:14px;
      margin-bottom:12px;
      text-align:left;
      font-size:16px;
      border:1px solid #1e293b;
    }

    .menu button:hover{
      background:#3b82f6;
    }

    .system-status{
      background:#0f172a;
      border:1px solid #1e293b;
      padding:20px;
      border-radius:20px;
      text-align:center;
    }

    .system-status h3{
      color:#60a5fa;
      margin-bottom:10px;
    }

    /* MAIN */

    .main{
      flex:1;
      padding:30px;
    }

    .topbar{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:25px;
    }

    .topbar h2{
      font-size:38px;
    }

    .topbar p{
      color:#cbd5e1;
      margin-top:5px;
    }

    .clock{
      color:#3b82f6;
      font-size:24px;
      font-weight:bold;
    }

    .grid{
      display:grid;
      grid-template-columns:2fr 1fr;
      gap:20px;
    }

    .card{
      background:#0d1b2a;
      border:1px solid #1e293b;
      border-radius:20px;
      padding:20px;
    }

    .card-title{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:15px;
    }

    .live{
      color:#60a5fa;
    }

    /* CAMERA */

    .camera{
      overflow:hidden;
      border-radius:16px;
      height:500px;
      margin-top:15px;
    }

    .camera img{
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .mask-status{
      margin-top:15px;
      background:#0f172a;
      border:1px solid #1e293b;
      border-radius:15px;
      padding:20px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    }

    .mask-status h3{
      color:#60a5fa;
    }

    .confidence{
      color:#60a5fa;
      font-size:28px;
      font-weight:bold;
    }

    /* MACHINE */

    .machine-status{
      background:rgba(59,130,246,0.15);
      border:1px solid #3b82f6;
      border-radius:18px;
      padding:25px;
      text-align:center;
      margin-top:20px;
    }

    .machine-status h1{
      color:#60a5fa;
      font-size:38px;
      margin-bottom:10px;
    }

    .danger-btn{
      width:100%;
      padding:18px;
      background:rgba(239,68,68,0.15);
      border:1px solid #ef4444;
      color:#ef4444;
      border-radius:16px;
      font-size:16px;
      margin-top:20px;
      font-weight:bold;
    }

    .control{
      margin-top:20px;
    }

    .control-buttons{
      display:flex;
      gap:10px;
      margin-top:15px;
    }

    .start{
      flex:1;
      background:rgba(59,130,246,0.15);
      border:1px solid #3b82f6;
      color:#60a5fa;
      padding:16px;
      border-radius:14px;
      font-weight:bold;
    }

    .stop{
      flex:1;
      background:rgba(239,68,68,0.15);
      border:1px solid #ef4444;
      color:#ef4444;
      padding:16px;
      border-radius:14px;
      font-weight:bold;
    }

    .info{
      display:flex;
      justify-content:space-between;
      margin-top:15px;
      color:#cbd5e1;
    }

    .green{
      color:#60a5fa;
      font-weight:bold;
    }

    .yellow{
      color:#93c5fd;
      font-weight:bold;
    }

    .red{
      color:#ef4444;
      font-weight:bold;
    }

    .logs{
      margin-top:20px;
    }

    .log-item{
      background:#0f172a;
      border-radius:14px;
      padding:15px;
      display:flex;
      justify-content:space-between;
      margin-top:10px;
      border:1px solid #1e293b;
    }

    footer{
      text-align:center;
      color:#94a3b8;
      margin-top:20px;
    }

    @media(max-width:1200px){

      .grid{
        grid-template-columns:1fr;
      }

      .dashboard{
        flex-direction:column;
      }

      .sidebar{
        width:100%;
      }

    }

  </style>
</head>

<body>

  <!-- LOGIN -->

  <div id="login" class="screen active">

    <div class="login-screen">

      <div class="login-box">

        <h1>SECURI&TECH</h1>
        <p>Welding Safety System</p>

        <input type="text" placeholder="Usuário">
        <input type="password" placeholder="Senha">

        <button class="login-btn" onclick="abrirDashboard()">
          ENTRAR
        </button>

      </div>

    </div>

  </div>

  <!-- DASHBOARD -->

  <div id="dashboard" class="screen">

    <div class="dashboard">

      <!-- SIDEBAR -->

      <div class="sidebar">

        <div>

          <div class="logo">
            <h1>SECURI&TECH</h1>
            <p>Welding Safety System</p>
          </div>

          <div class="menu">

            <button onclick="mostrarTela('monitoramento')">
              📹 Monitoramento
            </button>

            <button onclick="mostrarTela('historico')">
              🕒 Histórico
            </button>

            <button onclick="mostrarTela('configuracoes')">
              ⚙ Configurações
            </button>

            <button onclick="sairSistema()">
              🚪 Sair
            </button>

          </div>

        </div>

        <div class="system-status">
          <h3>● SISTEMA ONLINE</h3>
          <p>Todos os sistemas operacionais</p>
        </div>

      </div>

      <!-- MAIN -->

      <div class="main">

        <div class="topbar">

          <div>
            <h2>MONITORAMENTO EM TEMPO REAL</h2>
            <p>Sistema inteligente de detecção de máscara de solda</p>
          </div>

          <div class="clock" id="clock"></div>

        </div>

        <!-- MONITORAMENTO -->

        <div id="monitoramento">

          <div class="grid">

            <div>

              <div class="card">

                <div class="card-title">
                  <h2>📹 CÂMERA DE MONITORAMENTO</h2>
                  <span class="live">● AO VIVO</span>
                </div>

                <div class="camera">

                  <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop"
                  alt="Soldador">

                </div>

                <div class="mask-status">

                  <div>
                    <h3>✔ MÁSCARA DETECTADA</h3>
                    <p>Operador autorizado para uso da máquina</p>
                  </div>

                  <div class="confidence">
                    98%
                  </div>

                </div>

              </div>

              <!-- LOGS -->

              <div class="card logs">

                <h2>🕒 LOGS EM TEMPO REAL</h2>

                <div class="log-item">
                  <span>14:35 - Máscara detectada</span>
                  <span class="green">OK</span>
                </div>

                <div class="log-item">
                  <span>14:36 - Operador autorizado</span>
                  <span class="green">VALIDADO</span>
                </div>

                <div class="log-item">
                  <span>14:37 - Máquina de solda iniciada</span>
                  <span class="yellow">OPERANDO</span>
                </div>

              </div>

            </div>

            <!-- LADO DIREITO -->

            <div>

              <div class="card">

                <h2>🛠 MÁQUINA DE SOLDA</h2>

                <div class="machine-status" id="machineStatus">

                  <h1 id="machineText">LIBERADA</h1>
                  <p id="machineSub">Operação autorizada</p>

                </div>

                <button class="danger-btn" onclick="removerMascara()">
                  ⚠ SIMULAR REMOÇÃO DA MÁSCARA
                </button>

              </div>

              <!-- CONTROLE -->

              <div class="card control">

                <h2>⚙ CONTROLE DA MÁQUINA</h2>

                <div class="control-buttons">

                  <button class="start">
                    ▶ INICIAR
                  </button>

                  <button class="stop">
                    ■ PARAR
                  </button>

                </div>

                <div class="info">
                  <span>Estado:</span>
                  <span class="green">Operacional</span>
                </div>

                <div class="info">
                  <span>Temperatura:</span>
                  <span class="yellow">72°C</span>
                </div>

              </div>

            </div>

          </div>

        </div>

        <!-- HISTÓRICO -->

        <div id="historico" style="display:none;">

          <div class="card">

            <h2>🕒 HISTÓRICO DE OCORRÊNCIAS</h2>

            <div class="log-item">
              <span>14:35 - Máscara detectada</span>
              <span class="green">OK</span>
            </div>

            <div class="log-item">
              <span>14:37 - Máquina liberada</span>
              <span class="green">AUTORIZADA</span>
            </div>

            <div class="log-item">
              <span>14:40 - Máscara removida</span>
              <span class="red">ALERTA</span>
            </div>

            <div class="log-item">
              <span>14:40 - Máquina bloqueada automaticamente</span>
              <span class="red">BLOQUEADA</span>
            </div>

          </div>

        </div>

        <!-- CONFIG -->

        <div id="configuracoes" style="display:none;">

          <div class="card">

            <h2>⚙ CONFIGURAÇÕES DO SISTEMA</h2>

            <div class="info">
              <span>Modo da IA:</span>
              <span class="green">Detecção Ativa</span>
            </div>

            <div class="info">
              <span>Sensibilidade:</span>
              <span class="yellow">Alta</span>
            </div>

            <div class="info">
              <span>Tempo de bloqueio:</span>
              <span class="yellow">2 segundos</span>
            </div>

            <div class="info">
              <span>Status dos sensores:</span>
              <span class="green">Online</span>
            </div>

          </div>

        </div>

        <footer>
          SECURI&TECH Welding Safety System • Projeto Interdisciplinar
        </footer>

      </div>

    </div>

  </div>

  <script>

    function abrirDashboard(){
      document.getElementById('login').classList.remove('active');
      document.getElementById('dashboard').classList.add('active');
    }

    function mostrarTela(tela){

      document.getElementById('monitoramento').style.display='none';
      document.getElementById('historico').style.display='none';
      document.getElementById('configuracoes').style.display='none';

      document.getElementById(tela).style.display='block';
    }

    function sairSistema(){
      document.getElementById('dashboard').classList.remove('active');
      document.getElementById('login').classList.add('active');
    }

    function removerMascara(){

      document.getElementById('machineText').innerHTML='BLOQUEADA';
      document.getElementById('machineText').style.color='#ef4444';

      document.getElementById('machineSub').innerHTML='Máscara não detectada';

      document.getElementById('machineStatus').style.background='rgba(239,68,68,0.15)';
      document.getElementById('machineStatus').style.border='1px solid #ef4444';
    }

    function atualizarRelogio(){

      const agora = new Date();
      const hora = agora.toLocaleTimeString();

      document.getElementById('clock').innerHTML = hora;
    }

    setInterval(atualizarRelogio,1000);

  </script>

</body>
</html>
