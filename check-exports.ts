import * as router from "@solidjs/router";
console.log("Exports from @solidjs/router:", Object.keys(router));
if ("Form" in router) {
    console.log("Form is exported!");
} else {
    console.log("Form is NOT exported!");
}
