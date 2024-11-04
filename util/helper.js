import * as fs from 'node:fs/promises';


// Create a .json file and store it on the path
export const saveFileData = (filepath, information, date) => {
    const urlPath = `${filepath}-${date}.json`;
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

export class FileManager {
    /**
     *
     * @param {Date} date - The date is using ISOString format. You could format using the helper function and select the format of your choice.
     * @param {string} filename - `name` the name is general only change is the date. Which is formatted an independent of the function.
     * @param {string} ext - `File extention` for the new file or existing file
     * @description - The `FileManager` class is used to create and maintain files from creation and probably extended to deletion and update processes in the later stages.
     */
    constructor(date, filename, ext) {
      this.filename = `${filename}_${date}.${ext}`;
    }

    async readExistingLogs() {
      try {
        const fileExists = await fs.access(this.filename)
          .then(() => true)
          .catch(() => false);

        if (!fileExists) {
          return [];
        }

        const data = await fs.readFile(this.filename, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.error('Error reading existing logs:', error);
        return [];
      }
    }

    async appendLogs(newLogs) {
      try {
        // Read existing logs
        const existingLogs = await this.readExistingLogs();

        // Create a Set of existing URLs to avoid duplicates
        const existingUrls = new Set(existingLogs.map(log => log.url));

        // Filter out duplicates from new logs
        const uniqueNewLogs = newLogs.filter(log => !existingUrls.has(log.url));

        // Combine existing and new logs
        const combinedLogs = [...existingLogs, ...uniqueNewLogs];

        // Write back to file
        await fs.writeFile(
          this.filename,
          JSON.stringify(combinedLogs, null, 2),
          'utf-8'
        );

        return {
          totalLogs: combinedLogs.length,
          newLogsAdded: uniqueNewLogs.length
        };
      } catch (error) {
        console.error('Error appending logs:', error);
        throw error;
      }
    }
  }



// Get current date
const today = new Date();

// Get yesterday by subtracting 1 day (in milliseconds)
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// Format as YYYY-MM-DD (which is what NBA API expects)
export const formattedDate = yesterday.toISOString().split('T')[0];

console.log(formattedDate); // Will output something like "2024-11-03"

// Alternative formats if needed:
export const monthDayYear = yesterday.toLocaleDateString(); // e.g., "11/3/2024"
export const fullDate = yesterday.toString(); // e.g., "Sun Nov 03 2024 ..."