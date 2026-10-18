export const author = {
  name: 'Juraci Paixão Kröhling',
  role: 'Contribuidor do OpenTelemetry e instrutor',
  avatar: '/authors/juraci.webp',
  profilePath: '/#instrutor',
  bio: 'Ensino OpenTelemetry e engenharia de observabilidade com cursos e conteúdo prático em português.',
  social: {
    linkedin: 'https://www.linkedin.com/in/jpkroehling',
    github: 'https://github.com/jpkroehling',
  },
};

export interface Author {
  name: string;
  role: string;
  avatar: string;
  profilePath?: string;
  bio: string;
  social: { linkedin?: string; github?: string; bluesky?: string };
}

export const authors: Record<'juraci' | 'carla', Author> = {
  juraci: author,
  carla: {
    name: 'Carla Paixão Kröhling',
    role: 'Responsável por operações',
    avatar: '/authors/carla.webp',
    bio: 'Carla cuida das operações da Telemetry Drops e atua nos bastidores da Dose de Telemetria e da Telemetry Drops desde o início do projeto, em 2022.',
    social: { linkedin: 'https://www.linkedin.com/in/cpkroehling/' },
  },
};
