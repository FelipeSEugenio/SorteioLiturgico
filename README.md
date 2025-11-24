# Sorteio Litúrgico - Nossa Senhora Aparecida

Um aplicativo web elegante e interativo para realizar sorteios de leituras e monições do Caminho Neocatecumenal, com foco na experiência mobile-first e design inspirado em Nossa Senhora Aparecida.

## ✨ Funcionalidades

### 🎲 Sorteio Inteligente
- **Distribuição justa**: Garante que cada pessoa seja sorteada pelo menos uma vez
- **4 posiciones litúrgicas**: 3 leituras + 1 evangelho
- **4 monições**: Incluindo monição do evangelho
- **Validação automática**: Mínimo 2, máximo 7 participantes

### 📱 Design Mobile-First
- **Interface responsiva**: Otimizada para dispositivos móveis
- **Animações suaves**: Feedback visual durante as interações
- **Tema religioso**: Inspirado em Nossa Senhora Aparecida
- **Cores elegantes**: Azul céu, dourado e branco

### 📖 Leituras Opcionais
- **Dados personalizáveis**: Insira livro, capítulo e versículo
- **Referência completa**: Exibe a referência bíblica no resultado
- **API bíblica**: Integração com APIs gratuitas de versículos (em desenvolvimento)

### 📸 Compartilhamento
- **Screenshot automático**: Capture o resultado como imagem
- **Download direto**: Salva como PNG de alta qualidade
- **Timestamp**: Nome do arquivo inclui data atual

## 🎨 Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Primário** | `#2563EB` | Links, ícones, bordas de foco |
| **Acento** | `#FDE68A → #D97706` | Botão principal (gradiente dourado) |
| **Fundo** | `#F8F9FA` | Fundo da página |
| **Cards** | `#FFFFFF` | Fundo dos componentes |

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **Tailwind CSS**: Framework CSS utilitário
- **JavaScript Vanilla**: Lógica da aplicação
- **Lucide Icons**: Ícones modernos
- **html2canvas**: Geração de screenshots

## 📱 Experiência do Usuário

### Fluxo Principal
1. **Adicionar Participantes**: Digite nomes e pressione Enter
2. **Definir Leituras** (opcional): Expanda o painel e insira dados bíblicos
3. **Realizar Sorteio**: Clique no botão dourado
4. **Ver Resultado**: Acompanhe a animação dos resultados
5. **Salvar Imagem**: Clique em "Salvar Imagem"

### Atalhos de Teclado
- **Enter** no campo de nomes: Adiciona participante
- **Ctrl/Cmd + Enter**: Realiza sorteio (quando disponível)
- **Ctrl/Cmd + R**: Reseta aplicação (com confirmação)

### Animações
- **Fade In**: Elementos aparecem suavemente
- **Slide Up**: Resultados deslizam para cima
- **Bounce In**: Cards principais com efeito de bounce
- **Pulse Gold**: Botão principal pulsa suavemente

## 🎯 Algoritmo de Sorteio

O algoritmo garante distribuição justa entre os participantes:

1. **Embaralhamento**: Lista de participantes é embaralhada
2. **Distribuição sequencial**: Leituras são atribuídas na ordem
3. **Monições rotativas**: Distribuição cíclica para monições
4. **Múltiplas atribuições**: Algumas pessoas podem ter mais de uma função

## 📂 Estrutura de Arquivos

```
sorteio-liturgico/
├── index.html          # Página principal
├── script.js           # Lógica JavaScript
├── README.md           # Documentação
└── imgs/               # Imagens do projeto
    ├── logo_aparecida_1.png
    ├── background_aparecida_*.jpg
    └── nossa_senhora_aparecida_*.jpg
```

## 🚀 Como Usar

### Instalação Local
```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd sorteio-liturgico

# Abra no navegador
open index.html
```

### Uso Online
O aplicativo pode ser hospedado em qualquer serviço de hospedagem web:
- **Netlify**: Deploy automático via Git
- **Vercel**: Deploy com preview
- **GitHub Pages**: Hospedagem gratuita

## 🔧 Personalização

### Cores
Altere as cores no arquivo `index.html`, seção de configuração do Tailwind:

```javascript
colors: {
    'primary': {
        100: '#EBF2FF',
        500: '#2563EB',
        700: '#1D4ED8',
    },
    // ...
}
```

### Funções Litúrgicas
Modifique os títulos das posições em `script.js`:

```javascript
const assignments = [
    { position: '1ª Leitura', type: 'reading' },
    { position: '2ª Leitura', type: 'reading' },
    // ...
];
```

## 🔌 APIs Integradas

### Bible API (bible-api.com)
API gratuita para buscar versículos bíblicos:
```javascript
const response = await fetch(`https://bible-api.com/${reference}`);
const data = await response.json();
```

## 📈 Funcionalidades Futuras

- [ ] **Múltiplas comunidades**: Suporte para diferentes paróquias
- [ ] **Histórico de sorteios**: Salvar sorteios anteriores
- [ ] **Compartilhamento**: Enviar resultado via WhatsApp/email
- [ ] **PWA**: Aplicativo instalável no celular
- [ ] **Temas**: Múltiplos temas religiosos
- [ ] **Sincronização**: Sorteios sincronizados entre dispositivos
- [ ] **Impressão**: Layout otimizado para impressão
- [ ] **Estatísticas**: Relatórios de participação

## 🤝 Contribuições

Este projeto é aberto para melhorias! Algumas áreas que podem ser melhoradas:

1. **Performance**: Otimização para dispositivos mais lentos
2. **Acessibilidade**: Melhor suporte a leitores de tela
3. **Internacionalização**: Suporte a múltiplos idiomas
4. **Testes**: Implementação de testes automatizados
5. **API própria**: Sistema próprio para dados litúrgicos

## 📞 Suporte

Para reportar bugs ou solicitar funcionalidades:

1. **Issue no GitHub**: Para problemas técnicos
2. **Email**: Para questões gerais
3. **Documentação**: Consulte este README

## 🙏 Agradecimentos

- **Nossa Senhora Aparecida**: Proteção e inspiração
- **Caminho Neocatecumenal**: Fundamento litúrgico
- **Comunidade Católica**: Feedback e sugestões
- **Desenvolvedores Open Source**: Ferramentas utilizadas

## 📄 Licença

Este projeto está sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para a comunidade católica**

*"E eis que todas as gerações me chamarão bem-aventurada"* - São Lucas 1:48