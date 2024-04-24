const version = process.versions.node;
const [major, minor] = version.split(".").map(parseInt);
if (major < 21 || (major === 21 && minor < 2)) {
    throw new Error(
        `Test runner currently requires Node v21.2.0 or higher for lcov coverage ` +
            `reports. You are currently using ${version}.`
    );
}
