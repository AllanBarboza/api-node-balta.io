const repository = require("../repositories/product-repository");
const ValidationContract = require("../validators/fluent-validators");
const guid = require("guid");
const azure = require("azure-storage");
const config = require("../config");

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("Não foi possivel realizar a busca", e);
  }
};
exports.getBySlug = async (req, res, next) => {
  try {
    const data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("Não foi possivel realizar a busca", e);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("Não foi possivel realizar a busca", e);
  }
};
exports.getByTag = async (req, res, next) => {
  try {
    const data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("Não foi possivel realizar a busca", e);
  }
};

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.title,
    3,
    "O título deve conter pelo menos 3 caracteres"
  );
  contract.hasMinLen(
    req.body.slug,
    3,
    "O título deve conter pelo menos 3 caracteres"
  );
  contract.hasMinLen(
    req.body.description,
    3,
    "O título deve conter pelo menos 3 caracteres"
  );

  // Se os dados forem inválidos
  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  try {
    // Cria o Blob Service
    const blobSvc = azure.createBlobService(config.containerConnectionString);

    let filename = guid.raw().toString() + ".jpg";
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], "base64");

    // Salva a imagem
    await blobSvc.createBlockBlobFromText(
      "product-images",
      filename,
      buffer,
      {
        contentType: type,
      },
      function (error, result, response) {
        if (error) {
          filename = "default-product.png";
        }
      }
    );

    await repository.create({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      active: true,
      tags: req.body.tags,
      image:
        "https://nodestorebalta.blob.core.windows.net/product-images/" +
        filename,
    });
    res.status(201).send({
      message: "Produto cadastrado com sucesso!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Falha ao processar sua requisição",
    });
  }
};
exports.put = async (req, resp, next) => {
  const id = req.params.id;
  try {
    await repository.update(id, req.body);
    resp.send("Produto alterado com sucesso!");
  } catch (e) {
    resp.send("Não foi possivel alterar o produto!", e);
  }
};
exports.delete = async (req, resp, next) => {
  const id = req.body.id;
  try {
    await repository.delete(id);
    resp.send("Produto removido com sucesso!");
  } catch (e) {
    resp.send("Não foi possivel remover o produto!", e);
  }
};
