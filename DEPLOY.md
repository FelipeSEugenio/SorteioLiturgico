# 🚀 Como Publicar o Sorteio Litúrgico

## 📁 Arquivos do Projeto

Seu projeto está pronto! Aqui estão os arquivos principais:

### Arquivos Principais
- **<filepath>index.html</filepath>** - Página principal do aplicativo
- **<filepath>script.js</filepath>** - Toda a lógica JavaScript
- **<filepath>README.md</filepath>** - Documentação completa
- **<filepath>.imgs/</filepath>** - Imagens de Nossa Senhora Aparecida

## 🌐 Como Publicar Online

### Opção 1: GitHub Pages (Gratuito)
```bash
# 1. Crie um repositório no GitHub
# 2. Faça push dos arquivos:
git remote add origin https://github.com/SEU-USUARIO/sorteio-liturgico.git
git branch -M main
git push -u origin main

# 3. No GitHub:
# Settings > Pages > Source: Deploy from a branch
# Branch: main / (root)
```

### Opção 2: Netlify (Gratuito + Fácil)
1. Acesse [netlify.com](https://netlify.com)
2. Faça login com GitHub
3. Clique em "New site from Git"
4. Conecte seu repositório
5. Deploy automático!

**Vantagens Netlify:**
- Deploy automático a cada commit
- Preview de mudanças
- Certificados SSL gratuitos
- Domínio personalizado

### Opção 3: Vercel (Gratuito + Rápido)
1. Acesse [vercel.com](https://vercel.com)
2. Login com GitHub
3. "New Project"
4. Import do repositório
5. Deploy instantâneo!

### Opção 4: Firebase Hosting (Google)
1. Instale Firebase CLI: `npm install -g firebase-tools`
2. `firebase init hosting`
3. `firebase deploy`

## 📱 Testando no Celular

### Opção A: Servidor Local
```bash
# Instale Python (já vem no Mac/Linux)
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Opção B: Live Server (VS Code)
1. Instale extensão "Live Server"
2. Clique com botão direito em index.html
3. "Open with Live Server"

## 🎨 Personalização Rápida

### Alterar Cores
No arquivo `index.html`, localize a seção:
```javascript
colors: {
    'primary': {
        500: '#2563EB', // Sua cor azul
    },
    // ...
}
```

### Alterar Logo
Substitua a imagem em `imgs/logo_aparecida_1.png`

### Alterar Textos
No arquivo `script.js`, linha ~150:
```javascript
const assignments = [
    { position: 'Sua 1ª Leitura', type: 'reading' },
    // ...
];
```

## 🛠️ Funcionalidades Avançadas

### API de Versículos Bíblicos
O código já inclui integração com bible-api.com. Para ativar:
1. Adicione campos na interface para mostrar versículos
2. Chame `fetchBibleVerse()` no script

### PWA (Progressive Web App)
Para transformar em app instalável:

1. Crie `manifest.json`:
```json
{
  "name": "Sorteio Litúrgico",
  "short_name": "Sorteio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8F9FA",
  "theme_color": "#2563EB",
  "icons": [...]
}
```

2. Adicione meta tags no HTML
3. Registre Service Worker

## 📊 Analytics (Opcional)

### Google Analytics
```html
<!-- Adicione no <head> do index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Manutenção

### Atualizações
```bash
# Faça mudanças nos arquivos
git add .
git commit -m "feat: Nova funcionalidade"
git push
```

### Backup
- Todos os arquivos estão no Git
- Imagens salvas em `imgs/`
- Dados não são persistidos (apenas temporários)

## 🎯 Próximos Passos Sugeridos

1. **Publicar online** (Netlify recomendado)
2. **Testar no celular**
3. **Personalizar cores/logos**
4. **Configurar domínio personalizado**
5. **Adicionar analytics**
6. **Criar PWA**

## 💡 Dicas Importantes

- **Teste sempre no celular** antes de publicar
- **Use imagens otimizadas** para carregamento rápido
- **Mantenha o Git atualizado** para não perder trabalho
- **Configure HTTPS** para segurança
- **Faça backup regular** dos dados importantes

## 🆘 Suporte

Se precisar de ajuda:
1. Consulte o README.md
2. Verifique o console do navegador (F12)
3. Teste em diferentes dispositivos
4. Verifique a conexão com internet

---

**🎉 Seu Sorteio Litúrgico está pronto para abençoar muitas comunidades!**

*"Enviai, ó Deus, os vossos operários às vossas vinhas"* - Lucas 10:2