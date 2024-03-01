

import express from 'express';
import cors from 'cors'; // Import cors middleware

import * as dotenv from 'dotenv';
import openai from 'openai';
// import { promises as fs } from 'fs';
import fs from 'fs';

dotenv.config()
// const express = require('express');
const app = express();
const port = 5000;
app.use(cors());

const OpenAi = new openai({
    apiKey: "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"
})

//CREATE  NEW ASSIATANT

// OpenAi.beta.assistants.create({
//     name: "ai chatbot",
//     instructions: "you are chatbot for website ",
//     tools: [
//         {
//             type: "code_interpreter"
//         }
//     ],
//     model: "gpt-3.5-turbo-0613"

// })

// async function main() {
//     const file = await OpenAi.files.create({
//         file: fs.createReadStream("sample.jsonl"),
//         purpose: "fine-tune",
//     });

//     // console.log(file);
// }

// main();

// const run = await OpenAi.beta.threads.runs.create(
//     "thread_LuAo4XBiPdFls9uv8FDveuQJ",
//     {
//         assistant_id: "asst_7tNhES3PYDYgT0EhV2RoLdTA",
//         instructions: "Please address the user as Jane Doe. The user has a premium account."
//     }
// );

const run2 = await OpenAi.beta.threads.runs.retrieve(
    "thread_LuAo4XBiPdFls9uv8FDveuQJ",
    "run_7NvPR9NtrTKTJsrtEai2TCIR"
);

// const messages = await OpenAi.beta.threads.messages.list(
//     "thread_LuAo4XBiPdFls9uv8FDveuQJ"
// );
// console.log(messages);

app.get('/messages', async (req, res) => {
    try {
        // Retrieve messages from OpenAI threads
        const messages = await OpenAi.beta.threads.messages.list("thread_LuAo4XBiPdFls9uv8FDveuQJ");
        res.json(messages);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});