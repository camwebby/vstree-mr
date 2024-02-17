export default {
  async fetch(request: Request): Promise<Response> {
    console.log(request.headers.get("x-amzn-function-arn"));
    // ...
    return new Response("Hello from LearnAWS!", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
};
