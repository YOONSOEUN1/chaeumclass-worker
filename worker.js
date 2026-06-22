export default {
  async fetch(request) {
    return new Response("채움클래스 - 곧 만나요!", {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
}
