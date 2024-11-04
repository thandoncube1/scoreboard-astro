import * as fs from 'node:fs/promises';

// Create a .json file and store it on the path
export const saveFileData = (path, information, date) => {
    const urlPath = `${path}-${date}.json`;
    const data = JSON.stringify(information);
    const save = fs.writeFile(urlPath, data, 'utf-8', function(error, data) {
            if (error) throw error;
            console.log("File saved Successfully \n", data);
    });

    save.then(result => {
        console.log("Result: ", result);
    }).catch(error => {
        console.error("Error: ", error);
    });
}
