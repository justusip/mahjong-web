import {getProjectLicenses} from "generate-license-file";
import {ILicense} from "generate-license-file/dist/models/license";
import * as fs from "fs/promises";

// Get an array of licenses for the current project's production dependencies.
(async () => {
    const licenses: ILicense[] = await getProjectLicenses("./package.json");
    let owo = "";

    for(const l of licenses) {
        owo += l.dependencies.join(", ") + ":\n\n";
        owo += l.content + "\n\n"
    }

    await fs.writeFile('licenses.txt', owo);
})();
