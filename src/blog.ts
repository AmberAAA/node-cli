import { Dayjs } from "dayjs";
import inquirer from "";
interface Blog {
  title?: string;
  tags?: string[];
  authors?: string;
  body: string;
}

export function genBlogString(blog: Blog) {
  return `---
    title: ${blog.title}
    tags: [${blog.tags?.join(",") ?? ""}]
    authors: ${blog.authors}
    ---
    
    # ${blog.title}
    
    ${blog.body}
      `;
}
