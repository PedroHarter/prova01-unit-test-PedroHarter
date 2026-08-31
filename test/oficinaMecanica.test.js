const OficinaMecanica = require("../src/oficinaMecanica");

describe("OficinaMecanica", () => {
  let oficina;

  beforeEach(() => {
    oficina = new OficinaMecanica("Auto Center");
  });

  // ----------------------------------------------------------------
  // Construtor
  // ----------------------------------------------------------------
  describe("construtor", () => {
    test("deve criar a oficina com estado inicial e nome sem espacos", () => {
      // Arrange & Act
      const nova = new OficinaMecanica("  Oficina do Ze  ");

      // Assert
      expect(nova.nome).toBe("Oficina do Ze");
      expect(nova.contarVeiculos()).toBe(0);
      expect(nova.consultarCaixa()).toBe(0);
      expect(nova.estaAberta()).toBe(true);
    });

    test("deve lancar erro quando o nome for invalido", () => {
      // Arrange, Act & Assert
      expect(() => new OficinaMecanica("")).toThrow("Nome inválido");
      expect(() => new OficinaMecanica("   ")).toThrow("Nome inválido");
      expect(() => new OficinaMecanica(123)).toThrow("Nome inválido");
      expect(() => new OficinaMecanica(null)).toThrow("Nome inválido");
    });
  });

  // ----------------------------------------------------------------
  // 1) registrarVeiculo
  // ----------------------------------------------------------------
  describe("registrarVeiculo", () => {
    test("deve registrar um veiculo normalizando a placa e retornar o total", () => {
      // Act
      const total = oficina.registrarVeiculo("abc1234", "Gol");

      // Assert
      expect(total).toBe(1);
      expect(oficina.veiculoRegistrado("ABC1234")).toBe(true);
    });

    test("deve lancar erro quando placa ou modelo forem invalidos", () => {
      // Act & Assert
      expect(() => oficina.registrarVeiculo("", "Gol")).toThrow("Placa inválida");
      expect(() => oficina.registrarVeiculo("ABC1234", "")).toThrow("Modelo inválido");
    });

    test("deve lancar erro ao registrar veiculo ja existente", () => {
      // Arrange
      oficina.registrarVeiculo("abc1234", "Gol");

      // Act & Assert
      expect(() => oficina.registrarVeiculo("ABC1234", "Palio")).toThrow(
        "Veículo já registrado"
      );
    });
  });

  // ----------------------------------------------------------------
  // 2) removerVeiculo
  // ----------------------------------------------------------------
  describe("removerVeiculo", () => {
    test("deve remover um veiculo registrado independente da caixa da placa", () => {
      // Arrange
      oficina.registrarVeiculo("abc1234", "Gol");

      // Act
      const removido = oficina.removerVeiculo("abc1234");

      // Assert
      expect(removido).toBe(true);
      expect(oficina.contarVeiculos()).toBe(0);
    });

    test("deve lancar erro ao remover veiculo inexistente", () => {
      // Act & Assert
      expect(() => oficina.removerVeiculo("XYZ0000")).toThrow(
        "Veículo não encontrado"
      );
    });
  });

  // ----------------------------------------------------------------
  // 3) veiculoRegistrado
  // ----------------------------------------------------------------
  describe("veiculoRegistrado", () => {
    test("deve indicar corretamente se um veiculo esta registrado", () => {
      // Arrange
      oficina.registrarVeiculo("abc1234", "Gol");

      // Act & Assert
      expect(oficina.veiculoRegistrado("abc1234")).toBe(true);
      expect(oficina.veiculoRegistrado("ZZZ9999")).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // 4) contarVeiculos
  // ----------------------------------------------------------------
  describe("contarVeiculos", () => {
    test("deve contar a quantidade de veiculos registrados", () => {
      // Arrange
      oficina.registrarVeiculo("abc1234", "Gol");
      oficina.registrarVeiculo("def5678", "Palio");

      // Act & Assert
      expect(oficina.contarVeiculos()).toBe(2);
    });
  });

  // ----------------------------------------------------------------
  // 5) listarVeiculos
  // ----------------------------------------------------------------
  describe("listarVeiculos", () => {
    test("deve retornar a lista de veiculos", () => {
      // Arrange
      oficina.registrarVeiculo("abc1234", "Gol");

      // Act
      const lista = oficina.listarVeiculos();

      // Assert
      expect(lista).toEqual([{ placa: "ABC1234", modelo: "Gol" }]);
    });

    test("deve retornar uma copia que nao afeta o estado interno", () => {
      // Arrange
      oficina.registrarVeiculo("abc1234", "Gol");

      // Act
      const lista = oficina.listarVeiculos();
      lista.push({ placa: "FAKE", modelo: "Falso" });

      // Assert
      expect(oficina.contarVeiculos()).toBe(1);
    });
  });

  // ----------------------------------------------------------------
  // 6) adicionarPeca
  // ----------------------------------------------------------------
  describe("adicionarPeca", () => {
    test("deve adicionar pecas e acumular a quantidade", () => {
      // Act
      const primeira = oficina.adicionarPeca("oleo", 5);
      const segunda = oficina.adicionarPeca("oleo", 3);

      // Assert
      expect(primeira).toBe(5);
      expect(segunda).toBe(8);
    });

    test("deve lancar erro quando o nome da peca for invalido", () => {
      // Act & Assert
      expect(() => oficina.adicionarPeca("", 5)).toThrow("Peça inválida");
    });

    test("deve lancar erro quando a quantidade nao for positiva", () => {
      // Act & Assert
      expect(() => oficina.adicionarPeca("oleo", 0)).toThrow(
        "O valor deve ser positivo"
      );
      expect(() => oficina.adicionarPeca("oleo", "muito")).toThrow(
        "Valor inválido"
      );
    });
  });

  // ----------------------------------------------------------------
  // 7) usarPeca
  // ----------------------------------------------------------------
  describe("usarPeca", () => {
    test("deve retirar pecas do estoque e retornar o restante", () => {
      // Arrange
      oficina.adicionarPeca("filtro", 10);

      // Act
      const restante = oficina.usarPeca("filtro", 4);

      // Assert
      expect(restante).toBe(6);
    });

    test("deve lancar erro quando nao houver estoque suficiente", () => {
      // Arrange
      oficina.adicionarPeca("filtro", 2);

      // Act & Assert
      expect(() => oficina.usarPeca("filtro", 5)).toThrow("Estoque insuficiente");
    });

    test("deve lancar erro quando a quantidade for invalida", () => {
      // Act & Assert
      expect(() => oficina.usarPeca("filtro", -1)).toThrow(
        "O valor deve ser positivo"
      );
    });
  });

  // ----------------------------------------------------------------
  // 8) consultarEstoque
  // ----------------------------------------------------------------
  describe("consultarEstoque", () => {
    test("deve retornar a quantidade da peca em estoque", () => {
      // Arrange
      oficina.adicionarPeca("pneu", 7);

      // Act & Assert
      expect(oficina.consultarEstoque("pneu")).toBe(7);
    });

    test("deve retornar 0 quando a peca nao existir", () => {
      // Act & Assert
      expect(oficina.consultarEstoque("inexistente")).toBe(0);
    });
  });

  // ----------------------------------------------------------------
  // 9) temPecaSuficiente
  // ----------------------------------------------------------------
  describe("temPecaSuficiente", () => {
    test("deve indicar se ha quantidade suficiente de uma peca", () => {
      // Arrange
      oficina.adicionarPeca("vela", 4);

      // Act & Assert
      expect(oficina.temPecaSuficiente("vela", 4)).toBe(true);
      expect(oficina.temPecaSuficiente("vela", 5)).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // 10) registrarServico
  // ----------------------------------------------------------------
  describe("registrarServico", () => {
    test("deve registrar um servico e retornar o total de servicos", () => {
      // Act
      const total = oficina.registrarServico("Troca de oleo", 120);

      // Assert
      expect(total).toBe(1);
    });

    test("deve lancar erro ao registrar servico com a oficina fechada", () => {
      // Arrange
      oficina.fechar();

      // Act & Assert
      expect(() => oficina.registrarServico("Troca de oleo", 120)).toThrow(
        "Oficina fechada"
      );
    });

    test("deve lancar erro quando descricao ou valor forem invalidos", () => {
      // Act & Assert
      expect(() => oficina.registrarServico("", 120)).toThrow(
        "Descrição inválida"
      );
      expect(() => oficina.registrarServico("Troca de oleo", 0)).toThrow(
        "O valor deve ser positivo"
      );
    });
  });

  // ----------------------------------------------------------------
  // 11) calcularTotalServicos
  // ----------------------------------------------------------------
  describe("calcularTotalServicos", () => {
    test("deve retornar 0 quando nao houver servicos", () => {
      // Act & Assert
      expect(oficina.calcularTotalServicos()).toBe(0);
    });

    test("deve somar o valor de todos os servicos", () => {
      // Arrange
      oficina.registrarServico("Servico A", 10.1);
      oficina.registrarServico("Servico B", 20.2);

      // Act & Assert
      expect(oficina.calcularTotalServicos()).toBeCloseTo(30.3, 2);
    });
  });

  // ----------------------------------------------------------------
  // 12) aplicarDesconto
  // ----------------------------------------------------------------
  describe("aplicarDesconto", () => {
    test("deve aplicar um desconto percentual sobre o total de servicos", () => {
      // Arrange
      oficina.registrarServico("Servico A", 10.1);
      oficina.registrarServico("Servico B", 20.2);

      // Act
      const comDesconto = oficina.aplicarDesconto(50);

      // Assert
      expect(comDesconto).toBeCloseTo(15.15, 2);
    });

    test("deve lancar erro quando o percentual for invalido", () => {
      // Act & Assert
      expect(() => oficina.aplicarDesconto(-1)).toThrow("Percentual inválido");
      expect(() => oficina.aplicarDesconto(101)).toThrow("Percentual inválido");
      expect(() => oficina.aplicarDesconto("dez")).toThrow("Percentual inválido");
    });
  });

  // ----------------------------------------------------------------
  // 13) formatarValor
  // ----------------------------------------------------------------
  describe("formatarValor", () => {
    test("deve formatar valores no padrao brasileiro", () => {
      // Act & Assert
      expect(oficina.formatarValor(1234.5)).toBe("R$ 1.234,50");
      expect(oficina.formatarValor(0)).toBe("R$ 0,00");
      expect(oficina.formatarValor(1000000)).toBe("R$ 1.000.000,00");
    });

    test("deve lancar erro quando o valor nao for um numero", () => {
      // Act & Assert
      expect(() => oficina.formatarValor("100")).toThrow("Valor inválido");
      expect(() => oficina.formatarValor(NaN)).toThrow("Valor inválido");
    });
  });

  // ----------------------------------------------------------------
  // 14) registrarPagamento
  // ----------------------------------------------------------------
  describe("registrarPagamento", () => {
    test("deve somar o pagamento ao caixa e retornar o novo valor", () => {
      // Act
      const primeiro = oficina.registrarPagamento(100);
      const segundo = oficina.registrarPagamento(50);

      // Assert
      expect(primeiro).toBe(100);
      expect(segundo).toBe(150);
    });

    test("deve lancar erro quando o valor do pagamento nao for positivo", () => {
      // Act & Assert
      expect(() => oficina.registrarPagamento(0)).toThrow(
        "O valor deve ser positivo"
      );
    });
  });

  // ----------------------------------------------------------------
  // 15) consultarCaixa
  // ----------------------------------------------------------------
  describe("consultarCaixa", () => {
    test("deve retornar o valor atual do caixa", () => {
      // Arrange
      oficina.registrarPagamento(250);

      // Act & Assert
      expect(oficina.consultarCaixa()).toBe(250);
    });
  });

  // ----------------------------------------------------------------
  // 16, 17, 18) abrir / fechar / estaAberta
  // ----------------------------------------------------------------
  describe("controle de abertura", () => {
    test("deve fechar a oficina", () => {
      // Act
      const estado = oficina.fechar();

      // Assert
      expect(estado).toBe(false);
      expect(oficina.estaAberta()).toBe(false);
    });

    test("deve abrir a oficina", () => {
      // Arrange
      oficina.fechar();

      // Act
      const estado = oficina.abrir();

      // Assert
      expect(estado).toBe(true);
      expect(oficina.estaAberta()).toBe(true);
    });
  });

  // ----------------------------------------------------------------
  // 19) servicoMaisCaro
  // ----------------------------------------------------------------
  describe("servicoMaisCaro", () => {
    test("deve retornar null quando nao houver servicos", () => {
      // Act & Assert
      expect(oficina.servicoMaisCaro()).toBeNull();
    });

    test("deve retornar o servico de maior valor", () => {
      // Arrange
      oficina.registrarServico("Barato", 50);
      oficina.registrarServico("Caro", 300);
      oficina.registrarServico("Medio", 150);

      // Act
      const maisCaro = oficina.servicoMaisCaro();

      // Assert
      expect(maisCaro).toEqual({ descricao: "Caro", valor: 300 });
    });
  });

  // ----------------------------------------------------------------
  // 20) mediaValorServicos
  // ----------------------------------------------------------------
  describe("mediaValorServicos", () => {
    test("deve retornar 0 quando nao houver servicos", () => {
      // Act & Assert
      expect(oficina.mediaValorServicos()).toBe(0);
    });

    test("deve calcular a media dos valores dos servicos", () => {
      // Arrange
      oficina.registrarServico("Servico A", 100);
      oficina.registrarServico("Servico B", 50);
      oficina.registrarServico("Servico C", 25);

      // Act & Assert
      expect(oficina.mediaValorServicos()).toBeCloseTo(58.33, 2);
    });
  });
});