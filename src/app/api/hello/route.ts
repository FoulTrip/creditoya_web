/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(_req: Request) {
  // Do whatever you want
  return new Response("Hello world", {
    status: 200,
  });
}
