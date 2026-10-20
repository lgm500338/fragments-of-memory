import { CategoryType, LevelData, Question, SceneItem } from '../types/puzzle';
import { splitSentence } from './sentenceSplitter';

// Curated pool of infinite storybook tales
const TALE_GENERATION_POOL = [
  {
    book: '어린 왕자',
    author: '앙투안 드 생택쥐페리',
    enBook: 'The Little Prince',
    enAuthor: 'Antoine de Saint-Exupéry',
    illustrationType: 'fairytale_cottage' as const,
    passages: [
      {
        ko: '사막이 아름다운 것은 어딘가에 우물을 숨겨두고 있기 때문이야.',
        en: 'What makes the desert beautiful is that somewhere it hides a well.',
        keywords: { ko: ['사막', '아름다운 것', '우물', '숨겨두고'], en: ['desert', 'beautiful', 'well', 'hides'] },
      },
      {
        ko: '누군가에게 길들여진다는 것은 눈물 흘릴 일을 각오하는 것이다.',
        en: 'One runs the risk of crying a bit if one allows oneself to be tamed.',
        keywords: { ko: ['길들여진다는 것', '눈물', '각오'], en: ['tamed', 'crying', 'risk'] },
      },
      {
        ko: '별들이 아름다운 이유는 보이지 않는 한 송이 꽃이 있기 때문이야.',
        en: 'The stars are beautiful because of a flower that cannot be seen.',
        keywords: { ko: ['별들', '아름다운 이유', '꽃'], en: ['stars', 'beautiful', 'flower'] },
      },
      {
        ko: '어른들은 누구나 처음에는 어린이였지만 그것을 기억하는 어른은 별로 없다.',
        en: 'All grown-ups were once children, but only few of them remember it.',
        keywords: { ko: ['어른들', '어린이', '기억'], en: ['grown-ups', 'children', 'remember'] },
      },
    ],
  },
  {
    book: '이상한 나라의 앨리스',
    author: '루이스 캐럴',
    enBook: 'Alice in Wonderland',
    enAuthor: 'Lewis Carroll',
    illustrationType: 'fairytale_meadow' as const,
    passages: [
      {
        ko: '하얀 토끼는 조끼 주머니에서 회중시계를 꺼내보며 늦었다고 외쳤습니다.',
        en: 'The White Rabbit took a watch out of his waistcoat-pocket and cried that he was late.',
        keywords: { ko: ['하얀 토끼', '조끼 주머니', '회중시계', '늦었다고'], en: ['White Rabbit', 'watch', 'waistcoat', 'late'] },
      },
      {
        ko: '내가 어디로 가야 하는지 알려줄래? 그것은 네가 어디로 가고 싶은지에 달렸지.',
        en: 'Would you tell me which way I ought to go? That depends on where you want to get to.',
        keywords: { ko: ['어디로 가야 하는지', '어디로 가고 싶은지'], en: ['which way', 'where you want'] },
      },
      {
        ko: '체셔 고양이는 나뭇가지 위에서 커다란 미소를 지으며 서서히 사라졌습니다.',
        en: 'The Cheshire Cat vanished quite slowly, beginning with the grin.',
        keywords: { ko: ['체셔 고양이', '나뭇가지', '미소', '사라졌습니다'], en: ['Cheshire Cat', 'grin', 'vanished'] },
      },
    ],
  },
  {
    book: '피터 팬',
    author: 'J.M. 배리',
    enBook: 'Peter Pan',
    enAuthor: 'J.M. Barrie',
    illustrationType: 'fairytale_cottage' as const,
    passages: [
      {
        ko: '오른쪽에서 두 번째 별을 지나 아침이 올 때까지 곧장 날아가면 네버랜드란다.',
        en: 'Second star to the right and straight on till morning, that is Neverland.',
        keywords: { ko: ['두 번째 별', '아침', '곧장 날아가면', '네버랜드'], en: ['Second star', 'morning', 'Neverland'] },
      },
      {
        ko: '요정 팅커벨이 은빛 가루를 뿌리자 웬디와 아이들은 가볍게 하늘로 날아올랐습니다.',
        en: 'Tinker Bell sprinkled fairy dust, and Wendy and the boys floated into the sky.',
        keywords: { ko: ['팅커벨', '은빛 가루', '하늘로', '날아올랐습니다'], en: ['Tinker Bell', 'fairy dust', 'sky', 'floated'] },
      },
    ],
  },
  {
    book: '피노키오의 모험',
    author: '카를로 콜로디',
    enBook: 'The Adventures of Pinocchio',
    enAuthor: 'Carlo Collodi',
    illustrationType: 'fairytale_cottage' as const,
    passages: [
      {
        ko: '제페토 할아버지는 작은 등불 아래서 참나무 조각으로 말하는 목각 인형을 깎았습니다.',
        en: 'Geppetto carved a talking wooden puppet out of pine wood beneath the soft lamp.',
        keywords: { ko: ['제페토', '작은 등불', '목각 인형', '깎았습니다'], en: ['Geppetto', 'wooden puppet', 'lamp'] },
      },
      {
        ko: '푸른 요정이 나타나 정직하고 착한 아이가 되면 진짜 사람이 될 수 있다고 말했습니다.',
        en: 'The Blue Fairy appeared and promised he could become a real boy if honest and brave.',
        keywords: { ko: ['푸른 요정', '정직하고', '진짜 사람'], en: ['Blue Fairy', 'real boy', 'honest'] },
      },
    ],
  },
];

