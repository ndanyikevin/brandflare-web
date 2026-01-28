import * as start from "@solidjs/start";
console.log("Exports from @solidjs/start:", Object.keys(start));
if ("Form" in start) {
    console.log("Form is exported from @solidjs/start!");
} else {
    console.log("Form is NOT exported from @solidjs/start!");
}
