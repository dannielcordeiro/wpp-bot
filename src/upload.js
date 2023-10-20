const venom = require('venom-bot');
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs')
const uploadFile = require("./multer");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    venom
    .create('arthur',
        (base64Qr, asciiQR, attempts, urlCode, statusSession) => {
            if (statusSession != 'isLogged' && statusSession != 'waitForLogin') {
                var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                    response = {};

                if (matches.length !== 3) {
                    return new Error('Invalid input string');
                }

                fs.readFile('./src/login.html', 'utf8', (err, data) => {
                    if (err) {
                        console.error("Erro ao ler o arquivo:", err);
                        // res.status(500).send("Erro interno do servidor");
                        return;
                    }
                    let modifiedData = data.replace('<img id="dynamicImage" src=""',
                        '<img id="dynamicImage" src="' + "data:image/png;base64," + matches[2] + '"');

                    // res.writeHead(200, { 'content-type': 'text/html' })
                    res.send(modifiedData);
                });
            } 
        },


        undefined,
        { logQR: false }
    )


    .then((client) => {
        console.log("Sucesso");
        start(client);
    })
    .catch((erro) => {
        console.log(erro);
    });

  } catch (err) {
    res.status(500).send({
      message: `Não foi possivel realizar a operação: ${err}`,
    });
  }
};



function start(client) {
  readXlsxFile("../telefones.xlsx").then((rows) => {
    for (let i = 0; i <= rows.length; i++) {
      const nome = rows[i][0];
      const telefone = rows[i][1];

      console.log(nome, telefone);
      sendMessage(client, nome, telefone);
    }
  })

}

function sendMessage(client, nome, telefone) {
  const destino = '55' + telefone + '@c.us';
  console.log(destino);
  client
    .sendText(destino, 'Teste de Bot - Lista Telefônica \n Oi ' + nome)
    .then((result) => {
      console.log('Sucesso ao enviar para ' + nome + ' ' + telefone);
      return true;
    })
    .catch((erro) => {
      console.error('Erro ao enviar para ' + nome + ' ' + telefone);
      return false;
    });
}

module.exports = upload;