// Curated pool of infinite classical novels
const NOVEL_GENERATION_POOL = [
  {
    book: '셜록 홈즈 회고록',
    author: '아서 코난 도일',
    enBook: 'The Memoirs of Sherlock Holmes',
    enAuthor: 'Arthur Conan Doyle',
    illustrationType: 'classic_study' as const,
    passages: [
      {
        ko: '불가능한 것을 모두 제외하고 남은 것은, 아무리 믿기 어려워도 진실일 수밖에 없다.',
        en: 'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
        keywords: { ko: ['불가능한 것', '제외하고', '진실'], en: ['eliminated the impossible', 'truth'] },
      },
      {
        ko: '자네는 보기만 할 뿐 관찰하지는 않아. 그 둘 사이에는 명백한 차이가 있네.',
        en: 'You see, but you do not observe. The distinction is clear.',
        keywords: { ko: ['보기만 할 뿐', '관찰', '차이'], en: ['see', 'observe', 'distinction'] },
      },
      {
        ko: '홈즈는 서재 창가에 서서 바이올린을 켜며 깊은 사색에 잠겨 있었습니다.',
        en: 'Holmes stood by the study window, playing his violin in deep thought.',
        keywords: { ko: ['홈즈', '서재 창가', '바이올린', '사색'], en: ['Holmes', 'window', 'violin', 'thought'] },
      },
    ],
  },
  {
    book: '위대한 개츠비',
    author: 'F. 스콧 피츠제럴드',
    enBook: 'The Great Gatsby',
    enAuthor: 'F. Scott Fitzgerald',
    illustrationType: 'classic_study' as const,
    passages: [
      {
        ko: '그는 부두 끝에서 깜빡이는 초록색 불빛을 향해 두 팔을 뻗고 있었습니다.',
        en: 'He stretched out his arms towards the dark water toward a single green light.',
        keywords: { ko: ['부두 끝', '초록색 불빛', '두 팔'], en: ['green light', 'arms', 'water'] },
      },
      {
        ko: '누군가를 비판하고 싶을 때는, 세상 사람들이 모두 너처럼 좋은 조건을 누리지 못했다는 걸 기억해라.',
        en: 'Whenever you feel like criticizing anyone, remember that all the people in this world haven’t had the advantages that you’ve had.',
        keywords: { ko: ['비판', '세상 사람', '기억해라'], en: ['criticizing', 'advantages', 'remember'] },
      },
    ],
  },
  {
    book: '노인과 바다',
    author: '어니스트 헤밍웨이',
    enBook: 'The Old Man and the Sea',
    enAuthor: 'Ernest Hemingway',
    illustrationType: 'classic_study' as const,
    passages: [
      {
        ko: '인간은 파멸할지언정 패배할 수는 없다. 노인은 굳게 다문 입술로 낚싯줄을 쥐었습니다.',
        en: 'Man is not made for defeat. A man can be destroyed but not defeated.',
        keywords: { ko: ['인간', '파멸', '패배', '낚싯줄'], en: ['defeat', 'destroyed', 'not defeated'] },
      },
      {
        ko: '태양이 바다 위로 떠오르자 푸른 물결 위로 거대한 물고기의 그림자가 일렁였습니다.',
        en: 'As the sun rose above the sea, the great shadow of the fish rippled through the deep blue water.',
        keywords: { ko: ['태양', '바다', '거대한 물고기', '그림자'], en: ['sun', 'sea', 'great shadow', 'fish'] },
      },
    ],
  },
  {
    book: '데미안',
    author: '헤르만 헤세',
    enBook: 'Demian',
    enAuthor: 'Hermann Hesse',
    illustrationType: 'classic_study' as const,
    passages: [
      {
        ko: '새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다.',
        en: 'The bird fights its way out of the egg. The egg is the world. Who would be born must first destroy a world.',
        keywords: { ko: ['새', '알', '세계', '깨뜨려야 한다'], en: ['bird', 'egg', 'world', 'destroy'] },
      },
    ],
  },
];

