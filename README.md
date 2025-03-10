# Playwright SauceDemo Test Suite

<div align="center">
  <a href="#english">🇺🇸 English</a> |
  <a href="#portuguese">🇧🇷 Português</a>
</div>

---

<div id="english">

# Playwright SauceDemo Test Suite

This is a simple project, I made it to learn more about the use of fixtures in playwright and contains automated end-to-end tests for the SauceDemo e-commerce application using Playwright with TypeScript. The test suite covers some test scenarios including authentication, shopping processes, performance measurements, and visual testing.

## Project Structure

```
playwright-saucedemo/
├── .github/           # GitHub-related configurations
├── fixtures/
│   └── sauceFixtures.ts  # Custom test fixtures for SauceDemo
├── node_modules/      # Node.js dependencies
├── tests/
│   ├── visual.spec.ts-snapshots/  # Snapshot images for visual tests
│   ├── advanced.spec.ts           # Advanced test scenarios
│   ├── checkout-validation.spec.ts # Checkout form validation tests
│   ├── login.spec.ts              # Authentication tests
│   ├── performance.spec.ts        # Performance measurement tests
│   ├── product-details.spec.ts    # Product details page tests
│   ├── product.spec.ts            # Product listing page tests
│   ├── shopping.spec.ts           # Shopping flow tests
│   └── visual.spec.ts             # Visual testing scenarios
├── .gitignore         # Git ignore configurations
├── package-lock.json  # Dependency lock file
├── package.json       # Project metadata and dependencies
├── playwright.config.ts  # Playwright configuration
└── README.md          # Project documentation
```

## Features

The test suite includes:

1. **Custom Fixtures**: Reusable test fixtures with TypeScript typing to handle common operations such as login, checkout, and cart management.

2. **Allure Reporting**: Integration with Allure to generate comprehensive test reports with screenshots, parameters, and step-by-step execution logs.

3. **Performance Testing**: Measurement of loading times and user interactions with performance metrics collection.

4. **Visual Testing**: Screenshot comparison to detect visual regressions across browsers.

5. **Comprehensive Test Coverage**:
   - Authentication and user management
   - Product browsing and filtering
   - Shopping cart functionality
   - Checkout process validation
   - Error handling and form validation

## Key Test Scenarios

- **Login Tests**: Validation of user types (standard, locked, problem, performance).
- **Shopping Flow**: Complete end-to-end purchase flow from product selection to order confirmation.
- **Form Validation**: Field validation on checkout pages.
- **Performance Measurement**: Comparison of login times between standard users and performance-glitch users.
- **Visual Testing**: Snapshot testing across browsers to ensure UI consistency.
- **Advanced Scenarios**: Network condition simulation, multi-item cart testing, and dynamic product navigation.

## Setup and Usage

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/playwright-saucedemo.git
cd playwright-saucedemo

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test login.spec.ts

# Run tests with UI mode
npx playwright test --ui

# Generate and open Allure report
npm run report

