import * as fs from 'fs';
import * as path from 'path';
import { PersistencePlugin, Document } from '@teriologia/sonicdb'; 

export class NodeFSPersistence<T extends Document> implements PersistencePlugin<T> {
    public name = "NodeFSPersistence";
    private filePath: string;
    private isWriting = false;
    
    constructor(fileName: string, private options: { basePath?: string } = {}) {
        const basePath = options.basePath || process.cwd();
        this.filePath = path.join(basePath, fileName);
    }

    async saveData(data: (T | null)[]): Promise<void> {
        if (this.isWriting) {
            console.log("persistence is busy");
            return;
        }

        this.isWriting = true; 
        
        
        try {
            const jsonString = JSON.stringify(data);
            await fs.promises.writeFile(this.filePath, jsonString, 'utf8'); 
        } catch (error) {
            console.error("Error while writing: ", error);
            throw error;
        } finally {
            this.isWriting = false;
        }
    }

    async loadData(): Promise<T[] | null> {
        try {
            const fileContent = await fs.promises.readFile(this.filePath, 'utf8');
            return JSON.parse(fileContent) as T[];
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw new Error(`[NodeFSPersistence] Failed to load data: ${error.message}`);
        }
    }
}