// Curated pool of infinite quotes & cinema lines
const QUOTE_GENERATION_POOL = [
  {
    author: '알베르트 아인슈타인',
    enAuthor: 'Albert Einstein',
    textKo: '상상력은 지식보다 더 중요하다. 지식은 유한하지만 상상력은 온 세상을 감싸 안기 때문이다.',
    textEn: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.',
    keywords: { ko: ['상상력', '지식', '중요하다', '온 세상'], en: ['imagination', 'knowledge', 'embraces'] },
  },
  {
    author: '영화 <라라랜드>',
    enAuthor: 'Movie <La La Land>',
    textKo: '꿈을 꾸는 사람들을 위하여, 비록 바보처럼 보일지라도. 부서진 마음들을 위하여.',
    textEn: 'Here’s to the ones who dream, foolish as they may seem. Here’s to the hearts that ache.',
    keywords: { ko: ['꿈을 꾸는 사람', '바보처럼', '마음들'], en: ['dream', 'foolish', 'hearts'] },
  },
  {
    author: '스티브 잡스',
    enAuthor: 'Steve Jobs',
    textKo: '늘 갈망하고, 늘 우직하게 살아가라. Stay Hungry, Stay Foolish.',
    textEn: 'Stay Hungry. Stay Foolish. Never let the noise of others drown out your inner voice.',
    keywords: { ko: ['갈망', '우직하게', 'Stay Hungry'], en: ['Stay Hungry', 'Stay Foolish'] },
  },
  {
    author: '영화 <인터스텔라>',
    enAuthor: 'Movie <Interstellar>',
    textKo: '우리는 답을 찾을 것이다. 늘 그랬듯이.',
    textEn: 'We will find a way. We always have.',
    keywords: { ko: ['답을 찾을 것이다', '늘 그랬듯이'], en: ['find a way', 'always have'] },
  },
  {
    author: '공자',
    enAuthor: 'Confucius',
    textKo: '멈추지 않는 이상, 얼마나 천천히 가는지는 전혀 중요하지 않다.',
    textEn: 'It does not matter how slowly you go as long as you do not stop.',
    keywords: { ko: ['멈추지 않는 이상', '천천히', '중요하지 않다'], en: ['slowly', 'do not stop'] },
  },
  {
    author: '영화 <쇼생크 탈출>',
    enAuthor: 'Movie <The Shawshank Redemption>',
    textKo: '기억해요, 희망은 좋은 거예요. 어쩌면 가장 좋은 걸지도 몰라요. 그리고 좋은 것은 결코 죽지 않아요.',
    textEn: 'Remember that hope is a good thing, maybe the best of things, and no good thing ever dies.',
    keywords: { ko: ['희망', '좋은 것', '죽지 않아요'], en: ['hope', 'good thing', 'never dies'] },
  },
];

