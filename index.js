#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

console.log(chalk.bgGreen("hi mom"));

let playername;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
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

async function askName() {
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

async function question1() {
  const answers = await inquirer.prompt({
    name: "question1",
    type: "list",
    message: "Javascript was created in 10 days and released on\n",
    choices: [
      "May 23rd, 1995",
      "Nov 24th, 1995 ",
      "Dec 4th, 1995 ",
      "Dec 17, 1996 ",
    ],
  });

  return handleAnswer(answers.question1 == "Dec 4th, 1995 ");
}

async function handleAnswer(isCorrect) {
  const spinner = createSpinner("Checking answer...").start();
  await sleep();

  if (isCorrect) {
    spinner.success({
      text: `Nice work ${playername}`,
    });
  } else {
    spinner.error({
      text: `💀💀💀 Game over, you lose ${playername}`,
    });
    process.exit(1);
  }
}

function winner() {
  console.clear();
  const msg = `Congrats, ${playername}! \n $ 1 , 0 0 0 , 0 0 0`;
  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
}

// await welcome();

await askName();

await question1();

winner();
