import { PLUGIN_ID } from './pluginId';
import { PuzzlePiece as Puzzle } from '@strapi/icons';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: Puzzle,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Component Usage',
      },
      Component: async () => {
        const { HomePage } = await import('./pages/HomePage');
        return HomePage;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(
            `./translations/${locale}.json`
          );
          return {
            data: Object.entries(data).reduce(
              (acc: Record<string, string>, [key, value]) => {
                acc[`${PLUGIN_ID}.${key}`] = value as string;
                return acc;
              },
              {}
            ),
            locale,
          };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
