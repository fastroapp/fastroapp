import { Footer } from "$fastro/components/footer.tsx";
import { InlineNav } from "../../components/inline-nav.tsx";

export default function (
  props: {
    CSS: string;
    markdown: string;
    attrs: Record<string, unknown>;
  },
) {
  const title = props.attrs.title as string;
  const description = props.attrs.description as string;
  const image = props.attrs.image as string;
  const previous = props.attrs.previous ? props.attrs.previous as string : "#";
  const next = props.attrs.next ? props.attrs.next as string : "#";

  const toc = [
    {
      title: "Get Started",
      url: "/docs/start",
    },
    {
      title: "Application Structure",
      url: "/docs/structure",
    },
    {
      title: "Benchmarks",
      url: "/docs/benchmarks",
    },
  ];

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <title>{`${title} | Fastro`}</title>
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
          rel="stylesheet"
        />
        <style>
          {props.CSS}
        </style>
        <link href="/styles.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
      </head>
      <body class="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
        <main class={"grow p-6 md:grid md:grid-cols-10"}>
          <div
            class={`hidden md:flex md:flex-col md:grow md:gap-y-3 md:col-span-2 md:items-end md:text-right md:pr-6`}
          >
            {toc.map((v) => {
              return <a href={v.url}>{v.title}</a>;
            })}
          </div>
          <div
            class={`md:col-span-6 md:border-l md:border-l-gray-800 md:pl-5`}
          >
            <div class={`flex flex-col gap-y-3 mb-3`}>
              <div class={`block`}>
                <InlineNav
                  title="Fastro"
                  description="Documentation"
                  destination="/docs"
                />
              </div>
              <h1 class="text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
                {title}
              </h1>
            </div>
            <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <div
              data-color-mode="auto"
              data-light-theme="light"
              data-dark-theme="dark"
              class={`markdown-body pb-6`}
            >
              {props.markdown}
            </div>

            <div
              class={`flex justify-between py-3 border-t-[1px] border-t-gray-800`}
            >
              <a href={previous}>
                Previous
              </a>
              <a href={next}>
                Next
              </a>
            </div>
          </div>
        </main>
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
