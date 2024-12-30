import { PathLike } from "node:fs";
import * as fs from 'node:fs/promises';

type GameData = Array<{ date: string; collection: object }>;

export function groupByDate(data: GameData) {
  const result: { [key: string]: GameData } = {};
  data.forEach((item) => {
    const date = item.date.split(' ')[0];
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(item);
  });

  return result;
}

export const saveFileData = async (filepath: string, information: any) => {
  const urlPath = `${filepath}.json`;

  try {
      // Try to read existing file content
      let source = "";
      try {
          source = await Deno.readTextFile(urlPath);
          console.log(`Successfully read file: ${urlPath}`);
      } catch (error) {
          if (!(error instanceof Deno.errors.NotFound)) {
              console.error("Error reading file:", error);
          }
      }

      let parseDataSource = null;
      if (source.length > 0) {
          parseDataSource = JSON.parse(source);
      }

      let data = "";
      if (source.length !== 0 && parseDataSource[0].date !== formattedDate) {
          // Update the data source with new information
          parseDataSource.push({ date: formattedDate.split(' ')[0], collection: information });
          console.log("Games: ", parseDataSource);
          data = JSON.stringify(parseDataSource);
      }

      if (source.length === 0) {
          const games = [{ date: formattedDate, collection: information }];
          console.log("Games [1]: ", games);
          data = JSON.stringify(games);
      }

      if (data) {
          await Deno.writeTextFile(urlPath, data);
          console.log("File saved Successfully");
      }

  } catch (error) {
      console.error("Save File Error - ", error);
      throw error;
  }
};

// Helper function to check if file exists
export const fileExists = async (filepath: string): Promise<boolean> => {
  try {
      await Deno.stat(`${filepath}.json`);
      return true;
  } catch {
      return false;
  }
};

interface LogEntry {
  url: string;
  [key: string]: any; // Additional properties in the log entry
}

interface AppendLogsResult {
  totalLogs: number;
  newLogsAdded: number;
}

export class FileManager {
  filename: string;

  /**
   * @param {string} filename - The base name of the file.
   * @param {string} ext - The file extension (e.g., 'json', 'txt').
   * @description - The `FileManager` class is used to create and maintain files from creation and later extended for deletion and update processes.
   */
  constructor(filename: string, ext: string) {
    this.filename = `${filename}.${ext}`;
  }

  /**
   * Reads existing logs from the file.
   * @returns {Promise<LogEntry[]>} - A promise that resolves with an array of log entries.
   */
  async readExistingLogs(): Promise<LogEntry[]> {
    try {
      const fileExists = await this.fileExists(this.filename);
      if (!fileExists) {
        return [];
      }

      const data = await Deno.readTextFile(this.filename);
      return JSON.parse(data) as LogEntry[];
    } catch (error) {
      console.error('Error reading existing logs:', error);
      return [];
    }
  }

  /**
   * Appends new logs to the file, ensuring no duplicate entries by URL.
   * @param {LogEntry[]} newLogs - Array of new log entries to append.
   * @returns {Promise<AppendLogsResult>} - A promise with details of the operation.
   */
  async appendLogs(newLogs: LogEntry[]): Promise<AppendLogsResult> {
    try {
      // Read existing logs
      const existingLogs = await this.readExistingLogs();

      // Create a Set of existing URLs to avoid duplicates
      const existingUrls = new Set(existingLogs.map((log) => log.url));

      // Filter out duplicates from new logs
      const uniqueNewLogs = newLogs.filter(log => !existingUrls.has(log.url));

      // Combine existing and new logs
      const combinedLogs = [...existingLogs, ...uniqueNewLogs];

      // Write back to file
      await Deno.writeTextFile(
        this.filename,
        JSON.stringify(combinedLogs, null, 2)
      );

      return {
        totalLogs: combinedLogs.length,
        newLogsAdded: uniqueNewLogs.length,
      };
    } catch (error) {
      console.error('Error appending logs:', error);
      throw error;
    }
  }

  /**
   * Checks if a file exists.
   * @param {string} path - Path to the file.
   * @returns {Promise<boolean>} - True if the file exists, false otherwise.
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return false;
      }
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
