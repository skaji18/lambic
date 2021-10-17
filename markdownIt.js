import markdown_it from "markdown-it";
import markdown_it_emoji from "markdown-it-emoji";
import markdown_it_sanitizer from "markdown-it-sanitizer";
import markdown_it_imsize from "markdown-it-imsize";
import markdown_it_link_attributes from "markdown-it-link-attributes";

const markdownIt = markdown_it({ html: true })
  .use(markdown_it_emoji)
  .use(markdown_it_sanitizer)
  .use(markdown_it_imsize)
  .use(markdown_it_link_attributes, {
    attrs: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  });

export default markdownIt;
