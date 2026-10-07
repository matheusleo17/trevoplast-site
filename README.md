# Trevoplast – proposta de site

Site estático (HTML + CSS), sem build. Funciona abrindo o `index.html` direto no navegador.

## Estrutura

```
index.html     conteúdo da página
style.css      estilos (cores e fontes ficam nas variáveis do topo, em :root)
vercel.json    configuração da Vercel
img/           logo, favicon e, depois, as fotos da empresa
```

## Pendências antes de publicar para valer

- Trocar o link do WhatsApp (`href="#"` nos botões da faixa de contato) por `https://wa.me/55DDDNUMERO?text=Olá...`
- Colocar as fotos reais em `img/` (estoque, fachada, produtos) e usar `<img src="img/arquivo.jpg" alt="...">` no hero e nas categorias.
- Marcas: o carrossel (seção "As melhores marcas") hoje usa texto. Para usar logos, coloque os arquivos em `img/marcas/` e troque o `<b>`/`<i>` de cada `<li>` por `<img src="img/marcas/tigre.png" alt="Tigre" height="36">`. Faça isso nas duas listas (a segunda é a cópia que fecha o loop).
- Remover o aviso "Proposta de redesign" do rodapé.

## Rodar local (Visual Studio / VS Code)

Abra a pasta e use a extensão Live Server, ou rode `npx serve .` na pasta.

## Publicar na Vercel

Opção 1 – pelo GitHub:
1. Crie um repositório e envie estes arquivos.
2. Em vercel.com, "Add New > Project", importe o repositório.
3. Framework Preset: "Other". Deixe Build Command e Output Directory vazios. Clique em Deploy.

Opção 2 – pelo terminal:
```
npm i -g vercel
vercel
```
Responda as perguntas com as opções padrão. Para a versão final: `vercel --prod`.
