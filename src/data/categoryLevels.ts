import { LevelData } from '../types/puzzle';

export const CATEGORY_LEVELS: Record<string, LevelData[]> = {
  // 1. 기억동화·소설 (Unified Tale & Novel) - Every level features a 3-step progressive chunking flow
  tale_novel: [
    {
      id: 'tale_novel-1',
      category: 'tale_novel',
      levelNumber: 1,
      title: {
        ko: '<어린 왕자> 제1화: 시작의 이름',
        en: '<The Little Prince> Ep. 1: The Beginning',
      },
      subtitle: {
        ko: '생택쥐페리 명작 동화',
        en: 'Antoine de Saint-Exupéry Classic',
      },
      difficultyTier: 'easy',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '프랑스 작가 생택쥐페리의 어린왕자',
        en: 'The Little Prince by French author Saint-Exupéry',
      },
      illustrationType: 'little_prince',
      questions: [
        {
          id: 'tn-1-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 동화의 시작 첫머리를 기억하여 작성하세요.',
            en: '[Step 1: Front Half] Type the front half of the phrase.',
          },
          originalText: {
            ko: '프랑스 작가',
            en: 'French author',
          },
          keyWords: {
            ko: ['프랑스', '작가'],
            en: ['French', 'author'],
          },
          explanation: {
            ko: '어린 왕자의 원작자는 프랑스 작가입니다.',
            en: 'The author of The Little Prince was a French writer.',
          },
          points: 50,
        },
        {
          id: 'tn-1-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 작가 이름과 작품명을 기억하여 작성하세요.',
            en: '[Step 2: Back Half] Type the author and title part.',
          },
          originalText: {
            ko: '생택쥐페리의 어린왕자',
            en: 'Saint-Exupéry The Little Prince',
          },
          keyWords: {
            ko: ['생택쥐페리', '어린왕자'],
            en: ['Saint-Exupéry', 'Little Prince'],
          },
          explanation: {
            ko: '앙투안 드 생택쥐페리의 대표작 어린 왕자입니다.',
            en: 'Antoine de Saint-Exupéry’s masterpiece The Little Prince.',
          },
          points: 50,
        },
        {
          id: 'tn-1-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine Step 1 and Step 2 to finish the full phrase!',
          },
          originalText: {
            ko: '프랑스 작가 생택쥐페리의 어린왕자',
            en: 'The Little Prince by French author Saint-Exupéry',
          },
          keyWords: {
            ko: ['프랑스 작가', '생택쥐페리의 어린왕자'],
            en: ['French author', 'Saint-Exupéry', 'Little Prince'],
          },
          explanation: {
            ko: '완벽합니다! 1화의 전체 문장을 온전히 기억해냈습니다.',
            en: 'Brilliant! You have recalled the entire phrase of Episode 1.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-2',
      category: 'tale_novel',
      levelNumber: 2,
      title: {
        ko: '<어린 왕자> 제2화: 소행성 B-612',
        en: '<The Little Prince> Ep. 2: Asteroid B-612',
      },
      subtitle: {
        ko: '작은 별에 핀 단 하나의 꽃',
        en: 'A Rose on a Tiny Planet',
      },
      difficultyTier: 'easy',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '소행성 B-612에는 작은 장미꽃 한 송이가 피어 있었습니다.',
        en: 'On Asteroid B-612, a single little rose was blooming.',
      },
      illustrationType: 'little_prince',
      questions: [
        {
          id: 'tn-2-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 어린 왕자가 살던 별의 이름을 기억하여 작성하세요.',
            en: '[Step 1: Front Half] Recall the asteroid’s name.',
          },
          originalText: {
            ko: '소행성 B-612에는',
            en: 'On Asteroid B-612,',
          },
          keyWords: {
            ko: ['소행성', 'B-612'],
            en: ['Asteroid', 'B-612'],
          },
          explanation: {
            ko: '어린 왕자가 살던 곳은 소행성 B-612였습니다.',
            en: 'The Little Prince lived on Asteroid B-612.',
          },
          points: 50,
        },
        {
          id: 'tn-2-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 소행성에 피어있던 꽃의 묘사를 작성하세요.',
            en: '[Step 2: Back Half] Recall what was blooming.',
          },
          originalText: {
            ko: '작은 장미꽃 한 송이가 피어 있었습니다.',
            en: 'a single little rose was blooming.',
          },
          keyWords: {
            ko: ['작은 장미꽃', '한 송이', '피어 있었습니다'],
            en: ['little rose', 'blooming'],
          },
          explanation: {
            ko: '작은 장미꽃 한 송이가 피어 있었습니다.',
            en: 'A single little rose was blooming.',
          },
          points: 50,
        },
        {
          id: 'tn-2-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine Step 1 and Step 2 into the complete sentence!',
          },
          originalText: {
            ko: '소행성 B-612에는 작은 장미꽃 한 송이가 피어 있었습니다.',
            en: 'On Asteroid B-612, a single little rose was blooming.',
          },
          keyWords: {
            ko: ['소행성 B-612에는', '작은 장미꽃 한 송이가 피어 있었습니다'],
            en: ['Asteroid B-612', 'single little rose was blooming'],
          },
          explanation: {
            ko: '훌륭합니다! 소행성 B-612와 장미꽃 문장을 정확히 기억했습니다.',
            en: 'Fantastic memory recall of Asteroid B-612 and the rose.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-3',
      category: 'tale_novel',
      levelNumber: 3,
      title: {
        ko: '<어린 왕자> 제3화: 비밀의 고백',
        en: '<The Little Prince> Ep. 3: Secret of the Heart',
      },
      subtitle: {
        ko: '마음으로 보아야 보이는 것',
        en: 'Seen Only with the Heart',
      },
      difficultyTier: 'easy',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '가장 중요한 것은 눈에 보이지 않고 마음으로 보아야 해.',
        en: 'What is most important is invisible to the eye; it is only with the heart that one can see rightly.',
      },
      illustrationType: 'little_prince',
      questions: [
        {
          id: 'tn-3-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 눈에 보이지 않는 진실에 관한 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Recall what is most important.',
          },
          originalText: {
            ko: '가장 중요한 것은 눈에 보이지 않고',
            en: 'What is most important is invisible to the eye',
          },
          keyWords: {
            ko: ['가장 중요한 것', '눈에 보이지 않고'],
            en: ['important', 'invisible'],
          },
          explanation: {
            ko: '가장 중요한 것은 눈에 보이지 않습니다.',
            en: 'The most important things are invisible to the eye.',
          },
          points: 50,
        },
        {
          id: 'tn-3-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 어떻게 보아야 하는지 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Recall how one must see.',
          },
          originalText: {
            ko: '마음으로 보아야 해.',
            en: 'it is only with the heart that one can see rightly.',
          },
          keyWords: {
            ko: ['마음으로', '보아야 해'],
            en: ['heart', 'see rightly'],
          },
          explanation: {
            ko: '오직 마음으로 보아야 진정한 가치를 알 수 있습니다.',
            en: 'Only with the heart can one see rightly.',
          },
          points: 50,
        },
        {
          id: 'tn-3-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine both parts into the full quote!',
          },
          originalText: {
            ko: '가장 중요한 것은 눈에 보이지 않고 마음으로 보아야 해.',
            en: 'What is most important is invisible to the eye; it is only with the heart that one can see rightly.',
          },
          keyWords: {
            ko: ['가장 중요한 것은 눈에 보이지 않고', '마음으로 보아야 해'],
            en: ['invisible to the eye', 'with the heart'],
          },
          explanation: {
            ko: '전 세계 수많은 이들의 마음에 울림을 준 불멸의 명문장입니다.',
            en: 'One of the most famous literary quotes in world history.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-4',
      category: 'tale_novel',
      levelNumber: 4,
      title: {
        ko: '<어린 왕자> 제4화: 유리 덮개',
        en: '<The Little Prince> Ep. 4: The Glass Globe',
      },
      subtitle: {
        ko: '찬바람을 막아주는 사랑',
        en: 'Shelter From the Wind',
      },
      difficultyTier: 'normal',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '차가운 밤바람을 막아주기 위해 투명한 유리 덮개를 씌워 주기도 했습니다.',
        en: 'He even placed a transparent glass globe over her to protect her from the chilly night wind.',
      },
      illustrationType: 'little_prince',
      questions: [
        {
          id: 'tn-4-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 장미를 위해 막아주고자 했던 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Recall what he wanted to shelter her from.',
          },
          originalText: {
            ko: '차가운 밤바람을 막아주기 위해',
            en: 'To protect her from the chilly night wind',
          },
          keyWords: {
            ko: ['차가운 밤바람', '막아주기 위해'],
            en: ['chilly night wind', 'protect'],
          },
          explanation: {
            ko: '차가운 밤바람을 막아주기 위해 정성을 쏟았습니다.',
            en: 'He sheltered the rose from the chilly night wind.',
          },
          points: 50,
        },
        {
          id: 'tn-4-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 장미에게 씌워준 물건에 관한 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Recall what he placed over her.',
          },
          originalText: {
            ko: '투명한 유리 덮개를 씌워 주기도 했습니다.',
            en: 'he placed a transparent glass globe over her.',
          },
          keyWords: {
            ko: ['투명한 유리 덮개', '씌워 주기도 했습니다'],
            en: ['transparent glass globe', 'placed'],
          },
          explanation: {
            ko: '투명한 유리 덮개를 씌워 보호했습니다.',
            en: 'He protected her with a transparent glass globe.',
          },
          points: 50,
        },
        {
          id: 'tn-4-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine both parts into the full sentence!',
          },
          originalText: {
            ko: '차가운 밤바람을 막아주기 위해 투명한 유리 덮개를 씌워 주기도 했습니다.',
            en: 'He even placed a transparent glass globe over her to protect her from the chilly night wind.',
          },
          keyWords: {
            ko: ['차가운 밤바람을 막아주기 위해', '투명한 유리 덮개를 씌워 주기도 했습니다'],
            en: ['chilly night wind', 'glass globe'],
          },
          explanation: {
            ko: '정말 멋집니다! 장미를 아끼던 어린 왕자의 따뜻한 마음이 느껴집니다.',
            en: 'Beautifully recalled! The tender care of the Little Prince.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-5',
      category: 'tale_novel',
      levelNumber: 5,
      title: {
        ko: '<어린 왕자> 제5화: 여우의 가르침',
        en: '<The Little Prince> Ep. 5: The Fox’s Wisdom',
      },
      subtitle: {
        ko: '세상에 단 하나뿐인 존재',
        en: 'One in All the World',
      },
      difficultyTier: 'normal',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '네가 나를 길들인다면 우리는 서로에게 이 세상에서 단 하나뿐인 존재가 될 거야.',
        en: 'If you tame me, then we shall need each other. To me, you will be unique in all the world.',
      },
      illustrationType: 'little_prince',
      questions: [
        {
          id: 'tn-5-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 여우가 말한 길들임의 전제 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Type the front half about taming.',
          },
          originalText: {
            ko: '네가 나를 길들인다면 우리는 서로에게',
            en: 'If you tame me, then we shall need each other.',
          },
          keyWords: {
            ko: ['네가 나를 길들인다면', '우리는 서로에게'],
            en: ['tame me', 'need each other'],
          },
          explanation: {
            ko: '네가 나를 길들인다면 우리는 서로에게 특별해집니다.',
            en: 'If you tame me, we shall need each other.',
          },
          points: 50,
        },
        {
          id: 'tn-5-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 서로에게 어떤 존재가 되는지 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Type the back half about becoming unique.',
          },
          originalText: {
            ko: '이 세상에서 단 하나뿐인 존재가 될 거야.',
            en: 'To me, you will be unique in all the world.',
          },
          keyWords: {
            ko: ['이 세상에서', '단 하나뿐인 존재가 될 거야'],
            en: ['unique in all the world'],
          },
          explanation: {
            ko: '이 세상에서 단 하나뿐인 소중한 존재가 됩니다.',
            en: 'You become unique in all the world.',
          },
          points: 50,
        },
        {
          id: 'tn-5-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine Step 1 and Step 2 to finish the full sentence!',
          },
          originalText: {
            ko: '네가 나를 길들인다면 우리는 서로에게 이 세상에서 단 하나뿐인 존재가 될 거야.',
            en: 'If you tame me, then we shall need each other. To me, you will be unique in all the world.',
          },
          keyWords: {
            ko: ['네가 나를 길들인다면 우리는 서로에게', '이 세상에서 단 하나뿐인 존재가 될 거야'],
            en: ['tame me', 'unique in all the world'],
          },
          explanation: {
            ko: '당신은 몰랐을 거예요, 당신이 천재라는 사실을! 긴 명문장을 완벽하게 기억해냈습니다.',
            en: 'Incredible memory! You recalled the legendary line flawlessly.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-6',
      category: 'tale_novel',
      levelNumber: 6,
      title: {
        ko: '<셜록 홈즈> 제6화: 베이커 가 221B',
        en: '<Sherlock Holmes> Ep. 6: 221B Baker Street',
      },
      subtitle: {
        ko: '아서 코난 도일의 명작 추리 소설',
        en: 'Arthur Conan Doyle Masterpiece',
      },
      difficultyTier: 'normal',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '셜록 홈즈와 존 왓슨 박사는 런던 베이커 가 221B 번지에서 함께 살았습니다.',
        en: 'Sherlock Holmes and Dr. John Watson lived together at 221B Baker Street, London.',
      },
      illustrationType: 'classic_study',
      questions: [
        {
          id: 'tn-6-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 두 주인공의 이름을 기억하여 작성하세요.',
            en: '[Step 1: Front Half] Type the two protagonists’ names.',
          },
          originalText: {
            ko: '셜록 홈즈와 존 왓슨 박사는',
            en: 'Sherlock Holmes and Dr. John Watson',
          },
          keyWords: {
            ko: ['셜록 홈즈', '존 왓슨 박사'],
            en: ['Sherlock Holmes', 'John Watson'],
          },
          explanation: {
            ko: '셜록 홈즈와 존 왓슨 박사가 주인공입니다.',
            en: 'Sherlock Holmes and Dr. John Watson are the characters.',
          },
          points: 50,
        },
        {
          id: 'tn-6-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 그들이 함께 살던 주소와 행동을 작성하세요.',
            en: '[Step 2: Back Half] Type their London address and living arrangement.',
          },
          originalText: {
            ko: '런던 베이커 가 221B 번지에서 함께 살았습니다.',
            en: 'lived together at 221B Baker Street, London.',
          },
          keyWords: {
            ko: ['런던 베이커 가 221B 번지', '함께 살았습니다'],
            en: ['221B Baker Street', 'lived together'],
          },
          explanation: {
            ko: '런던 베이커 가 221B 번지에서 하숙 생활을 함께 시작했습니다.',
            en: 'They resided together at 221B Baker Street, London.',
          },
          points: 50,
        },
        {
          id: 'tn-6-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine Step 1 and Step 2 into the complete sentence!',
          },
          originalText: {
            ko: '셜록 홈즈와 존 왓슨 박사는 런던 베이커 가 221B 번지에서 함께 살았습니다.',
            en: 'Sherlock Holmes and Dr. John Watson lived together at 221B Baker Street, London.',
          },
          keyWords: {
            ko: ['셜록 홈즈와 존 왓슨 박사는', '런던 베이커 가 221B 번지에서 함께 살았습니다'],
            en: ['Sherlock Holmes and Dr. John Watson', '221B Baker Street'],
          },
          explanation: {
            ko: '점점 더 똑똑해지고 있어요! 홈즈의 대표 주소를 완벽히 기억했습니다.',
            en: 'Brilliant work! You completed the famous 221B Baker Street sentence.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-7',
      category: 'tale_novel',
      levelNumber: 7,
      title: {
        ko: '<셜록 홈즈> 제7화: 명탐정의 관찰',
        en: '<Sherlock Holmes> Ep. 7: The Art of Observation',
      },
      subtitle: {
        ko: '보는 것과 관찰하는 것의 차이',
        en: 'Seeing vs Observing',
      },
      difficultyTier: 'hard',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '자네는 보기만 할 뿐 관찰하지는 않아. 그 둘 사이에는 명백한 차이가 있지.',
        en: 'You see, but you do not observe. The distinction is clear.',
      },
      illustrationType: 'classic_study',
      questions: [
        {
          id: 'tn-7-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 왓슨을 향한 홈즈의 날카로운 지적 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Type the front half about seeing vs observing.',
          },
          originalText: {
            ko: '자네는 보기만 할 뿐 관찰하지는 않아.',
            en: 'You see, but you do not observe.',
          },
          keyWords: {
            ko: ['보기만 할 뿐', '관찰하지는 않아'],
            en: ['see', 'do not observe'],
          },
          explanation: {
            ko: '눈으로 보는 것과 머리로 관찰하는 것의 차이를 지적했습니다.',
            en: 'Holmes notes the difference between seeing and observing.',
          },
          points: 50,
        },
        {
          id: 'tn-7-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 둘 사이의 차이에 관한 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Type the back half about the clear distinction.',
          },
          originalText: {
            ko: '그 둘 사이에는 명백한 차이가 있지.',
            en: 'The distinction is clear.',
          },
          keyWords: {
            ko: ['그 둘 사이에는', '명백한 차이가 있지'],
            en: ['distinction is clear'],
          },
          explanation: {
            ko: '그 둘 사이에는 결정적인 차이가 존재합니다.',
            en: 'There is a clear distinction between the two.',
          },
          points: 50,
        },
        {
          id: 'tn-7-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine Step 1 and Step 2 into the complete sentence!',
          },
          originalText: {
            ko: '자네는 보기만 할 뿐 관찰하지는 않아. 그 둘 사이에는 명백한 차이가 있지.',
            en: 'You see, but you do not observe. The distinction is clear.',
          },
          keyWords: {
            ko: ['자네는 보기만 할 뿐 관찰하지는 않아', '그 둘 사이에는 명백한 차이가 있지'],
            en: ['You see, but you do not observe', 'distinction is clear'],
          },
          explanation: {
            ko: '정말 멋지게 기억해냈어요! 추리 소설 최고의 명언을 온전히 암기하셨습니다.',
            en: 'Outstanding memory! You mastered Holmes’ most famous quote.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'tale_novel-8',
      category: 'tale_novel',
      levelNumber: 8,
      title: {
        ko: '<어린 왕자> 제8화: 쏟은 시간의 의미',
        en: '<The Little Prince> Ep. 8: Time Spent on the Rose',
      },
      subtitle: {
        ko: '장미꽃이 그토록 소중한 이유',
        en: 'What Makes the Rose So Precious',
      },
      difficultyTier: 'hard',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '네 장미꽃이 그토록 소중한 이유는 네가 그 꽃을 위해 들인 시간 때문이야.',
        en: 'It is the time you have wasted for your rose that makes your rose so important.',
      },
      illustrationType: 'little_prince',
      questions: [
        {
          id: 'tn-8-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 장미꽃이 소중한 이유를 묻는 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Recall why the rose is so precious.',
          },
          originalText: {
            ko: '네 장미꽃이 그토록 소중한 이유는',
            en: 'It is the time you have wasted for your rose',
          },
          keyWords: {
            ko: ['네 장미꽃', '그토록 소중한 이유'],
            en: ['your rose', 'so important'],
          },
          explanation: {
            ko: '장미꽃이 그토록 소중한 까닭입니다.',
            en: 'Why your rose is so precious.',
          },
          points: 50,
        },
        {
          id: 'tn-8-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 쏟아부은 시간에 관한 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Recall the part about time spent.',
          },
          originalText: {
            ko: '네가 그 꽃을 위해 들인 시간 때문이야.',
            en: 'that makes your rose so important.',
          },
          keyWords: {
            ko: ['그 꽃을 위해', '들인 시간 때문이야'],
            en: ['wasted for your rose', 'important'],
          },
          explanation: {
            ko: '네가 장미꽃을 위해 들인 시간과 사랑 때문입니다.',
            en: 'The devotion and time you dedicated to her.',
          },
          points: 50,
        },
        {
          id: 'tn-8-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine both parts into the full quote!',
          },
          originalText: {
            ko: '네 장미꽃이 그토록 소중한 이유는 네가 그 꽃을 위해 들인 시간 때문이야.',
            en: 'It is the time you have wasted for your rose that makes your rose so important.',
          },
          keyWords: {
            ko: ['네 장미꽃이 그토록 소중한 이유는', '네가 그 꽃을 위해 들인 시간 때문이야'],
            en: ['time you have wasted', 'rose so important'],
          },
          explanation: {
            ko: '완벽합니다! 어린 왕자의 가장 아름다운 교훈을 완벽하게 기억해냈습니다.',
            en: 'Extraordinary! You completely recalled the core wisdom of The Little Prince.',
          },
          points: 100,
        },
      ],
    },
  ],

  // 2. 기억 그림 (Visual Exploration Puzzles)
  picture: [
    {
      id: 'pic-1',
      category: 'picture',
      levelNumber: 1,
      title: {
        ko: '탐험 제1장: 엘레나의 아침 방',
        en: 'Expedition Ch. 1: Elena’s Morning Room',
      },
      subtitle: {
        ko: '가구와 작은 소품들의 자리',
        en: 'Arrangement of Furniture and Props',
      },
      difficultyTier: 'easy',
      observationTimeLimit: 12,
      storyNarrative: {
        ko: '햇살이 비치는 아침 방의 거울과 화장대, 그리고 바닥에 놓인 구두의 자리를 눈여겨보세요.',
        en: 'Observe the mirror, vanity, and the shoes placed on the wooden parquet floor.',
      },
      illustrationType: 'fairytale_cottage',
      items: [
        {
          id: 'vanity_mirror',
          name: { ko: '타원형 금빛 거울', en: 'Oval Gilt Mirror' },
          category: { ko: '가구', en: 'Furniture' },
          description: { ko: '중앙 화장대 위 황금빛 거울', en: 'Gilded mirror on center dresser' },
          x: 50,
          y: 38,
          radius: 14,
          count: 1,
          iconType: 'mirror',
          color: '#F59E0B',
          zoneName: { ko: '중앙 화장대 위', en: 'Above Central Dresser' },
        },
      ],
      questions: [
        {
          id: 'pic-1-q1',
          type: 'pin_location',
          prompt: {
            ko: '방 중앙 화장대 위에 걸려 있던 [타원형 금빛 거울]의 위치를 클릭하세요.',
            en: 'Click where the [Oval Gilt Mirror] was located above the dresser.',
          },
          targetItemId: 'vanity_mirror',
          explanation: {
            ko: '타원형 금빛 거울은 화면 중앙 화장대 위(X: 50%, Y: 38%)에 놓여 있었습니다.',
            en: 'The mirror was at the central dresser position.',
          },
          points: 100,
        },
      ],
    },
  ],

  // 3. 기억 명언·명대사 (Memory Quotes & Lines) - Also 3-step progressive chunking
  quote: [
    {
      id: 'quote-1',
      category: 'quote',
      levelNumber: 1,
      title: {
        ko: '명언 제1편: 시간의 가치',
        en: 'Quote Pt. 1: Value of Time',
      },
      authorOrSource: {
        ko: '벤자민 프랭클린 (미국 건국의 아버지)',
        en: 'Benjamin Franklin (1706–1790)',
      },
      difficultyTier: 'easy',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '시간은 금이다. - 벤자민 프랭클린',
        en: 'Time is money. - Benjamin Franklin',
      },
      illustrationType: 'quote_parchment',
      questions: [
        {
          id: 'quote-1-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 시간에 관한 핵심 격언 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Type the proverb about time.',
          },
          originalText: {
            ko: '시간은 금이다.',
            en: 'Time is money.',
          },
          keyWords: {
            ko: ['시간은 금이다'],
            en: ['Time is money'],
          },
          explanation: {
            ko: '시간은 금과 같이 소중하다는 격언입니다.',
            en: 'Time is as precious as gold.',
          },
          points: 50,
        },
        {
          id: 'quote-1-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 이 격언을 남긴 인물의 이름을 작성하세요.',
            en: '[Step 2: Back Half] Type the name of the speaker.',
          },
          originalText: {
            ko: '벤자민 프랭클린',
            en: 'Benjamin Franklin',
          },
          keyWords: {
            ko: ['벤자민 프랭클린'],
            en: ['Benjamin Franklin'],
          },
          explanation: {
            ko: '미국 건국의 아버지 벤자민 프랭클린의 명언입니다.',
            en: 'Said by Founding Father Benjamin Franklin.',
          },
          points: 50,
        },
        {
          id: 'quote-1-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 명언을 완성하세요!',
            en: '[Step 3: Complete] Combine Step 1 and Step 2 to finish the full quote!',
          },
          originalText: {
            ko: '시간은 금이다. - 벤자민 프랭클린',
            en: 'Time is money. - Benjamin Franklin',
          },
          keyWords: {
            ko: ['시간은 금이다', '벤자민 프랭클린'],
            en: ['Time is money', 'Benjamin Franklin'],
          },
          explanation: {
            ko: '흘러가는 매 순간이 금처럼 고귀하고 값지다는 의미를 담은 격언입니다.',
            en: 'A timeless quote reminding us that every fleeting second is precious.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'quote-2',
      category: 'quote',
      levelNumber: 2,
      title: {
        ko: '명언 제2편: 걷기의 기적',
        en: 'Quote Pt. 2: The Miracle of Walking',
      },
      authorOrSource: {
        ko: '사무엘 존슨 (영국 비평가 · 문학가)',
        en: 'Samuel Johnson (1709–1784)',
      },
      difficultyTier: 'easy',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '하루에 3시간을 걸으면 7년 후에 지구를 한 바퀴 돌 수 있다. - 사무엘 존슨',
        en: 'If you walk 3 hours a day, in 7 years you will have walked around the globe. - Samuel Johnson',
      },
      illustrationType: 'quote_parchment',
      questions: [
        {
          id: 'quote-2-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 매일 걷는 시간에 관한 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Type the front half about daily walking.',
          },
          originalText: {
            ko: '하루에 3시간을 걸으면',
            en: 'If you walk 3 hours a day,',
          },
          keyWords: {
            ko: ['하루에', '3시간을 걸으면'],
            en: ['walk 3 hours a day'],
          },
          explanation: {
            ko: '하루에 3시간을 걷는 꾸준한 습관입니다.',
            en: 'The habit of walking 3 hours daily.',
          },
          points: 50,
        },
        {
          id: 'quote-2-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 7년 후 이루어지는 결과 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Type the result achieved after 7 years.',
          },
          originalText: {
            ko: '7년 후에 지구를 한 바퀴 돌 수 있다.',
            en: 'in 7 years you will have walked around the globe.',
          },
          keyWords: {
            ko: ['7년 후에', '지구를 한 바퀴 돌 수 있다'],
            en: ['7 years', 'walked around the globe'],
          },
          explanation: {
            ko: '꾸준함이 모여 지구 한 바퀴를 도는 기적을 이룹니다.',
            en: 'Small daily steps add up to walking around the world.',
          },
          points: 50,
        },
        {
          id: 'quote-2-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!',
            en: '[Step 3: Complete] Combine both parts into the complete quote!',
          },
          originalText: {
            ko: '하루에 3시간을 걸으면 7년 후에 지구를 한 바퀴 돌 수 있다.',
            en: 'If you walk 3 hours a day, in 7 years you will have walked around the globe.',
          },
          keyWords: {
            ko: ['하루에 3시간을 걸으면', '7년 후에 지구를 한 바퀴 돌 수 있다'],
            en: ['walk 3 hours a day', 'walked around the globe'],
          },
          explanation: {
            ko: '매일의 작은 습관과 꾸준함이 모여 상상도 못한 위대한 결실을 맺습니다.',
            en: 'Daily persistent steps culminate in extraordinary achievements.',
          },
          points: 100,
        },
      ],
    },
    {
      id: 'quote-3',
      category: 'quote',
      levelNumber: 3,
      title: {
        ko: '명대사 제3편: 인생의 상자',
        en: 'Line Pt. 3: Box of Chocolates',
      },
      authorOrSource: {
        ko: '영화 <포레스트 검프> (1994)',
        en: 'Movie <Forrest Gump> (1994)',
      },
      difficultyTier: 'normal',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: '인생은 초콜릿 상자와 같은 거야. 네가 무엇을 고를지 아무도 모르거든.',
        en: 'Life is like a box of chocolates. You never know what you’re gonna get.',
      },
      illustrationType: 'quote_parchment',
      questions: [
        {
          id: 'quote-3-q1',
          type: 'text_recall_typing',
          prompt: {
            ko: '[1단계: 앞부분] 인생에 비유한 초콜릿 상자 앞부분을 작성하세요.',
            en: '[Step 1: Front Half] Type the front half about the chocolate box.',
          },
          originalText: {
            ko: '인생은 초콜릿 상자와 같은 거야.',
            en: 'Life is like a box of chocolates.',
          },
          keyWords: {
            ko: ['인생은', '초콜릿 상자와 같은 거야'],
            en: ['Life is like a box of chocolates'],
          },
          explanation: {
            ko: '인생은 초콜릿 상자에 비유됩니다.',
            en: 'Life is compared to a box of chocolates.',
          },
          points: 50,
        },
        {
          id: 'quote-3-q2',
          type: 'text_recall_typing',
          prompt: {
            ko: '[2단계: 뒷부분] 무엇을 고를지 모른다는 뒷부분을 작성하세요.',
            en: '[Step 2: Back Half] Type the back half about the unpredictable choices.',
          },
          originalText: {
            ko: '네가 무엇을 고를지 아무도 모르거든.',
            en: 'You never know what you’re gonna get.',
          },
          keyWords: {
            ko: ['무엇을 고를지', '아무도 모르거든'],
            en: ['never know', 'what you’re gonna get'],
          },
          explanation: {
            ko: '어떤 초콜릿을 고를지 알 수 없기에 인생은 흥미롭습니다.',
            en: 'Unpredictability makes life exciting.',
          },
          points: 50,
        },
        {
          id: 'quote-3-q3',
          type: 'text_recall_typing',
          prompt: {
            ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 명대사를 완성하세요!',
            en: '[Step 3: Complete] Combine both parts into the full movie line!',
          },
          originalText: {
            ko: '인생은 초콜릿 상자와 같은 거야. 네가 무엇을 고를지 아무도 모르거든.',
            en: 'Life is like a box of chocolates. You never know what you’re gonna get.',
          },
          keyWords: {
            ko: ['인생은 초콜릿 상자와 같은 거야', '네가 무엇을 고를지 아무도 모르거든'],
            en: ['box of chocolates', 'never know what you’re gonna get'],
          },
          explanation: {
            ko: '인생은 어떤 것이 기다리고 있을지 알 수 없기에 더욱 설레고 아름답습니다.',
            en: 'Life’s beauty lies in its delightful unpredictability.',
          },
          points: 100,
        },
      ],
    },
  ],
};
