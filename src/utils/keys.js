export function getKey(name) {
    let key = process.env[name];
    if (!key) {
        throw new Error(`API key "${name}" not found in keys.json or environment variables!`);
    }
    return key;
}

export function hasKey(name) {
    return process.env[name];
}