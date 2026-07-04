const port = process.env.PORT || 3000;

Bun.serve({
  port,
  fetch() {
    return new Response("API OK 🚀");
  },
});