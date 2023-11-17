#!/usr/bin/env node
import inquirer, { QuestionCollection } from "inquirer";
import { genBlogString } from "./blog.js";
import { exec } from "child_process";
import { writeFile } from "fs/promises";
import dayjs from "dayjs";
const BLOG_ROOT = `${process.env.HOME}/code/docs`;
const BLOG_DIR = "/blog";

const runCmd = async (cmd: string) => {
  return new Promise<string>((res, rej) => {
    exec(cmd, (err, std) => {
      if (err) {
        return rej(err);
      }
      res(std);
    });
  });
};

interface BlogAnswers {
  title: string;
  authors: string;
  body: string;
  tags: string;
  filename: string;
}

const questions: QuestionCollection<BlogAnswers> = [
  {
    type: "input",
    name: "filename",
    message: "filename?",
  },
  {
    type: "input",
    name: "title",
    message: "title?",
  },
  {
    type: "input",
    name: "tags",
    message: "tags?",
  },
  {
    type: "input",
    name: "body",
    message: "body?",
  },
];

async function main() {
  const day = dayjs();

  const answer = await inquirer.prompt(questions);
  const str = genBlogString({
    tags: answer.tags.split(","),
    authors: "Amber",
    title: answer.title,
    body: answer.body,
  });
  // 清空git
  await runCmd(`cd ${BLOG_ROOT} && git pull`);
  // 创建文件
  await writeFile(
    `${BLOG_ROOT}/${BLOG_DIR}/${day.format("YYYY-MM-DD")}-${
      answer.filename
    }.md`,
    str
  );
  await runCmd(
    `cd ${BLOG_ROOT} && git add . && git commit -m "publish a blog" && git push`
  );
}

main();
