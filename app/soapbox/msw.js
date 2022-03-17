import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  rest.get('*', (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({ error: 'Not implemented' }),
    );
  }),
);

export { rest } from 'msw';
