/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.js` in your console
 */

import inquirer, { QuestionCollection } from "inquirer";
import { genBlogString } from "./blog";
import { exec } from "child_process";
import { run } from "node:test";
const BLOG_PATH = "${HOME}/code/blog";

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

console.log("Hi, welcome to Node Pizza");

interface BlogAnswers {
  title: string;
  authors: string;
  body: string;
  tags: string;
}

const questions: QuestionCollection<BlogAnswers> = [
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
  const a = await runCmd(
    `cd ${BLOG_PATH} && git reset . &&  git checkout . && git clean -df`
  );
  return;
  const answer = await inquirer.prompt(questions);
  const str = genBlogString({
    tags: answer.tags.split(","),
    authors: "Amber",
    title: answer.title,
    body: answer.body,
  });
  console.log(str);
}

main();