// Curated pool of infinite picture items & scenes
const PICTURE_THEMES = [
  {
    themeId: 'savannah',
    illustrationType: 'savannah_wild' as const,
    titleKo: '세렝게티 사바나 평원 관찰',
    titleEn: 'Serengeti Savannah Observation',
    subtitleKo: '동물 무리의 위치와 수량',
    subtitleEn: 'Animal Herd Locations & Counts',
    narrativeKo: '사바나의 바오밥 나무 그늘과 오아시스 호숫가에 동물 무리가 평화롭게 모여 있습니다.',
    narrativeEn: 'Herds of animals gather peacefully beneath the baobab trees and along the lake shores.',
    itemsPool: [
      { id: 'rhino', name: { ko: '바오밥 나무 아래 코뿔소 3마리', en: '3 Rhinos Under Baobab' }, category: { ko: '동물', en: 'Animal' }, description: { ko: '코뿔소 무리', en: 'Rhino herd' }, x: 25, y: 62, radius: 14, count: 3, iconType: 'rhino', color: '#64748B', zoneName: { ko: '바오밥 나무 그늘', en: 'Baobab Shade' } },
      { id: 'birds', name: { ko: '호숫가 플라밍고 새 8마리', en: '8 Flamingos at Lake' }, category: { ko: '조류', en: 'Bird' }, description: { ko: '플라밍고 새', en: 'Flamingo flock' }, x: 60, y: 72, radius: 14, count: 8, iconType: 'bird', color: '#F43F5E', zoneName: { ko: '오아시스 호숫가', en: 'Oasis Lake' } },
      { id: 'zebra', name: { ko: '언덕 위 얼룩말 2마리', en: '2 Zebras on Ridge' }, category: { ko: '동물', en: 'Animal' }, description: { ko: '얼룩말', en: 'Zebras' }, x: 80, y: 55, radius: 12, count: 2, iconType: 'zebra', color: '#F1F5F9', zoneName: { ko: '붉은 언덕 능선', en: 'Red Ridge' } },
    ],
  },
  {
    themeId: 'study',
    illustrationType: 'classic_study' as const,
    titleKo: '빅토리아 시대 서재의 비밀 유물',
    titleEn: 'Victorian Study Secret Relics',
    subtitleKo: '책상과 진열장 속 단서',
    subtitleEn: 'Clues on the Desk & Cabinet',
    narrativeKo: '앤틱 서재의 중앙 책상과 흔들의자, 서가 곳곳에 의문의 물건들이 흩어져 있습니다.',
    narrativeEn: 'Mysterious artifacts are placed across the central mahogany desk, chair, and bookshelf.',
    itemsPool: [
      { id: 'watch', name: { ko: '책상 위 황금 회중시계', en: 'Gold Pocket Watch' }, category: { ko: '귀중품', en: 'Valuable' }, description: { ko: '회중시계', en: 'Pocket watch' }, x: 42, y: 62, radius: 12, count: 1, iconType: 'watch', color: '#F59E0B', zoneName: { ko: '책상 중앙', en: 'Center Desk' } },
      { id: 'candle', name: { ko: '서재 은촛대', en: 'Silver Candlestick' }, category: { ko: '소품', en: 'Prop' }, description: { ko: '은촛대', en: 'Candlestick' }, x: 55, y: 58, radius: 12, count: 1, iconType: 'candle', color: '#E2E8F0', zoneName: { ko: '책상 우측', en: 'Right Desk' } },
      { id: 'books', name: { ko: '서가 붉은 고서 5권', en: '5 Red Leather Books' }, category: { ko: '도서', en: 'Book' }, description: { ko: '가죽 고서', en: 'Leather books' }, x: 18, y: 35, radius: 14, count: 5, iconType: 'book', color: '#991B1B', zoneName: { ko: '좌측 서가 2단', en: 'Left Shelf' } },
    ],
  },
  {
    themeId: 'observatory',
    illustrationType: 'observatory_altar' as const,
    titleKo: '고대 천문대의 방위 제단',
    titleEn: 'Ancient Observatory Directional Altar',
    subtitleKo: '사방위 보석과 천문 기구',
    subtitleEn: 'Cardinal Jewels & Astrolabe',
    narrativeKo: '원형 제단의 사방위에 배치된 룬석과 황금 아스트롤라베의 위치를 기억하세요.',
    narrativeEn: 'Memorize the cardinal positions of the gemstones and golden astrolabe.',
    itemsPool: [
      { id: 'compass', name: { ko: '3시 방향 황금 나침반', en: '3 O’Clock Golden Compass' }, category: { ko: '유물', en: 'Relic' }, description: { ko: '황금 나침반', en: 'Golden compass' }, x: 76, y: 50, radius: 12, count: 1, iconType: 'compass', color: '#F59E0B', zoneName: { ko: '동쪽 (3시 방위)', en: 'East (3h)' } },
      { id: 'ruby', name: { ko: '6시 방향 붉은 루비', en: '6 O’Clock Red Ruby' }, category: { ko: '보석', en: 'Gem' }, description: { ko: '루비 룬석', en: 'Ruby rune' }, x: 50, y: 80, radius: 12, count: 1, iconType: 'gem', color: '#EF4444', zoneName: { ko: '남쪽 (6시 방위)', en: 'South (6h)' } },
      { id: 'crystal', name: { ko: '12시 방향 푸른 수정', en: '12 O’Clock Blue Crystal' }, category: { ko: '보석', en: 'Gem' }, description: { ko: '푸른 수정', en: 'Blue crystal' }, x: 50, y: 22, radius: 12, count: 1, iconType: 'gem', color: '#38BDF8', zoneName: { ko: '북쪽 (12시 방위)', en: 'North (12h)' } },
    ],
  },
];

