import express, {Application} from 'express'
import userRoutes from '../users/routes/user'
import cors from 'cors';

export class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        users : '/api/users'
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000';

        this.middlwares();
      
        this.routes();
    }

    middlwares() {
        //CORS
        this.app.use( cors() );
        //Lectura del body
        this.app.use( express.json() );
        // File Public
        this.app.use( express.static('public') )
    }

    routes() {
        this.app.use( this.apiPaths.users, userRoutes );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server is running in port ${this.port}`);
        })
    }
}
export default Server;