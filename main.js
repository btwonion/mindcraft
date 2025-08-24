import * as Mindcraft from './src/mindcraft/mindcraft.js';
import settings from './settings.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readFileSync } from 'fs';

function parseArguments() {
    return yargs(hideBin(process.argv))
        .option('profiles', {
            type: 'array',
            describe: 'List of agent profile paths',
        })
        .option('task_path', {
            type: 'string',
            describe: 'Path to task file to execute'
        })
        .option('task_id', {
            type: 'string',
            describe: 'Task ID to execute'
        })
        .help()
        .alias('help', 'h')
        .parse();
}
const args = parseArguments();
if (args.profiles) {
    settings.profiles = args.profiles;
}
if (args.task_path) {
    let tasks = JSON.parse(readFileSync(args.task_path, 'utf8'));
    if (args.task_id) {
        settings.task = tasks[args.task_id];
        settings.task.task_id = args.task_id;
    }
    else {
        throw new Error('task_id is required when task_path is provided');
    }
}

// these environment variables override certain settings
if (process.env.MINECRAFT_VERSION) {
    settings.minecraft_version = process.env.MINECRAFT_VERSION;
}
if (process.env.MINECRAFT_HOST) {
    settings.host = process.env.MINECRAFT_HOST;
}
if (process.env.MINECRAFT_PORT) {
    settings.port = process.env.MINECRAFT_PORT;
}
if (process.env.MINECRAFT_AUTH) {
    settings.auth = process.env.MINECRAFT_AUTH;
}

if (process.env.PROFILES && JSON.parse(process.env.PROFILES).length > 0) {
    settings.profiles = JSON.parse(process.env.PROFILES);
}
if (process.env.INIT_MESSAGE) {
    settings.init_message = process.env.INIT_MESSAGE;
}
if (process.env.ONLY_CHAT_WITH) {
    settings.only_chat_with = JSON.parse(process.env.ONLY_CHAT_WITH);
}
if (process.env.LANGUAGE) {
    settings.language = process.env.LANGUAGE;
}

if (process.env.INSECURE_CODING) {
    settings.allow_insecure_coding = process.env.INSECURE_CODING;
}
if (process.env.ALLOW_VISION) {
    settings.allow_vision = process.env.ALLOW_VISION;
}
if (process.env.BLOCKED_ACTIONS) {
    settings.blocked_actions = JSON.parse(process.env.BLOCKED_ACTIONS);
}

if (process.env.MAX_MESSAGES) {
    settings.max_messages = process.env.MAX_MESSAGES;
}
if (process.env.NUM_EXAMPLES) {
    settings.num_examples = process.env.NUM_EXAMPLES;
}
if (process.env.NARRATE_BEHAVIOR) {
    settings.narrate_behavior = process.env.NARRATE_BEHAVIOR;
}
if (process.env.LOG_ALL) {
    settings.log_all_prompts = process.env.LOG_ALL;
}

Mindcraft.init(false, settings.mindserver_port);

for (let profile of settings.profiles) {
    const profile_json = JSON.parse(readFileSync(profile, 'utf8'));
    settings.profile = profile_json;
    Mindcraft.createAgent(settings);
}