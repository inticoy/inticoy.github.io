module.exports = {
  title: `Inticoy`,
  description: `Inticoy's Blog`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://inticoy.github.io`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: ``, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `윤건우`,
    bio: {
      role: `개발자`,
      description: ['인생이 즐거운', '다재다능한', '본질을 꿰뚫고 싶은'],
      thumbnail: 'inticoy-handwriting.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/inticoy`, // `https://github.com/zoomKoding`,
      linkedIn: ``, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `inticoy0406@gmail.com`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2022.02',
        activity: '한양대학교 EOS 학술제 Advanced 대상',
        links: {
          github: 'https://github.com/penta-trespassers',
          demo: 'https://www.figma.com/proto/wlmYpiATcrL3YwPf5Hy342/Neodoallae-Prototype?node-id=2%3A5&starting-point-node-id=2%3A5&show-proto-sidebar=1',
        },
      },
      {
        date: '2021.08 ~ 2022.02',
        activity: 'NC Fellowship Program Neural Graphics Track 참가',
        links: {
          //github: 'https://github.com/penta-trespassers',
          //demo: 'https://www.figma.com/proto/wlmYpiATcrL3YwPf5Hy342/Neodoallae-Prototype?node-id=2%3A5&starting-point-node-id=2%3A5&show-proto-sidebar=1',
        },
      },
      {
        date: '2021.05 ~',
        activity: '블로그 시작',
        links: {
          //post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/inticoy/inticoy.github.io',
          demo: 'https://inticoy.github.io',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================

      {
        title: '너도 올래? 앱 디자인 및 개발',
        description: '친구의 자취방을 숙소처럼 예약할 수 있는 앱이 있으면 좋겠다고 생각하여 주요 기능으로 친구, 예약, 내 주변 자취방 검색 기능을 구현하였습니다. Penta-Trespassers 팀원들과 함께 교내 앱 개발 동아리 EOS 학술제에서 우승하는 성과를 이루어냈습니다. 2022년에는 서버의 Django에서 Ktor로의 이주와 플레이스토어 출시를 계획하고 있습니다.',
        techStack: ['figma', 'kotlin', 'android'],
        thumbnailUrl: 'neodoollae.png',
        links: {
          github: 'https://github.com/penta-trespassers',
          demo: 'https://www.figma.com/proto/wlmYpiATcrL3YwPf5Hy342/Neodoallae-Prototype?node-id=2%3A5&starting-point-node-id=2%3A5&show-proto-sidebar=1',
        },
      },

      // {
      //   title: '개발 블로그 테마 개발',
      //   description:
      //     '개발 블로그를 운영하는 기간이 조금씩 늘어나고 점점 많은 생각과 경험이 블로그에 쌓아가면서 제 이야기를 담고 있는 블로그를 직접 만들어보고 싶게 되었습니다. 그동안 여러 개발 블로그를 보면서 좋았던 부분과 불편했던 부분들을 바탕으로 레퍼런스를 참고하여 직접 블로그 테마를 만들게 되었습니다.',
      //   techStack: ['gatsby', 'react'],
      //   thumbnailUrl: 'blog.png',
      //   links: {
      //     post: '/gatsby-starter-zoomkoding-introduction',
      //     github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
      //     demo: 'https://www.zoomkoding.com',
      //   },
      // },
    ],
  },
};
