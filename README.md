![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, simple, minimalist web framework for [deno](https://deno.land/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen({ port: 8000 });

```

## How to use
These modules are tagged in accordance with Fastro releases. So, for example, the v0.1.0 tag is guaranteed to work with fastro v0.1.0. You can link to v0.1.0 using the URL [https://deno.land/x/fastro@v0.1.0/mod.ts](https://deno.land/x/fastro@v0.1.0/mod.ts). Not specifying a tag will link to the master branch.

## Available route shorthand declaration 
- `server.get(url, handler)`
- `server.post(url, handler)`
- `server.put(url, handler)`
- `server.head(url, handler)`
- `server.delete(url, handler)`
- `server.options(url, handler)`
- `server.patch(url, handler)`

## Create a plugin
For example you want to get a payload of all post method or want to get the url parameters of all get method or want to get headers of all types of requests --
instead of defining it in each handler, you can make a plugin.

```ts
function plugin(req: FastroRequest) {
  console.log(req.parameter);
}
server.use(plugin)
```

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | 1.0.0-rc6 | &#10003; | 1092.3 |
| `Deno_http` | 0.52.0 | &#10007; | 2187 |
| Express | 4.17.1 | &#10003; | 620 |
| Fastify | 2.14.1 | &#10003; | 1462.7 |
| **Fastro** | **0.2.8** | **&#10003;** | **1519.1**  |
| `Node_http` | 14.3.0 | &#10007; | 2203.4 |
| Oak | 4.0.0 | &#10007; | 1106.91 |

Check this to see the detail method & results: [benckmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks)

## Examples
You can see above basic example code here: [hello.ts](https://github.com/fastrojs/fastro-server/blob/master/examples/hello.ts)

Check the following codes to find out how to:
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [handle url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [handle http posts & get the payload](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L28)
- [add optional callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [plugin: compare parameter with local variable](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L5)
- [plugin: add new request function & property](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L23)
- [plugin: get client headers & custom send method](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L13)
