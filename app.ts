import Server from './src/models/server';
import { AppDataSource } from './src/database/db';

const main = async() => {
    
    await AppDataSource.initialize();
    console.log(`BD Online`);
    const server = new Server();
    server.listen();
}

main();