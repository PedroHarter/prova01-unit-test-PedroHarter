/**
 * OficinaMecanica
 * ------------------------------------------------------------
 * Classe criada para praticar testes unitários.
 * Possui 20 métodos públicos com cenários variados:
 * - retorno de valores
 * - lançamento de exceções (toThrow)
 * - números decimais (toBeCloseTo)
 * - booleanos
 * - strings
 * - arrays
 * - mudança de estado
 *
 * Estado interno:
 * - veiculos: lista de { placa, modelo }
 * - estoque: mapa nome-da-peca -> quantidade
 * - servicos: lista de { descricao, valor }
 * - caixa: dinheiro acumulado
 * - aberta: se a oficina está aberta ou fechada
 */
class OficinaMecanica {
  /**
   * @param {string} nome Nome da oficina (obrigatório, não vazio).
   * @throws {Error} Se o nome for inválido.
   */
  constructor(nome) {
    if (typeof nome !== "string" || nome.trim() === "") {
      throw new Error("Nome inválido");
    }
    this.nome = nome.trim();
    this.veiculos = [];
    this.estoque = {};
    this.servicos = [];
    this.caixa = 0;
    this.aberta = true;
  }

  /**
   * Helper interno: valida que o valor é um número positivo.
   * (Não precisa ser testado diretamente — é usado por outros métodos.)
   */
  _validarNumeroPositivo(valor) {
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      throw new Error("Valor inválido");
    }
    if (valor <= 0) {
      throw new Error("O valor deve ser positivo");
    }
  }

  /**
   * Helper interno: normaliza a placa (sem espaços e em maiúsculas).
   */
  _normalizarPlaca(placa) {
    return placa.trim().toUpperCase();
  }

  // 1 -------------------------------------------------------------
  /**
   * Registra um veículo na oficina.
   * A placa é normalizada (ex.: "abc1234" vira "ABC1234").
   * @returns {number} Quantidade total de veículos registrados.
   * @throws Se placa/modelo forem inválidos ou o veículo já estiver registrado.
   */
  registrarVeiculo(placa, modelo) {
    if (typeof placa !== "string" || placa.trim() === "") {
      throw new Error("Placa inválida");
    }
    if (typeof modelo !== "string" || modelo.trim() === "") {
      throw new Error("Modelo inválido");
    }
    const placaNormalizada = this._normalizarPlaca(placa);
    if (this.veiculoRegistrado(placaNormalizada)) {
      throw new Error("Veículo já registrado");
    }
    this.veiculos.push({ placa: placaNormalizada, modelo: modelo.trim() });
    return this.veiculos.length;
  }

  // 2 -------------------------------------------------------------
  /**
   * Remove um veículo pela placa.
   * @returns {boolean} true se removeu com sucesso.
   * @throws Se o veículo não estiver registrado.
   */
  removerVeiculo(placa) {
    const placaNormalizada = this._normalizarPlaca(placa);
    const indice = this.veiculos.findIndex((v) => v.placa === placaNormalizada);
    if (indice === -1) {
      throw new Error("Veículo não encontrado");
    }
    this.veiculos.splice(indice, 1);
    return true;
  }

  // 3 -------------------------------------------------------------
  /**
   * Indica se um veículo está registrado.
   * @returns {boolean}
   */
  veiculoRegistrado(placa) {
    const placaNormalizada = this._normalizarPlaca(placa);
    return this.veiculos.some((v) => v.placa === placaNormalizada);
  }

  // 4 -------------------------------------------------------------
  /**
   * Conta quantos veículos estão registrados.
   * @returns {number}
   */
  contarVeiculos() {
    return this.veiculos.length;
  }

  // 5 -------------------------------------------------------------
  /**
   * Retorna uma cópia da lista de veículos.
   * @returns {Array<{placa: string, modelo: string}>}
   */
  listarVeiculos() {
    return [...this.veiculos];
  }

  // 6 -------------------------------------------------------------
  /**
   * Adiciona uma quantidade de determinada peça ao estoque.
   * @returns {number} Nova quantidade em estoque dessa peça.
   * @throws Se o nome for inválido ou a quantidade não for positiva.
   */
  adicionarPeca(nome, quantidade) {
    if (typeof nome !== "string" || nome.trim() === "") {
      throw new Error("Peça inválida");
    }
    this._validarNumeroPositivo(quantidade);
    const chave = nome.trim();
    this.estoque[chave] = (this.estoque[chave] || 0) + quantidade;
    return this.estoque[chave];
  }

  // 7 -------------------------------------------------------------
  /**
   * Usa (retira) uma quantidade de peça do estoque.
   * @returns {number} Quantidade restante em estoque.
   * @throws Se a quantidade for inválida ou não houver estoque suficiente.
   */
  usarPeca(nome, quantidade) {
    this._validarNumeroPositivo(quantidade);
    const chave = typeof nome === "string" ? nome.trim() : nome;
    const atual = this.estoque[chave] || 0;
    if (quantidade > atual) {
      throw new Error("Estoque insuficiente");
    }
    this.estoque[chave] = atual - quantidade;
    return this.estoque[chave];
  }

  // 8 -------------------------------------------------------------
  /**
   * Consulta a quantidade de uma peça no estoque.
   * @returns {number} 0 se a peça não existir.
   */
  consultarEstoque(nome) {
    const chave = typeof nome === "string" ? nome.trim() : nome;
    return this.estoque[chave] || 0;
  }

  // 9 -------------------------------------------------------------
  /**
   * Indica se há quantidade suficiente de uma peça.
   * @returns {boolean}
   */
  temPecaSuficiente(nome, quantidade) {
    return this.consultarEstoque(nome) >= quantidade;
  }

  // 10 ------------------------------------------------------------
  /**
   * Registra um serviço realizado.
   * @returns {number} Quantidade total de serviços registrados.
   * @throws Se a oficina estiver fechada, ou descrição/valor forem inválidos.
   */
  registrarServico(descricao, valor) {
    if (!this.aberta) {
      throw new Error("Oficina fechada");
    }
    if (typeof descricao !== "string" || descricao.trim() === "") {
      throw new Error("Descrição inválida");
    }
    this._validarNumeroPositivo(valor);
    this.servicos.push({ descricao: descricao.trim(), valor });
    return this.servicos.length;
  }

  // 11 ------------------------------------------------------------
  /**
   * Soma o valor de todos os serviços registrados.
   * @returns {number} 0 se não houver serviços.
   */
  calcularTotalServicos() {
    return this.servicos.reduce((soma, s) => soma + s.valor, 0);
  }

  // 12 ------------------------------------------------------------
  /**
   * Aplica um desconto (percentual) sobre o total de serviços.
   * @param {number} percentual Entre 0 e 100.
   * @returns {number} Total com desconto (pode ter decimais -> use toBeCloseTo).
   * @throws Se o percentual for inválido (fora de 0..100).
   */
  aplicarDesconto(percentual) {
    if (typeof percentual !== "number" || Number.isNaN(percentual)) {
      throw new Error("Percentual inválido");
    }
    if (percentual < 0 || percentual > 100) {
      throw new Error("Percentual inválido");
    }
    const total = this.calcularTotalServicos();
    return total - total * (percentual / 100);
  }

  // 13 ------------------------------------------------------------
  /**
   * Formata um valor no padrão brasileiro.
   * Ex.: 1234.5 -> "R$ 1.234,50"
   * @returns {string}
   * @throws Se o valor não for um número.
   */
  formatarValor(valor) {
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      throw new Error("Valor inválido");
    }
    const partes = valor.toFixed(2).split(".");
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${inteiro},${partes[1]}`;
  }

  // 14 ------------------------------------------------------------
  /**
   * Registra um pagamento, somando o valor ao caixa.
   * @returns {number} Novo valor do caixa.
   * @throws Se o valor não for positivo.
   */
  registrarPagamento(valor) {
    this._validarNumeroPositivo(valor);
    this.caixa += valor;
    return this.caixa;
  }

  // 15 ------------------------------------------------------------
  /**
   * Consulta o valor atual do caixa.
   * @returns {number}
   */
  consultarCaixa() {
    return this.caixa;
  }

  // 16 ------------------------------------------------------------
  /**
   * Abre a oficina.
   * @returns {boolean} Novo estado (true).
   */
  abrir() {
    this.aberta = true;
    return this.aberta;
  }

  // 17 ------------------------------------------------------------
  /**
   * Fecha a oficina.
   * @returns {boolean} Novo estado (false).
   */
  fechar() {
    this.aberta = false;
    return this.aberta;
  }

  // 18 ------------------------------------------------------------
  /**
   * Indica se a oficina está aberta.
   * @returns {boolean}
   */
  estaAberta() {
    return this.aberta;
  }

  // 19 ------------------------------------------------------------
  /**
   * Retorna o serviço mais caro já registrado.
   * @returns {{descricao: string, valor: number} | null} null se não houver serviços.
   */
  servicoMaisCaro() {
    if (this.servicos.length === 0) {
      return null;
    }
    return this.servicos.reduce((maisCaro, atual) =>
      atual.valor > maisCaro.valor ? atual : maisCaro
    );
  }

  // 20 ------------------------------------------------------------
  /**
   * Calcula a média dos valores dos serviços.
   * @returns {number} 0 se não houver serviços (pode ter decimais -> toBeCloseTo).
   */
  mediaValorServicos() {
    if (this.servicos.length === 0) {
      return 0;
    }
    return this.calcularTotalServicos() / this.servicos.length;
  }
}

// Exportação no formato CommonJS (padrão usado pelo Jest).
// Se sua prova usar ES Modules, troque por: export default OficinaMecanica;
module.exports = OficinaMecanica;