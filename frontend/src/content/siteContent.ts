/*
 * Arquivo central de conteúdo do site.
 *
 * Procure pelos comentários:
 * - MUDE O TEXTO AQUI
 * - ADICIONE A IMAGEM AQUI
 * - MUDE O LINK AQUI
 */

export const siteContent = {
  brand: {
    name: "NeuroPP",
    professionalName: "Ivina Peixoto",
  },

  contact: {
    // MUDE O TEXTO AQUI: número de WhatsApp com DDD
    whatsapp: "81999999999",

    // MUDE O TEXTO AQUI: e-mail para contato ou feedbacks
    email: "contato@ivina.com",

    // MUDE O LINK AQUI: link do Instagram da profissional
    instagram: "https://instagram.com/",

    // MUDE O TEXTO AQUI: endereço do atendimento
    address: "Espaço Virtudes — o endereço completo é confirmado diretamente com a profissional.",

    // MUDE O TEXTO AQUI: bairro/cidade, caso queira mostrar separado
    locationShort: "Espaço Virtudes",
  },

  home: {
    badge: "Avaliação neuropsicopedagógica infantil",

    title:
      "Cuidado, escuta e orientação para o desenvolvimento da aprendizagem.",

    description:
      "Um espaço acolhedor para compreender dificuldades de aprendizagem, orientar famílias e construir caminhos possíveis para cada criança.",

    /*
     * ADICIONE A IMAGEM AQUI:
     * A imagem precisa estar dentro de public/images.
     */
    heroImage: "/images/ivinapeixoto.jpeg",

    cards: [
      {
        title: "Entendimento da aprendizagem",
        description:
          "A avaliação ajuda a observar aspectos cognitivos, escolares e comportamentais relacionados ao processo de aprender.",
      },
      {
        title: "Acolhimento familiar",
        description:
          "O responsável participa do processo trazendo informações sobre rotina, escola e dificuldades percebidas.",
      },
      {
        title: "Agendamento online",
        description:
          "O responsável pode escolher um horário disponível, enviar a solicitação e acompanhar o status pelo sistema.",
      },
    ],

    careList: [
      "Escuta inicial da família",
      "Observação cuidadosa da criança",
      "Organização das informações",
      "Orientações claras para os próximos passos",
    ],
  },

  about: {
    title: "Sobre Ivina Peixoto",

    description:
      "Ivina Peixoto atua na neuropsicopedagogia com uma abordagem acolhedora, ética e voltada para compreender como cada criança aprende.",

    secondText:
      "Seu trabalho busca aproximar família, escola e processo de aprendizagem, oferecendo orientações cuidadosas a partir da avaliação neuropsicopedagógica.",

    /*
     * ADICIONE A IMAGEM AQUI:
     * A imagem precisa estar dentro de public/images.
     */
    image: "/images/profivina.jpeg",

    highlights: [
      "Atendimento infantil presencial",
      "Escuta acolhedora da família",
      "Olhar atento para dificuldades de aprendizagem",
      "Orientações para próximos passos",
    ],
  },

  assessment: {
    title: "Como funciona a avaliação",

    description:
      "A avaliação neuropsicopedagógica busca compreender aspectos relacionados à aprendizagem, atenção, memória, raciocínio, linguagem e desenvolvimento escolar da criança.",

    steps: [
      {
        title: "Anamnese com o responsável",
        description:
          "Primeiro, é feita uma escuta inicial para entender a história da criança, queixas principais e contexto familiar.",
      },
      {
        title: "Observação da criança",
        description:
          "Durante a avaliação, são observadas habilidades cognitivas, escolares, comportamentais e de interação.",
      },
      {
        title: "Atividades avaliativas",
        description:
          "A profissional utiliza atividades e instrumentos adequados para compreender o processo de aprendizagem.",
      },
      {
        title: "Análise das informações",
        description:
          "As informações coletadas são organizadas para compreender pontos de atenção e potencialidades.",
      },
      {
        title: "Devolutiva à família",
        description:
          "A família recebe orientações sobre os resultados observados e possíveis caminhos de acompanhamento.",
      },
      {
        title: "Próximos passos",
        description:
          "Quando necessário, podem ser indicados retornos, acompanhamento, diálogo com a escola ou outros encaminhamentos.",
      },
    ],
  },

  contactPage: {
    title: "Fale Conosco",

    description:
      "Fale com a profissional para tirar dúvidas, acompanhar uma solicitação de agendamento ou enviar feedbacks sobre o atendimento.",

    subtitle:
      "Escolha o melhor canal para falar com Ivina Peixoto. Para solicitações de avaliação, o ideal é utilizar o agendamento pelo site.",

    emailFeedbackText:
      "Se desejar enviar um feedback, relato ou dúvida mais detalhada, envie uma mensagem pelo e-mail informado abaixo.",

    /*
     * ADICIONE A IMAGEM AQUI:
     * A imagem precisa estar dentro de public/images.
     */
    image: "/images/lugar.jpeg",
  },

  schedule: {
    title: "Marcar avaliação",

    description:
      "Escolha uma data disponível para enviar sua solicitação de avaliação neuropsicopedagógica.",

    notice:
      "Após escolher o horário, será necessário realizar login ou cadastro do responsável para concluir a solicitação.",
  },
};