import fs from 'fs';

// 1. ai-chat.service.ts
let aiChat = fs.readFileSync('packages/api/src/services/ai-chat.service.ts', 'utf8');
aiChat = aiChat.replace('from "db/prisma-tenant"', 'from "@workspace/db"');
fs.writeFileSync('packages/api/src/services/ai-chat.service.ts', aiChat);

// 2. credit.service.ts
let credit = fs.readFileSync('packages/api/src/services/credit.service.ts', 'utf8');
credit = credit.replace(/subscriptionPlan/g, 'subscription');
fs.writeFileSync('packages/api/src/services/credit.service.ts', credit);

// 3. omr-scan.service.ts
let omr = fs.readFileSync('packages/api/src/services/omr-scan.service.ts', 'utf8');
omr = omr.replace('answers: {}, questionMarks: {}', 'answerKey: {}, marksKey: {}');
omr = omr.replace('correctOption: true', 'answer: true');
omr = omr.replace('mcq.correctOption', 'mcq.answer');
fs.writeFileSync('packages/api/src/services/omr-scan.service.ts', omr);

