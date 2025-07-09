# Brev.ly - Encurtador de URLs

Este repositório contém o projeto **Brev.ly**, um encurtador de URLs desenvolvido como resultado da finalização do Módulo 1 da Faculdade de Tecnologia Rocketseat.

## Sobre o Projeto

O **Brev.ly** é uma aplicação completa (fullstack) que permite criar, listar, deletar e exportar links encurtados, além de acompanhar estatísticas de acesso. O objetivo é proporcionar uma experiência simples e eficiente para gerenciamento de URLs, com foco em usabilidade, responsividade e performance.

## Tecnologias Utilizadas

### Backend (`server`)
- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
- **Vite**: Ferramenta de build e desenvolvimento.
- **Drizzle ORM**: Mapeamento objeto-relacional para banco de dados.
- **Docker**: Containerização do ambiente de desenvolvimento.
- **Testes automatizados**: Cobertura de funcionalidades essenciais.
- **Exportação CSV**: Geração e disponibilização de relatórios via CDN.

### Frontend (`web`)
- **React**: Biblioteca para construção de interfaces de usuário.
- **Vite**: Bundler moderno para aplicações web.
- **TypeScript**: Tipagem estática no frontend.
- **Tailwind CSS** (deduzido pelo uso de classes utilitárias): Estilização rápida e responsiva.
- **Responsividade**: Layout adaptável para desktop e mobile.
- **Experiência do usuário**: Empty states, loaders e bloqueio de ações conforme estado da aplicação.

## Funcionalidades

- Criação de links encurtados com validação.
- Listagem de todas as URLs cadastradas.
- Deleção de links.
- Redirecionamento para a URL original.
- Incremento da contagem de acessos.
- Exportação de relatório em CSV com URL original, encurtada, contagem de acessos e data de criação.
- Interface SPA responsiva e amigável.

---

Cada parte do projeto possui seu próprio README com um checklist dos requisitos solicitados:

- [server/README.md](server/README.md)
- [web/README.md](web/README.md)

---

Projeto desenvolvido como parte do Módulo 1 da [Faculdade de Tecnologia Rocketseat](https://www.rocketseat.com.br/).
