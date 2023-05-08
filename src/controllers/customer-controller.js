const repository = require("../repositories/customer-repository");
const ValidationContract = require("../validators/fluent-validators");

const md5 = require("md5");

exports.post = async (req, res, next) => {
  contract = new ValidationContract();
  contract.isRequired(req.body.name, "O name é obrigatorio");
  contract.isRequired(req.body.email, "O email é obrigatorio");
  contract.isEmail(req.body.email, "O email não é valido");
  contract.isRequired(req.body.password, "O password é obrigatorio");

  if (!contract.isValid()) {
    res.status(400).send(contract.errors());
    return;
  }

  try {
    await repository.create({
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY),
    });
    res.status(201).send({ message: "Cliente cadastro com sucesso!" });
  } catch (e) {
    res
      .status(400)
      .send({ message: "Não foi possivel cadastrar o cliente!", data: e });
  }
};