/**
 * Procedural infinite level generator
 * Seamlessly generates high levels (from level 11 to 10,000+) dynamically.
 */
export function generateDynamicLevel(category: CategoryType, levelNumber: number): LevelData {
  const seed = levelNumber * 7919;

  if (category === 'tale_novel') {
    // Alternate between tale and novel pools
    const pool = (levelNumber % 2 === 1) ? TALE_GENERATION_POOL : NOVEL_GENERATION_POOL;
    const bookData = pool[seed % pool.length];
    const passage = bookData.passages[(seed >> 3) % bookData.passages.length];
    const split = splitSentence(passage.ko);

    return {
      id: `dyn-tn-${levelNumber}`,
      category: 'tale_novel',
      levelNumber,
      title: {
        ko: `<${bookData.book}> 제${levelNumber}화: 기억의 문장`,
        en: `<${bookData.enBook}> Ep. ${levelNumber}: Memory Lines`,
      },
      subtitle: {
        ko: `${bookData.author} 작`,
        en: `by ${bookData.enAuthor}`,
      },
      difficultyTier: levelNumber <= 15 ? 'normal' : 'hard',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: `${passage.ko}\n\n- ${bookData.author} <${bookData.book}>`,
        en: `${passage.en}\n\n- ${bookData.enAuthor}, ${bookData.enBook}`,
      },
      illustrationType: bookData.illustrationType,
      questions: [
        {
          id: `dyn-tn-${levelNumber}-q1`,
          type: 'text_recall_typing',
          prompt: {
            ko: `[1단계: 앞부분] 문장의 앞부분을 기억하여 작성하세요.`,
            en: `[Step 1: Front Half] Type the front half of the sentence.`,
          },
          originalText: {
            ko: split.part1,
            en: split.part1,
          },
          explanation: {
            ko: `문장의 첫 번째 조각입니다.`,
            en: `The first piece of the sentence.`,
          },
          points: 50,
        },
        {
          id: `dyn-tn-${levelNumber}-q2`,
          type: 'text_recall_typing',
          prompt: {
            ko: `[2단계: 뒷부분] 문장의 뒷부분을 기억하여 작성하세요.`,
            en: `[Step 2: Back Half] Type the back half of the sentence.`,
          },
          originalText: {
            ko: split.part2,
            en: split.part2,
          },
          explanation: {
            ko: `문장의 두 번째 조각입니다.`,
            en: `The second piece of the sentence.`,
          },
          points: 50,
        },
        {
          id: `dyn-tn-${levelNumber}-q3`,
          type: 'text_recall_typing',
          prompt: {
            ko: `[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!`,
            en: `[Step 3: Complete] Combine Step 1 and Step 2 to finish the full sentence!`,
          },
          originalText: {
            ko: passage.ko,
            en: passage.en,
          },
          keyWords: passage.keywords,
          explanation: {
            ko: `${bookData.book} 속 깊은 여운을 주는 명문장 전체를 성공적으로 기억해냈습니다.`,
            en: `You successfully remembered the full quote from ${bookData.enBook}.`,
          },
          points: 100,
        },
      ],
    };
  }

  if (category === 'quote') {
    const quoteData = QUOTE_GENERATION_POOL[seed % QUOTE_GENERATION_POOL.length];
    const split = splitSentence(quoteData.textKo);

    return {
      id: `dyn-quote-${levelNumber}`,
      category: 'quote',
      levelNumber,
      title: {
        ko: `명언·명대사 제${levelNumber}편: 삶을 바꾸는 통찰`,
        en: `Quote & Line Pt. ${levelNumber}: Life Insights`,
      },
      authorOrSource: {
        ko: quoteData.author,
        en: quoteData.enAuthor,
      },
      difficultyTier: levelNumber <= 15 ? 'normal' : 'hard',
      observationTimeLimit: 0,
      storyNarrative: {
        ko: `${quoteData.textKo} - ${quoteData.author}`,
        en: `${quoteData.textEn} - ${quoteData.enAuthor}`,
      },
      illustrationType: 'quote_parchment',
      questions: [
        {
          id: `dyn-quote-${levelNumber}-q1`,
          type: 'text_recall_typing',
          prompt: {
            ko: `[1단계: 앞부분] 명언의 앞부분을 기억하여 작성하세요.`,
            en: `[Step 1: Front Half] Type the front half of the quote.`,
          },
          originalText: {
            ko: split.part1,
            en: split.part1,
          },
          explanation: {
            ko: `명언의 첫 번째 조각입니다.`,
            en: `The first piece of the quote.`,
          },
          points: 50,
        },
        {
          id: `dyn-quote-${levelNumber}-q2`,
          type: 'text_recall_typing',
          prompt: {
            ko: `[2단계: 뒷부분] 명언의 뒷부분을 기억하여 작성하세요.`,
            en: `[Step 2: Back Half] Type the back half of the quote.`,
          },
          originalText: {
            ko: split.part2,
            en: split.part2,
          },
          explanation: {
            ko: `명언의 두 번째 조각입니다.`,
            en: `The second piece of the quote.`,
          },
          points: 50,
        },
        {
          id: `dyn-quote-${levelNumber}-q3`,
          type: 'text_recall_typing',
          prompt: {
            ko: `[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 명언을 완성하세요!`,
            en: `[Step 3: Complete] Combine both parts to finish the complete quote!`,
          },
          originalText: {
            ko: `${quoteData.textKo} - ${quoteData.author}`,
            en: `${quoteData.textEn} - ${quoteData.enAuthor}`,
          },
          keyWords: quoteData.keywords,
          explanation: {
            ko: `시대와 세대를 뛰어넘어 큰 울림을 주는 명언을 완벽히 기억해냈습니다.`,
            en: `A timeless insight echoing wisdom through the generations.`,
          },
          points: 100,
        },
      ],
    };
  }

  // picture mode
  const theme = PICTURE_THEMES[seed % PICTURE_THEMES.length];
  const targetItem = theme.itemsPool[(seed >> 2) % theme.itemsPool.length];
  const isCount = (seed % 2) === 0 && (targetItem.count ?? 1) > 1;

  const question: Question = isCount
    ? {
        id: `dyn-pic-${levelNumber}-q1`,
        type: 'count_input',
        prompt: {
          ko: `그림 속 ${targetItem.zoneName.ko}에 있던 ${targetItem.description.ko}은(는) 총 몇 개(마리)였습니까?`,
          en: `How many ${targetItem.description.en} were in the ${targetItem.zoneName.en}?`,
        },
        expectedCount: targetItem.count || 1,
        explanation: {
          ko: `해당 구역에는 정확히 ${targetItem.count}개가 있었습니다.`,
          en: `There were exactly ${targetItem.count} items in that area.`,
        },
        points: 150,
      }
    : {
        id: `dyn-pic-${levelNumber}-q1`,
        type: 'pin_location',
        prompt: {
          ko: `${targetItem.name.ko}이(가) 놓여 있던 위치를 화면에서 정확히 클릭하세요.`,
          en: `Click exactly where the ${targetItem.name.en} was placed on the screen.`,
        },
        targetItemId: targetItem.id,
        explanation: {
          ko: `${targetItem.name.ko}은(는) ${targetItem.zoneName.ko} 위치에 있었습니다.`,
          en: `The item was located in the ${targetItem.zoneName.en}.`,
        },
        points: 160,
      };

  return {
    id: `dyn-pic-${levelNumber}`,
    category: 'picture',
    levelNumber,
    title: {
      ko: `탐험 제${levelNumber}장: ${theme.titleKo}`,
      en: `Expedition Ch. ${levelNumber}: ${theme.titleEn}`,
    },
    subtitle: {
      ko: theme.subtitleKo,
      en: theme.subtitleEn,
    },
    difficultyTier: levelNumber <= 15 ? 'normal' : 'hard',
    observationTimeLimit: 12,
    storyNarrative: {
      ko: `${theme.narrativeKo}\n사물의 위치와 수량을 눈에 깊이 각인하세요!`,
      en: `${theme.narrativeEn}\nMemorize the items and quantities!`,
    },
    illustrationType: theme.illustrationType,
    items: theme.itemsPool,
    questions: [question],
  };
}