# Run tests and generate report in one command
npm run test:report
```

## Fixtures

The project uses custom fixtures defined in `sauceFixtures.ts` to encapsulate common operations:

- `userCredentials`: Predefined user accounts for testing
- `homePage`: Basic page navigation to the home page
- `loggedInPage`: Pre-authenticated page with standard user
- `cartWithItems`: Page with items already added to cart
- `loginAs`: Function to log in with specific user types
- `checkoutPage`: Page navigated to checkout flow
- `productDetailsPage`: Function to access product details
- `orderCompletePage`: Page with completed order
- `addMultipleItemsToCart`: Function to add a specific number of items to cart
- `performanceMetrics`: Utilities for measuring performance

## Reporting

The test suite uses Allure for comprehensive reporting:

- Test executions are organized by epics and features
- Screenshots are captured at critical points
- Step-by-step execution logs are included
- Performance metrics are recorded
- Test parameters are documented


</div>

---

<div id="portuguese">

# Suite de Testes Playwright para SauceDemo

Este é um projeto simples, foi feito para entender melhor o uso de fixtures no playwright e contém testes automatizados end-to-end para a aplicação de e-commerce SauceDemo utilizando Playwright com TypeScript. A suite de testes abrange cenários como autenticação, processos de compra, medições de desempenho e testes visuais.

## Estrutura do Projeto

```
playwright-saucedemo/
├── .github/           # Configurações relacionadas ao GitHub
├── fixtures/
│   └── sauceFixtures.ts  # Fixtures de teste personalizadas para SauceDemo
├── node_modules/      # Dependências Node.js
├── tests/
│   ├── visual.spec.ts-snapshots/  # Imagens de snapshot para testes visuais
│   ├── advanced.spec.ts           # Cenários de teste avançados
│   ├── checkout-validation.spec.ts # Testes de validação do formulário de checkout
│   ├── login.spec.ts              # Testes de autenticação
│   ├── performance.spec.ts        # Testes de medição de desempenho
│   ├── product-details.spec.ts    # Testes da página de detalhes do produto
│   ├── product.spec.ts            # Testes da página de listagem de produtos
│   ├── shopping.spec.ts           # Testes de fluxo de compras
│   └── visual.spec.ts             # Cenários de teste visual
├── .gitignore         # Configurações de ignore do Git
├── package-lock.json  # Arquivo de lock de dependências
├── package.json       # Metadados e dependências do projeto
├── playwright.config.ts  # Configuração do Playwright
└── README.md          # Documentação do projeto
```

## Funcionalidades

A suite de testes inclui:

1. **Fixtures Personalizadas**: Fixtures de teste reutilizáveis com tipagem TypeScript para lidar com operações comuns como login, checkout e gerenciamento de carrinho.

2. **Relatórios Allure**: Integração com Allure para gerar relatórios abrangentes de testes com capturas de tela, parâmetros e logs de execução passo a passo.

3. **Testes de Desempenho**: Medição de tempos de carregamento e interações do usuário com coleta de métricas de desempenho.

4. **Testes Visuais**: Comparação de capturas de tela para detectar regressões visuais entre navegadores.

5. **Cobertura Abrangente de Testes**:
   - Autenticação e gerenciamento de usuários
   - Navegação e filtragem de produtos
   - Funcionalidade do carrinho de compras
   - Validação do processo de checkout
   - Tratamento de erros e validação de formulários

## Principais Cenários de Teste

- **Testes de Login**: Validação de vários tipos de usuários (padrão, bloqueado, problemático, com falhas de desempenho).
- **Fluxo de Compras**: Fluxo completo de compra end-to-end, da seleção do produto à confirmação do pedido.
- **Validação de Formulários**: Validação de campos nas páginas de checkout.
- **Medição de Desempenho**: Comparação de tempos de login entre usuários padrão e usuários com falhas de desempenho.
- **Testes Visuais**: Testes de snapshot em diferentes navegadores para garantir a consistência da interface.
- **Cenários Avançados**: Simulação de condições de rede, testes de carrinho com múltiplos itens e navegação dinâmica de produtos.

## Configuração e Uso

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/playwright-saucedemo.git
cd playwright-saucedemo

# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install
```

### Executando Testes

```bash
# Executar todos os testes
npx playwright test

# Executar arquivo de teste específico
npx playwright test login.spec.ts

# Executar testes no modo UI
npx playwright test --ui

# Gerar e abrir relatório Allure
npm run report

# Executar testes e gerar relatório em um único comando
npm run test:report
```

## Fixtures

O projeto utiliza fixtures personalizadas definidas em `sauceFixtures.ts` para encapsular operações comuns:

- `userCredentials`: Contas de usuário predefinidas para testes
- `homePage`: Navegação básica para a página inicial
- `loggedInPage`: Página pré-autenticada com usuário padrão
- `cartWithItems`: Página com itens já adicionados ao carrinho
- `loginAs`: Função para fazer login com tipos específicos de usuário
- `checkoutPage`: Página navegada para o fluxo de checkout
- `productDetailsPage`: Função para acessar detalhes do produto
- `orderCompletePage`: Página com pedido concluído
- `addMultipleItemsToCart`: Função para adicionar um número específico de itens ao carrinho
- `performanceMetrics`: Utilitários para medir desempenho

## Relatórios

A suite de testes utiliza Allure para relatórios abrangentes:

- Execuções de teste são organizadas por épicos e funcionalidades
- Capturas de tela são feitas em pontos críticos
- Logs de execução passo a passo são incluídos
- Métricas de desempenho são registradas
- Parâmetros de teste são documentados

</div>
```
