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
