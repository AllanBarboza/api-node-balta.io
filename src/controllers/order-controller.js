const repository = require("../repositories/order-repository");
const guid = require("guid");

exports.post = async (req, res, next) => {
  let data = req.body;

  try {
    await repository.create({
      customer: data.customer,
      number: (data.number = guid.raw().substring(0, 6)),
      items: data.items,
    });
    res.status(201).send({ message: "Pedido cadastrado com sucesso!" });
  } catch (e) {
    res
      .status(400)
      .send({ message: "Não foi possivel cadastrar o pedido!", data: e });
  }
};

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("Não foi possivel realizar a busca", e);
  }
};
