import subprocess

code = """
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

async function test() {
  for (const m of models) {
    try {
      console.log('Testing model:', m);
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Halo dalam 5 kata.'
      });
      console.log('Success with model:', m, '=>', res.text?.trim());
      break;
    } catch (e: any) {
      console.log('Failed model', m, e?.message?.slice(0, 80));
    }
  }
}

test();
"""

with open("test_models.ts", "w") as f:
    f.write(code)

res = subprocess.run(["npx", "tsx", "test_models.ts"], capture_output=True, text=True)
print(res.stdout)
print(res.stderr)
import os
if os.path.exists("test_models.ts"):
    os.remove("test_models.ts")
