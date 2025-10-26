const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

    // Se nenhum dado foi enviado, mostra o formulário
    if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
        return res.send(`
      <html>
        <head>
          <title>Reajuste Salarial</title>
          <style>
            body {
              font-family: Arial;
              background-color: #f2f2f2;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              width: 100%;
              height: 100vh;
            }
            form {
              width: 400px;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            input, select {
              width: 100%;
              padding: 8px;
              outline: none;
              margin: 8px 0;
              border-radius: 5px;
              border: 1px solid #ccc;
            }
            button {
              width: 100%;
              padding: 10px;
              background-color: #2e8b57;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1em;
            }
            button:hover {
              background-color: #267046;
            }
          </style>
        </head>
        <body>
          <form id="form">
            <h2>Cálculo de Reajuste Salarial</h2>
            <label>Matrícula:</label>
            <input type="number" id="matricula" required>

            <label>Idade:</label>
            <input type="number" id="idade" required>

            <label>Sexo:</label>
            <select id="sexo" required>
              <option disable value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>

            <label>Salário base:</label>
            <input type="number" step="0.01" id="salario_base" required>

            <label>Ano de contratação:</label>
            <input type="number" id="anoContratacao" required>

            <button type="submit">Calcular</button>
          </form>

          <script>
            const form = document.getElementById("form");
            form.addEventListener("submit", (e) => {
              e.preventDefault();
              const idade = document.getElementById("idade").value;
              const sexo = document.getElementById("sexo").value;
              const salario_base = document.getElementById("salario_base").value;
              const anoContratacao = document.getElementById("anoContratacao").value;
              const matricula = document.getElementById("matricula").value;

              // Redireciona para a URL com os parâmetros
              window.location.href = 
                \`/?idade=\${idade}&sexo=\${sexo}&salario_base=\${salario_base}&anoContratacao=\${anoContratacao}&matricula=\${matricula}\`;
            });
          </script>
        </body>
      </html>
    `);
    }

    const idadeNum = parseInt(idade);
    const salarioNum = parseFloat(salario_base);
    const anoNum = parseInt(anoContratacao);
    const matriculaNum = parseInt(matricula);

    if (
        isNaN(idadeNum) || idadeNum <= 16 ||
        isNaN(salarioNum) || salarioNum <= 0 ||
        isNaN(anoNum) || anoNum <= 1960 ||
        isNaN(matriculaNum) || matriculaNum <= 0 ||
        (sexo !== "M" && sexo !== "F")
    ) {
        return res.send(`
      <h2 style="color:red;">Dados inválidos!</h2>
      <p>Verifique se os parâmetros estão corretos.</p>
      <a href="/">Voltar</a>
    `);
    }

    const anoAtual = 2025;
    const tempoEmpresa = anoAtual - anoNum;
    let reajuste = 0, novoSalario = 0, descontoOuAcrescimo = 0;

    if (idadeNum >= 18 && idadeNum <= 39) {
        reajuste = sexo === "M" ? 0.10 : 0.08;
        descontoOuAcrescimo = tempoEmpresa <= 10 ? (sexo === "M" ? -10 : -11) : (sexo === "M" ? 17 : 16);
    } else if (idadeNum >= 40 && idadeNum <= 69) {
        reajuste = sexo === "M" ? 0.08 : 0.10;
        descontoOuAcrescimo = tempoEmpresa <= 10 ? (sexo === "M" ? -5 : -7) : (sexo === "M" ? 15 : 14);
    } else if (idadeNum >= 70 && idadeNum <= 99) {
        reajuste = sexo === "M" ? 0.15 : 0.17;
        descontoOuAcrescimo = tempoEmpresa <= 10 ? (sexo === "M" ? -15 : -17) : (sexo === "M" ? 13 : 12);
    } else {
        return res.send("<h2>Idade fora das faixas definidas!</h2><a href='/'>Voltar</a>");
    }

    novoSalario = salarioNum + (salarioNum * reajuste) + descontoOuAcrescimo;

    res.send(`
    <html>
      <head>
        <title>Resultado do Reajuste</title>
        <style>
          body { 
            font-family: Arial;
              background-color: #f2f2f2;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              width: 100%;
              height: 100vh;
          }

          .card {
              width: 400px;
              height: 400px;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }

          h2 { 
            color: #2c3e50; 
            text-align: center; 
          }
          p { 
            font-size: 1.1em; 
          }
          .valor { 
            color: #2e8b57; 
            font-size: 1.3em; 
            font-weight: bold; 
          }
          a { 
            display: block; 
            text-align: center; 
            margin-top: 20px; 
            color: #2e8b57; 
            text-decoration: none; 
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Resultado do Cálculo</h2>
          <p><b>Matrícula:</b> ${matriculaNum}</p>
          <p><b>Sexo:</b> ${sexo}</p>
          <p><b>Idade:</b> ${idadeNum} anos</p>
          <p><b>Tempo de empresa:</b> ${tempoEmpresa} anos</p>
          <p><b>Salário base:</b> R$ ${salarioNum.toFixed(2)}</p>
          <p><b>Reajuste:</b> ${(reajuste * 100).toFixed(1)}%</p>
          <hr />
          <p class="valor">Novo salário: R$ ${novoSalario.toFixed(2)}</p>
          <a href="/">Voltar</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
