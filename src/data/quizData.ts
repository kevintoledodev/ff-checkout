export const quizData = {
  logo: "/images/free fire2.png",
  errorImage: "/images/303797e9-0d2d-40dd-a926-d0a36e6345b0.jpg",
  congratsImage: "/images/free fire2.png",

  steps: [
    {
      id: 'step1',
      title: 'Pergunta 1: (Fácil)',
      subtitle: '👉 Qual dessas armas é a melhor para combates de longa distância?',
      progress: 25,
      discount: 0,
      type: 'text-image',
      columns: 'grid-cols-2',
      options: [
        { id: '1', title: 'M1887', image: '/images/images.jpg', isCorrect: false },
        { id: '2', title: 'MP40', image: '/images/images (1).jpg', isCorrect: false },
        { id: '3', title: 'Desert Eagle', image: '/images/desert-eagle.png', isCorrect: false },
        { id: '4', title: 'Scar', image: '/images/SCAR.png', isCorrect: true }
      ],
      errorPageId: 'error1',
      nextPageId: 'break1'
    },
    {
      id: 'step2',
      title: 'Pergunta 2: (Fácil)',
      subtitle: 'Qual é o nome do primeiro mapa lançado no Free Fire?',
      progress: 33.33,
      discount: 15,
      type: 'text-image',
      columns: 'grid-cols-2',
      options: [
        { id: '1', title: 'Kalahari', image: '/images/kalahari.jpg', isCorrect: false },
        { id: '2', title: 'Purgatorio', image: '/images/purgatorio.jpg', isCorrect: false },
        { id: '3', title: 'Alpine', image: '/images/alpine.jpg', isCorrect: false },
        { id: '4', title: 'Bermuda', image: '/images/bermuda.jpg', isCorrect: true }
      ],
      errorPageId: 'error2',
      nextPageId: 'step3'
    },
    {
      id: 'step3',
      title: 'Pergunta 3: (Fácil)',
      subtitle: '👉 Quantos jogadores entram em uma partida de Battle Royale no Free Fire?',
      progress: 50.33,
      discount: 45,
      type: 'text-only',
      columns: 'grid-cols-2',
      options: [
        { id: '1', title: '50', isCorrect: true },
        { id: '2', title: '75', isCorrect: false },
        { id: '3', title: '100', isCorrect: false },
        { id: '4', title: '150', isCorrect: false }
      ],
      errorPageId: 'error3',
      nextPageId: 'coupon'
    },
    {
      id: 'step4',
      title: 'Pergunta 4: (Fácil)',
      subtitle: '👉 Qual o nome do criador do Free Fire?',
      progress: 66.66,
      discount: 60,
      type: 'text-image',
      columns: 'grid-cols-2',
      options: [
        { id: '1', title: 'Garena', image: '/images/garena.png', isCorrect: true },
        { id: '2', title: 'Tencent', image: '/images/tencent.png', isCorrect: false },
        { id: '3', title: 'Supercell', image: '/images/supercell.png', isCorrect: false },
        { id: '4', title: 'Ubisoft', image: '/images/ubisoft.png', isCorrect: false }
      ],
      errorPageId: 'error4',
      nextPageId: 'step5'
    },
    {
      id: 'step5',
      title: 'Pergunta 5: (Médio) Você está perto!',
      subtitle: '👉 Qual destes personagens tem a habilidade de curar aliados?',
      progress: 75,
      discount: 75,
      type: 'text-image',
      columns: 'grid-cols-2',
      options: [
        { id: '1', title: 'Kapella', image: '/images/kapella.png', isCorrect: true },
        { id: '2', title: 'Moco', image: '/images/moco.png', isCorrect: false },
        { id: '3', title: 'Hayato', image: '/images/hayato.png', isCorrect: false },
        { id: '4', title: 'Laura', image: '/images/laura.png', isCorrect: false }
      ],
      errorPageId: 'error5',
      nextPageId: 'step6'
    },
    {
      id: 'step6',
      title: 'Pergunta FINAL:',
      subtitle: '👉 Se você tivesse um cupom de desconto HOJE para comprar diamantes e não perder mais nenhum evento, você usaria?',
      progress: 83.32,
      discount: 90,
      type: 'text-emoji',
      columns: 'grid-cols-1',
      options: [
        { id: '1', title: 'Com certeza! Sempre preciso de diamantes!', emoji: '😁', isCorrect: true },
        { id: '2', title: 'Talvez, dependendo do desconto.', emoji: '😕', isCorrect: true },
        { id: '3', title: 'Não sei…', emoji: '🤢', isCorrect: true }
      ],
      errorPageId: null,
      nextPageId: 'loading'
    }
  ]
};
