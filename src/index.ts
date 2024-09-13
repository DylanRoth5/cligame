#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

console.log(chalk.bgGreen("hi mom"));

let playername: string;

const sleep = (ms: number = 2000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function welcome(): Promise<void> {
  const rainbowTitle = chalkAnimation.rainbow(
    "============This is the menu============\n"
  );
  await sleep();
  rainbowTitle.stop();
  console.log(`
    ${chalk.bgBlue("WHAT TO DO")}
    this is a description
    ffffffffffffffffffffffffffff ${chalk.bgRed("aaaa")}
  `);
}

async function askName(): Promise<void> {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: "What is thou name?",
    default() {
      return "Player";
    },
  });

  playername = answers.player_name;
}

async function question1(): Promise<void> {
  const answers = await inquirer.prompt({
    name: "question1",
    type: "list",
    message: "Javascript was created in 10 days and released on\n",
    choices: [
      "May 23rd, 1995",
      "Nov 24th, 1995",
      "Dec 4th, 1995",
      "Dec 17, 1996",
    ],
  });

  return handleAnswer(answers.question1 === "Dec 4th, 1995");
}

async function handleAnswer(isCorrect: boolean): Promise<void> {
  const spinner = createSpinner("Checking answer...").start();
  await sleep();

  if (isCorrect) {
    spinner.success({ text: `Nice work ${playername}` });
  } else {
    spinner.error({ text: `💀💀💀 Game over, you lose ${playername}` });
    process.exit(1);
  }
}

function winner(): void {
  console.clear();
  const msg = `Congrats, ${playername}! \n $ 1 , 0 0 0 , 0 0 0`;
  figlet(msg, (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(gradient("red", "green", "blue"));
  });
}

await welcome();
await askName();
await question1();
winner();
