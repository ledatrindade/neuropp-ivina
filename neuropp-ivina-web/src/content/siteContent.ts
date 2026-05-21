/*
 * Arquivo central de conteúdo do site.
 *
 * A ideia é facilitar futuras edições sem precisar mexer em muitas páginas.
 *
 * Procure pelos comentários:
 * - MUDE O TEXTO AQUI
 * - ADICIONE A IMAGEM AQUI
 * - MUDE O LINK AQUI
 */

export const siteContent = {
  brand: {
    // MUDE O TEXTO AQUI: nome que aparece no topo do site
    name: "NeuroPP",

    // MUDE O TEXTO AQUI: subtítulo da marca
    professionalName: "Ivina Peixoto",
  },

  contact: {
    // MUDE O TEXTO AQUI: número de WhatsApp com DDD
    whatsapp: "81999990000",

    // MUDE O LINK AQUI: link do Instagram da profissional
    instagram: "https://instagram.com/",

    // MUDE O TEXTO AQUI: endereço do atendimento
    address: "Espaço Virtudes — endereço completo do atendimento",

    // MUDE O TEXTO AQUI: bairro/cidade, caso queira mostrar separado
    locationShort: "Recife - PE",
  },

  home: {
    // MUDE O TEXTO AQUI
    badge: "Avaliação neuropsicopedagógica infantil",

    // MUDE O TEXTO AQUI
    title: "Cuidado, escuta e orientação para o desenvolvimento da aprendizagem.",

    // MUDE O TEXTO AQUI
    description:
      "Um espaço acolhedor para compreender dificuldades de aprendizagem, orientar famílias e construir caminhos possíveis para cada criança.",

    /*
     * ADICIONE A IMAGEM AQUI:
     *
     * Coloque a imagem dentro da pasta:
     * public/images
     *
     * Exemplo:
     * public/images/ivina-hero.jpg
     *
     * Depois coloque aqui:
     * heroImage: "/images/ivina-hero.jpg"
     *
     * Se deixar vazio, o site mostra um bloco temporário.
     */
    heroImage: "",

    cards: [
      {
        // MUDE O TEXTO AQUI
        title: "Entendimento da aprendizagem",

        // MUDE O TEXTO AQUI
        description:
          "A avaliação ajuda a observar aspectos cognitivos, escolares e comportamentais relacionados ao processo de aprender.",
      },
      {
        // MUDE O TEXTO AQUI
        title: "Acolhimento familiar",

        // MUDE O TEXTO AQUI
        description:
          "O responsável participa do processo, trazendo informações importantes sobre a rotina, a escola e as principais dificuldades percebidas.",
      },
      {
        // MUDE O TEXTO AQUI
        title: "Agendamento online",

        // MUDE O TEXTO AQUI
        description:
          "O responsável poderá escolher um horário disponível e confirmar a avaliação de forma simples e organizada.",
      },
    ],
  },

  about: {
    // MUDE O TEXTO AQUI
    title: "Sobre Ivina Peixoto",

    // MUDE O TEXTO AQUI
    description:
      "Ivina Peixoto atua na área de neuropsicopedagogia com uma abordagem acolhedora, cuidadosa e voltada para compreender o processo de aprendizagem da criança.",

    /*
     * ADICIONE A IMAGEM AQUI:
     * Exemplo: "/images/ivina-sobre.jpg"
     */
    image: "",
  },

  assessment: {
    // MUDE O TEXTO AQUI
    title: "Como funciona a avaliação",

    // MUDE O TEXTO AQUI
    description:
      "A avaliação neuropsicopedagógica busca compreender aspectos relacionados à aprendizagem, atenção, memória, raciocínio, linguagem e desenvolvimento escolar da criança.",

    steps: [
      "Anamnese com o responsável",
      "Levantamento da história da criança",
      "Observação de habilidades cognitivas e escolares",
      "Aplicação de atividades e instrumentos avaliativos",
      "Análise das informações coletadas",
      "Devolutiva e orientações para a família",
    ],
  },

  schedule: {
    // MUDE O TEXTO AQUI
    title: "Marcar avaliação",

    // MUDE O TEXTO AQUI
    description:
      "Escolha uma data disponível para iniciar o processo de agendamento da avaliação neuropsicopedagógica.",

    // MUDE O TEXTO AQUI
    notice:
      "Após escolher o horário, será necessário realizar o cadastro do responsável para confirmar o agendamento.",
  },
};