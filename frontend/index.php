
<?php
// 1. INICIA A SESSÃO
session_start();

// Habilita exibição de erros para suporte local
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Se o colaborador já estiver logado, redireciona direto baseado no cargo salvo
if (isset($_SESSION['colab_id'])) {
    $cargo_salvo = isset($_SESSION['colab_cargo']) ? trim($_SESSION['colab_cargo']) : '';
    if (strcasecmp($cargo_salvo, 'Supervisor') === 0) {
        header("Location: dashboard.php");
    } else {
        header("Location: operador.php");
    }
    exit;
}

$erro = "";

// 2. PROCESSA O FORMULÁRIO QUANDO ENVIADO
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura QUALQUE valor digitado nos campos de forma dinâmica
    $usuario_input = filter_input(INPUT_POST, 'usuario', FILTER_SANITIZE_SPECIAL_CHARS);
    $senha_input = $_POST['password'];

    if (!empty($usuario_input) && !empty($senha_input)) {
        try {
            // Verifica a localização do arquivo de conexão
            if (file_exists("conexao.php")) {
                require_once "conexao.php";
            } else {
                require_once "../conexao.php";
            }

            // BUSCA TOTALMENTE DINÂMICA: Procura na tabela o que foi digitado no input
            // Usamos LEFT JOIN para encontrar o funcionário mesmo se o id_cargo dele estiver nulo ou errado
            $sql = "SELECT c.id_colab, c.nome_colab, c.usuario, c.senha, n.cargo 
                    FROM COLABORADORES c
                    LEFT JOIN NIVEIS n ON c.id_cargo = n.id_cargo
                    WHERE c.usuario = :usuario";
            
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':usuario', $usuario_input);
            $stmt->execute();
            
            $colaborador = $stmt->fetch(PDO::FETCH_ASSOC);

            // Se o usuário existir em qualquer registro do banco...
            if ($colaborador) {
                
                // Validação de senha flexível (Texto puro ou Hash criptografado)
                $senha_valida = false;
                if ($senha_input === $colaborador['senha']) {
                    $senha_valida = true;
                } elseif (password_verify($senha_input, $colaborador['senha'])) {
                    $senha_valida = true;
                }

                if ($senha_valida) {
                    // Salva as credenciais reais do banco na sessão do navegador
                    $_SESSION['colab_id']      = $colaborador['id_colab'];
                    $_SESSION['colab_nome']    = $colaborador['nome_colab'];
                    $_SESSION['colab_usuario'] = $colaborador['usuario'];
                    
                    // Se o cargo estiver em branco no banco, define como 'Operador' por padrão
                    $cargo_destino = !empty($colaborador['cargo']) ? trim($colaborador['cargo']) : 'Operador';
                    $_SESSION['colab_cargo']   = $cargo_destino; 

                    // REDIRECIONAMENTO DINÂMICO
                    // Se for exatamente "Supervisor", vai para o dashboard. Qualquer outro vai para operador.php
                    if (strcasecmp($cargo_destino, 'Supervisor') === 0) {
                        echo "<script>window.location.href='dashboard.php';</script>";
                        header("Location: dashboard.php");
                    } else {
                        echo "<script>window.location.href='operador.php';</script>";
                        header("Location: operador.php");
                    }
                    exit;
                } else {
                    $erro = "Senha incorreta.";
                }
            } else {
                $erro = "Usuário/Matrícula não encontrado no banco de dados.";
            }

        } catch (PDOException $e) {
            $erro = "Erro de banco de dados: " . $e->getMessage();
        }
    } else {
        $erro = "Por favor, preencha todos os campos.";
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Login — Securi&Tech EPI Guardian</title>
    <link rel="stylesheet" href="css/styles.css"/>
</head>
<body>
<div class="login">
    <div class="card">
        <div style="text-align:center;margin-bottom:20px">
            <div style="font-size:48px">🛡️</div>
            <h1>Securi&<span style="color:var(--primary)">Tech</span></h1>
            <div class="sub">EPI Guardian · Autenticação do Sistema</div>
        </div>

        <form id="loginForm" method="POST" action="">
            
            <?php if (!empty($erro)): ?>
                <div style="color: #ff4d4d; background: rgba(255,77,77,0.1); padding: 12px; border-radius: 4px; margin-bottom: 15px; font-size: 14px; text-align: center; border: 1px solid rgba(255,77,77,0.2)">
                    <?php echo $erro; ?>
                </div>
            <?php endif; ?>

            <div class="field">
                <label for="usuario">Usuário / Matrícula</label>
                <input id="usuario" name="usuario" placeholder="Digite seu usuário ou matrícula" value="<?php echo isset($usuario_input) ? $usuario_input : ''; ?>" required/>
            </div>
            
            <div class="field">
                <label for="password">Senha</label>
                <input id="password" name="password" type="password" placeholder="••••••" required/>
            </div>
            
            <button class="btn primary" style="width:100%;justify-content:center" type="submit">Entrar</button>
        </form>
    </div>
</div>
</body>
</html>